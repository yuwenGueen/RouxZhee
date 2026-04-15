<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🔍 搜索按钮组件
-->

<template>
  <button
    class="rouxzhee-search-btn"
    aria-label="搜索 (Ctrl+K)"
    @click="openSearch"
  >
    <svg class="rouxzhee-search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="rouxzhee-search-label">搜索</span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

/* 🎯 打开搜索 */
function openSearch() {
  window.dispatchEvent(new CustomEvent('rouxzhee-open-search'));
}

/* ⌨️ 全局键盘快捷键 */
function handleGlobalKeyDown(event: KeyboardEvent) {
  /* ⌨️ Ctrl/Cmd + K 打开搜索 */
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    openSearch();
  }
}

/* 🚀 生命周期钩子 */
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
});
</script>

<style scoped lang="scss">
/* ========================================
   🔍 搜索按钮样式
   ======================================== */

.rouxzhee-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  cursor: pointer;
  box-shadow: var(--search-btn-shadow);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  /* 允许提示气泡超出按钮边界 */
  overflow: visible;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    border-color: transparent;
    box-shadow: var(--search-btn-shadow-hover);

    .rouxzhee-search-icon {
      color: var(--banner-title-color);
    }

    .rouxzhee-search-label {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
}

.rouxzhee-search-icon {
  width: 24px;
  height: 24px;
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* 🏷️ 搜索按钮标签 */
.rouxzhee-search-label {
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
  box-shadow: var(--search-btn-label-shadow);

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
  .rouxzhee-search-btn {
    background: var(--card-bg);
    border-color: var(--border-color);
    box-shadow: var(--search-btn-dark-shadow);

    .rouxzhee-search-icon {
      color: var(--text-secondary);
    }

    &:hover {
      box-shadow: var(--search-btn-dark-shadow-hover);
    }
  }

  .rouxzhee-search-label {
    background: var(--tooltip-bg);
    color: var(--tooltip-text);

    &::after {
      border-color: var(--tooltip-bg) transparent transparent transparent;
    }
  }
}

/* ========================================
   📱 移动端适配
   ======================================== */
@media (max-width: 768px) {
  .rouxzhee-search-btn {
    width: 48px;
    height: 48px;

    .rouxzhee-search-icon {
      width: 22px;
      height: 22px;
    }
  }

}

@media (max-width: 480px) {
  .rouxzhee-search-btn {
    width: 44px;
    height: 44px;

    .rouxzhee-search-icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
