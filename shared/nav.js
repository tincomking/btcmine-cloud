/**
 * BTC Mine Cloud — Global Navigation
 * Renders consistent nav bar across all pages
 */

const Nav = (() => {
  const PAGES = [
    { id: 'cloud',     label: 'Cloud',      href: 'https://cloud.btcmine.info',     local: '/cloud/' },
    { id: 'minersell', label: 'Miner Sell',  href: 'https://minersell.btcmine.info', local: '/minersell/' },
    { id: 'user',      label: 'User Calc',   href: 'https://user.btcmine.info',      local: '/user/' },
    { id: 'miner',     label: 'Miner Calc',  href: 'https://miner.btcmine.info',     local: '/miner/' },
    { id: 'cal',       label: 'Platform',    href: 'https://cal.btcmine.info',       local: '/cal/' },
    { id: 'analytics', label: 'Analytics',   href: 'https://btcmine.info',           local: 'https://btcmine.info' },
  ];

  // Detect if running locally or on pages.dev
  function isLocal() {
    const h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.pages.dev');
  }

  function getLink(page) {
    return isLocal() ? page.local : page.href;
  }

  /**
   * Render navigation bar
   * @param {string} activeId - Current page id (e.g., 'cloud', 'miner')
   */
  function render(activeId) {
    const nav = document.createElement('nav');
    nav.className = 'nav-bar';
    nav.innerHTML = `
      <div class="nav-inner">
        <a class="nav-logo" href="${isLocal() ? '/' : 'https://cloud.btcmine.info'}">
          <div class="nav-logo-icon">B</div>
          <div class="nav-logo-text">BTCMINE<span>.cloud</span></div>
        </a>
        <div class="nav-links" id="navLinks">
          ${PAGES.map(p => `
            <a class="nav-link${p.id === activeId ? ' active' : ''}"
               href="${getLink(p)}">${p.label}</a>
          `).join('')}
        </div>
        <div class="nav-right">
          <div class="nav-ticker">
            <div class="nav-ticker-dot"></div>
            <span class="nav-ticker-label">BTC</span>
            <span class="nav-ticker-price" id="navBtcPrice">--</span>
          </div>
          <button class="nav-mobile-toggle" id="navMobileToggle" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Insert at top of body
    document.body.prepend(nav);

    // Mobile toggle
    document.getElementById('navMobileToggle').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });

    // Close on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
      });
    });

    // Start price updates
    updatePrice();
    setInterval(updatePrice, 30000);
  }

  async function updatePrice() {
    try {
      const res = await fetch('https://mempool.space/api/v1/prices');
      const data = await res.json();
      const price = data.USD;
      const el = document.getElementById('navBtcPrice');
      if (el) el.textContent = '$' + price.toLocaleString();

      // Also update legacy btcPrice elements if they exist
      const legacy = document.getElementById('btcPrice');
      if (legacy) legacy.textContent = '$' + price.toLocaleString();

      // Update PricingEngine if available
      if (typeof PricingEngine !== 'undefined') {
        PricingEngine.liveData.btcPrice = price;
      }
    } catch (e) {
      // silent fail
    }
  }

  return { render, updatePrice, PAGES, getLink, isLocal };
})();
