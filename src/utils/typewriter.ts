// 🕊️白木 原创开发 🔗gl.baimu.live
// 😎余温 原创开发 🔗https://wiki.xxdevops.cn
// 打字机效果 - Banner 副标题动画

export interface TypewriterOptions {
  // 文本列表
  items: string[];
  // 打字速度 (ms)
  typeSpeed: number;
  // 删除速度 (ms)
  deleteSpeed: number;
  // 停留时间 (ms)
  holdTime: number;
  // 切换延迟 (ms)
  nextDelay: number;
  // 随机打乱
  shuffle: boolean;
}

export class Typewriter {
  private element: HTMLElement;
  private caret: HTMLElement | null;
  private options: TypewriterOptions;
  private queue: string[];
  private currentIndex = 0;
  private isDeleting = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    element: HTMLElement,
    caret: HTMLElement | null,
    options: TypewriterOptions
  ) {
    this.element = element;
    this.caret = caret;
    this.options = options;

    // 初始化队列
    this.queue = [...options.items];
    if (options.shuffle) {
      this.queue = this.queue
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    }

    // 初始化光标
    if (this.caret) {
      this.caret.style.display = 'inline-block';
    }

    // 清空初始文本
    this.element.textContent = '';

    // 延迟启动
    setTimeout(() => this.tick(), 400);
  }

  private tick(): void {
    const current = this.queue[this.currentIndex % this.queue.length];
    const displayed = this.element.textContent || '';

    // 打字中
    if (!this.isDeleting && displayed.length < current.length) {
      this.element.textContent = current.slice(0, displayed.length + 1);
      this.timer = setTimeout(() => this.tick(), this.options.typeSpeed);
      return;
    }

    // 删除中
    if (this.isDeleting && displayed.length > 0) {
      this.element.textContent = current.slice(0, displayed.length - 1);
      this.timer = setTimeout(() => this.tick(), this.options.deleteSpeed);
      return;
    }

    // 完成打字，开始停留
    if (!this.isDeleting) {
      this.isDeleting = true;
      this.timer = setTimeout(() => this.tick(), this.options.holdTime);
      return;
    }

    // 完成删除，切换下一条
    this.isDeleting = false;
    this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    this.timer = setTimeout(() => this.tick(), this.options.nextDelay);
  }

  // 销毁实例
  destroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// 自动初始化函数
export function initTypewriter(): void {
  const subtitleEl = document.querySelector('[data-hero-subtitle]') as HTMLElement;
  if (!subtitleEl) return;

  // 解析配置
  const itemsAttr = subtitleEl.dataset.items;
  const items: string[] = itemsAttr ? JSON.parse(itemsAttr) : [];

  if (items.length === 0) return;

  const options: TypewriterOptions = {
    items,
    typeSpeed: parseInt(subtitleEl.dataset.typeSpeed || '90', 10),
    deleteSpeed: parseInt(subtitleEl.dataset.deleteSpeed || '45', 10),
    holdTime: parseInt(subtitleEl.dataset.hold || '1800', 10),
    nextDelay: parseInt(subtitleEl.dataset.nextDelay || '600', 10),
    shuffle: subtitleEl.dataset.shuffle === 'true',
  };

  const caret = document.querySelector('[data-hero-caret]') as HTMLElement;

  new Typewriter(subtitleEl, caret, options);
}
