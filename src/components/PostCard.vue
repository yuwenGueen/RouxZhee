<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  📝 文档内容卡片组件
-->

<template>
  <article class="post-card">
    <!-- 🖼️ 文档封面 -->
    <a
      :href="post.url"
      class="post-cover-wrapper"
      :aria-label="`查看文章：${post.title}`"
    >
      <img
        :src="post.cover"
        :alt="post.title"
        class="post-cover"
        loading="lazy"
      />
      <!-- ✨ 悬停遮罩 -->
      <div class="post-cover-overlay">
        <div class="post-cover-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><defs><clipPath id="lineMdWatchTwotoneLoop0"><rect width="24" height="12"></rect></clipPath><symbol id="lineMdWatchTwotoneLoop1"><path fill="#fff" fill-opacity="0" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" data-swindex="0" d="M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z" clip-path="url(#lineMdWatchTwotoneLoop0)"><animate attributeName="d" dur="6s" keyTimes="0;0.07;0.93;1" repeatCount="indefinite" values="M23 16.5C23 11.5 18.0751 12 12 12C5.92487 12 1 11.5 1 16.5z;M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z;M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z;M23 16.5C23 11.5 18.0751 12 12 12C5.92487 12 1 11.5 1 16.5z"></animate><animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.15s" values="0;0.3"></animate></path></symbol><mask id="lineMdWatchTwotoneLoop2"><use href="#lineMdWatchTwotoneLoop1"></use><use href="#lineMdWatchTwotoneLoop1" transform="rotate(180 12 12)"></use><circle cx="12" cy="12" r="0" fill="#fff"><animate attributeName="r" dur="6s" keyTimes="0;0.03;0.97;1" repeatCount="indefinite" values="0;3;3;0"></animate></circle></mask></defs><rect width="24" height="24" fill="#9e9e9e" mask="url(#lineMdWatchTwotoneLoop2)"></rect></svg>
        </div>
      </div>
    </a>

    <!-- 📝 文档信息 -->
    <div class="post-content">
      <!-- 📌 标题 -->
      <h3 class="post-title">
        <a :href="post.url" class="post-title-link">
          {{ post.title }}
        </a>
      </h3>

      <!-- 📝 描述 -->
      <p v-if="post.description" class="post-description">
        {{ post.description }}
      </p>

      <!-- 📅 发布时间 -->
      <time class="post-date" :datetime="post.date">
        <svg class="post-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {{ formatDate(post.date) }}
      </time>
    </div>
  </article>
</template>

<script setup lang="ts">
/* 🔗 文档内容卡片组件脚本 */

import type { Post } from '../types/post';

/* 📋 Props 定义 */
interface Props {
  post: Post;
}

defineProps<Props>();

/* 📅 日期格式化函数 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
</script>

<style scoped lang="scss">
/* 🎨 文档内容卡片样式 */

.post-card {
  /* 📦 基础布局 */
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--card-border-radius);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-normal);
  z-index: 5;

  /* ✨ 悬停效果 */
  &:hover {
    transform: var(--card-transform-hover);
    box-shadow: var(--card-shadow-hover);

    .post-cover-wrapper {
      .post-cover {
        transform: var(--post-cover-scale-hover);
      }

      .post-cover-overlay {
        opacity: var(--card-overlay-opacity-hover);
      }
    }
  }

  /* 🖼️ 封面区域 */
  .post-cover-wrapper {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: var(--post-cover-aspect-ratio);
    overflow: hidden;
    text-decoration: none;

    .post-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--post-cover-transition);
    }

    /* ✨ 悬停遮罩 */
    .post-cover-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--card-overlay-bg);
      backdrop-filter: blur(var(--card-overlay-blur));
      -webkit-backdrop-filter: blur(var(--card-overlay-blur));
      opacity: var(--card-overlay-opacity);
      transition: all var(--transition-normal);
    }

    &:hover .post-cover-icon-wrapper {
      transform: var(--card-icon-transform-hover);
    }
  }

  /* 📝 内容区域 */
  .post-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: var(--card-content-padding);
    gap: var(--card-content-gap);

    /* 📌 标题 */
    .post-title {
      margin: 0;
      font-size: var(--card-title-font-size);
      font-weight: var(--card-title-font-weight);
      line-height: var(--card-title-line-height);
      font-family: var(--font-heading);

      .post-title-link {
        color: var(--text-color);
        text-decoration: none;
        transition: color var(--transition-normal);

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    /* 📝 描述 */
    .post-description {
      margin: 0;
      font-size: var(--card-description-font-size);
      line-height: var(--card-description-line-height);
      color: var(--text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: var(--card-description-clamp);
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* 📅 发布时间 */
    .post-date {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: var(--card-date-font-size);
      color: var(--text-secondary);
      margin-top: auto;
      padding-top: 0.5rem;
      border-top: var(--card-date-border-top);

      .post-date-icon {
        width: var(--card-date-icon-size);
        height: var(--card-date-icon-size);
      }
    }
  }
}

/* 🌙 暗色模式适配 */
:global(.dark-mode) {
  .post-card {
    background: var(--glass-bg);
    border-color: var(--glass-border);

    .post-content {
      .post-title-link {
        color: var(--text-color);

        &:hover {
          color: var(--primary-color);
        }
      }

      .post-description {
        color: var(--text-secondary);
      }

      .post-date {
        color: var(--text-secondary);
        border-top: var(--card-date-border-top);
      }
    }
  }
}
</style>
