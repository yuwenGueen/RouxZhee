// 🕊️白木 原创开发 🔗gl.baimu.live
// 用户自定义导航栏配置 - 覆盖默认配置

import type { NavbarConfig, NavLink } from '../navbar.config';

// ========================================
// 📝 用户自定义配置
// 这里的配置会覆盖默认配置
// ========================================
export const userNavbarConfig: Partial<NavbarConfig> = {
  // 🏠 Logo 配置
  logo: {
    src: '/favicon.svg',
    siteName: 'RouxZhee',
    showLogo: true,
    showSiteName: true,
  },

  // 📍 导航链接配置
  // 注意：导航链接数组会完全替换默认配置，不会合并
  links: [
    { text: '首页', href: '/' },
    { text: '文章', href: '/posts' },
    { text: '标签', href: '/tags' },
    { text: '归档', href: '/archives' },
    { text: '关于', href: '/about' },
    { text: 'GitHub', href: 'https://github.com/yuwenGueen/RouxZhee', external: true },
  ] as NavLink[],

  // ⏰ 时钟配置
  clock: {
    enabled: true,
    format: '24h',
    showSeconds: true,
  },

  // 📱 移动端菜单配置
  mobileMenu: {
    ariaLabel: '切换菜单',
  },

  // 🎨 滚动行为配置
  scroll: {
    threshold: 100,
  },
};
