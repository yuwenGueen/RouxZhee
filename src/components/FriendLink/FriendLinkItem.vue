<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🔗 友链单项组件
-->

<template>
  <div class="friend-link-card" ref="cardRef">
    <a :href="data.link" target="_blank" rel="noopener noreferrer">
      <!-- 标签 -->
      <span v-if="data.tag" class="friend-link-tag">{{ data.tag }}</span>

      <!-- 头像 -->
      <div class="friend-link-avatar">
        <img
          v-if="!imageFailed && data.avatar"
          :src="data.avatar"
          :alt="data.name"
          @error="handleImageError"
          :class="{ irregular: data.irregular }"
          loading="lazy"
        />
        <span v-else class="avatar-placeholder">
          {{ data.name ? data.name.charAt(0).toUpperCase() : '?' }}
        </span>
      </div>

      <!-- 信息 -->
      <div class="friend-link-content">
        <div class="friend-link-name">{{ data.name }}</div>
        <div class="friend-link-desc" :title="data.descr">
          {{ data.descr }}
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useHintPill } from '../../composables/useHintPill';
import { useCardTilt } from '../../composables/useCardTilt';
import type { FriendLinkItem as FriendLinkItemType } from '../../types/friend-link';

interface Props {
  data: FriendLinkItemType;
}

const props = defineProps<Props>();

const imageFailed = ref(false);
const handleImageError = () => (imageFailed.value = true);

const cardRef = ref<HTMLElement | null>(null);
useCardTilt(cardRef);
let rafId: number;
const lights: any[] = [];
const lightCount = 1;

// 💬 导航状态提示胶囊
const { show: showHint, hide: hideHint } = useHintPill();

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const presetColors = [
  'rgba(14, 116, 144, 0.7)',
  'rgba(6, 182, 212, 0.7)',
  'rgba(139, 92, 246, 0.7)',
  'rgba(236, 72, 153, 0.7)',
  'rgba(34, 211, 238, 0.7)',
  'rgba(124, 58, 237, 0.7)',
];

const getRandomColor = () => presetColors[Math.floor(Math.random() * presetColors.length)];

const getGradientColor = (lightColor: string) => {
  const [r, g, b] = lightColor.match(/\d+/g)!.map(Number);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

onMounted(() => {
  if (!cardRef.value) return;
  const card = cardRef.value;
  const lightColor = getRandomColor();

  const handleMouseEnter = () => {
    showHint(`点击查看 🎉${props.data.name}`);
    for (let i = 0; i < lightCount; i++) {
      const lightEl = document.createElement('div');
      lightEl.classList.add('friend-link-light');
      lightEl.style.position = 'absolute';
      lightEl.style.borderRadius = '50%';
      lightEl.style.pointerEvents = 'none';
      lightEl.style.background = 'rgba(255,255,255,0)';
      card.appendChild(lightEl);

      lights.push({
        el: lightEl,
        x: card.offsetWidth / 2,
        y: card.offsetHeight / 2,
        size: Math.max(card.offsetWidth, card.offsetHeight) * 1.8,
        opacity: 0,
        targetX: card.offsetWidth / 2,
        targetY: card.offsetHeight / 2,
        speed: 0.08,
        lightColor,
      });
    }
  };

  const handleMouseLeave = () => {
    hideHint();
    lights.forEach((light) => {
      light.el.style.opacity = '0';
      setTimeout(() => light.el.remove(), 300);
    });
    lights.length = 0;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lights.forEach((light) => {
      light.targetX = x;
      light.targetY = y;

      light.x = lerp(light.x, light.targetX, light.speed);
      light.y = lerp(light.y, light.targetY, light.speed);

      const maxDim = Math.max(card.offsetWidth, card.offsetHeight);
      const targetSize = maxDim * 1.8;
      light.size = lerp(light.size, targetSize, 0.1);
      light.opacity = lerp(light.opacity, 0.5, 0.1);

      const gradientColor = getGradientColor(light.lightColor);
      light.el.style.background = `radial-gradient(circle at ${light.x}px ${light.y}px, ${gradientColor} 0%, rgba(255,255,255,0) 100%)`;
      light.el.style.width = `${light.size}px`;
      light.el.style.height = `${light.size}px`;
      light.el.style.left = `${light.x - light.size / 2}px`;
      light.el.style.top = `${light.y - light.size / 2}px`;
      light.el.style.opacity = light.opacity.toString();
    });
  };

  card.addEventListener('mouseenter', handleMouseEnter);
  card.addEventListener('mouseleave', handleMouseLeave);
  card.addEventListener('mousemove', handleMouseMove);

  const animate = () => (rafId = requestAnimationFrame(animate));
  animate();

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId);
    card.removeEventListener('mouseenter', handleMouseEnter);
    card.removeEventListener('mouseleave', handleMouseLeave);
    card.removeEventListener('mousemove', handleMouseMove);
  });
});
</script>

<style scoped lang="scss">
.friend-link-card {
  position: relative;
  height: 100px;
  border-radius: 12px;
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
  overflow: hidden;
  z-index: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px);

  &:hover {
    box-shadow: var(--card-shadow-hover);
    border-color: var(--primary-color);
  }

  &.is-tilted {
    transition:
      transform 0.1s ease-out,
      box-shadow 0.3s ease,
      border-color 0.3s ease;
    transform: perspective(1000px) rotateX(var(--tilt-x, 0deg))
      rotateY(var(--tilt-y, 0deg)) translateZ(20px) scale3d(1.02, 1.02, 1.02);
  }

  a {
    display: flex;
    align-items: center;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }
}

.friend-link-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  background: var(--gradient-primary);
  color: var(--text-white) !important;
  letter-spacing: 0.2px;
  pointer-events: none;
}

.friend-link-avatar {
  flex: 0 0 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &.irregular {
      border-radius: 8px;
      object-fit: contain;
    }
  }

  .avatar-placeholder {
    width: 60px;
    height: 60px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--text-color);
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
}

.friend-link-card:hover .friend-link-avatar img,
.friend-link-card:hover .friend-link-avatar .avatar-placeholder {
  transform: scale(1.15);
}

.friend-link-content {
  flex: 1;
  padding: 0 16px 0 0;
  position: relative;
  z-index: 1;
  min-width: 0;
}

.friend-link-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-link-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
}

.friend-link-light {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
</style>
