/**
 * Cloudflare Pages Worker
 * 根据子域名路由到对应的子目录
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // shared/ 文件直接提供，不做路由
    if (url.pathname.startsWith('/shared/')) {
      return env.ASSETS.fetch(request);
    }

    // 子域名 → 子目录映射
    const subdomainMap = {
      'cloud': '/cloud',
      'minersell': '/minersell',
      'miner': '/miner',
      'user': '/user',
      'cal': '/cal',
    };

    // 提取子域名（支持 xxx.btcmine.info 和 xxx.btcmine-cloud.pages.dev）
    const parts = hostname.split('.');
    const subdomain = parts[0];
    const dir = subdomainMap[subdomain];

    if (dir) {
      const path = url.pathname === '/' ? '/index.html' : url.pathname;
      const newUrl = new URL(dir + path, url.origin);
      return env.ASSETS.fetch(new Request(newUrl, request));
    }

    // 默认：serve root（landing page 或 cloud）
    return env.ASSETS.fetch(request);
  }
};
