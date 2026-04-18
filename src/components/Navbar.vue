<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  🧭 导航栏组件 - 双模式切换起飞🚀
  📂 支持多级嵌套菜单
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Clock from './Clock.vue';
import { navbarConfig, type NavLink } from '../config/navbar.config';

// 🎯 当前打开的菜单路径（用于控制多级菜单展开状态）
const activeMenuPath = ref<string[]>([]);

// 📝 切换子菜单展开状态
const toggleSubmenu = (path: string[], event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const pathKey = path.join('>');
  const parentPath = path.slice(0, -1).join('>');
  
  // 如果点击的是已展开的菜单，则关闭它
  if (activeMenuPath.value.join('>').startsWith(pathKey)) {
    // 关闭当前及子菜单，保留父级
    if (parentPath) {
      activeMenuPath.value = parentPath.split('>').filter(Boolean);
    } else {
      activeMenuPath.value = [];
    }
  } else {
    // 展开新菜单，关闭同级其他菜单
    if (parentPath) {
      activeMenuPath.value = [...parentPath.split('>').filter(Boolean), path[path.length - 1]];
    } else {
      activeMenuPath.value = [path[0]];
    }
  }
};

// 📝 检查菜单是否展开
const isMenuActive = (path: string[]): boolean => {
  const currentPath = activeMenuPath.value.join('>');
  const checkPath = path.join('>');
  return currentPath.startsWith(checkPath);
};

// 📝 关闭所有子菜单
const closeAllSubmenus = () => {
  activeMenuPath.value = [];
};

// 📝 处理点击页面其他地方关闭子菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // 检查点击的是否在菜单区域内
  const isInsideMenu = target.closest('.navbar-menu-item') !== null;
  if (!isInsideMenu) {
    closeAllSubmenus();
  }
};

// 🎯 响应式状态
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

// 📄 检测是否在文档内容页面
const isDocPage = computed(() => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  // 排除首页和其他非文档页面
  return path !== '/' && path !== '/index.html' && path !== '';
});

// 📱 检测是否为移动端
const isMobile = ref(false);
const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

// 🎨 导航栏透明度控制（普通页面效果）
const isNavbarFaded = ref(false);
let navbarFadeTimer: ReturnType<typeof setTimeout> | null = null;
const NAVBAR_FADE_DELAY = 3000; // ◀️ 3秒后降低透明度

// 🎨 导航栏隐藏控制（文档页面效果 - 上移渐隐）
const isNavbarHidden = ref(false);
let navbarHideTimer: ReturnType<typeof setTimeout> | null = null;
const NAVBAR_HIDE_DELAY = 3000; // ◀️ 3秒后上移隐藏

// 🔗 启动导航栏淡出计时器（普通页面）
const startNavbarFadeTimer = () => {
  // 如果是文档页面或移动端，不使用此效果
  if (isDocPage.value || isMobile.value) return;
  // 清除已有计时器
  if (navbarFadeTimer) {
    clearTimeout(navbarFadeTimer);
  }
  // 设置新的计时器，3秒后降低透明度
  navbarFadeTimer = setTimeout(() => {
    isNavbarFaded.value = true;
  }, NAVBAR_FADE_DELAY);
};

// 🔗 启动导航栏隐藏计时器（文档页面 - 上移渐隐）
const startNavbarHideTimer = () => {
  // 如果不是文档页面或是移动端，不使用此效果
  if (!isDocPage.value || isMobile.value) return;
  // 清除已有计时器
  if (navbarHideTimer) {
    clearTimeout(navbarHideTimer);
  }
  // 设置新的计时器，3秒后上移隐藏
  navbarHideTimer = setTimeout(() => {
    isNavbarHidden.value = true;
  }, NAVBAR_HIDE_DELAY);
};

// 🔗 处理导航栏鼠标移入
const handleNavbarMouseEnter = () => {
  // 如果是文档页面且导航栏已隐藏，显示导航栏
  if (isDocPage.value && !isMobile.value && isNavbarHidden.value) {
    isNavbarHidden.value = false;
    // 清除隐藏计时器
    if (navbarHideTimer) {
      clearTimeout(navbarHideTimer);
      navbarHideTimer = null;
    }
    return;
  }
  // 普通页面：鼠标移入，恢复透明度
  if (!isDocPage.value || isMobile.value) {
    isNavbarFaded.value = false;
    // 清除淡出计时器
    if (navbarFadeTimer) {
      clearTimeout(navbarFadeTimer);
      navbarFadeTimer = null;
    }
  }
};

// 🔗 处理触发区域鼠标移入（立即显示导航栏，无延迟）
const handleTriggerMouseEnter = () => {
  if (!isDocPage.value || isMobile.value) return;
  // 立即显示导航栏
  isNavbarHidden.value = false;
  // 清除隐藏计时器
  if (navbarHideTimer) {
    clearTimeout(navbarHideTimer);
    navbarHideTimer = null;
  }
};

// 🔗 处理导航栏鼠标移出
const handleNavbarMouseLeave = () => {
  // 如果是文档页面，启动隐藏计时器
  if (isDocPage.value && !isMobile.value) {
    startNavbarHideTimer();
    return;
  }
  // 普通页面：启动淡出计时器
  startNavbarFadeTimer();
};

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
  // 初始化移动端检测
  isMobile.value = checkIsMobile();

  // 监听窗口大小变化，更新移动端状态
  window.addEventListener('resize', () => {
    isMobile.value = checkIsMobile();
  });

  // 强制检查初始滚动状态
  checkInitialScroll();

  // 监听滚动
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 🖱️ 监听全局点击事件，点击菜单区域外关闭子菜单
  document.addEventListener('click', handleClickOutside);

  // 延迟再次检查，确保 DOM 完全渲染
  setTimeout(checkInitialScroll, 100);

  // ⏱️ 启动导航栏效果计时器（页面加载3秒后开始）
  // 文档页面使用上移渐隐，普通页面使用透明度淡出
  if (isDocPage.value && !isMobile.value) {
    startNavbarHideTimer();
  } else {
    startNavbarFadeTimer();
  }
});

// 🧹 组件卸载
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  // 🖱️ 移除全局点击事件监听
  document.removeEventListener('click', handleClickOutside);
  // 清除导航栏淡出计时器
  if (navbarFadeTimer) {
    clearTimeout(navbarFadeTimer);
  }
  // 清除导航栏隐藏计时器
  if (navbarHideTimer) {
    clearTimeout(navbarHideTimer);
  }
});
</script>

<template>
  <!-- 🧭 导航栏容器（包含触发区域） -->
  <div
    class="navbar-wrapper"
    :class="{ 'is-hidden': isNavbarHidden }"
    @mouseenter="handleNavbarMouseEnter"
    @mouseleave="handleNavbarMouseLeave"
  >
    <!-- 📄 文档页面：顶部触发区域（导航栏隐藏时显示） -->
    <div
      v-if="isDocPage && !isMobile"
      class="navbar-trigger-area"
      :class="{ 'is-visible': isNavbarHidden }"
      @mouseenter="handleTriggerMouseEnter"
    ></div>

    <!-- 🧭 导航栏 -->
    <nav
      class="navbar"
      :class="{
        'is-scrolled': isScrolled,
        'is-transparent': !isScrolled,
        'is-faded': isNavbarFaded,
        'is-hidden': isNavbarHidden
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

      <!-- 📍 导航链接（支持多级菜单） -->
      <div class="navbar-menu">
        <template v-for="(link, index) in navbarConfig.links" :key="`nav-${index}`">
          <!-- 🔗 有子菜单的项 -->
          <div
            v-if="link.children && link.children.length > 0"
            class="navbar-menu-item has-submenu"
            :class="{ 'is-active': isMenuActive([link.text]) }"
          >
            <span
              class="navbar-link submenu-toggle"
              @click="toggleSubmenu([link.text], $event)"
            >
              {{ link.text }}
              <span class="submenu-arrow" :class="{ 'is-rotated': isMenuActive([link.text]) }">▶</span>
            </span>
            <!-- 📂 二级菜单 -->
            <div class="submenu level-1">
              <template v-for="(child, childIndex) in link.children" :key="`nav-${index}-${childIndex}`">
                <!-- 🔗 有三级菜单的项 -->
                <div
                  v-if="child.children && child.children.length > 0"
                  class="submenu-item has-submenu"
                  :class="{ 'is-active': isMenuActive([link.text, child.text]) }"
                >
                  <span
                    class="submenu-link submenu-toggle"
                    @click="toggleSubmenu([link.text, child.text], $event)"
                  >
                    {{ child.text }}
                    <span class="submenu-arrow" :class="{ 'is-rotated': isMenuActive([link.text, child.text]) }">▶</span>
                  </span>
                  <!-- 📂 三级菜单 -->
                  <div class="submenu level-2">
                    <a
                      v-for="(grandChild, grandChildIndex) in child.children"
                      :key="`nav-${index}-${childIndex}-${grandChildIndex}`"
                      :href="grandChild.href"
                      class="submenu-link"
                      :target="grandChild.external ? '_blank' : undefined"
                      :rel="grandChild.external ? 'noopener noreferrer' : undefined"
                    >
                      {{ grandChild.text }}
                    </a>
                  </div>
                </div>
                <!-- 🔗 普通二级链接 -->
                <a
                  v-else
                  :href="child.href"
                  class="submenu-link"
                  :target="child.external ? '_blank' : undefined"
                  :rel="child.external ? 'noopener noreferrer' : undefined"
                >
                  {{ child.text }}
                </a>
              </template>
            </div>
          </div>
          <!-- 🔗 普通一级链接 -->
          <a
            v-else
            :href="link.href"
            class="navbar-link"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
          >
            {{ link.text }}
          </a>
        </template>
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
</div>

<!-- 📱 移动端菜单（支持多级菜单） -->
<div
  class="navbar-mobile-menu"
  :class="{ 'is-open': isMobileMenuOpen }"
>
    <template v-for="(link, index) in navbarConfig.links" :key="`mobile-${index}`">
      <!-- 🔗 有子菜单的项 -->
      <div
        v-if="link.children && link.children.length > 0"
        class="navbar-mobile-menu-item has-submenu"
        :class="{ 'is-active': isMenuActive([link.text]) }"
      >
        <span
          class="navbar-mobile-link submenu-toggle"
          @click="toggleSubmenu([link.text], $event)"
        >
          {{ link.text }}
          <span class="submenu-arrow" :class="{ 'is-rotated': isMenuActive([link.text]) }">▶️</span>
        </span>
        <!-- 📂 二级菜单 -->
        <div v-show="isMenuActive([link.text])" class="mobile-submenu level-1">
          <template v-for="(child, childIndex) in link.children" :key="`mobile-${index}-${childIndex}`">
            <!-- 🔗 有三级菜单的项 -->
            <div
              v-if="child.children && child.children.length > 0"
              class="mobile-submenu-item has-submenu"
              :class="{ 'is-active': isMenuActive([link.text, child.text]) }"
            >
              <span
                class="mobile-submenu-link submenu-toggle"
                @click="toggleSubmenu([link.text, child.text], $event)"
              >
                {{ child.text }}
                <span class="submenu-arrow" :class="{ 'is-rotated': isMenuActive([link.text, child.text]) }">▶️</span>
              </span>
              <!-- 📂 三级菜单 -->
              <div v-show="isMenuActive([link.text, child.text])" class="mobile-submenu level-2">
                <a
                  v-for="(grandChild, grandChildIndex) in child.children"
                  :key="`mobile-${index}-${childIndex}-${grandChildIndex}`"
                  :href="grandChild.href"
                  class="mobile-submenu-link"
                  :target="grandChild.external ? '_blank' : undefined"
                  :rel="grandChild.external ? 'noopener noreferrer' : undefined"
                  @click="closeMobileMenu"
                >
                  {{ grandChild.text }}
                </a>
              </div>
            </div>
            <!-- 🔗 普通二级链接 -->
            <a
              v-else
              :href="child.href"
              class="mobile-submenu-link"
              :target="child.external ? '_blank' : undefined"
              :rel="child.external ? 'noopener noreferrer' : undefined"
              @click="closeMobileMenu"
            >
              {{ child.text }}
            </a>
          </template>
        </div>
      </div>
      <!-- 🔗 普通一级链接 -->
      <a
        v-else
        :href="link.href"
        class="navbar-mobile-link"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        @click="closeMobileMenu"
      >
        {{ link.text }}
      </a>
    </template>
  </div>
</template>

<style lang="scss">
@use '../styles/navbar.scss' as *;
</style>
