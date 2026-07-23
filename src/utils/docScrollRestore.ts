// 🕊️白木 原创开发 🔗gl.baimu.live
// 📄 文档页阅读位置保存与恢复（锚点 + 像素双备份）

export const DOC_SCROLL_STORAGE_PREFIX = 'scroll_';
export const DOC_SCROLL_ANCHOR_PREFIX = 'scroll_anchor_';

export function getDocScrollStorageKey(pathname: string = window.location.pathname): string {
  return `${DOC_SCROLL_STORAGE_PREFIX}${pathname}`;
}

export function getDocScrollAnchorStorageKey(pathname: string = window.location.pathname): string {
  return `${DOC_SCROLL_ANCHOR_PREFIX}${pathname}`;
}

export function getSavedDocScroll(pathname: string = window.location.pathname): number | null {
  try {
    const saved = localStorage.getItem(getDocScrollStorageKey(pathname));
    if (!saved) return null;

    const top = parseInt(saved, 10);
    if (!Number.isFinite(top) || top < 0) return null;

    return top;
  } catch {
    return null;
  }
}

export function getSavedDocScrollAnchor(pathname: string = window.location.pathname): string | null {
  try {
    const anchorId = localStorage.getItem(getDocScrollAnchorStorageKey(pathname));
    return anchorId || null;
  } catch {
    return null;
  }
}

export function saveDocScroll(top: number, pathname: string = window.location.pathname): void {
  try {
    localStorage.setItem(getDocScrollStorageKey(pathname), String(Math.round(top)));
  } catch {
    // 忽略无痕模式等 localStorage 不可用的情况
  }
}

export function saveDocScrollAnchor(anchorId: string, pathname: string = window.location.pathname): void {
  if (!anchorId) return;

  try {
    localStorage.setItem(getDocScrollAnchorStorageKey(pathname), anchorId);
  } catch {
    // 忽略无痕模式等 localStorage 不可用的情况
  }
}

/** 文档页导航栏 + 目录偏移（与 scrollToAnchor 一致） */
export const DOC_SCROLL_NAV_OFFSET = 100;

/**
 * 锚点方式瞬时定位（behavior: auto，无动画）
 * @returns 是否成功定位到锚点
 */
export function scrollToDocAnchor(anchorId: string, offset = DOC_SCROLL_NAV_OFFSET): boolean {
  const element = document.getElementById(anchorId);
  if (!element) return false;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetTop = Math.max(0, element.getBoundingClientRect().top + scrollTop - offset);
  window.scrollTo(0, targetTop);
  return true;
}

/**
 * 像素方式瞬时定位（锚点不可用时的兜底）
 */
export function scrollToDocPixel(top: number): void {
  if (!Number.isFinite(top) || top < 0) return;
  window.scrollTo(0, top);
}

/**
 * 优先像素、其次锚点，均瞬时跳转
 * @returns 是否完成定位
 */
export function restoreDocScrollInstant(pathname: string = window.location.pathname): boolean {
  if (window.location.hash) return false;

  const savedTop = getSavedDocScroll(pathname);
  if (savedTop != null) {
    scrollToDocPixel(savedTop);
    return true;
  }

  const anchorId = getSavedDocScrollAnchor(pathname);
  if (anchorId && scrollToDocAnchor(anchorId)) {
    return true;
  }

  return false;
}
