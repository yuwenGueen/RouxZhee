// 🕊️白木 原创开发 🔗gl.baimu.live
// ⚡ 性能优化工具函数 - 防抖、节流、缓存等

/**
 * 🎯 防抖函数 - 限制函数在指定时间间隔内只执行一次
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
};

/**
 * ⏱️ 节流函数 - 限制函数在指定时间间隔内最多执行一次
 * @param fn 需要节流的函数
 * @param limit 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
};

/**
 * 💾 内存缓存类 - 带过期时间的缓存管理器
 */
export class MemoryCache<T> {
  private cache: Map<string, { data: T; expiry: number }> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    // 默认 5 分钟过期
    this.defaultTTL = defaultTTL;
    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60 * 1000); // 每分钟清理一次
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 过期时间（毫秒）
   */
  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data: value, expiry });
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存值或 undefined
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.data;
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 检查缓存是否存在且未过期
   * @param key 缓存键
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * 📊 性能监控工具
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  /**
   * 开始计时
   * @param name 标记名称
   */
  static startMark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`mark-${name}-start`);
      this.marks.set(name, performance.now());
    }
  }

  /**
   * 结束计时并记录
   * @param name 标记名称
   * @returns 耗时（毫秒）
   */
  static endMark(name: string): number | null {
    if (typeof performance !== 'undefined' && this.marks.has(name)) {
      performance.mark(`mark-${name}-end`);
      performance.measure(name, `mark-${name}-start`, `mark-${name}-end`);

      const startTime = this.marks.get(name)!;
      const duration = performance.now() - startTime;
      this.marks.delete(name);

      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return null;
  }

  /**
   * 记录自定义指标
   * @param name 指标名称
   * @param value 指标值
   */
  static recordMetric(name: string, value: number): void {
    if (typeof performance !== 'undefined') {
      console.log(`📊 ${name}: ${value}`);
    }
  }
}

/**
 * 🔄 请求空闲时执行回调
 * @param callback 回调函数
 * @param options 配置选项
 */
export const requestIdleCallback = (
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // 兼容性处理：使用 setTimeout 作为后备方案
  return window.setTimeout(
    () => callback({
      didTimeout: false,
      timeRemaining: () => 50,
    }),
    1
  ) as unknown as number;
};

/**
 * ❌ 取消空闲回调
 * @param handle 回调句柄
 */
export const cancelIdleCallback = (handle: number): void => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(handle);
  } else {
    clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
  }
};
