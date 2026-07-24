<div align="center">

![Logo](./public/RouxZhee-LOGO.png)

# RouxZhee - Astro 个人博客主题

</div>

---

## 📖 项目简介 | Introduction

**中文**

RouxZhee 是一个基于 Astro + Vue 3 + TypeScript + SCSS 构建的现代个人博客主题。采用玻璃质感圆角卡片设计风格，支持主题切换、懒加载、双模式分页、标签云、归档分类、站点概览等特性，为技术博主提供优雅的内容展示体验。

**English**

RouxZhee is a modern personal blog theme built with Astro + Vue 3 + TypeScript + SCSS. Featuring glassmorphism rounded card design, theme switching, lazy loading, dual-mode pagination, tag cloud, archives, site overview, and more, providing an elegant content display experience for tech bloggers.

---

## ✨ 核心特性 | Key Features

### 🎨 设计 | Design

- 🪟 **玻璃质感** - 采用毛玻璃效果的圆角卡片设计
- 🌙 **主题切换** - 支持明暗主题，带涟漪动画效果
- 📱 **响应式布局** - 适配各种屏幕尺寸
- 🎯 **层级管理** - 科学的 z-index 层级规划
- ☁️ **云图卡片** - 标签云 / 分类云可视化展示

### ⚡ 性能 | Performance

- 🚀 **Astro 驱动** - 零 JavaScript 默认输出，极速首屏加载
- 💤 **懒加载支持** - 图片和内容按需加载
- 📦 **组件化架构** - Vue 3 组件复用，代码精简
- 🗜️ **生产压缩** - Terser + HTML / CSS 压缩，自动剔除 console

### 🛠️ 功能 | Functions

- 🔍 **搜索功能** - 基于 Pagefind 的全文搜索，左下角集成搜索按钮
- ⬆️ **快捷导航** - 轮盘式回到顶部 / 前往底部按钮
- 🎨 **主题切换** - 左下角涟漪式主题切换动画
- ⏰ **实时时钟** - 导航栏内置时钟组件
- 📄 **双模式分页** - 支持页码模式和无限懒加载模式
- 🏷️ **标签页面** - `/tags` 标签云总览 + `/tags/标签名` 筛选列表
- 🗂️ **归档页面** - `/archives` 分类云总览 + `/archives/分类名` 筛选列表
- 👤 **关于页面** - 博主介绍与社交链接展示
- 🏠 **站点概览** - 站点信息、域名、备案、文档统计、访客量
- 👥 **团队页面** - RZ 团队成员展示
- 🖼️ **图片预览** - 文档内图片点击放大查看
- ✨ **鼠标轨迹** - 可选的鼠标拖尾光效
- 💊 **提示胶囊** - 悬浮提示信息组件

### 🎯 开发体验 | Developer Experience

- 🔧 **双层配置** - 默认配置 + 用户自定义配置，灵活覆盖
- 📝 **TypeScript** - 类型安全的开发体验
- 🎨 **SCSS 变量** - 统一的颜色和样式管理
- 🧩 **模块化组件** - 清晰的组件划分，易于扩展
- 🔎 **SEO 组件** - 内置 SEO Head、JsonLd、Open Graph、canonical 支持

---

## 🚀 快速开始 | Quick Start

### 📋 环境要求

- Node.js 18+
- npm 9+ 或 pnpm 8+

### 📦 安装依赖

```bash
npm install
```

<div align="center">

或使用 pnpm

</div>

```bash
pnpm install
```

### 🏃 启动开发服务器

```bash
npm run dev
```

<div align="center">

或

</div>

```bash
npm start
```

开发服务器默认运行在 http://localhost:4321

启动前会自动执行 RouxZhee Tools：

1. 判断当前系统是 Windows、Linux 还是 macOS。
2. 下载或复用对应平台的 `rz-tools` 二进制。
3. 执行 `rz-tools content export --framework astro --input doc --output .site-data`。
4. 完成内容解析后再启动 Astro。

CNB 或其他云开发环境需要配置下载清单地址：

```bash
ROUXZHEE_TOOLS_MANIFEST_URL=https://your-tools-download-domain/list
```

如果本机旁边存在 `../rouxzhee-tools/bin/`，启动脚本会优先复用本地构建产物，方便开发调试。正式对外使用时建议给 `rouxzhee-tools-download` 绑定自定义域名，不要把 EdgeOne 预设域名的临时 `eo_token` 写进仓库。

### 🔨 构建生产版本

```bash
npm run build
```

构建输出位于 `dist/` 目录。

> 构建完成后会自动运行 Pagefind 索引构建与同步脚本，生成搜索数据。

### 👀 预览生产构建

```bash
npm run preview
```

---

## 📁 项目结构

```
RouxZhee/
├── src/
│   ├── components/     # Vue / Astro 组件
│   │   ├── doc/        # 文档渲染组件
│   │   ├── seo/        # SEO 相关组件
│   │   ├── CursorTrail/# 鼠标轨迹
│   │   └── ImageViewer/# 图片预览
│   ├── composables/    # Vue 组合式函数
│   ├── config/         # 配置文件
│   │   └── .config/    # 用户自定义配置（覆盖默认配置）
│   ├── layouts/        # Astro 布局
│   ├── pages/          # 页面文件
│   │   ├── archives/   # 归档分类页
│   │   └── tags/       # 标签页
│   ├── styles/         # SCSS 样式
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   └── page-templates/  # Markdown 页面模板
├── public/             # 静态资源
├── scripts/            # 构建 / 启动 / 搜索索引脚本
├── doc/                # 博客文档内容
└── .site-data/         # rz-tools 导出的站点数据（构建时生成）
```

---

## 📃 使用说明

### 🎨 自定义配置

项目采用**双层配置架构**，在 `src/config/.config/` 目录下创建同名配置文件即可覆盖默认设置：

```typescript
// src/config/.config/navbar.config.ts
export const userNavbarConfig = {
  logo: { siteName: '我的博客' },
  links: [
    { text: '首页', href: '/' },
    { text: '文章', href: '/posts' },
    { text: '关于', href: '/about' },
  ],
};
```

```typescript
// src/config/.config/banner.config.ts
export const userBannerConfig = {
  title: '我的博客',
  subtitle: {
    items: ['记录生活', '分享技术'],
  },
};
```

### 📋 可用配置文件

| 配置文件 | 说明 |
| --- | --- |
| `about.config.ts` | 关于页面配置 |
| `banner.config.ts` | 首页横幅配置 |
| `blogger.config.ts` | 博主信息、备案、社交链接 |
| `cursorTrail.config.ts` | 鼠标轨迹配置 |
| `imageViewer.config.ts` | 图片预览配置 |
| `navbar.config.ts` | 导航栏、社交链接、时钟 |
| `runtime.config.ts` | 站点运行时间配置 |
| `seo.config.ts` | SEO 默认信息 |
| `site.config.ts` | 站点概览页面配置 |

### 📝 添加文章

将 Markdown 文档放入 `doc/` 目录即可自动渲染。文档 frontmatter 支持的字段请参考 `doc/文档类说明/文档表头说明文档.md`。

### 🎨 自定义主题色

修改 `src/styles/variables.scss` 中的 SCSS 变量。

### 🔍 搜索功能

项目使用 [Pagefind](https://pagefind.app/) 提供全文搜索。生产构建时会自动生成索引：`npm run build`。开发环境下如需生成索引，可运行：

```bash
npm run astro:build
npm run postbuild
```

### 📦 生成商城主题包

商城上传的是主题源码发布包，不是 Astro 的 `dist/` 构建目录：

```bash
npm run package:theme
```

产物和 SHA256 校验文件生成在 `.release/`：

```text
.release/rouxzhee-theme-astro-<version>.rztheme
.release/rouxzhee-theme-astro-<version>.rztheme.sha256
```

---

## 📞 联系方式 | Contact

- **博客 Blog**: [https://wiki.xxdevops.cn](https://wiki.xxdevops.cn)
- **GitHub**: [https://github.com/xxdevops/RouxZhee](https://github.com/xxdevops/RouxZhee)
- **Issues**: [GitHub Issues](https://github.com/xxdevops/RouxZhee/issues)

---

<div align="center">

⭐ **如果这个项目对你有帮助，请给个 Star！**

**If this project helps you, please give it a star!**

Made with ❤️ by [余温Gueen](https://wiki.xxdevops.cn)

</div>
