// 🕊️白木 原创开发 🔗gl.baimu.live
// 🎴 卡片 3D 跟随鼠标倾斜效果（复用自团队页）

import { type Ref, onMounted, onBeforeUnmount } from 'vue';

const DEFAULT_MAX_ANGLE = 10;

function handleTiltMove(event: MouseEvent, maxAngle: number) {
  const card = event.currentTarget as HTMLElement;
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -maxAngle;
  const rotateY = ((x - centerX) / centerX) * maxAngle;

  card.style.setProperty('--tilt-x', `${rotateX}deg`);
  card.style.setProperty('--tilt-y', `${rotateY}deg`);
  card.classList.add('is-tilted');
}

function handleTiltLeave(event: MouseEvent) {
  const card = event.currentTarget as HTMLElement;
  if (!card) return;

  card.classList.remove('is-tilted');
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
}

export function useCardTilt(
  cardRef: Ref<HTMLElement | null>,
  options?: { maxAngle?: number },
) {
  const maxAngle = options?.maxAngle ?? DEFAULT_MAX_ANGLE;
  let card: HTMLElement | null = null;

  const onMove = (event: MouseEvent) => handleTiltMove(event, maxAngle);
  const onLeave = (event: MouseEvent) => handleTiltLeave(event);

  onMounted(() => {
    card = cardRef.value;
    if (!card) return;

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  onBeforeUnmount(() => {
    if (!card) return;

    card.removeEventListener('mousemove', onMove);
    card.removeEventListener('mouseleave', onLeave);
    card.classList.remove('is-tilted');
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
}
