/**
 * BTC Cloud Mining Pricing Engine
 * 三方博弈定价模型：矿工 ↔ 平台 ↔ 用户
 */

const PricingEngine = (() => {
  // ===== 网络参数（实时更新） =====
  const DEFAULTS = {
    btcPrice: 67000,
    networkHashrateEH: 950,      // EH/s
    blockReward: 3.125,          // BTC per block
    blocksPerDay: 144,
    nextHalvingDate: '2028-04-15',
    difficultyAdjustDays: 14,
  };

  // ===== 参考矿机库 =====
  const MINERS = {
    's21xp': {
      name: 'Antminer S21 XP',
      hashrate: 270,       // TH/s
      power: 3645,         // W
      efficiency: 13.5,    // J/TH
      price: 3875,         // USD
      cooling: 'air',
    },
    's21xp_hyd': {
      name: 'Antminer S21 XP Hyd',
      hashrate: 473,
      power: 5676,
      efficiency: 12.0,
      price: 6228,
      cooling: 'liquid',
    },
    's21': {
      name: 'Antminer S21',
      hashrate: 200,
      power: 3500,
      efficiency: 17.5,
      price: 3200,
      cooling: 'air',
    },
    's21_plus': {
      name: 'Antminer S21+',
      hashrate: 220,
      power: 3630,
      efficiency: 16.5,
      price: 4260,
      cooling: 'air',
    },
  };

  // ===== 平台参数 =====
  const PLATFORM = {
    hashrateCommission: 0.08,     // 8% 算力差价佣金
    electricityMarkup: 0.12,      // 12% 电费服务费加成
    minerPremiumBase: 0.05,       // 矿工基础溢价 5%
    minerPeriodAdjust: {          // 合约期长度对矿工溢价的调整
      30:  0.02,                  // 短期 +2%
      90:  0.00,
      180: -0.01,
      270: -0.02,
      360: -0.03,                 // 长期 -3%
    },
    minerVolumeDiscount: {        // 算力量折扣
      100:  0,
      500:  -0.01,
      1000: -0.02,
      5000: -0.03,
    },
    periods: [30, 90, 180, 270, 360],
    minHashrate: 10,              // TH/s
  };

  // ===== 实时数据缓存 =====
  let liveData = { ...DEFAULTS };
  let lastFetch = 0;
  const CACHE_TTL = 60000; // 1分钟

  // 获取实时BTC价格
  async function fetchBTCPrice() {
    const now = Date.now();
    if (now - lastFetch < CACHE_TTL) return liveData.btcPrice;
    try {
      const res = await fetch('https://mempool.space/api/v1/prices');
      const data = await res.json();
      liveData.btcPrice = data.USD;
      lastFetch = now;
    } catch (e) {
      console.warn('BTC price fetch failed, using cached:', liveData.btcPrice);
    }
    return liveData.btcPrice;
  }

  // 获取网络难度和算力
  async function fetchNetworkStats() {
    try {
      const res = await fetch('https://mempool.space/api/v1/mining/hashrate/1m');
      const data = await res.json();
      if (data.currentHashrate) {
        liveData.networkHashrateEH = data.currentHashrate / 1e18;
      }
      if (data.currentDifficulty) {
        liveData.difficulty = data.currentDifficulty;
      }
    } catch (e) {
      console.warn('Network stats fetch failed');
    }
  }

  // ===== 核心计算函数 =====

  /**
   * 每日BTC产出（per TH/s）
   */
  function dailyBTCPerTH(networkEH = liveData.networkHashrateEH) {
    const networkTH = networkEH * 1e6; // EH → TH
    const dailyBTC = DEFAULTS.blocksPerDay * DEFAULTS.blockReward;
    return dailyBTC / networkTH; // BTC per TH/s per day
  }

  /**
   * Hashprice: 每TH/s每天的美元收入
   */
  function hashprice(btcPrice = liveData.btcPrice, networkEH = liveData.networkHashrateEH) {
    return dailyBTCPerTH(networkEH) * btcPrice;
  }

  /**
   * 电费成本 per TH/s per day
   */
  function electricityCostPerTH(elecRate, efficiency = 13.5) {
    // efficiency: J/TH = W per TH/s
    const kwhPerDay = (efficiency * 24) / 1000;
    return kwhPerDay * elecRate;
  }

  /**
   * 硬件折旧成本 per TH/s per day
   */
  function depreciationPerTH(minerKey = 's21xp', lifespanDays = 1095) {
    const miner = MINERS[minerKey];
    return (miner.price / miner.hashrate) / lifespanDays;
  }

  /**
   * 矿工自挖利润 per TH/s per day
   */
  function minerSelfMiningProfit(elecRate = 0.06, minerKey = 's21xp', btcPrice, networkEH) {
    const revenue = hashprice(btcPrice, networkEH);
    const elecCost = electricityCostPerTH(elecRate, MINERS[minerKey].efficiency);
    const depreciation = depreciationPerTH(minerKey);
    return {
      revenue,
      electricityCost: elecCost,
      depreciation,
      totalCost: elecCost + depreciation,
      profit: revenue - elecCost - depreciation,
      margin: (revenue - elecCost - depreciation) / revenue,
    };
  }

  /**
   * 矿工溢价率计算
   */
  function minerPremiumRate(period, totalTH) {
    let rate = PLATFORM.minerPremiumBase;
    // 合约期调整
    rate += PLATFORM.minerPeriodAdjust[period] || 0;
    // 算力量折扣
    const tiers = Object.keys(PLATFORM.minerVolumeDiscount)
      .map(Number).sort((a, b) => a - b);
    for (const tier of tiers) {
      if (totalTH >= tier) {
        rate += PLATFORM.minerVolumeDiscount[tier];
      }
    }
    return Math.max(rate, 0.01); // 最低1%溢价
  }

  /**
   * 完整定价计算
   * @param {number} hashrateTH - 购买算力 TH/s
   * @param {number} period - 合约天数
   * @param {number} elecRate - 电费 $/kWh
   * @param {string} minerKey - 矿机型号
   * @returns {Object} 完整定价分析
   */
  function calculatePricing(hashrateTH, period, elecRate = 0.06, minerKey = 's21xp', btcPrice, networkEH) {
    btcPrice = btcPrice || liveData.btcPrice;
    networkEH = networkEH || liveData.networkHashrateEH;

    const hp = hashprice(btcPrice, networkEH);
    const premium = minerPremiumRate(period, hashrateTH);
    const miner = MINERS[minerKey];

    // === 矿工端 ===
    const minerSellPrice = hp * (1 + premium); // per TH/s/day (不含电费)
    const minerTotalRevenue = minerSellPrice * hashrateTH * period;
    const selfMining = minerSelfMiningProfit(elecRate, minerKey, btcPrice, networkEH);
    const selfMiningRevenue = hp * hashrateTH * period;
    const minerExtraProfit = minerTotalRevenue - selfMiningRevenue;

    // === 平台端 ===
    const userHashratePrice = minerSellPrice / (1 - PLATFORM.hashrateCommission); // per TH/s/day
    const userHashrateFeeTotal = userHashratePrice * hashrateTH * period; // 一次性算力费
    const platformHashrateProfit = userHashrateFeeTotal - minerTotalRevenue;

    const actualElecPerTH = electricityCostPerTH(elecRate, miner.efficiency);
    const userElecPerTH = actualElecPerTH * (1 + PLATFORM.electricityMarkup);
    const userElecFeeTotal = userElecPerTH * hashrateTH * period; // 总电费/服务费
    const platformElecProfit = (userElecPerTH - actualElecPerTH) * hashrateTH * period;

    const platformTotalProfit = platformHashrateProfit + platformElecProfit;

    // === 用户端 ===
    const userTotalCost = userHashrateFeeTotal + userElecFeeTotal;
    const totalBTC = dailyBTCPerTH(networkEH) * hashrateTH * period;
    const btcValue = totalBTC * btcPrice;
    const userROI = (btcValue - userTotalCost) / userTotalCost;
    const breakEvenBTC = userTotalCost / totalBTC;

    // === DCA对比 ===
    // 如果用户把同样的钱直接买BTC
    const directBuyBTC = userTotalCost / btcPrice;
    const miningVsBuying = totalBTC / directBuyBTC; // >1 = 挖矿更好

    return {
      // 参数
      params: { hashrateTH, period, elecRate, minerKey, btcPrice, networkEH },

      // 网络
      network: {
        hashprice: hp,
        dailyBTCPerTH: dailyBTCPerTH(networkEH),
        dailyBTCTotal: dailyBTCPerTH(networkEH) * hashrateTH,
        totalBTC,
        totalBTCValue: btcValue,
      },

      // 矿工
      miner: {
        premium,
        sellPrice: minerSellPrice,           // per TH/s/day
        totalRevenue: minerTotalRevenue,
        selfMiningRevenue,
        extraProfit: minerExtraProfit,
        extraProfitPct: minerExtraProfit / selfMiningRevenue,
        selfMiningAnalysis: selfMining,
      },

      // 平台
      platform: {
        hashrateCommission: PLATFORM.hashrateCommission,
        electricityMarkup: PLATFORM.electricityMarkup,
        hashrateProfit: platformHashrateProfit,
        elecProfit: platformElecProfit,
        totalProfit: platformTotalProfit,
        profitMargin: platformTotalProfit / userTotalCost,
      },

      // 用户
      user: {
        hashrateFee: userHashrateFeeTotal,     // 一次性
        hashrateFeePerTH: userHashratePrice * period,
        electricityFee: userElecFeeTotal,      // 周期内总电费
        electricityFeeDaily: userElecPerTH * hashrateTH,
        totalCost: userTotalCost,
        roi: userROI,
        breakEvenBTC,
        directBuyBTC,
        miningVsBuyingRatio: miningVsBuying,
        dailyCostPerTH: userHashratePrice + userElecPerTH,
      },
    };
  }

  /**
   * 批量计算所有合约期
   */
  function calculateAllPeriods(hashrateTH = 10, elecRate = 0.06, minerKey = 's21xp', btcPrice, networkEH) {
    return PLATFORM.periods.map(period =>
      calculatePricing(hashrateTH, period, elecRate, minerKey, btcPrice, networkEH)
    );
  }

  /**
   * BTC价格敏感性分析
   */
  function sensitivityAnalysis(hashrateTH, period, elecRate, minerKey, btcPriceRange) {
    if (!btcPriceRange) {
      const base = liveData.btcPrice;
      btcPriceRange = [
        base * 0.5, base * 0.7, base * 0.85, base,
        base * 1.2, base * 1.5, base * 2.0, base * 3.0,
      ];
    }
    return btcPriceRange.map(price => ({
      btcPrice: price,
      ...calculatePricing(hashrateTH, period, elecRate, minerKey, price),
    }));
  }

  /**
   * 电费敏感性分析
   */
  function electricitySensitivity(hashrateTH, period, minerKey, elecRates) {
    if (!elecRates) {
      elecRates = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.10, 0.12];
    }
    return elecRates.map(rate => ({
      elecRate: rate,
      ...calculatePricing(hashrateTH, period, rate, minerKey),
    }));
  }

  /**
   * 减半倒计时
   */
  function halvingCountdown() {
    const halving = new Date(DEFAULTS.nextHalvingDate);
    const now = new Date();
    const diffMs = halving - now;
    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    return { date: DEFAULTS.nextHalvingDate, daysRemaining: days, hours, diffMs };
  }

  /**
   * 格式化工具
   */
  const fmt = {
    usd: (n, decimals = 2) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    btc: (n) => n < 0.001 ? n.toFixed(8) + ' BTC' : n.toFixed(6) + ' BTC',
    pct: (n) => (n * 100).toFixed(2) + '%',
    th: (n) => n.toLocaleString() + ' TH/s',
    days: (n) => n + ' 天',
    kwh: (n) => '$' + n.toFixed(4) + '/kWh',
  };

  // ===== 公开 API =====
  return {
    DEFAULTS,
    MINERS,
    PLATFORM,
    liveData,
    fetchBTCPrice,
    fetchNetworkStats,
    dailyBTCPerTH,
    hashprice,
    electricityCostPerTH,
    depreciationPerTH,
    minerSelfMiningProfit,
    minerPremiumRate,
    calculatePricing,
    calculateAllPeriods,
    sensitivityAnalysis,
    electricitySensitivity,
    halvingCountdown,
    fmt,
    getMiner: (key) => MINERS[key],
    getMinerList: () => Object.entries(MINERS).map(([k, v]) => ({ key: k, ...v })),
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PricingEngine;
}
