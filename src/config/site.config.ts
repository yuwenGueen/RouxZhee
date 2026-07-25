// 🕊️白木 原创开发 🔗gl.baimu.live
// 站点概览页面配置 - 双层配置架构设计

import { bloggerConfig } from './blogger.config';
import { seoConfig } from './seo.config';
import { aboutConfig } from './about.config';
import { runtimeConfig } from './runtime.config';
import { themeConfig } from './theme.config';
import versionInfo from '../../version.json';
import { withBase } from '../utils/base';

// ========================================
// 📋 类型定义
// ========================================
export interface CloudItem {
  name: string;
  count: number;
}

export interface SiteOverviewConfig {
  // 🏠 站点信息
  site: {
    name: string;
    description: string;
    icon: string;
    createdAt: string;
    status: 'normal' | 'maintenance' | 'closed';
  };

  // 🔗 绑定域名
  domain: {
    primary: string;
    aliases: string[];
    status: 'resolved' | 'pending' | 'expired';
  };

  // 👤 拥有者 & 备案信息
  owner: {
    name: string;
    contact: string;
  };
  icp: {
    number: string;
    href: string;
    entity: string;
  };
  gongan: {
    text: string;
    href: string;
  };

  // 📝 文档统计
  documents: {
    total: number;
    today: number;
    week: number;
    trend: number[];
  };

  // 🏷️ 分类云 / 标签云
  categories: CloudItem[];
  tags: CloudItem[];

  // 📊 站点访客量
  visitors: {
    total: number;
    today: number;
    yesterday: number;
    month: number;
    online: number;
  };

  // 🎨 当前主题
  theme: {
    name: string;
    version: string;
    preview: string;
    author: string;
    description: string;
  };
}

// ========================================
// 📋 默认配置
// ========================================
export const defaultSiteOverviewConfig: SiteOverviewConfig = {
  // 🏠 站点信息卡片（从 SEO / Runtime 配置读取）
  site: {
    name: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    icon: withBase('/favicon.svg'),
    createdAt: new Date(runtimeConfig.initDate).toISOString().split('T')[0],
    status: 'normal',
  },

  // 🔗 绑定域名
  domain: {
    primary: 'wiki.xxdevops.cn',
    aliases: ['www.wiki.xxdevops.cn'],
    status: 'resolved',
  },

  // 👤 拥有者 & 备案信息（从博主 blogger.config.ts / 关于配置读取）
  owner: {
    name: aboutConfig.hero.name,
    contact: aboutConfig.footer.email,
  },
  icp: {
    number: bloggerConfig.beian.icp.text,
    href: bloggerConfig.beian.icp.href,
    entity: aboutConfig.hero.name,
  },
  gongan: {
    text: bloggerConfig.beian.gongan.text,
    href: bloggerConfig.beian.gongan.href,
  },

  // 📝 文档统计（默认从 doc 目录动态读取）
  documents: {
    total: 0,
    today: 0,
    week: 0,
    trend: [0, 0, 0, 0, 0, 0, 0],
  },

  // 🏷️ 分类云（默认从 doc 目录 frontmatter 动态读取）
  categories: [],

  // 🏷️ 标签云（默认从 doc 目录 frontmatter 动态读取）
  tags: [],

  // 📊 站点访客量
  visitors: {
    total: 123456,
    today: 1234,
    yesterday: 2345,
    month: 34567,
    online: 42,
  },

  // 🎨 当前主题
  theme: {
    name: themeConfig.name,
    version: `v${versionInfo.version}`,
    preview: themeConfig.preview,
    author: themeConfig.author,
    description: themeConfig.description,
  },
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
// 使用 import.meta.glob 仅加载对应的用户配置，避免不同配置间循环引用
const userConfigModules = import.meta.glob('./.config/site.config.ts', { eager: true });
const siteUserModule = userConfigModules['./.config/site.config.ts'] as Record<string, any> | undefined;
const userSiteOverviewConfig: Partial<SiteOverviewConfig> | undefined = siteUserModule?.userSiteOverviewConfig;

export const siteOverviewConfig: SiteOverviewConfig = userSiteOverviewConfig
  ? mergeConfig(defaultSiteOverviewConfig, userSiteOverviewConfig)
  : defaultSiteOverviewConfig;

export default siteOverviewConfig;
