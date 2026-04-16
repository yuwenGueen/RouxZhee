// 🕊️白木 原创开发 🔗gl.baimu.live
// 🖼️ 图片优化工具函数 - 提供响应式图片和懒加载支持

/**
 * 📐 生成响应式图片 srcset
 * @param src 原始图片路径
 * @param widths 需要生成的宽度数组
 * @returns srcset 字符串
 */
export const generateSrcSet = (src: string, widths: number[] = [400, 600, 800, 1200]): string => {
  // 如果是 data URL 或外部 URL，直接返回原始 src
  if (src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }

  // 生成不同尺寸的图片路径（假设使用 Astro 的图片优化）
  return widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(', ');
};

/**
 * 📏 根据容器宽度计算合适的图片尺寸
 * @param containerWidth 容器宽度
 * @param devicePixelRatio 设备像素比
 * @returns 最优图片宽度
 */
export const calculateOptimalSize = (
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number => {
  // 支持的尺寸列表
  const supportedSizes = [320, 480, 640, 800, 1024, 1280, 1600];

  // 计算所需像素数
  const requiredPixels = containerWidth * devicePixelRatio;

  // 找到最接近且大于等于所需像素数的尺寸
  const optimalSize = supportedSizes.find(size => size >= requiredPixels);

  return optimalSize || supportedSizes[supportedSizes.length - 1];
};

/**
 * 🎨 获取图片格式优先级列表
 * @returns 支持的格式数组
 */
export const getSupportedFormats = (): string[] => {
  const formats = [];

  // 检查浏览器是否支持 AVIF
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/avif').startsWith('data:image/avif')) {
      formats.push('avif');
    }
    // WebP 支持广泛，默认包含
    formats.push('webp');
  }

  return formats;
};

/**
 * ⚡ 图片懒加载观察器配置
 */
export const imageObserverOptions = {
  root: null,
  rootMargin: '200px', // 提前 200px 开始加载
  threshold: 0.01,
};

/**
 * 🔍 创建图片懒加载 Intersection Observer
 * @param callback 当图片进入视口时的回调
 * @returns IntersectionObserver 实例
 */
export const createImageObserver = (
  callback: (img: HTMLImageElement) => void
): IntersectionObserver => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        callback(img);
        observer.unobserve(img);
      }
    });
  }, imageObserverOptions);
};

/**
 * 📊 图片加载性能监控
 */
export const trackImagePerformance = (img: HTMLImageElement, loadTime: number): void => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`image-loaded-${img.src}`);
    console.log(`🖼️ 图片加载完成: ${img.src}, 耗时: ${loadTime.toFixed(2)}ms`);
  }
};
