// 🕊️白木 原创开发 🔗gl.baimu.live
// 用户自定义导航栏配置 - 覆盖默认配置

import type { NavbarConfig, NavLink, SocialLink } from '../navbar.config';

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
    { text: '友链', href: 'https://gl.baimu.live', external: true },
  ] as NavLink[],

  // 🔗 社交链接配置
  social: {
    enabled: true,
    links: [
      {
        name: 'GitHub',
        href: 'https://github.com/yuwenGueen/RouxZhee',
        // 🔽 社交链接的图标
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        external: true,
      },
    ] as SocialLink[],
  },

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
