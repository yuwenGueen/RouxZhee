<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🚀 回到顶部/前往底部火箭轮盘组件
-->

<template>
  <div
    class="rouxzhee-scroll-navigator"
    :class="{ 'is-open': isWheelOpen }"
  >
    <!-- 🎯 轮盘菜单 -->
    <div class="rouxzhee-scroll-wheel">
      <!-- 🔝 回到顶部按钮 -->
      <button
        class="rouxzhee-wheel-btn roulxhee-wheel-btn-top"
        aria-label="回到顶部"
        @click.stop="scrollToTop"
      >
        <svg class="rouxzhee-wheel-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="rouxzhee-wheel-label">回到顶部</span>
      </button>

      <!-- 🔚 前往底部按钮 -->
      <button
        class="rouxzhee-wheel-btn roulxhee-wheel-btn-bottom"
        aria-label="前往底部"
        @click.stop="scrollToBottom"
      >
        <svg class="rouxzhee-wheel-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="rouxzhee-wheel-label">前往底部</span>
      </button>
    </div>

    <!-- 🚀 火箭触发按钮 -->
    <button
      class="rouxzhee-rocket-btn"
      :class="{ 'is-launching': isLaunching, 'is-open': isWheelOpen }"
      :aria-label="isWheelOpen ? '关闭导航' : '打开导航'"
      @click.stop="toggleWheel"
    >
      <!-- 📊 进度圆环 -->
      <svg class="rouxzhee-progress-circle" viewBox="0 0 70 70">
        <circle
          class="rouxzhee-progress-bg"
          cx="35"
          cy="35"
          r="30"
          fill="none"
        />
        <circle
          class="rouxzhee-progress-bar"
          cx="35"
          cy="35"
          r="30"
          fill="none"
          transform="rotate(-90 35 35)"
          :style="{ strokeDashoffset: progressOffset }"
        />
      </svg>

      <!-- 🚀 火箭图标 -->
      <svg v-if="!isWheelOpen" class="rouxzhee-rocket-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M752.736 431.063C757.159 140.575 520.41 8.97 504.518 0.41V0l-0.45 0.205-0.41-0.205v0.41c-15.934 8.56-252.723 140.165-248.259 430.653-48.21 31.457-98.713 87.368-90.685 184.074 8.028 96.666 101.007 160.768 136.601 157.287 35.595-3.482 25.232-30.31 25.232-30.31l12.206-50.095s52.47 80.569 69.304 80.528c15.114-1.23 87-0.123 95.6 0h0.82c8.602-0.123 80.486-1.23 95.6 0 16.794 0 69.305-80.528 69.305-80.528l12.165 50.094s-10.322 26.83 25.272 30.31c35.595 3.482 128.574-60.62 136.602-157.286 8.028-96.665-42.475-152.617-90.685-184.074z m-248.669-4.26c-6.758-0.123-94.781-3.359-102.891-107.192 2.95-98.714 95.97-107.438 102.891-107.93 6.964 0.492 99.943 9.216 102.892 107.93-8.11 103.833-96.174 107.07-102.892 107.192z m-52.019 500.531c0 11.838-9.42 21.382-21.012 21.382a21.217 21.217 0 0 1-21.054-21.34V821.74c0-11.797 9.421-21.382 21.054-21.382 11.591 0 21.012 9.585 21.012 21.382v105.635z m77.333 57.222a21.504 21.504 0 0 1-21.34 21.626 21.504 21.504 0 0 1-21.34-21.626V827.474c0-11.96 9.543-21.668 21.299-21.668 11.796 0 21.38 9.708 21.38 21.668v157.082z m71.147-82.043c0 11.796-9.42 21.34-21.053 21.34a21.217 21.217 0 0 1-21.013-21.34v-75.367c0-11.755 9.421-21.299 21.013-21.299 11.632 0 21.053 9.544 21.053 21.3v75.366z"/>
      </svg>

      <!-- 📊 百分比文本 -->
      <span v-else class="rouxzhee-scroll-percent">{{ scrollPercentText }}</span>

      <!-- 🏷️ 提示气泡 -->
      <span class="rouxzhee-rocket-label">{{ isWheelOpen ? '关闭' : '导航' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

/* 🚀 常量定义 */
const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* 🚀 响应式状态 */
const isWheelOpen = ref(false);
const isLaunching = ref(false);
const scrollPercent = ref(0);
const ticking = ref(false);

/* 🚀 计算进度圆环的偏移量 */
const progressOffset = computed(() => {
  return CIRCUMFERENCE * (1 - scrollPercent.value);
});

/* 📊 计算百分比文本 */
const scrollPercentText = computed(() => {
  return Math.round(scrollPercent.value * 100) + '%';
});

/* 📊 更新进度 */
function updateProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollPercent.value = scrollHeight <= 0 ? 0 : Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
  ticking.value = false;
}

/* 🎯 切换轮盘显示状态 */
function toggleWheel() {
  isWheelOpen.value = !isWheelOpen.value;
}

/* 📁 关闭轮盘 */
function closeWheel() {
  isWheelOpen.value = false;
}

/* ⬆️ 平滑滚动到顶部 */
function scrollToTop() {
  if (isLaunching.value) return;

  isLaunching.value = true;
  closeWheel();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  /* 🚀 动画结束后重置火箭状态 */
  setTimeout(() => {
    isLaunching.value = false;
  }, 800);
}

/* ⬇️ 平滑滚动到底部 */
function scrollToBottom() {
  closeWheel();

  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  window.scrollTo({
    top: scrollHeight,
    behavior: 'smooth'
  });
}

/* 🖱️ 滚动事件处理 */
function handleScroll() {
  if (!ticking.value) {
    window.requestAnimationFrame(updateProgress);
    ticking.value = true;
  }
}

/* 🌐 点击页面其他地方关闭轮盘 */
function handleClickOutside(e: MouseEvent) {
  const navigator = document.querySelector('.rouxzhee-scroll-navigator');
  const target = e.target as Node;

  if (isWheelOpen.value && navigator && !navigator.contains(target)) {
    closeWheel();
  }
}

/* ⌨️ 按ESC键关闭轮盘 */
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isWheelOpen.value) {
    closeWheel();
  }
}

/* 🚀 生命周期钩子 */
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
/* ========================================
   🚀 火箭导航轮盘组件样式
   ======================================== */

.rouxzhee-scroll-navigator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  /* 不添加额外的上下间距 */
  margin: 0;
  padding: 0;
}

/* 🎯 轮盘菜单 */
.rouxzhee-scroll-wheel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: scale(0.8) translateX(20px);
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: right center;

  .rouxzhee-scroll-navigator.is-open & {
    opacity: 1;
    transform: scale(1) translateX(0);
    pointer-events: auto;
  }
}

/* 🔘 轮盘按钮 */
.rouxzhee-wheel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
}

.rouxzhee-wheel-icon {
  width: 20px;
  height: 20px;
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* 🔝 回到顶部按钮悬停效果 */
.roulxhee-wheel-btn-top:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-color: transparent;

  .rouxzhee-wheel-icon {
    color: white;
  }
}

/* 🔚 前往底部按钮悬停效果 */
.roulxhee-wheel-btn-bottom:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border-color: transparent;

  .rouxzhee-wheel-icon {
    color: white;
  }
}

/* 🏷️ 轮盘按钮标签 */
.rouxzhee-wheel-label {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(10px);
  padding: 0.5rem 0.875rem;
  background: var(--tooltip-bg);
  color: var(--tooltip-text);
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px 0 6px 6px;
    border-style: solid;
    border-color: transparent transparent transparent var(--tooltip-bg);
  }

  .rouxzhee-wheel-btn:hover & {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* 🚀 火箭触发按钮 */
.rouxzhee-rocket-btn {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(14, 116, 144, 0.3), 0 8px 30px rgba(6, 182, 212, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;
  /* 确保火箭可以超出容器 */
  overflow: visible;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 25px rgba(14, 116, 144, 0.4), 0 12px 40px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  &.is-open {
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3), 0 8px 30px rgba(248, 113, 113, 0.2);

    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      box-shadow: 0 6px 25px rgba(239, 68, 68, 0.4), 0 12px 40px rgba(248, 113, 113, 0.3);
    }
  }

  &:hover {
    .rouxzhee-rocket-label {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
}

/* 📊 进度圆环 */
.rouxzhee-progress-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  pointer-events: none;
  z-index: 0;

  circle {
    transition: stroke-dashoffset 0.1s ease;
  }
}

.rouxzhee-progress-bg {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 4;
}

.rouxzhee-progress-bar {
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 4;
  stroke-dasharray: v-bind(CIRCUMFERENCE);
}

/* 🚀 火箭图标 */
.rouxzhee-rocket-icon {
  position: absolute;
  z-index: 2;
  width: 55%;
  height: 55%;
  fill: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
  pointer-events: none;
  /* 居中定位 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .rouxzhee-rocket-btn:hover & {
    transform: translate(-50%, -50%) scale(1.1);
  }

  .rouxzhee-rocket-btn.is-launching & {
    animation: roulxhee-rocket-fly 0.8s ease-in-out forwards;
  }
}

/* 🚀 火箭飞出动画 - 向上飞出容器 */
@keyframes roulxhee-rocket-fly {
  0% {
    transform: translate(-50%, -50%) translateY(0) scale(1);
    opacity: 1;
  }
  20% {
    /* 预备：稍微下沉 */
    transform: translate(-50%, -50%) translateY(5px) scale(0.95);
  }
  40% {
    /* 发射：快速向上 */
    transform: translate(-50%, -50%) translateY(-40px) scale(1.05);
  }
  70% {
    /* 继续上升并变小 */
    transform: translate(-50%, -50%) translateY(-120px) scale(0.8);
    opacity: 0.6;
  }
  100% {
    /* 飞出视野 */
    transform: translate(-50%, -50%) translateY(-200px) scale(0.5);
    opacity: 0;
  }
}

/* 📊 百分比文本 */
.rouxzhee-scroll-percent {
  position: absolute;
  z-index: 2;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  user-select: none;
  pointer-events: none;
  /* 居中定位 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 🏷️ 火箭按钮标签 */
.rouxzhee-rocket-label {
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
  z-index: 100;

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

/* ========================================
   🌠 暗色模式适配
   ======================================== */
:global(.dark-mode) {
  .rouxzhee-wheel-btn {
    background: var(--card-bg);
    border-color: var(--border-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);

    .rouxzhee-wheel-icon {
      color: var(--text-secondary);
    }

    &:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }

  .rouxzhee-wheel-label {
    background: var(--tooltip-bg);
    color: var(--tooltip-text);

    &::after {
      border-color: transparent transparent transparent var(--tooltip-bg);
    }
  }
}

/* ========================================
   📱 移动端适配
   ======================================== */
@media (max-width: 768px) {
  .rouxzhee-scroll-navigator {
    flex-direction: row;
    gap: 0.5rem;
  }

  .rouxzhee-scroll-wheel {
    flex-direction: row;
    order: -1;
    gap: 0.5rem;
  }

  .rouxzhee-wheel-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;

    .rouxzhee-wheel-icon {
      width: 18px;
      height: 18px;
    }
  }

  .rouxzhee-wheel-label {
    bottom: calc(100% + 10px);
    right: auto;
    left: 50%;
    top: auto;
    transform: translateX(-50%) translateY(5px);
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    border-radius: 10px;

    &::after {
      right: auto;
      left: 50%;
      top: auto;
      bottom: -6px;
      transform: translateX(-50%);
      border-width: 6px 6px 0 6px;
      border-color: var(--text-color) transparent transparent transparent;
    }
  }

  .rouxzhee-wheel-btn:hover .rouxzhee-wheel-label {
    transform: translateX(-50%) translateY(0);
  }

  .rouxzhee-rocket-btn {
    width: 48px;
    height: 48px;

    .rouxzhee-progress-circle {
      width: 48px;
      height: 48px;
    }
  }
}

@media (max-width: 480px) {
  .rouxzhee-wheel-btn {
    width: 38px;
    height: 38px;
    border-radius: 8px;

    .rouxzhee-wheel-icon {
      width: 16px;
      height: 16px;
    }
  }

  .rouxzhee-rocket-btn {
    width: 44px;
    height: 44px;

    .rouxzhee-progress-circle {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
