<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🔍 404 页面组件 - 页面不存在提示
-->

<template>
  <div class="rouxzhee-not-found">
    <!-- 🎨 几何装饰背景 -->
    <div class="geometric-decorations">
      <div
        v-for="(shape, index) in shapes"
        :key="index"
        class="shape"
        :class="shape.type"
        :style="getShapeStyle(shape, index)"
      />
    </div>

    <div class="content">
      <!-- 🔢 错误代码 -->
      <div class="error-code">
        <span class="digit" data-text="4">4</span>
        <div class="zero-wrapper">
          <div class="zero">
            <div class="face">
              <div class="eyes">
                <div class="eye"></div>
                <div class="eye"></div>
              </div>
              <div class="mouth"></div>
            </div>
          </div>
        </div>
        <span class="digit" data-text="4">4</span>
      </div>

      <!-- 📝 提示文本 -->
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>

      <!-- 🔘 操作按钮 -->
      <div class="actions">
        <a href="/" class="btn btn-primary">
          <span class="btn-text">{{ homeText }}</span>
          <span class="btn-icon">→</span>
        </a>
        <button class="btn btn-secondary" @click="goBack">
          <span class="btn-text">{{ backText }}</span>
          <span class="btn-icon">←</span>
        </button>
      </div>

      <!-- 💡 几何提示 -->
      <div class="geometric-hints">
        <div v-for="(hint, index) in hints" :key="index" class="hint">
          <span class="hint-icon">{{ hint.icon }}</span>
          <span>{{ hint.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/* 📋 组件属性 */
interface Props {
  title?: string;
  subtitle?: string;
  homeText?: string;
  backText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '页面不见了',
  subtitle: '抱歉，您访问的页面似乎迷失在几何世界里了',
  homeText: '返回首页',
  backText: '返回上一页'
});

/* 🎨 几何形状配置 */
const shapeConfigs = [
  { type: 'circle', color: '#FF6B6B' },
  { type: 'square', color: '#4ECDC4' },
  { type: 'triangle', color: '#FFE66D' },
  { type: 'cross', color: '#95E1D3' },
  { type: 'donut', color: '#F38181' },
  { type: 'semicircle', color: '#AA96DA' },
  { type: 'quarter', color: '#FCBAD3' },
  { type: 'zigzag', color: '#FFFFD2' }
];

/* 📐 生成形状数据 */
const shapes = computed(() => {
  const count = 15;
  return Array.from({ length: count }, (_, i) => ({
    type: shapeConfigs[i % shapeConfigs.length].type,
    color: shapeConfigs[i % shapeConfigs.length].color,
    left: `${Math.random() * 90 + 5}%`,
    top: `${Math.random() * 90 + 5}%`,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 1,
    delay: `${Math.random() * 3}s`,
    duration: `${3 + Math.random() * 4}s`
  }));
});

/* 💡 几何提示 */
const hints = [
  { icon: '○', text: '圆圈代表完整' },
  { icon: '△', text: '三角代表方向' },
  { icon: '□', text: '方块代表稳定' }
];

/* 🎨 获取形状样式 */
function getShapeStyle(shape: typeof shapes.value[0], index: number) {
  return {
    left: shape.left,
    top: shape.top,
    '--rotation': `${shape.rotation}deg`,
    '--scale': shape.scale,
    '--delay': shape.delay,
    '--duration': shape.duration,
    '--color': shape.color,
    transform: `rotate(${shape.rotation}deg) scale(${shape.scale})`
  };
}

/* 🔙 返回上一页 */
function goBack() {
  window.history.back();
}
</script>

<style lang="scss">
@use '../styles/404.scss';
</style>
