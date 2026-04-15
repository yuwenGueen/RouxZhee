<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🧰 浮动工具栏组件
-->

<template>
  <div class="rouxzhee-floating-toolbar">
    <!-- 🔎 搜索按钮 -->
    <SearchButton />

    <!-- ☀️🌙 主题切换按钮 -->
    <ThemeToggle />

    <!-- 🚀 回到顶部/前往底部火箭轮盘 -->
    <ScrollNavigator />
  </div>
</template>

<script setup lang="ts">
import SearchButton from './SearchButton.vue';
import ScrollNavigator from './ScrollNavigator.vue';
import ThemeToggle from './ThemeToggle.vue';
</script>

<style scoped lang="scss">
/* ========================================
   🧰 浮动工具栏样式
   ======================================== */

.rouxzhee-floating-toolbar {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.25rem;
  z-index: 999;
  pointer-events: none;

  /* 让所有子元素可以接收点击事件 */
  > * {
    pointer-events: auto;
  }
}

/* ========================================
   📱 移动端适配
   ======================================== */
@media (max-width: 768px) {
  .rouxzhee-floating-toolbar {
    bottom: 1.5rem;
    right: 1rem;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .rouxzhee-floating-toolbar {
    bottom: 1rem;
    right: 0.75rem;
    gap: 0.5rem;
  }
}
</style>
