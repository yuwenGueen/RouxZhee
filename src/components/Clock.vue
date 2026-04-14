<script setup lang="ts">
// 🕊️白木 原创开发 🔗gl.baimu.live
// 😎余温 原创开发 🔗https://wiki.xxdevops.cn
// 时钟组件 - 实时显示当前时间

import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  showSeconds?: boolean;
  use24Hour?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSeconds: true,
  use24Hour: true,
});

// ⏰ 时间状态
const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');

// 🔄 定时器
let timer: ReturnType<typeof setInterval> | null = null;

// 📝 格式化数字
const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

// 🔄 更新时间
const updateTime = () => {
  const now = new Date();
  hours.value = formatNumber(now.getHours());
  minutes.value = formatNumber(now.getMinutes());
  seconds.value = formatNumber(now.getSeconds());
};

// 🚀 组件挂载
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

// 🧹 组件卸载
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="header-clock">
    <!-- 📦 透明容器框，防止数字跳动导致布局变化 -->
    <div class="clock-container">
      <svg class="clock-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="clock-time">
        <span class="hour">{{ hours }}</span>
        <span class="separator">:</span>
        <span class="minute">{{ minutes }}</span>
        <template v-if="showSeconds">
          <span class="separator">:</span>
          <span class="second">{{ seconds }}</span>
        </template>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-clock {
  display: flex;
  align-items: center;
  font-family: var(--rouxzhee-font-family-mono, 'Monaco', 'Menlo', 'Consolas', monospace);

  // 📦 透明容器框，固定宽度防止跳动
  .clock-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 90px; // 固定宽度，避免数字变化导致布局跳动
    height: 36px; // 固定高度
    padding: 0 12px;
    border-radius: 8px;
    background-color: transparent; // 完全透明背景
    justify-content: center;
    flex-shrink: 0; // 防止容器被压缩
  }

  .clock-icon {
    display: none;
  }

  .clock-time {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: inherit;
    contain: content;
    white-space: nowrap; // 防止文本换行

    span {
      display: inline-block;
      min-width: 1.2em; // 每个数字最小宽度，防止跳动
      text-align: center;
    }

    .separator {
      opacity: 0.6;
      min-width: 0.5em;
    }

    .second {
      opacity: 0.8;
    }
  }
}
</style>
