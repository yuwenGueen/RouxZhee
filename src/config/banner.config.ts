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
      '堂堂亚特兰蒂斯后裔',
      '鲨鲨连个岩王帝君都请不动',
      '丢不丢人！',
      'Bloop你别笑',
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
    // 支持自定义图片链接
    images: [
      'https://mu.baimu.live/img/acg',
      'https://mu.baimu.live/img/xk',
    ] as string[],
    // 图片填充模式：'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    objectFit: 'cover' as 'cover' | 'contain' | 'fill' | 'none' | 'scale-down',
    // 图片位置，例如：'center', 'top', 'bottom', 'left', 'right'
    position: 'center' as string,
    // 背景淡入动画时长 (ms)
    fadeDuration: 3500,
    // API 配置（用于动态获取背景图片）
    api: {
      enabled: false,
      url: '',
      // API 返回图片字段名
      imageField: 'url',
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
