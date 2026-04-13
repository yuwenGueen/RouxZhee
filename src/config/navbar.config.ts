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
