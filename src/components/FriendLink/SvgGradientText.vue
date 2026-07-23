<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  SVG 渐变文字片段（用于友链页标题等）
  使用隐藏测量节点预留占位，避免 getBBox / 字体加载导致布局抖动
-->

<template>
  <span class="svg-gradient-text-host">
    <span class="svg-gradient-text-measure" aria-hidden="true">{{ text }}</span>
    <svg
      ref="svgRef"
      class="svg-gradient-text"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          :id="gradientId"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" class="svg-cyber-stop-start" />
          <stop offset="50%" class="svg-cyber-stop-mid" />
          <stop offset="100%" class="svg-cyber-stop-end" />
        </linearGradient>
      </defs>
      <text ref="textRef" :fill="`url(#${gradientId})`">{{ text }}</text>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from 'vue';

interface Props {
  text: string;
}

const props = defineProps<Props>();

const gradientId = useId();
const svgRef = ref<SVGSVGElement | null>(null);
const textRef = ref<SVGTextElement | null>(null);

const updateSize = async () => {
  await nextTick();

  const svg = svgRef.value;
  const text = textRef.value;
  if (!svg || !text || !props.text) return;

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const bbox = text.getBBox();
  const pad = 2;

  svg.setAttribute(
    'viewBox',
    `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`,
  );
  svg.style.width = `${bbox.width + pad * 2}px`;
  svg.style.height = `${bbox.height + pad * 2}px`;
};

onMounted(updateSize);
watch(() => props.text, updateSize);
</script>

<style scoped lang="scss">
.svg-gradient-text-host {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  line-height: 1;
}

// 首帧占位：与 SVG 文本同字体，SSR 即可确定宽高
.svg-gradient-text-measure {
  display: inline-block;
  visibility: hidden;
  white-space: pre;
  font-family: var(--font-heading);
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  user-select: none;
  pointer-events: none;
}

.svg-gradient-text {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
  font-size: inherit;

  text {
    font-family: var(--font-heading);
    font-size: 1em;
    font-weight: inherit;
    letter-spacing: inherit;
  }
}

.svg-cyber-stop-start {
  stop-color: #0e7490;
}

.svg-cyber-stop-mid {
  stop-color: #06b6d4;
}

.svg-cyber-stop-end {
  stop-color: #22d3ee;
}

:global(.dark-mode) .svg-cyber-stop-start {
  stop-color: rgba(34, 211, 238, 0.7);
}

:global(.dark-mode) .svg-cyber-stop-mid {
  stop-color: rgba(6, 182, 212, 0.7);
}

:global(.dark-mode) .svg-cyber-stop-end {
  stop-color: rgba(8, 145, 178, 0.7);
}
</style>
