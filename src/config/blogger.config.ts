// 🕊️白木 原创开发 🔗gl.baimu.live
// 😎余温 原创开发 🔗https://wiki.xxdevops.cn
// 博主信息配置 - 双层配置架构设计

// ========================================
// 📋 社交链接类型定义
// ========================================
export interface BloggerSocialLink {
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
export const defaultBloggerConfig = {
  // 👤 博主头像
  avatar: {
    // 头像图片链接
    src: 'https://img.xxdevops.cn/blog/avatar/yuwen_avatar.avif?w=240&h=240&fit=crop&fm=webp&q=85',
    // 头像alt文本
    alt: '博主头像',
  },

  // 🏷️ 博主名称
  name: '余温',

  // 🔗 博主主页链接
  homepage: 'https://wiki.xxdevops.cn/',

  // 📱 社交链接配置
  social: {
    // 是否显示社交链接
    enabled: true,
    // 社交链接列表
    links: [
      {
        name: 'CNB',
        href: 'https://cnb.cool/yuwen-gueen/hugo-teeker-theme',
        // 🎨 CNB SVG 图标
        icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#f97316"><title>Cloud Native Build</title><path d="M12.1536.0002c-1.9776.0136-3.2463.5813-3.929 1.015-.3365.2136-.3544.6973-.0396.942l6.3553 4.9409c.5601.435 1.3806.187 1.6094-.4847l1.3594-3.993a.5756.5756 0 0 0-.1646-.6187c-.587-.5182-2.0702-1.6096-4.2978-1.771a11.3315 11.3315 0 0 0-.893-.0305zM4.2072 3.5147c-.7541.4104-2.6862 1.6729-3.682 4.2704-.7687 2.0019-.498 4.2179-.2866 5.3006.0695.354.4445.5577.7803.4267l12.2229-4.7733c.8728-.3409.8775-1.575.006-1.9203l-8.428-3.3407c-.2033-.0803-.4173-.0697-.6126.0366zm15.5544.6553L16.677 6.9072c-.5036.4466-.4505 1.2461.1067 1.6247l6.1693 4.185c.3532.2396.8347.0264.8961-.3963.1622-1.1189.3034-3.0663-.3444-4.5355-.8635-1.9578-2.3283-3.164-3.0237-3.6547-.2207-.1553-.5235-.1337-.7194.0396zm-5.898 5.0812c-.207-.0112-.4255.0438-.628.1798L1.842 17.0818c-.2598.1743-.3766.4967-.2926.7986.2417.8685.9615 2.6747 3.0054 4.3191 2.0439 1.6443 4.4622 1.8237 5.4957 1.7984a.721.721 0 0 0 .6706-.506l4.0753-12.8934c.2204-.698-.3115-1.3136-.9327-1.3473Zm2.6122.1341c-.491.01-.9644.3642-1.015.9419L14.333 23.1597c-.0319.364.2768.6669.64.6279 1.169-.1253 3.5685-.5916 5.3678-2.3105 1.7515-1.6727 2.3215-3.6567 2.4872-4.4471a.7272.7272 0 0 0-.1463-.6066l-5.392-6.657c-.2191-.2704-.5194-.3868-.8139-.381z"/></svg>',
        external: true,
      },
      {
        name: 'GitHub',
        href: 'https://github.com/yuwenGueen/RouxZhee',
        // 🎨 GitHub SVG 图标
        icon: '<svg viewBox="0 0 24 24" fill="#000000"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        external: true,
      },
    ] as BloggerSocialLink[],
  },

  // 📋 备案信息配置
  beian: {
    // ICP备案号配置（为空则不显示）
    icp: {
      // 备案号文本
      text: '*ICP备**********号-*',
      // 备案号链接
      href: 'https://beian.miit.gov.cn/',
    },
    // 公安备案号配置（为空则不显示）
    gongan: {
      // 公安备案号文本
      text: '*公网安备*********号',
      // 公安备案号链接
      href: 'https://www.beian.gov.cn/',
    },
  },
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type BloggerConfig = typeof defaultBloggerConfig;

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

// 获取 blogger 用户配置模块
const bloggerUserModule = userConfigModules['./.config/blogger.config.ts'] as Record<string, any> | undefined;

// 提取用户配置
const userBloggerConfig: Partial<BloggerConfig> | undefined = bloggerUserModule?.userBloggerConfig;

// 最终配置：优先使用用户配置，否则使用默认配置
export const bloggerConfig: BloggerConfig = userBloggerConfig
  ? mergeConfig(defaultBloggerConfig, userBloggerConfig)
  : defaultBloggerConfig;

// 默认导出
export default bloggerConfig;
