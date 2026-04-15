<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  ☀️🌙 主题切换按钮组件 - 亮色/暗色模式切换带涟漪动画
-->

<template>
  <div class="rouxzhee-theme-toggle-wrapper">
    <!-- 🔘 主题切换按钮 -->
    <button
      class="rouxzhee-theme-toggle-btn"
      :class="{ 'is-dark': isDark }"
      :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
      @click="handleToggle"
    >
      <!-- 🌙 月亮图标 - 亮色模式时显示 -->
      <svg
        v-if="!isDark"
        class="rouxzhee-theme-icon roulxhee-moon-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <!-- ☀️ 太阳图标 - 暗色模式时显示 -->
      <svg
        v-else
        class="rouxzhee-theme-icon roulxhee-sun-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <!-- 🏷️ 提示气泡 -->
      <span class="rouxzhee-theme-label">{{ isDark ? '切换亮色' : '切换暗色' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/* 🌗 响应式状态 - 是否暗色模式 */
const isDark = ref(false);

/* 🎯 处理切换 */
async function handleToggle(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement;
  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // 🌊 检查是否支持 View Transition API
  if ('startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    // 计算涟漪半径
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 记录当前主题状态（切换前）
    const wasDark = isDark.value;

    // 🎨 切换主题
    const transition = (document as any).startViewTransition(async () => {
      isDark.value = !isDark.value;
      applyTheme();
      saveThemePreference();
    });

    await transition.ready;

    // 🌊 执行 clip-path 动画
    // 如果切换到暗色：新视图（暗色）从 0 展开到最大
    // 如果切换到亮色：旧视图（暗色）从最大收缩到 0
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`,
    ];

    // 切换到暗色：新视图展开；切换到亮色：旧视图收缩
    const animateOptions = wasDark
      ? { clipPath: clipPath.reverse(), pseudoElement: '::view-transition-old(root)' }
      : { clipPath, pseudoElement: '::view-transition-new(root)' };

    document.documentElement.animate(
      { clipPath: animateOptions.clipPath },
      {
        duration: 600,
        easing: 'ease-in',
        fill: 'forwards',
        pseudoElement: animateOptions.pseudoElement,
      }
    );
  } else {
    // 不支持 View Transition API，直接切换
    isDark.value = !isDark.value;
    applyTheme();
    saveThemePreference();
  }
}

/* 🎨 应用主题到文档 */
function applyTheme() {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add('dark-mode');
  } else {
    html.classList.remove('dark-mode');
  }
}

/* 💾 保存主题偏好到 localStorage */
function saveThemePreference() {
  try {
    localStorage.setItem('rouxzhee-theme-preference', isDark.value ? 'dark' : 'light');
  } catch (e) {
    console.warn('无法保存主题偏好:', e);
  }
}

/* 📖 从 localStorage 读取主题偏好 */
function loadThemePreference() {
  try {
    const saved = localStorage.getItem('rouxzhee-theme-preference');
    if (saved) {
      isDark.value = saved === 'dark';
    } else {
      /* ☀️ 默认使用亮色模式 */
      isDark.value = false;
    }
    applyTheme();
  } catch (e) {
    console.warn('无法读取主题偏好:', e);
    isDark.value = false;
    applyTheme();
  }
}

/* 🚀 生命周期钩子 */
onMounted(() => {
  loadThemePreference();
});
</script>

<style scoped lang="scss">
/* ========================================
   ☀️🌙 主题切换按钮样式
   ======================================== */

.rouxzhee-theme-toggle-wrapper {
  position: relative;
  display: inline-flex;
}

/* 🔘 主题切换按钮 */
.rouxzhee-theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: var(--card-bg);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: var(--theme-btn-shadow);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  /* 允许提示气泡超出按钮边界 */
  overflow: visible;
  z-index: 1;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--theme-btn-shadow-hover);

    .rouxzhee-theme-label {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  /* 🌙 暗色模式时的按钮样式 */
  &.is-dark {
    background: var(--theme-btn-dark-bg);

    .rouxzhee-theme-icon {
      color: var(--banner-title-color);
    }

    &:hover {
      background: var(--theme-btn-dark-bg-hover);
      box-shadow: var(--theme-btn-dark-shadow-hover);
    }
  }

  /* ☀️ 亮色模式时的按钮样式 */
  &:not(.is-dark) {
    background: var(--theme-btn-light-bg);
    box-shadow: var(--theme-btn-light-glow);

    .rouxzhee-theme-icon {
      color: var(--banner-title-color);
    }

    &:hover {
      background: var(--theme-btn-light-bg-hover);
      box-shadow: var(--theme-btn-light-glow-hover);

      .rouxzhee-theme-icon {
        color: var(--banner-title-color);
      }
    }
  }
}

/* 🎨 主题图标 */
.rouxzhee-theme-icon {
  width: 24px;
  height: 24px;
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* 🏷️ 主题切换按钮标签 */
.rouxzhee-theme-label {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  top: auto;
  right: auto;
  transform: translateX(-50%) translateY(5px);
  padding: 0.5rem 0.875rem;
  background: var(--tooltip-bg);
  color: var(--tooltip-text);
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  /* 🔽 下方小三角 */
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    right: auto;
    top: auto;
    bottom: -6px;
    transform: translateX(-50%);
    border-width: 6px 6px 0 6px;
    border-style: solid;
    border-color: var(--tooltip-bg) transparent transparent transparent;
  }
}

/* 🌙 月亮图标动画 */
.roulxhee-moon-icon {
  animation: roulxhee-moon-appear 0.3s ease;
}

/* ☀️ 太阳图标动画 */
.roulxhee-sun-icon {
  animation: roulxhee-sun-appear 0.3s ease;
}

@keyframes roulxhee-moon-appear {
  0% {
    transform: rotate(-30deg) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

@keyframes roulxhee-sun-appear {
  0% {
    transform: rotate(30deg) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

/* ========================================
   🌠 暗色模式适配
   ======================================== */
:global(.dark-mode) {
  .rouxzhee-theme-toggle-btn {
    background: var(--card-bg);
    border-color: var(--border-color);
    box-shadow: var(--theme-btn-dark-shadow);

    &:hover {
      box-shadow: var(--theme-btn-dark-shadow-hover);
    }

    .rouxzhee-theme-icon {
      color: var(--text-secondary);
    }

    &.is-dark .rouxzhee-theme-icon {
      color: var(--banner-title-color);
    }
  }
}

/* ========================================
   📱 移动端适配
   ======================================== */
@media (max-width: 768px) {
  .rouxzhee-theme-toggle-btn {
    width: 48px;
    height: 48px;

    .rouxzhee-theme-icon {
      width: 22px;
      height: 22px;
    }
  }
}

@media (max-width: 480px) {
  .rouxzhee-theme-toggle-btn {
    width: 44px;
    height: 44px;

    .rouxzhee-theme-icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
