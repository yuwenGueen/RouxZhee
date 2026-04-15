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
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <g fill="none" stroke="currentColor" stroke-dasharray="4" stroke-dashoffset="4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5">
            <animate id="lineMdMoonTwotoneAltLoop0" fill="freeze" attributeName="stroke-dashoffset" begin="0.7s;lineMdMoonTwotoneAltLoop0.begin+6s" dur="0.4s" values="4;0"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonTwotoneAltLoop0.begin+2s;lineMdMoonTwotoneAltLoop0.begin+4s" dur="0.4s" values="4;0"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonTwotoneAltLoop0.begin+1.2s;lineMdMoonTwotoneAltLoop0.begin+3.2s;lineMdMoonTwotoneAltLoop0.begin+5.2s" dur="0.4s" values="0;4"></animate>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop0.begin+1.8s" to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"></set>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop0.begin+3.8s" to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"></set>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop0.begin+5.8s" to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"></set>
          </path>
          <path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5">
            <animate id="lineMdMoonTwotoneAltLoop1" fill="freeze" attributeName="stroke-dashoffset" begin="1.1s;lineMdMoonTwotoneAltLoop1.begin+6s" dur="0.4s" values="4;0"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonTwotoneAltLoop1.begin+2s;lineMdMoonTwotoneAltLoop1.begin+4s" dur="0.4s" values="4;0"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonTwotoneAltLoop1.begin+1.2s;lineMdMoonTwotoneAltLoop1.begin+3.2s;lineMdMoonTwotoneAltLoop1.begin+5.2s" dur="0.4s" values="0;4"></animate>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop1.begin+1.8s" to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"></set>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop1.begin+3.8s" to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"></set>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop1.begin+5.8s" to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"></set>
          </path>
          <path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5">
            <animate id="lineMdMoonTwotoneAltLoop2" fill="freeze" attributeName="stroke-dashoffset" begin="2.9s;lineMdMoonTwotoneAltLoop2.begin+6s" dur="0.4s" values="4;0"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonTwotoneAltLoop2.begin+2s" dur="0.4s" values="4;0"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonTwotoneAltLoop2.begin+1.2s;lineMdMoonTwotoneAltLoop2.begin+3.2s" dur="0.4s" values="0;4"></animate>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop2.begin+1.8s" to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"></set>
            <set attributeName="d" begin="lineMdMoonTwotoneAltLoop2.begin+5.8s" to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"></set>
          </path>
        </g>
        <g fill-opacity="0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" data-swindex="0">
          <path fill="currentColor" stroke-dasharray="56" stroke-dashoffset="56" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0"></animate>
            <animate fill="freeze" attributeName="fill-opacity" begin="1.5s" dur="0.15s" values="0;0.3"></animate>
          </path>
        </g>
      </svg>

      <!-- ☀️ 太阳图标 - 暗色模式时显示 -->
      <svg
        v-else
        class="rouxzhee-theme-icon roulxhee-sun-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <g fill="none" stroke="currentColor" stroke-dasharray="2" stroke-dashoffset="2" stroke-linecap="round" stroke-width="2" data-swindex="0">
          <path d="M0 0">
            <animate fill="freeze" attributeName="d" begin="1.2s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="2;0"></animate>
          </path>
          <path d="M0 0">
            <animate fill="freeze" attributeName="d" begin="1.5s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"></animate>
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.5s" dur="1.2s" values="2;0"></animate>
          </path>
          <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform>
        </g>
        <g fill="currentColor">
          <path d="M15.22 6.03L17.75 4.09L14.56 4L13.5 1L12.44 4L9.25 4.09L11.78 6.03L10.87 9.09L13.5 7.28L16.13 9.09L15.22 6.03Z">
            <animate fill="freeze" attributeName="fill-opacity" dur="0.4s" values="1;0"></animate>
          </path>
          <path d="M19.61 12.25L21.25 11L19.19 10.95L18.5 9L17.81 10.95L15.75 11L17.39 12.25L16.8 14.23L18.5 13.06L20.2 14.23L19.61 12.25Z">
            <animate fill="freeze" attributeName="fill-opacity" begin="0.2s" dur="0.4s" values="1;0"></animate>
          </path>
        </g>
        <g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" data-swindex="0">
          <path d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"></path>
          <set attributeName="opacity" begin="0.6s" to="0"></set>
        </g>
        <mask id="lineMdMoonFilledToSunnyFilledLoopTransition0">
          <circle cx="12" cy="12" r="12" fill="#fff"></circle>
          <circle cx="18" cy="6" r="12" fill="#fff">
            <animate fill="freeze" attributeName="cx" begin="0.6s" dur="0.4s" values="18;22"></animate>
            <animate fill="freeze" attributeName="cy" begin="0.6s" dur="0.4s" values="6;2"></animate>
            <animate fill="freeze" attributeName="r" begin="0.6s" dur="0.4s" values="12;3"></animate>
          </circle>
          <circle cx="18" cy="6" r="10">
            <animate fill="freeze" attributeName="cx" begin="0.6s" dur="0.4s" values="18;22"></animate>
            <animate fill="freeze" attributeName="cy" begin="0.6s" dur="0.4s" values="6;2"></animate>
            <animate fill="freeze" attributeName="r" begin="0.6s" dur="0.4s" values="10;1"></animate>
          </circle>
        </mask>
        <circle cx="12" cy="12" r="10" fill="currentColor" mask="url(#lineMdMoonFilledToSunnyFilledLoopTransition0)" opacity="0">
          <set attributeName="opacity" begin="0.6s" to="1"></set>
          <animate fill="freeze" attributeName="r" begin="0.6s" dur="0.4s" values="10;6"></animate>
        </circle>
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
