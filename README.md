<div align="center">

![Logo](./public/RouxZhee-LOGO.png)

# RouxZhee - Astro个人博客主题

</div>

---

## 📖 项目简介 | Introduction

**中文**

RouxZhee 是一个基于 Astro + Vue 3 + TypeScript + SCSS 构建的现代个人博客主题。采用玻璃质感圆角卡片设计风格，支持主题切换、懒加载、双模式分页等特性，为技术博主提供优雅的内容展示体验

**English**

RouxZhee is a modern personal blog theme built with Astro + Vue 3 + TypeScript + SCSS. Featuring glassmorphism rounded card design, theme switching, lazy loading, and dual-mode pagination, providing an elegant content display experience for tech bloggers

---

## ✨ 核心特性 | Key Features

### 🎨 设计 | Design

- 🪟 **玻璃质感** - 采用毛玻璃效果的圆角卡片设计
- 🌙 **主题切换** - 支持明暗主题，带涟漪动画效果
- 📱 **响应式布局** - 适配各种屏幕尺寸
- 🎯 **层级管理** - 科学的 z-index 层级规划

### ⚡ 性能 | Performance

- 🚀 **Astro 驱动** - 零 JavaScript 默认输出，极速首屏加载
- 💤 **懒加载支持** - 图片和内容按需加载
- 📦 **组件化架构** - Vue 3 组件复用，代码精简

### 🛠️ 功能 | Functions

- 🔍 **搜索功能** - 页面左下角集成搜索按钮
- ⬆️ **快捷导航** - 轮盘式回到顶部/前往底部按钮
- 🎨 **主题切换** - 左下角涟漪式主题切换动画
- ⏰ **实时时钟** - 导航栏内置时钟组件
- 📄 **双模式分页** - 支持页码模式和无限懒加载模式

### 🎯 开发体验 | Developer Experience

- 🔧 **双层配置** - 默认配置 + 用户自定义配置，灵活覆盖
- 📝 **TypeScript** - 类型安全的开发体验
- 🎨 **SCSS 变量** - 统一的颜色和样式管理
- 🧩 **模块化组件** - 清晰的组件划分，易于扩展

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

### 🔨 构建生产版本

```bash
npm run build
```

构建输出位于 `dist/` 目录

### 👀 预览生产构建

```bash
npm run preview
```

---

## 📁 项目结构

```
RouxZhee/
├── src/
│   ├── components/     # Vue 组件
│   ├── config/         # 配置文件
│   ├── layouts/        # Astro 布局
│   ├── pages/          # 页面文件
│   ├── styles/         # SCSS 样式
│   └── utils/          # 工具函数
├── public/             # 静态资源
└── .doc/               # 存放文档内容

```

---

## 📃 使用说明

### 🎨 自定义配置

项目采用**双层配置架构**，在 `src/config/.config/` 目录下创建配置文件即可覆盖默认设置：

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

### 📝 添加文章

将 Markdown 文档放入 `doc/` 目录即可自动渲染。

### 🎨 自定义主题色

修改 `src/styles/variables.scss` 中的 SCSS 变量。

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
