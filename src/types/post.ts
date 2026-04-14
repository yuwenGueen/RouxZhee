// 🕊️白木 原创开发 🔗gl.baimu.live
// 😎余温 原创开发 🔗https://wiki.xxdevops.cn
// 文档类型定义

// ========================================
// 📋 文档数据类型
// ========================================
export interface Post {
  // 文档唯一标识
  slug: string;
  // 文档标题
  title: string;
  // 文档描述
  description?: string;
  // 文档封面图片
  cover: string;
  // 文档发布时间
  date: string;
  // 文档链接
  url: string;
  // 文档标签
  tags?: string[];
  // 文档分类
  category?: string;
  // 阅读时间（分钟）
  readTime?: string;
  // 标题图标
  titleIcon?: string;
}
