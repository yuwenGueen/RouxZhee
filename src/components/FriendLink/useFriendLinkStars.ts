// 🕊️白木 原创开发 🔗gl.baimu.live
// ✨ 友链头像悬停星爆效果

import { ref } from 'vue';

export interface StarStyle {
  left?: string;
  top?: string;
  transform?: string;
  opacity?: string;
  '--offset-x'?: string;
  '--offset-y'?: string;
}

const offsets = [
  { x: -50, y: -60 },
  { x: 20, y: -60 },
  { x: -70, y: 0 },
  { x: 60, y: -12 },
  { x: -40, y: 50 },
  { x: 30, y: 50 },
];

export function useFriendLinkStars() {
  const starStyles = ref<StarStyle[]>(
    Array.from({ length: 6 }, () => ({
      left: '0px',
      top: '0px',
      transform: 'translate(-50%, -50%) scale(0)',
      opacity: '0',
      '--offset-x': '0px',
      '--offset-y': '0px',
    })),
  );

  const starsWrap = ref<HTMLElement | null>(null);
  const isShowing = ref(false);

  function setWrap(el: HTMLElement) {
    starsWrap.value = el;
  }

  function onAvatarEnter(e: MouseEvent) {
    if (!starsWrap.value) return;

    const bannerRect = starsWrap.value.getBoundingClientRect();
    const iconRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = iconRect.left + iconRect.width / 2 - bannerRect.left;
    const centerY = iconRect.top + iconRect.height / 2 - bannerRect.top;

    isShowing.value = true;

    starStyles.value = offsets.map((offset) => ({
      left: `${centerX}px`,
      top: `${centerY}px`,
      '--offset-x': `${offset.x}px`,
      '--offset-y': `${offset.y}px`,
      transform: 'translate(-50%, -50%) scale(0)',
      opacity: '0',
    }));

    // 强制触发浏览器重绘，保证动画生效
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 动画由 CSS 接管
      });
    });
  }

  function onAvatarLeave() {
    isShowing.value = false;
    starStyles.value = starStyles.value.map(() => ({
      transform: 'translate(-50%, -50%) scale(0)',
      opacity: '0',
      '--offset-x': '0px',
      '--offset-y': '0px',
    }));
  }

  return {
    starStyles,
    starsWrap,
    isShowing,
    setWrap,
    onAvatarEnter,
    onAvatarLeave,
  };
}
