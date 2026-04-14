// 🕊️白木 原创开发 🔗gl.baimu.live
// 😎余温 原创开发 🔗https://wiki.xxdevops.cn
// 导航栏配置 - 双层配置架构设计

// ========================================
// 📋 导航链接类型定义
// ========================================
export interface NavLink {
  text: string;
  href: string;
  external?: boolean;
}

// ========================================
// 📋 社交链接类型定义
// ========================================
export interface SocialLink {
  // 平台名称（用于aria-label）
  name: string;
  // 链接地址
  href: string;
  // SVG图标代码
  icon: string;
  // 是否在新窗口打开
  external?: boolean;
}

// ========================================
// 📋 默认配置
// ========================================
export const defaultNavbarConfig = {
  // 🏠 Logo 配置
  logo: {
    // Logo 图片路径
    src: '/favicon.svg',
    // 网站名称
    siteName: 'RouxZhee',
    // 是否显示 Logo 图片
    showLogo: true,
    // 是否显示网站名称
    showSiteName: true,
  },

  // 📍 导航链接配置
  links: [
    { text: '首页', href: '/' },
    { text: '文章', href: '/posts' },
    { text: '关于', href: '/about' },
  ] as NavLink[],

  // ⏰ 时钟配置
  clock: {
    // 是否显示时钟
    enabled: true,
    // 时间格式 (12h / 24h)
    format: '24h' as '12h' | '24h',
    // 是否显示秒
    showSeconds: true,
  },

  // 📱 移动端菜单配置
  mobileMenu: {
    // 菜单按钮 ARIA 标签
    ariaLabel: '切换菜单',
  },

  // 🔗 社交链接配置
  social: {
    // 是否显示社交链接
    enabled: true,
    // 社交链接列表
    links: [
      {
        name: 'GitHub',
        href: 'https://github.com/yuwenGueen/RouxZhee',
        // 🎨 完整的 SVG HTML 代码
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        external: true,
      },
    ] as SocialLink[],
  },

  // 🎨 滚动行为配置
  scroll: {
    // 滚动阈值 (px)，超过此值切换为圆角卡片模式
    threshold: 100,
  },
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type NavbarConfig = typeof defaultNavbarConfig;

// ========================================
// 🔧 配置合并函数
// ========================================
function mergeConfig<T extends Record<string, any>>(defaultConfig: T, userConfig?: Partial<T>): T {
  if (!userConfig) return defaultConfig;

  const merged = { ...defaultConfig };
  for (const key in userConfig) {
    if (userConfig[key] !== undefined) {
      // 导航链接数组需要完全替换，不合并
      if (key === 'links' && Array.isArray(userConfig[key])) {
        merged[key] = userConfig[key] as T[Extract<keyof T, string>];
      } else if (Array.isArray(userConfig[key])) {
        merged[key] = userConfig[key] as T[Extract<keyof T, string>];
      } else if (typeof userConfig[key] === 'object' && userConfig[key] !== null) {
        merged[key] = mergeConfig(merged[key], userConfig[key]);
      } else {
        merged[key] = userConfig[key] as T[Extract<keyof T, string>];
      }
    }
  }
  return merged;
}

// ========================================
// 🔧 构建时配置加载策略
// ========================================
// 使用 import.meta.glob 加载所有可能的用户配置
const userConfigModules = import.meta.glob('./.config/*.ts', { eager: true });

// 获取 navbar 用户配置模块
const navbarUserModule = userConfigModules['./.config/navbar.config.ts'] as Record<string, any> | undefined;

// 提取用户配置
const userNavbarConfig: Partial<NavbarConfig> | undefined = navbarUserModule?.userNavbarConfig;

// 最终配置：优先使用用户配置，否则使用默认配置
export const navbarConfig: NavbarConfig = userNavbarConfig
  ? mergeConfig(defaultNavbarConfig, userNavbarConfig)
  : defaultNavbarConfig;

// 默认导出
export default navbarConfig;
