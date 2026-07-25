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
      title: '✨ RouxZhee 主创团队',
      subtitle: 'RouxZhee Core creative team',
      desc: '把血泪教训做成博客，只为让后来的你，少熬一个夜',
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
          tag: 'UI开发/框架',
          link: 'https://gl.baimu.live/',
          avatar: 'https://mu.baimu.live/a/img/gura-touxiang-1.png',
          descr: '打不过 我可以Alt+F4的～',
          irregular: false,
        },
      ],
    },
    {
      title: '🎉 RouxZhee 嘉宾',
      subtitle: 'RouxZhee Special Guest',
      desc: '聚集众多优秀独立博客，RouxZhee生态有他们得以追求更加向往的轻压/丝滑响应 🚀',
      list: [
        {
          name: 'Teek - 本站点主题作者',
          tag: 'teek主题',
          link: 'https://notes.teek.top/',
          avatar: 'https://mu.baimu.live/a/img/teek/teek-tx.jpg',
          descr: '朝圣的使徒，正在走向编程的至高殿堂！',
          irregular: false,
        },
        {
          name: 'W3C技术联盟博客',
          tag: '专注web',
          link: 'https://blog.w3c.cool',
          avatar: 'https://blog.w3c.cool/img/built/ADlXV04Q44-360.avif',
          descr: '专注于一系列深受web影响的行业生态',
          irregular: false,
        },
        {
          name: 'One Blog',
          tag: '执着博客的博主',
          link: 'https://onedayxyy.cn/',
          avatar: 'https://onedayxyy.cn/favicon.ico',
          descr: '明心静性，爱自己',
          irregular: false,
        },
        {
          name: '威威 Blog',
          tag: '精美的teek主题',
          link: 'https://dl-web.top/',
          avatar: 'https://dl-web.top/avatar/avatar.svg',
          descr: '一名兴趣使然的程序员，个人博客，全栈分享',
          irregular: false,
        },
        {
          name: 'Hyde Blog',
          tag: '更多Teek扩展与美化',
          link: 'https://teek.seasir.top/',
          avatar: 'https://teek.seasir.top/favicon.ico',
          descr: '人心中的成见是一座大山',
          irregular: false,
        },
        {
          name: '时光笔记',
          tag: '友链页面作者',
          link: 'https://kandu.cxcare.top/',
          avatar: 'https://kandu.cxcare.top/logo.svg',
          descr: '干货满满的技术笔记',
          irregular: true,
        },
        {
          name: '心流笔记',
          tag: 'Teek博主之一',
          link: 'http://blog.wilsonzy.cn/c/StreamNotes/',
          avatar: 'http://blog.wilsonzy.cn/c/StreamNotes/favicon.ico',
          descr: '坚持 & 汲取 & 分享 ✨一个记录生活与学习过程中灵感和感悟的空间',
          irregular: false,
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
