<template>
  <div
    v-if="showKanban"
    class="rz-beautify-kanban"
    :class="`rz-beautify-kanban--${kanban.position}`"
    :style="{ width: `${kanban.width}px` }"
    data-pagefind-ignore
  >
    <img :src="kanbanImageUrl" alt="" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { BeautifyPluginRuntime } from '../../types/plugins';
import { withBase } from '../../utils/base';
import { disabledBeautifyRuntime } from '../../utils/beautifyRuntime';

const props = withDefaults(defineProps<{
  runtime?: BeautifyPluginRuntime;
}>(), {
  runtime: () => disabledBeautifyRuntime,
});

const activeRuntime = computed(() => props.runtime ?? disabledBeautifyRuntime);
const settings = computed(() => activeRuntime.value.settings);
const kanban = computed(() => settings.value.kanban);
const showKanban = computed(() => activeRuntime.value.enabled && kanban.value.enabled && Boolean(kanban.value.imageUrl));
const kanbanImageUrl = computed(() => withBase(kanban.value.imageUrl));

function applyImagePlaceholders() {
  const placeholder = settings.value.imagePlaceholder;
  if (!activeRuntime.value.enabled || !placeholder.enabled || !placeholder.imageUrl) return;

  const placeholderUrl = withBase(placeholder.imageUrl);
  document
    .querySelectorAll<HTMLImageElement>('img:not([data-rz-beautify-placeholder-bound])')
    .forEach((image) => {
      if (image.closest('.rz-beautify-kanban')) return;
      image.dataset.rzBeautifyPlaceholderBound = 'true';
      image.style.setProperty('--rz-beautify-image-placeholder', `url("${placeholderUrl}")`);
      if (!image.complete) {
        image.classList.add('rz-beautify-image-loading');
      }
      image.addEventListener('load', () => image.classList.remove('rz-beautify-image-loading'), { once: true });
      image.addEventListener('error', () => image.classList.remove('rz-beautify-image-loading'), { once: true });
    });
}

onMounted(() => {
  applyImagePlaceholders();
});
</script>

<style lang="scss">
.rz-beautify-kanban {
  position: fixed;
  z-index: 960;
  pointer-events: none;

  img {
    display: block;
    width: 100%;
    height: auto;
    filter: drop-shadow(0 18px 28px rgba(15, 23, 42, 0.18));
  }
}

.rz-beautify-kanban--right-bottom {
  right: 24px;
  bottom: 24px;
}

.rz-beautify-kanban--left-bottom {
  left: 24px;
  bottom: 24px;
}

.rz-beautify-kanban--right-top {
  right: 24px;
  top: calc(var(--nav-height) + 24px);
}

.rz-beautify-kanban--left-top {
  left: 24px;
  top: calc(var(--nav-height) + 24px);
}

.rz-beautify-image-loading {
  background-image: var(--rz-beautify-image-placeholder);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

@media (max-width: 768px) {
  .rz-beautify-kanban {
    display: none;
  }
}
</style>
