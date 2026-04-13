// 🕊️白木 原创开发 🔗gl.baimu.live
// 用户自定义 Banner 配置 - 覆盖默认配置

import type { BannerConfig } from '../banner.config';

// ========================================
// 📝 用户自定义配置
// 这里的配置会覆盖默认配置
// ========================================
export const userBannerConfig: Partial<BannerConfig> = {
  // 🎯 标题配置
  title: 'My RouxZhee',

  // 📝 副标题配置
  subtitle: {
    enabled: true,
    items: [
      'RouxZhee个人博客',
      'Astro主题',
    ],
    typeSpeed: 100,
    deleteSpeed: 50,
    holdTime: 2000,
    nextDelay: 800,
    shuffle: false,
  },

  // 🖼️ 背景配置
  background: {
    enabled: true,
    autoPlay: true,
    interval: 10000,
    images: [],
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
};
