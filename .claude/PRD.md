# BTC Mine Cloud 产品需求文档 (PRD)

> 版本: 1.0
> 日期: 2026-03-06
> 项目: btcmine-cloud
> 网站: https://cloud.btcmine.info

---

## 1. 概述

BTC Mine Cloud 是一个比特币云算力交易平台，采用纯静态网站架构（HTML + JavaScript + Chart.js），通过 GitHub Pages 部署。平台由 5 个独立子站组成，覆盖云算力市场的完整生态——从矿工出售算力、用户购买算力、盈亏计算，到平台经济模型的透明展示。

核心创新在于**三方博弈定价模型**：通过数学建模将矿工（Miner）、平台（Platform）、用户（User）三方的利益纳入统一定价引擎，实现纳什均衡下的合理定价，每个参与者都能获得正收益。

所有定价计算基于 mempool.space API 的实时 BTC 价格，每 30-60 秒自动刷新，确保报价的时效性。

---

## 2. 使命与商业模式

### 使命

降低比特币挖矿的参与门槛，让普通用户无需矿机、场地、电力即可参与挖矿，同时为矿工提供比自挖更稳定、更高收益的算力变现渠道。

### 商业模式

平台作为矿工和用户之间的撮合方，通过两个收入来源盈利：

1. **算力差价佣金（8%）**：平台以矿工收购价买入算力，加价 8% 后卖给用户
2. **电费服务费（12%）**：在实际电费基础上加收 12%，覆盖设备维护、冷却、监控等运维成本

综合有效利润率约 15-18%，低于行业平均的 25-30%，以透明定价和低费率作为竞争优势。

---

## 3. 目标用户

### 3.1 矿工（Miner）

- **画像**：拥有矿机的矿场主或中小矿工
- **需求**：稳定收入、降低 BTC 价格波动风险、资金快速回笼
- **核心价值**：出售算力比自挖多赚 5-7% 溢价，电费由买方承担，一次性预付收入
- **对应子站**：minersell.btcmine.info

### 3.2 平台运营方（Platform）

- **画像**：云算力平台的运营管理者
- **需求**：可调参数的经济模型、规模化利润预测、博弈均衡分析
- **核心价值**：透明的三方博弈定价系统，可实时调整佣金率、服务费率等参数进行模拟
- **对应子站**：cal.btcmine.info

### 3.3 终端用户（User）

- **画像**：想参与比特币挖矿但没有矿机的个人投资者
- **需求**：低门槛入场、清晰的收益预期、与直接买 BTC 的对比决策
- **核心价值**：10 TH/s 起购，30-360 天灵活合约，实时 ROI 计算和情景分析
- **对应子站**：cloud.btcmine.info（购买）、user.btcmine.info（对比决策）、miner.btcmine.info（盈亏计算）

---

## 4. 当前范围

### 范围内（In Scope）

- 实时 BTC 价格驱动的动态定价系统
- 三方博弈定价引擎（`pricing.js`）
- 5 个子站的前端展示和交互计算
- 暗色/亮色主题切换系统
- 全局统一导航栏
- 合约选择、算力滑块、矿机选型交互
- BTC 价格情景分析（悲观/中性/乐观）
- 电费敏感性分析
- 云挖矿 vs 现货 BTC 对比计算
- 全合约期对比表
- BTC 减半倒计时
- FAQ 系统
- 订单/出售确认弹窗（展示用）
- 响应式移动端适配

### 范围外（Out of Scope）

- 实际支付/交易功能（订单按钮当前为占位功能，显示"开发中"）
- 用户注册/登录系统
- 后端服务器
- 数据库
- 实际的算力分配和 BTC 分发
- 矿池接口集成
- 多语言支持（当前仅中文 + 英文标题混合）
- 历史价格图表（BTC 价格走势）
- 邮件/推送通知

---

## 5. 核心功能

### 5.1 云算力市场（cloud.btcmine.info）

主站，用户购买云算力的入口。

**功能清单：**

| 功能 | 说明 |
|------|------|
| Hero 展示区 | 品牌展示，10 TH/s 起购、30-360 天合约等核心卖点 |
| BTC 减半倒计时 | 显示距下次减半（2028-04-15）的天数和小时数 |
| 实时数据面板 | BTC 价格、Hashprice、全网算力、日产 BTC/10TH |
| 合约选择器 | 5 档合约期 Tab 切换（30/90/180/270/360 天） |
| 算力滑块 | 10-10,000 TH/s 连续调节，步进 10 TH/s |
| 矿机选型 | 4 款矿机下拉选择 |
| 电费选择 | $0.05-$0.10 共 5 档 |
| 费用明细 | 算力费（一次性）、日电费、合约期总电费、总成本 |
| 预期收益 | 日产 BTC、合约期总 BTC、BTC 当前价值、ROI |
| 盈亏平衡价格 | 计算需要 BTC 涨到多少才能回本 |
| 价格情景分析 | 悲观（-30%）、中性（当前价）、乐观（+50%）三种场景 |
| 全合约对比表 | 以 10 TH/s 为基准，展示所有合约期的完整对比 |
| 订单弹窗 | 点击"立即购买"弹出订单确认（当前为 demo） |
| FAQ | 6 个常见问题的手风琴式展开 |

### 5.2 矿工出售平台（minersell.btcmine.info）

矿工端，展示出售算力的收益优势。

**功能清单：**

| 功能 | 说明 |
|------|------|
| 矿工数据面板 | Hashprice、平台收购价、溢价率、BTC 价格 |
| 矿机配置 | 型号、可出售算力、电费输入 |
| 收购报价卡片 | 5 个合约期的实时收购报价，含收入、自挖对比、额外收益 |
| 出售 vs 自挖对比表 | 按合约期展示自挖总收入/电费/净利润 vs 出售总收入/净利润/额外收益 |
| 出售优势展示 | 稳定溢价、电费转嫁、快速结算、降低风险四大优势卡片 |
| 出售确认弹窗 | 矿工点击出售后的订单确认 |

### 5.3 矿工盈亏计算器（miner.btcmine.info）

矿工自挖的完整盈亏分析工具。

**功能清单：**

| 功能 | 说明 |
|------|------|
| 矿机配置面板 | 型号、数量、电费、矿机单价、BTC 价格预期、使用寿命、难度增长率 |
| 核心指标 | 总算力、总功耗、日收入、日电费、日/月/年净利润、ROI 天数 |
| 成本结构 | 矿机投资、日折旧、日电费、日/月总成本 |
| 收入结构 | Hashprice、日产 BTC、日收入、利润率、盈亏平衡电费 |
| 自挖 vs 出售对比 | 链接到 minersell.btcmine.info 的收益对比 |
| 电费敏感性图表 | Chart.js 柱状图，$0.02-$0.14 电费对应的日利润 |
| BTC 价格敏感性表 | $30K-$200K 不同价格下的日收入/利润/ROI |
| 减半影响分析 | 减半前后的收入/利润对比，减半后盈亏平衡电费 |

### 5.4 用户对比计算器（user.btcmine.info）

帮助用户决策：云挖矿 vs 直接买 BTC。

**功能清单：**

| 功能 | 说明 |
|------|------|
| 投资参数 | 投资金额、合约期、矿机型号、电费、未来 BTC 价格预期 |
| 胜负判定 | 醒目展示云挖矿还是直接买 BTC 获得更多 BTC |
| 并列对比 | 左右卡片分别展示云挖矿和直接买 BTC 的完整明细 |
| 价格情景图表 | Chart.js 双线图，BTC 价格 ×0.3 到 ×3.0 范围内两种策略的 ROI 对比 |
| DCA 模拟 | 展示云挖矿作为 DCA 策略的日均 BTC 获取和等效日均投入 |
| 全合约期对比 | $1,000 投入下所有合约期的可购算力、产出、挖矿/买入比和结论 |

### 5.5 平台经济模型（cal.btcmine.info）

面向平台运营的三方博弈分析和经济模型。

**功能清单：**

| 功能 | 说明 |
|------|------|
| 资金流向图 | Miner ← Platform → User 的可视化资金流 |
| 参数调节面板 | 算力佣金率、电费服务费率、矿工基础溢价、基准电费、交易量、合约期 |
| 平台利润高亮 | 大字展示平台总利润和利润率 |
| 三方账本 | Miner/Platform/User 各自的完整收支明细 |
| 用户支出分配饼图 | 矿工收入、平台算力利润、实际电费、平台电费利润的占比 |
| 佣金率敏感性图表 | 不同佣金率下的平台利润柱状图 |
| 单位经济学表 | per TH/s/day 粒度的各合约期定价明细 |
| 规模化利润模型 | 1K-500K TH 月交易量下的平台月/年利润预测 |
| 博弈论分析 | 矿工/平台/用户三方的策略分析和纳什均衡条件 |

---

## 6. 系统架构

### 6.1 仓库结构

```
5 个独立 GitHub 仓库，1 个主站 + 4 个子站：

tincomking/btcmine-cloud          → cloud.btcmine.info（主站 + 共享资源）
tincomking/btcmine-minersell      → minersell.btcmine.info
tincomking/btcmine-miner          → miner.btcmine.info
tincomking/btcmine-user           → user.btcmine.info
tincomking/btcmine-cal            → cal.btcmine.info
```

### 6.2 主站目录结构

```
btcmine-cloud/
├── CNAME                   # GitHub Pages 自定义域名 (cloud.btcmine.info)
├── index.html              # 主站页面（云算力市场）
├── shared/                 # 共享资源（被所有子站引用）
│   ├── pricing.js          # 三方博弈定价引擎（核心）
│   ├── style.css           # 全局样式系统（暗/亮主题）
│   └── nav.js              # 统一导航栏组件
├── minersell/index.html    # 子站落地页（重定向/本地预览用）
├── miner/index.html        # 子站落地页
├── user/index.html         # 子站落地页
├── cal/index.html          # 子站落地页
└── .gitignore
```

### 6.3 共享资源加载方式

- **主站（cloud.btcmine.info）**：使用相对路径 `/shared/pricing.js`、`/shared/style.css`、`/shared/nav.js`
- **子站（其他 4 个站）**：使用绝对 URL `https://cloud.btcmine.info/shared/pricing.js` 等
- **本地开发**：`nav.js` 内置 `isLocal()` 检测，自动切换到本地路径

### 6.4 DNS 架构

所有子域名通过 CNAME 指向各自的 GitHub Pages：

```
cloud.btcmine.info      → tincomking.github.io/btcmine-cloud
minersell.btcmine.info  → tincomking.github.io/btcmine-minersell
miner.btcmine.info      → tincomking.github.io/btcmine-miner
user.btcmine.info       → tincomking.github.io/btcmine-user
cal.btcmine.info        → tincomking.github.io/btcmine-cal
```

### 6.5 外部依赖

| 依赖 | 版本 | 用途 | 引用方式 |
|------|------|------|----------|
| Chart.js | 4.4.0 | 图表渲染（柱状图/折线图/饼图） | CDN (jsdelivr) |
| Inter 字体 | - | 正文字体 | Google Fonts |
| JetBrains Mono 字体 | - | 数字/代码字体 | Google Fonts |
| mempool.space API | v1 | 实时 BTC 价格 | fetch API |

### 6.6 技术栈

- **前端**：纯 HTML + 原生 JavaScript（无框架）
- **样式**：纯 CSS + CSS 变量（无预处理器）
- **图表**：Chart.js 4.4.0
- **数据**：mempool.space REST API
- **部署**：GitHub Pages
- **构建**：无构建步骤，零依赖，直接部署

---

## 7. 定价模型（三方博弈）

### 7.1 核心引擎

定价引擎封装在 `shared/pricing.js` 的 `PricingEngine` IIFE 模块中，对外暴露完整的计算 API。

### 7.2 基础计算

```
每日 BTC 产出/TH = (区块奖励 × 日出块数) / 全网算力(TH)
                  = (3.125 × 144) / (networkHashrateEH × 1,000,000)

Hashprice = 每日 BTC 产出/TH × BTC 价格 (USD/TH/day)

电费成本/TH/day = (能效比 J/TH × 24h / 1000) × 电费单价 $/kWh
```

### 7.3 矿工端定价

```
矿工溢价率 = 基础溢价(5%) + 合约期调整 + 算力量折扣

合约期调整：
  30天:  +2%  （短期风险高，溢价高）
  90天:   0%
  180天: -1%
  270天: -2%
  360天: -3%  （长期锁定，溢价降低）

算力量折扣：
  ≥100 TH:   0%
  ≥500 TH:  -1%
  ≥1000 TH: -2%
  ≥5000 TH: -3%

最低溢价率：1%（保底）

矿工收购价 = Hashprice × (1 + 矿工溢价率)  (per TH/s/day)
```

### 7.4 平台端定价

```
用户算力单价 = 矿工收购价 / (1 - 算力佣金率8%)
             = 矿工收购价 / 0.92

用户电费单价 = 实际电费/TH/day × (1 + 电费服务费率12%)

平台算力利润 = (用户算力费 - 矿工总收入)
平台电费利润 = (用户电费 - 实际电费) × 总量
平台总利润 = 算力利润 + 电费利润
```

### 7.5 用户端计算

```
用户总成本 = 算力费（一次性）+ 合约期总电费
           = 用户算力单价 × TH × 天数 + 用户电费单价 × TH × 天数

预期产出 = 每日 BTC/TH × TH × 天数
ROI = (产出价值 - 总成本) / 总成本
盈亏平衡 BTC 价格 = 用户总成本 / 预期产出 BTC
挖矿/买入比 = 挖矿产出 BTC / (同等资金直接购买的 BTC)
```

### 7.6 纳什均衡条件

三方均获正收益的均衡条件：
- **矿工溢价** ≈ BTC 价格波动的风险溢价（约 5%）
- **平台佣金** < 行业竞品（8% vs 行业 10-15%）
- **用户预期 BTC 涨幅** > 盈亏平衡所需涨幅

### 7.7 敏感性分析

引擎内置两个敏感性分析函数：
- `sensitivityAnalysis()`：BTC 价格 0.5x-3.0x 范围的收益变化
- `electricitySensitivity()`：电费 $0.03-$0.12 范围的利润变化

---

## 8. 支持的硬件

### 矿机型号库

| 型号 | 键名 | 算力 | 功耗 | 能效比 | 参考价格 | 冷却 |
|------|------|------|------|--------|----------|------|
| Antminer S21 XP | `s21xp` | 270 TH/s | 3,645 W | 13.5 J/TH | $3,875 | 风冷 |
| Antminer S21 XP Hyd | `s21xp_hyd` | 473 TH/s | 5,676 W | 12.0 J/TH | $6,228 | 液冷 |
| Antminer S21 | `s21` | 200 TH/s | 3,500 W | 17.5 J/TH | $3,200 | 风冷 |
| Antminer S21+ | `s21_plus` | 220 TH/s | 3,630 W | 16.5 J/TH | $4,260 | 风冷 |

所有矿机数据存储在 `pricing.js` 的 `MINERS` 对象中，新增矿机只需添加一个新条目。

### 电费档位

| 电费 | 标签 | 备注 |
|------|------|------|
| $0.05/kWh | 低成本区域 | 水电/中东 |
| $0.06/kWh | 标准矿场 | **默认值** |
| $0.07/kWh | 普通矿场 | |
| $0.08/kWh | 较高成本 | |
| $0.10/kWh | 高成本区域 | |

### 合约参数

| 参数 | 值 |
|------|-----|
| 最小购买量 | 10 TH/s |
| 购买步进 | 10 TH/s |
| 最大购买量 | 10,000 TH/s（UI 限制） |
| 合约期 | 30 / 90 / 180 / 270 / 360 天 |
| 默认合约期 | 180 天 |
| 默认矿机 | S21 XP |
| 默认电费 | $0.06/kWh |

---

## 9. 主题系统

### 9.1 实现方式

- 基于 CSS 变量（Custom Properties）实现，通过 `data-theme` 属性切换
- 默认暗色主题，用户选择持久化到 `localStorage`（key: `btcmine-theme`）
- 主题切换时所有组件有 0.3s 的过渡动画

### 9.2 暗色主题

- 背景：纯黑 `#0b0b0b` → 深灰递进
- 文字：白色 `#f0f0f0` → 灰色递减
- 强调色：纯白 `#ffffff`
- 按钮：白底黑字
- 风格：精密极简科技感

### 9.3 亮色主题

- 背景：浅灰白 `#f7f7f8` → 白色
- 文字：深色 `#1a1a1a` → 灰色递减
- 强调色：深色 `#1a1a1a`
- 按钮：黑底白字
- 风格：明亮清爽

### 9.4 色彩系统

| 语义色 | 暗色模式 | 亮色模式 | 用途 |
|--------|----------|----------|------|
| green | `#00d672` | `#00a85a` | 正收益、盈利、矿工 |
| red | `#ff4d4d` | `#e53535` | 负收益、亏损、电费 |
| blue | `#4da6ff` | `#2b7dd9` | 用户、现货 BTC |
| purple | `#a78bfa` | `#7c5cbf` | 情景分析 |
| cyan | `#22d3ee` | `#0ea5c4` | 辅助装饰 |

### 9.5 字体系统

- **正文**：Inter（400-900 weight）
- **数字/代码**：JetBrains Mono（400-700 weight）

---

## 10. 部署与更新

### 10.1 部署流程

```
1. 修改代码
2. git add <files>
3. git commit -m "描述"
4. git push origin main
5. GitHub Pages 自动部署（通常 1-2 分钟生效）
```

无构建步骤，零配置，push 即部署。

### 10.2 子站更新

- **共享资源更新**：只需更新 `btcmine-cloud` 仓库的 `shared/` 目录，所有子站自动生效（因为通过绝对 URL 引用）
- **子站独立更新**：各子站有自己的仓库，独立 push 独立部署
- **本地预览**：可通过 `python -m http.server` 或任意静态服务器在本地预览

### 10.3 缓存策略

- `pricing.js` 内置 BTC 价格缓存（60 秒 TTL），避免频繁 API 调用
- `nav.js` 独立以 30 秒间隔刷新导航栏价格
- GitHub Pages 默认 CDN 缓存，静态资源可能有数分钟延迟

### 10.4 回退机制

- BTC 价格 API 失败时，使用缓存价格或默认值（$67,000）
- 网络算力 API 失败时，使用默认值（950 EH/s）
- 所有 fetch 调用都有 try/catch 保护，不会导致页面崩溃

---

## 11. 成功指标

### 产品指标

| 指标 | 目标 | 衡量方式 |
|------|------|----------|
| 页面加载时间 | < 2 秒 | 纯静态，无服务端渲染延迟 |
| 价格刷新延迟 | < 60 秒 | mempool.space API 60s 轮询 |
| 移动端可用性 | 100% 功能可用 | 响应式设计，768px/480px 断点 |
| 主题切换一致性 | 所有组件同步切换 | CSS 变量 + transition |
| 跨站导航 | 无缝切换 | 统一 nav.js 组件 |
| 计算准确性 | 三方利润之和 = 用户总支出 | pricing.js 单元测试 |

### 业务指标（未来）

| 指标 | 说明 |
|------|------|
| 用户访问量 | 各子站 UV/PV |
| 计算器使用率 | 用户交互（滑块、下拉、输入）次数 |
| 跨站跳转率 | 从一个子站到另一个子站的导航比例 |
| 订单转化率 | 点击"立即购买"/"出售"的比例（待实际交易功能上线后追踪） |

---

## 12. 未来规划

### 短期（P1）

- [ ] 实际的支付和交易系统集成
- [ ] 用户注册/登录体系
- [ ] 多语言支持（英语优先）
- [ ] 更多矿机型号支持（如新一代 S23 系列）
- [ ] 网络难度数据的实时获取（当前使用默认值）

### 中期（P2）

- [ ] 算力交易撮合系统
- [ ] 用户仪表盘（我的合约、收益追踪、BTC 提现）
- [ ] 矿工端管理后台
- [ ] 历史价格和挖矿数据图表
- [ ] 邮件/Telegram 通知系统
- [ ] 难度增长预测模型集成

### 长期（P3）

- [ ] 算力 NFT/代币化
- [ ] 算力二级市场（合约转让）
- [ ] 多币种支持（不限于 BTC）
- [ ] 机构级 API 接口
- [ ] 与 btcmine.info 分析平台的深度数据互通
- [ ] AI 驱动的最优合约推荐

### 技术演进

- [ ] 考虑引入轻量前端框架（如 Preact/Svelte）提升代码组织
- [ ] 添加 pricing.js 的自动化测试
- [ ] 引入 CI/CD 校验（HTML 验证、CSS lint、JS 语法检查）
- [ ] 性能监控（Web Vitals）
- [ ] 无障碍访问（ARIA 标签、键盘导航）优化

---

## 附录 A：API 接口

### mempool.space

| 端点 | 用途 | 刷新间隔 |
|------|------|----------|
| `GET /api/v1/prices` | BTC 实时价格（USD） | 30-60s |
| `GET /api/v1/mining/hashrate/1m` | 全网算力和难度 | 按需 |

### PricingEngine 公开 API

```javascript
PricingEngine.fetchBTCPrice()                        // 获取实时价格
PricingEngine.calculatePricing(TH, days, elec, miner) // 完整定价
PricingEngine.calculateAllPeriods(TH, elec, miner)   // 批量计算所有合约期
PricingEngine.sensitivityAnalysis(...)               // BTC 价格敏感性
PricingEngine.electricitySensitivity(...)            // 电费敏感性
PricingEngine.hashprice()                            // 当前 Hashprice
PricingEngine.dailyBTCPerTH()                        // 日产 BTC/TH
PricingEngine.halvingCountdown()                     // 减半倒计时
PricingEngine.minerSelfMiningProfit(...)             // 矿工自挖利润分析
PricingEngine.fmt.usd() / .btc() / .pct() / ...     // 格式化工具
```

## 附录 B：平台参数默认值

```javascript
{
  hashrateCommission: 0.08,    // 8% 算力差价佣金
  electricityMarkup: 0.12,     // 12% 电费服务费
  minerPremiumBase: 0.05,      // 5% 矿工基础溢价
  minerPeriodAdjust: {         // 合约期溢价调整
    30: +0.02, 90: 0, 180: -0.01, 270: -0.02, 360: -0.03
  },
  minerVolumeDiscount: {       // 算力量折扣
    100: 0, 500: -0.01, 1000: -0.02, 5000: -0.03
  },
  periods: [30, 90, 180, 270, 360],
  minHashrate: 10              // TH/s
}
```

## 附录 C：网络参数默认值

```javascript
{
  btcPrice: 67000,             // USD（实时覆盖）
  networkHashrateEH: 950,     // EH/s
  blockReward: 3.125,         // BTC per block
  blocksPerDay: 144,
  nextHalvingDate: '2028-04-15',
  difficultyAdjustDays: 14
}
```
