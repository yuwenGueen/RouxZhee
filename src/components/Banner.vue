<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  🎭 Banner 区域组件
-->

<template>
  <section
    class="banner-section"
    :class="{ 'banner-static': !config.background.enabled }"
    :data-autoplay="config.background.autoPlay"
    :data-interval="config.background.interval"
    :style="{ zIndex: 'var(--banner-z-index, 4)' }"
  >
    <!-- 🎯 内容区域 -->
    <div class="banner-content">
      <!-- 📝 标题 -->
      <h1 class="banner-title">{{ config.title }}</h1>

      <!-- 📝 副标题 (打字机效果) -->
      <template v-if="config.subtitle.enabled && config.subtitle.items.length > 0">
        <p class="banner-subtitle banner-subtitle--typed">
          <span
            ref="subtitleRef"
            data-banner-subtitle
            :data-items="JSON.stringify(config.subtitle.items)"
            :data-type-speed="config.subtitle.typeSpeed"
            :data-delete-speed="config.subtitle.deleteSpeed"
            :data-hold="config.subtitle.holdTime"
            :data-next-delay="config.subtitle.nextDelay"
            :data-shuffle="config.subtitle.shuffle.toString()"
          >
            {{ config.subtitle.items[0] }}
          </span>
          <span class="banner-subtitle__caret" data-banner-caret>|</span>
        </p>
      </template>
      <template v-else>
        <p class="banner-subtitle">{{ config.subtitle.items[0] || '' }}</p>
      </template>

      <!-- 👇 滚动指示器 -->
      <div
        v-if="config.scrollIndicator.enabled"
        class="banner-scroll-indicator"
        @click="scrollToContent"
      >
        <span>{{ config.scrollIndicator.text }}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14m0 0l7-7m-7 7l-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- 🌊 波浪过渡 -->
    <svg
      v-if="config.waves.enabled"
      class="banner-waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g class="parallax">
        <use class="wave-layer" xlink:href="#gentle-wave" x="48" y="0" />
        <use class="wave-layer" xlink:href="#gentle-wave" x="48" y="3" />
        <use class="wave-layer" xlink:href="#gentle-wave" x="48" y="5" />
        <use class="wave-layer" xlink:href="#gentle-wave" x="48" y="7" />
      </g>
    </svg>


  </section>
</template>

<script setup lang="ts">
/* 🔗 Banner 组件脚本 */

import { ref, onMounted, onUnmounted } from 'vue';
import { bannerConfig } from '../config/banner.config';
import type { BannerConfig } from '../config/banner.config';
import { Typewriter } from '../utils/typewriter';

/* 📋 配置数据 */
const config = ref<BannerConfig>(bannerConfig);

/* 📝 副标题元素引用 */
const subtitleRef = ref<HTMLElement | null>(null);

/* 🖊️ 打字机实例 */
let typewriterInstance: Typewriter | null = null;

/* 👇 滚动到内容区域 */
const scrollToContent = (): void => {
  const contentElement = document.getElementById('content');
  if (contentElement) {
    contentElement.scrollIntoView({ behavior: 'smooth' });
  }
};

/* 🎯 初始化打字机效果 */
const initTypewriterEffect = (): void => {
  if (!subtitleRef.value || !config.value.subtitle.enabled) return;

  const items = config.value.subtitle.items;
  if (items.length === 0) return;

  const caret = document.querySelector('[data-banner-caret]') as HTMLElement;

  typewriterInstance = new Typewriter(
    subtitleRef.value,
    caret,
    {
      items,
      typeSpeed: config.value.subtitle.typeSpeed,
      deleteSpeed: config.value.subtitle.deleteSpeed,
      holdTime: config.value.subtitle.holdTime,
      nextDelay: config.value.subtitle.nextDelay,
      shuffle: config.value.subtitle.shuffle,
    }
  );
};

/* 🔄 组件挂载 */
onMounted(() => {
  // 延迟初始化打字机效果，确保 DOM 已渲染
  setTimeout(initTypewriterEffect, 100);
});

/* 🧹 组件卸载 */
onUnmounted(() => {
  if (typewriterInstance) {
    typewriterInstance.destroy();
    typewriterInstance = null;
  }
});
</script>

<style scoped lang="scss">
@use '../styles/banner.scss' as *;

// 🎨 波浪颜色变量
:deep(.banner-waves) {
  .wave-layer:nth-child(1) {
    fill: rgba(255, 255, 255, 0.7) !important;
  }
  .wave-layer:nth-child(2) {
    fill: rgba(255, 255, 255, 0.5) !important;
  }
  .wave-layer:nth-child(3) {
    fill: rgba(255, 255, 255, 0.3) !important;
  }
}
</style>
