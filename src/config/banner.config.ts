// 🕊️白木 原创开发 🔗gl.baimu.live
// 😎余温 原创开发 🔗https://wiki.xxdevops.cn
// Banner 区域配置 - 双层配置架构设计

// ========================================
// 📋 默认配置
// ========================================
export const defaultBannerConfig = {
  // 🎯 标题配置
  title: 'RouxZhee',

  // 📝 副标题配置
  subtitle: {
    // 打字机效果开关
    enabled: true,
    // 副标题文本列表
    items: [
      '探索技术的无限可能',
      '记录学习的点滴成长',
      '分享编程的乐趣与思考',
      '在代码中寻找诗意',
    ],
    // 打字速度 (ms)
    typeSpeed: 90,
    // 删除速度 (ms)
    deleteSpeed: 45,
    // 停留时间 (ms)
    holdTime: 1800,
    // 切换延迟 (ms)
    nextDelay: 600,
    // 随机打乱顺序
    shuffle: false,
  },

  // 🖼️ 背景配置
  background: {
    // 背景功能开关
    enabled: true,
    // 自动轮播
    autoPlay: true,
    // 轮播间隔 (ms)
    interval: 8000,
    // 静态图片列表 (为空则使用默认渐变)
    images: [] as string[],
    // API 配置
    api: {
      enabled: false,
      url: '',
    },
  },

  // 👇 滚动指示器
  scrollIndicator: {
    enabled: true,
    text: '向下滚动',
  },

  // 🌊 波浪效果
  waves: {
    enabled: true,
  },
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type BannerConfig = typeof defaultBannerConfig;

// ========================================
// 🔧 配置合并函数
// ========================================
function mergeConfig<T extends Record<string, any>>(defaultConfig: T, userConfig?: Partial<T>): T {
  if (!userConfig) return defaultConfig;

  const merged = { ...defaultConfig };
  for (const key in userConfig) {
    if (userConfig[key] !== undefined) {
      if (Array.isArray(userConfig[key])) {
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

// 获取 banner 用户配置模块
const bannerUserModule = userConfigModules['./.config/banner.config.ts'] as Record<string, any> | undefined;

// 提取用户配置
const userBannerConfig: Partial<BannerConfig> | undefined = bannerUserModule?.userBannerConfig;

// 最终配置：优先使用用户配置，否则使用默认配置
export const bannerConfig: BannerConfig = userBannerConfig
  ? mergeConfig(defaultBannerConfig, userBannerConfig)
  : defaultBannerConfig;

// 默认导出
export default bannerConfig;
