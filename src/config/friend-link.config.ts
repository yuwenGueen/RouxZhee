// 🕊️白木 原创开发 🔗gl.baimu.live
// 🔗 友链页面配置 - 双层配置架构设计

import type { FriendLinkConfig } from '../types/friend-link';

// ========================================
// 📋 默认配置
// ========================================
export const defaultFriendLinkConfig: FriendLinkConfig = {
  // 页面主标题
  title: '我的友链',

  // 是否显示评论/留言申请区（当前版本已移除评论区，保留字段用于兼容）
  comments: false,

  // Banner 配置
  banner: {
    show: true,
    smallTitle: '与各位博主一起成长进步',
    showButtonGroup: true,
  },

  // 友链分组列表
  groups: [
    {
      title: '✨ RouxZhee 开发团队',
      desc: 'RouxZhee 开发团队，负责维护和更新该主题',
      list: [
        {
          name: '余温',
          tag: '后端开发/功能',
          link: 'https://wiki.xxdevops.cn/',
          avatar: 'https://img.xxdevops.cn/blog/avatar/yuwen_avatar.avif',
          descr: '源于热爱，而去创造',
          irregular: false,
        },
        {
          name: '🗼白木',
          link: 'https://gl.baimu.live/',
          avatar: 'https://mu.baimu.live/a/img/shiroki-logo-600.gif',
          descr: '让知识像纸鸢一样，既御风而行，也始终有线牵引',
        },
      ],
    },
  ],
};

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
const userConfigModules = import.meta.glob('./.config/friend-link.config.ts', { eager: true });
const friendLinkUserModule = userConfigModules['./.config/friend-link.config.ts'] as Record<string, any> | undefined;
const userFriendLinkConfig: Partial<FriendLinkConfig> | undefined = friendLinkUserModule?.userFriendLinkConfig;

export const friendLinkConfig: FriendLinkConfig = userFriendLinkConfig
  ? mergeConfig(defaultFriendLinkConfig, userFriendLinkConfig)
  : defaultFriendLinkConfig;

export default friendLinkConfig;
