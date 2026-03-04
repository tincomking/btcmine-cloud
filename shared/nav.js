/**
 * BTC Mine Cloud — Global Navigation
 * Renders consistent nav bar across all pages with theme toggle
 */

const Nav = (() => {
  const PAGES = [
    { id: 'cloud',     label: 'Cloud',      href: 'https://cloud.btcmine.info',     local: '/cloud/' },
    { id: 'minersell', label: 'Miner Sell',  href: 'https://minersell.btcmine.info', local: '/minersell/' },
    { id: 'user',      label: 'User Calc',   href: 'https://user.btcmine.info',      local: '/user/' },
    { id: 'miner',     label: 'Miner Calc',  href: 'https://miner.btcmine.info',     local: '/miner/' },
    { id: 'cal',       label: 'Platform',    href: 'https://cal.btcmine.info',       local: '/cal/' },
    { id: 'gametheory',label: 'Game Theory', href: 'https://gametheory.btcmine.info', local: '/gametheory/' },
    { id: 'analytics', label: 'Analytics',   href: 'https://btcmine.info',           local: 'https://btcmine.info' },
  ];

  function isLocal() {
    const h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.pages.dev');
  }

  function getLink(page) {
    return isLocal() ? page.local : page.href;
  }

  // Theme management
  function getTheme() {
    return localStorage.getItem('btcmine-theme') || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('btcmine-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.innerHTML = theme === 'dark'
        ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 9.2A6.5 6.5 0 016.8 2 6 6 0 1014 9.2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }

  function render(activeId) {
    // Apply saved theme immediately
    document.documentElement.setAttribute('data-theme', getTheme());

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
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme"></button>
          <button class="nav-mobile-toggle" id="navMobileToggle" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.prepend(nav);

    // Set initial theme icon
    setTheme(getTheme());

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });

    // Mobile toggle
    document.getElementById('navMobileToggle').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
      });
    });

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

      const legacy = document.getElementById('btcPrice');
      if (legacy) legacy.textContent = '$' + price.toLocaleString();

      if (typeof PricingEngine !== 'undefined') {
        PricingEngine.liveData.btcPrice = price;
      }
    } catch (e) {
      // silent fail
    }
  }

  return { render, updatePrice, PAGES, getLink, isLocal, setTheme, getTheme };
})();
