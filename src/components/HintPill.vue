<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  💬 状态提示胶囊 - 全局可复用提示组件
  📖 通过 useHintPill() 控制显示/隐藏，可放置于任意相对定位容器内
-->

<script setup lang="ts">
import { useHintPill } from '../composables/useHintPill';

interface Props {
  placement?: 'center' | 'nav-left' | 'more-panel';
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'center',
});

const { hintText, visible } = useHintPill();
</script>

<template>
  <div
    class="hint-pill"
    :class="[`is-${props.placement}`, { 'is-visible': visible }]"
    aria-hidden="true"
  >
    {{ hintText }}
  </div>
</template>

<style scoped lang="scss">
// 💬 状态提示胶囊
.hint-pill {
  position: absolute;
  top: 50%;
  padding: 7px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--navbar-hint-text);
  background: var(--navbar-capsule-bg);
  border: 1px solid var(--navbar-capsule-border);
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease,
    transform 0.25s ease;
  z-index: 2;

  // 👁️ 显示态：各 placement 共用，避免只改 transform 却仍透明不可见
  &.is-visible {
    opacity: 1;
    visibility: visible;
  }

  // 📍 默认居中：相对于最近定位祖先居中
  &.is-center {
    left: 50%;
    transform: translate(-50%, -50%) translateY(4px);

    &.is-visible {
      transform: translate(-50%, -50%) translateY(0);
    }
  }

  // 📍 导航左侧：固定在导航菜单左侧，与菜单间距 20px
  &.is-nav-left {
    right: calc(100% + 20px);
    transform: translateY(-50%) translateY(4px);

    &.is-visible {
      transform: translateY(-50%) translateY(0);
    }
  }

  // 📍 更多菜单面板：相对定位，用于放在固定面板内的提示容器中居中显示
  &.is-more-panel {
    position: relative;
    top: auto;
    left: auto;
    transform: translateY(4px);

    &.is-visible {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
}
</style>