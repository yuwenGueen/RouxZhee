<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  🧭 导航栏组件 - 双模式切换起飞🚀
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Clock from './Clock.vue';
import { navbarConfig } from '../config/navbar.config';

// 🎯 响应式状态
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

// 从配置中获取滚动阈值
const SCROLL_THRESHOLD = navbarConfig.scroll.threshold;

/**
 * 处理滚动事件，切换导航栏样式
 */
const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  const newIsScrolled = scrollY > SCROLL_THRESHOLD;

  // 只在状态变化时更新
  if (isScrolled.value !== newIsScrolled) {
    isScrolled.value = newIsScrolled;
  }
};

/**
 * 强制检查初始滚动状态
 */
const checkInitialScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  isScrolled.value = scrollY > SCROLL_THRESHOLD;
};

/**
 * 切换移动端菜单
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

/**
 * 关闭移动端菜单
 */
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// 🚀 组件挂载
onMounted(() => {
  // 强制检查初始滚动状态
  checkInitialScroll();

  // 监听滚动
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 延迟再次检查，确保 DOM 完全渲染
  setTimeout(checkInitialScroll, 100);
});

// 🧹 组件卸载
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <!-- 🧭 导航栏 -->
  <nav
    class="navbar"
    :class="{
      'is-scrolled': isScrolled,
      'is-transparent': !isScrolled
    }"
  >
    <div class="navbar-container">
      <!-- 🏠 Logo 区域 -->
      <div class="navbar-brand-wrapper">
        <a href="/" class="navbar-brand" @click="closeMobileMenu">
          <img
            v-if="navbarConfig.logo.showLogo"
            :src="navbarConfig.logo.src"
            :alt="navbarConfig.logo.siteName"
            class="navbar-logo"
          />
          <span v-if="navbarConfig.logo.showSiteName" class="navbar-site-name">
            {{ navbarConfig.logo.siteName }}
          </span>
        </a>
      </div>

      <!-- 📍 导航链接 -->
      <div class="navbar-menu">
        <a
          v-for="(link, index) in navbarConfig.links"
          :key="`nav-${index}`"
          :href="link.href"
          class="navbar-link"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          {{ link.text }}
        </a>
      </div>

      <!-- 🔗 右侧区域：社交链接 + 时钟 -->
      <div class="navbar-right">
        <!-- 社交链接区域 -->
        <div v-if="navbarConfig.social.enabled" class="navbar-social">
          <a
            v-for="(social, index) in navbarConfig.social.links"
            :key="`social-${index}`"
            :href="social.href"
            class="social-link"
            :target="social.external ? '_blank' : undefined"
            :rel="social.external ? 'noopener noreferrer' : undefined"
            :aria-label="social.name"
          >
            <!-- 🎨 使用 v-html 渲染完整 SVG 代码 -->
            <span class="social-icon" v-html="social.icon"></span>
          </a>
        </div>

        <!-- ⏰ 时钟区域 -->
        <div v-if="navbarConfig.clock.enabled" class="navbar-clock">
          <Clock />
        </div>
      </div>

      <!-- 📱 移动端菜单按钮 -->
      <button
        class="navbar-toggle"
        :class="{ 'is-active': isMobileMenuOpen }"
        @click="toggleMobileMenu"
        :aria-label="navbarConfig.mobileMenu.ariaLabel"
      >
        <span class="toggle-line"></span>
        <span class="toggle-line"></span>
        <span class="toggle-line"></span>
      </button>
    </div>
  </nav>

  <!-- 📱 移动端菜单 -->
  <div
    class="navbar-mobile-menu"
    :class="{ 'is-open': isMobileMenuOpen }"
  >
    <a
      v-for="(link, index) in navbarConfig.links"
      :key="`mobile-${index}`"
      :href="link.href"
      class="navbar-mobile-link"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      @click="closeMobileMenu"
    >
      {{ link.text }}
    </a>
  </div>
</template>

<style lang="scss">
@use '../styles/navbar.scss' as *;
</style>
