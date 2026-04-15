/*
  🕊️白木 原创开发 🔗gl.baimu.live
  📋 文档内容页类型定义
*/

/* 💕 文档元数据信息 */
export interface DocMeta {
  title: string;           // ◀️ 文档标题
  description?: string;    // ◀️ 文档描述
  date?: string;           // ◀️ 发布日期
  readTime?: string;       // ◀️ 阅读时间
  wordCount?: number;      // ◀️ 字数统计
  category?: string;       // ◀️ 分类
  tags?: string[];         // ◀️ 标签列表
  url?: string;            // ◀️ 自定义访问路径
  cover?: string;          // ◀️ 封面图片地址
  titleIcon?: string;      // ◀️ 标题图标
  updateDate?: string;     // ◀️ 更新日期
}

/* 🔗 大纲/目录项 */
export interface TocItem {
  id: string;              // ◀️ 锚点ID
  text: string;            // ◀️ 标题文本
  level: number;           // ◀️ 标题层级 1-6
}

/* 🔗 文档导航项 */
export interface DocNavItem {
  title: string;           // ◀️ 文档标题
  slug: string;            // ◀️ 文档路径
}

/* 📖 文档导航 */
export interface DocNavigation {
  prev: DocNavItem | null; // ◀️ 上一篇文档
  next: DocNavItem | null; // ◀️ 下一篇文档
}

/* 📁 分类文档项 */
export interface CategoryDoc {
  title: string;           // ◀️ 文档标题
  slug: string;            // ◀️ 文档路径
  path: string;            // ◀️ 相对路径
  isCurrent: boolean;      // ◀️ 是否为当前文档
}

/* 📁 分类项（用于分类树） */
export interface CategoryItem {
  name: string;            // ◀️ 分类名称
  path: string;            // ◀️ 分类路径
  docs: CategoryDoc[];     // ◀️ 分类下的文档
  children: CategoryItem[]; // ◀️ 子分类
  isExpanded: boolean;     // ◀️ 是否展开
  isCurrentCategory: boolean; // ◀️ 是否为当前文档所在分类
  level: number;           // ◀️ 层级深度
}
