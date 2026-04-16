<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  🏠 首页双栏内容布局组件
-->

<template>
  <div class="home-content-layout">
    <!-- 🎯 左侧信息区域 -->
    <aside class="content-sidebar">
      <!-- 👤 博主信息卡片 -->
      <BloggerCard />

      <!-- 📊 其他信息卡片（预留扩展） -->
      <!-- <div class="sidebar-card">其他内容...</div> -->
    </aside>

    <!-- 📄 右侧文档内容区域 -->
    <main class="content-main">
      <!-- 📝 文档列表 -->
      <div class="posts-grid">
        <PostCard
          v-for="post in posts"
          :key="post.slug"
          :post="post"
        />
      </div>

      <!-- 📄 分页/加载更多 -->
      <div class="posts-pagination">
        <button
          v-if="hasMorePosts"
          class="load-more-btn"
          @click="loadMore"
          :disabled="isLoading"
        >
          {{ isLoading ? '加载中...' : '加载更多' }}
        </button>
        <p v-else class="no-more-posts">已经到底啦 ~</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 🔗 首页双栏内容布局组件脚本 */

import { ref, onMounted, computed } from 'vue';
import PostCard from './PostCard.vue';
import BloggerCard from './BloggerCard.vue';
import type { Post } from '../types/post';
import { PerformanceMonitor } from '../utils/performance';

/* 📝 文档列表数据 */
const posts = ref<Post[]>([]);
const allPosts = ref<Post[]>([]);
const isLoading = ref(false);
const hasMorePosts = ref(true);
const currentPage = ref(1);
const postsPerPage = 9;

/* 📄 默认封面图集合 */
const defaultCovers = [
 // 第一组默认封面
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#fecfef;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff9a9e;stop-opacity:1" />
      </linearGradient>
      <filter id="glass5" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
      </filter>
    </defs>
    <rect width="600" height="400" fill="url(#bg5)"/>
    <circle cx="150" cy="120" r="60" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2" filter="url(#glass5)"/>
    <circle cx="450" cy="280" r="80" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2" filter="url(#glass5)"/>
    <circle cx="500" cy="100" r="40" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
    <rect x="130" y="100" width="340" height="200" rx="28" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
    <ellipse cx="300" cy="115" rx="120" ry="15" fill="rgba(255,255,255,0.3)"/>
    <rect x="170" y="160" width="220" height="16" rx="8" fill="rgba(255,255,255,0.4)"/>
    <rect x="170" y="195" width="160" height="12" rx="6" fill="rgba(255,255,255,0.3)"/>
    <rect x="170" y="220" width="180" height="12" rx="6" fill="rgba(255,255,255,0.3)"/>
    <rect x="60" y="280" width="40" height="40" rx="8" fill="#6c5ce7" opacity="0.7" transform="rotate(-15 80 300)"/>
    <circle cx="530" cy="200" r="25" fill="#00b894" opacity="0.6"/>
    <rect x="100" y="80" width="20" height="60" rx="10" fill="#fdcb6e" opacity="0.7"/>
  </svg>`)}`,
  
];

/* 📄 获取随机默认封面 */
const getRandomCover = (): string => {
  const index = Math.floor(Math.random() * defaultCovers.length);
  return defaultCovers[index];
};

/* 📄 默认封面（使用第一组作为后备） */
const defaultCover = defaultCovers[0];

/*  从文件路径提取 slug */
const extractSlug = (path: string): string => {
  const filename = path.split('/').pop() || '';
  return filename.replace(/\.md$/, '');
};

/* 🔍 从内容提取描述（前150个字符） */
const extractDescription = (content: string): string => {
  // 移除 frontmatter
  const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '');
  // 移除 Markdown 语法
  const plainText = contentWithoutFrontmatter
    .replace(/#+ /g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
  // 截取前150个字符
  return plainText.length > 150 ? plainText.slice(0, 150) + '...' : plainText;
};

/* 🔍 解析标签（支持顿号、逗号、中文逗号分隔，以及数组格式） */
const parseTags = (tagsValue: string): string[] => {
  if (!tagsValue) return [];

  // 移除数组括号
  const cleaned = tagsValue.replace(/[\[\]'"]/g, '');

  // 支持顿号、逗号、中文逗号分隔
  return cleaned
    .split(/[、,，]/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
};

/* 🔍 计算阅读时间（按每分钟300字计算） */
const calculateReadTime = (content: string): string => {
  // 移除 frontmatter
  const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '');
  // 计算中文字符数
  const chineseChars = (contentWithoutFrontmatter.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 计算英文单词数
  const englishWords = (contentWithoutFrontmatter.match(/[a-zA-Z]+/g) || []).length;
  // 总字数（中文按字算，英文按单词算）
  const totalWords = chineseChars + englishWords;
  // 按每分钟300字计算，向上取整
  const minutes = Math.ceil(totalWords / 300);
  return `${minutes} 分钟`;
};

/* 📄 加载所有文档 */
const loadAllPosts = async () => {
  PerformanceMonitor.startMark('loadAllPosts');

  try {
    // 🗂️ 使用 import.meta.glob 加载所有 MD 文件
    const mdModules = import.meta.glob('../../doc/**/*.md', { eager: true, query: '?raw', import: 'default' });

    const loadedPosts: Post[] = [];

    for (const [path, content] of Object.entries(mdModules)) {
      const rawContent = content as string;
      const slug = extractSlug(path);

      // 🔍 解析 frontmatter（支持 Windows \r\n 和 Unix \n 换行符）
      const frontmatterMatch = rawContent.match(/---\r?\n([\s\S]*?)\r?\n---/);
      let frontmatter: Record<string, any> = {};

      if (frontmatterMatch) {
        const frontmatterContent = frontmatterMatch[1];
        // 简单解析 YAML frontmatter
        frontmatterContent.split(/\r?\n/).forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // 移除引号
            value = value.replace(/^['"]|['"]$/g, '');
            frontmatter[key] = value;
          }
        });
      }

      // 📝 构建 Post 对象
      const post: Post = {
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description || extractDescription(rawContent),
        cover: frontmatter.cover || getRandomCover(),
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        url: frontmatter.url || `/posts/${slug}`,
        tags: parseTags(frontmatter.tags),
        category: frontmatter.category || '',
        readTime: frontmatter.readTime || calculateReadTime(rawContent),
        titleIcon: frontmatter.titleIcon || '',
      };

      loadedPosts.push(post);
    }

    // 📅 按日期降序排序
    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    allPosts.value = loadedPosts;
    PerformanceMonitor.endMark('loadAllPosts');
  } catch (error) {
    console.error('❌ 加载文档失败:', error);
    PerformanceMonitor.endMark('loadAllPosts');
  }
};

/* 🔄 加载更多文档 */
const loadMore = async () => {
  if (isLoading.value || !hasMorePosts.value) return;

  isLoading.value = true;

  // 模拟异步加载延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  // 计算要加载的文档
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const newPosts = allPosts.value.slice(startIndex, endIndex);

  if (newPosts.length > 0) {
    posts.value.push(...newPosts);
    currentPage.value++;
  }

  // 检查是否还有更多
  hasMorePosts.value = posts.value.length < allPosts.value.length;
  isLoading.value = false;
};

/* 🔄 初始化加载 */
onMounted(async () => {
  // 📄 加载所有文档
  await loadAllPosts();

  // 初始加载第一页
  const initialPosts = allPosts.value.slice(0, postsPerPage);
  posts.value = initialPosts;
  currentPage.value = 2;
  hasMorePosts.value = allPosts.value.length > postsPerPage;
});
</script>

<style scoped lang="scss">
@use '../styles/home-content.scss' as *;
</style>
