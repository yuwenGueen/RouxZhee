<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  👤 博主信息卡片组件
-->

<template>
  <div class="blogger-card">
    <!-- 🖼️ 头像区域 -->
    <div class="blogger-avatar-wrapper">
      <a
        :href="config.homepage"
        target="_blank"
        rel="noopener noreferrer"
        class="blogger-avatar-link"
        :aria-label="`访问 ${config.name} 的主页`"
      >
        <img
          :src="config.avatar.src"
          :alt="config.avatar.alt"
          class="blogger-avatar"
          loading="lazy"
        />
      </a>
    </div>

    <!-- 🏷️ 博主名称 -->
    <h3 class="blogger-name">
      <a
        :href="config.homepage"
        target="_blank"
        rel="noopener noreferrer"
        class="blogger-name-link"
      >
        {{ config.name }}
      </a>
    </h3>

    <!-- 📱 社交链接 -->
    <div v-if="config.social.enabled && config.social.links.length > 0" class="blogger-social">
      <a
        v-for="link in config.social.links"
        :key="link.name"
        :href="link.href"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="blogger-social-link"
        :aria-label="link.name"
        v-html="link.icon"
      />
    </div>

    <!-- 📋 备案信息 -->
    <div v-if="hasBeian" class="blogger-beian">
      <a
        v-if="config.beian?.icp?.text"
        :href="config.beian.icp.href"
        target="_blank"
        rel="noopener noreferrer"
        class="beian-link"
      >
        {{ config.beian.icp.text }}
      </a>
      <a
        v-if="config.beian?.gongan?.text"
        :href="config.beian.gongan.href"
        target="_blank"
        rel="noopener noreferrer"
        class="beian-link"
      >
        {{ config.beian.gongan.text }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
/* 🔗 博主信息卡片组件脚本 */

import { computed } from 'vue';
import { bloggerConfig } from '../config/blogger.config';
import type { BloggerConfig } from '../config/blogger.config';

/* 📋 配置数据 */
const config = bloggerConfig as BloggerConfig;

/* 🔍 是否有备案信息 */
const hasBeian = computed(() => {
  return !!(config.beian?.icp?.text || config.beian?.gongan?.text);
});
</script>

<style scoped lang="scss">
/* 🎨 博主信息卡片样式 */

.blogger-card {
  /* 📦 基础布局 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--card-padding);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  transition: all var(--transition-normal);
  z-index: 5;

  /* ✨ 悬停效果 */
  &:hover {
    transform: var(--card-transform-hover);
    box-shadow: var(--card-shadow-hover);
  }

  /* 🖼️ 头像区域 */
  .blogger-avatar-wrapper {
    margin-bottom: 1rem;

    .blogger-avatar-link {
      display: block;
      width: var(--blogger-avatar-size);
      height: var(--blogger-avatar-size);
      border-radius: 50%;
      overflow: hidden;
      transition: all var(--transition-normal);
      box-shadow: var(--blogger-avatar-shadow);

      &:hover {
        transform: scale(1.05);
        box-shadow: var(--blogger-avatar-shadow-hover);
      }

      .blogger-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.3s ease;
      }
    }
  }

  /* 🏷️ 博主名称 */
  .blogger-name {
    margin: 0 0 1rem 0;
    font-size: var(--blogger-name-font-size);
    font-weight: var(--blogger-name-font-weight);
    color: var(--text-color);
    font-family: var(--font-heading);

    .blogger-name-link {
      color: inherit;
      text-decoration: none;
      transition: color var(--transition-normal);

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  /* 📱 社交链接 */
  .blogger-social {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;

    /* 一行最多4个，超出换行 */
    .blogger-social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--blogger-social-link-size);
      height: var(--blogger-social-link-size);
      border-radius: var(--blogger-social-link-radius);
      background: var(--blogger-social-link-bg);
      color: var(--text-secondary);
      transition: all var(--transition-normal);
      flex: 0 0 calc(25% - 0.375rem);
      max-width: var(--blogger-social-link-size);

      &:hover {
        background: var(--blogger-social-link-bg-hover);
        color: var(--primary-color);
        transform: translateY(-2px);
      }

      /* SVG 图标样式 */
      :deep(svg) {
        width: var(--blogger-social-icon-size);
        height: var(--blogger-social-icon-size);
      }
    }
  }

  /* 📋 备案信息 */
  .blogger-beian {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--glass-border);
    width: 100%;

    .beian-link {
      font-size: var(--beian-font-size);
      color: var(--text-tertiary);
      text-decoration: none;
      transition: color var(--transition-normal);
      line-height: 1.4;

      &:hover {
        color: var(--primary-color);
      }
    }
  }
}

/* 🌙 暗色模式适配 */
:global(.dark-mode) {
  .blogger-card {
    background: var(--glass-bg);
    border-color: var(--glass-border);

    .blogger-name {
      color: var(--text-color);

      .blogger-name-link:hover {
        color: var(--primary-color);
      }
    }

    .blogger-social-link {
      background: var(--blogger-social-link-bg);
      color: var(--text-secondary);

      &:hover {
        background: var(--blogger-social-link-bg-hover);
        color: var(--primary-color);
      }
    }

    /* 📋 备案信息暗色模式 */
    .blogger-beian {
      border-top-color: var(--glass-border);

      .beian-link {
        color: var(--text-tertiary);

        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
}
</style>
