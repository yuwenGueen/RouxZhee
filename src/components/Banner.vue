<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  🎭 Banner 区域组件
-->

<template>
  <section
    class="banner-section"
    :class="{ 'banner-static': !config.background.enabled || backgroundImages.length === 0 }"
    :data-autoplay="config.background.autoPlay"
    :data-interval="config.background.interval"
    :style="sectionStyle"
  >
    <!-- 🧭 导航栏 (内嵌在Banner区域内) -->
    <Navbar />

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

import { ref, onMounted, onUnmounted, computed } from 'vue';
import Navbar from './Navbar.vue';
import { bannerConfig } from '../config/banner.config';
import type { BannerConfig } from '../config/banner.config';
import { Typewriter } from '../utils/typewriter';

/* 📋 配置数据 */
const config = ref<BannerConfig>(bannerConfig);

/* 🖼️ 背景图片相关状态 */
const backgroundImages = computed(() => config.value.background.images || []);
// 🔄 当前显示的图片索引（在 bgImageA 和 bgImageB 之间切换）
const currentImageIndex = ref(0);
// 🔄 当前活跃的背景层：'A' 或 'B'
const activeLayer = ref<'A' | 'B'>('A');
// 🔄 API 图片缓存（用于预加载）
const apiImageCache = ref<Record<number, string>>({});
let imageInterval: ReturnType<typeof setInterval> | null = null;
let preloadTimeout: ReturnType<typeof setTimeout> | null = null;

/* 🔍 检测是否为图片 API（无图片后缀） */
const isImageApi = (url: string): boolean => {
  if (!url) return false;
  // 检查常见的图片后缀
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff?)$/i;
  // 移除查询参数后检查后缀
  const urlWithoutParams = url.split('?')[0];
  return !imageExtensions.test(urlWithoutParams);
};

/* 📐 Section 样式 - 动态设置背景图片 */
const sectionStyle = computed(() => {
  const style: Record<string, string> = {
    zIndex: 'var(--banner-z-index, 4)',
  };

  const images = backgroundImages.value;
  if (images.length > 0) {
    const fadeDuration = config.value.background.fadeDuration || 3500;

    // 🖼️ 计算当前和上一张图片索引
    const currentIdx = currentImageIndex.value;
    const prevIdx = (currentIdx - 1 + images.length) % images.length;

    // 🖼️ 获取图片 URL（优先使用缓存的 API 图片）
    const getImageUrl = (idx: number): string => {
      const url = images[idx];
      // 如果是 API 且有缓存，使用缓存的图片 URL
      if (isImageApi(url) && apiImageCache.value[idx]) {
        return apiImageCache.value[idx];
      }
      return url;
    };

    // 🎬 根据活跃层设置图片和透明度
    if (activeLayer.value === 'A') {
      // 层A显示当前图片，层B显示上一张
      style['--banner-bg-image-1'] = `url(${getImageUrl(currentIdx)})`;
      style['--banner-bg-image-2'] = `url(${getImageUrl(prevIdx)})`;
      style['--banner-bg-opacity-1'] = '1';
      style['--banner-bg-opacity-2'] = '0';
    } else {
      // 层B显示当前图片，层A显示上一张
      style['--banner-bg-image-1'] = `url(${getImageUrl(prevIdx)})`;
      style['--banner-bg-image-2'] = `url(${getImageUrl(currentIdx)})`;
      style['--banner-bg-opacity-1'] = '0';
      style['--banner-bg-opacity-2'] = '1';
    }

    style['--banner-object-fit'] = config.value.background.objectFit || 'cover';
    style['--banner-position'] = config.value.background.position || 'center';
    style['--banner-fade-duration'] = `${fadeDuration}ms`;
  }

  return style;
});

/* 📝 副标题元素引用 */
const subtitleRef = ref<HTMLElement | null>(null);

/* 🖊️ 打字机实例 */
let typewriterInstance: Typewriter | null = null;

/* 🔄 加载指定索引的图片（用于 API 图片） */
const loadApiImage = async (index: number): Promise<void> => {
  const images = backgroundImages.value;
  if (index < 0 || index >= images.length) return;

  const url = images[index];

  // 🔍 如果是 API 图片且未缓存，使用 Image 对象预加载
  if (isImageApi(url) && !apiImageCache.value[index]) {
    try {
      // 🖼️ 使用 Image 对象预加载（不设置 crossOrigin 避免 CORS 限制）
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        // 注意：不设置 crossOrigin，让浏览器以默认模式加载
        // 这样即使服务器没有 CORS 头，图片也能正常显示
        img.onload = () => {
          // 预加载成功，缓存 URL
          apiImageCache.value[index] = url;
          resolve();
        };
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
        img.src = url;
      });
    } catch (error) {
      console.warn('🖼️ 加载图片失败:', url, error);
      // 即使预加载失败，仍然使用原始 URL
      apiImageCache.value[index] = url;
    }
  }
};

/* 🔄 预加载下一张图片 */
const preloadNextImage = async () => {
  const images = backgroundImages.value;
  if (images.length <= 1) return;

  const nextIndex = (currentImageIndex.value + 1) % images.length;
  await loadApiImage(nextIndex);
};

/* 🔄 加载当前图片（用于首次加载） */
const loadCurrentImage = async () => {
  await loadApiImage(currentImageIndex.value);
};

/* 🔄 切换背景图片 */
const switchBackgroundImage = () => {
  const images = backgroundImages.value;
  if (images.length <= 1) return;

  // 🎬 计算下一张图片索引
  const nextIndex = (currentImageIndex.value + 1) % images.length;

  // 🔄 切换活跃层（A ↔ B）
  activeLayer.value = activeLayer.value === 'A' ? 'B' : 'A';

  // 📍 更新当前图片索引
  currentImageIndex.value = nextIndex;

  // 🗑️ 清理上一张的缓存
  const prevIndex = (nextIndex - 2 + images.length) % images.length;
  if (apiImageCache.value[prevIndex]) {
    delete apiImageCache.value[prevIndex];
  }
};

/* 🎯 启动图片轮播 */
const startImageRotation = async () => {
  if (!config.value.background.autoPlay || backgroundImages.value.length <= 1) return;

  const interval = config.value.background.interval || 8000;
  const fadeDuration = config.value.background.fadeDuration || 3500;
  const preloadDelay = Math.max(0, interval - fadeDuration - 3000); // 提前3秒预加载

  // 🖼️ 首先加载当前显示的图片（如果是 API）
  await loadCurrentImage();

  // 🔄 预加载下一张图片
  await preloadNextImage();

  imageInterval = setInterval(() => {
    switchBackgroundImage();
    // 🔄 切换后立即预加载下一张
    preloadNextImage();
  }, interval);

  // ⏱️ 设置预加载定时器（提前3秒）
  if (preloadDelay > 0) {
    const schedulePreload = () => {
      preloadTimeout = setTimeout(() => {
        preloadNextImage();
        schedulePreload();
      }, interval);
    };
    schedulePreload();
  }
};

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
onMounted(async () => {
  // 延迟初始化打字机效果，确保 DOM 已渲染
  setTimeout(initTypewriterEffect, 100);

  // 🖼️ 启动背景图片轮播（异步加载 API 图片）
  await startImageRotation();
});

/* 🧹 组件卸载 */
onUnmounted(() => {
  if (typewriterInstance) {
    typewriterInstance.destroy();
    typewriterInstance = null;
  }

  // 🖼️ 清理图片轮播定时器
  if (imageInterval) {
    clearInterval(imageInterval);
    imageInterval = null;
  }

  // ⏱️ 清理预加载定时器
  if (preloadTimeout) {
    clearTimeout(preloadTimeout);
    preloadTimeout = null;
  }

  // 🗑️ 清理 API 图片缓存
  apiImageCache.value = {};
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
