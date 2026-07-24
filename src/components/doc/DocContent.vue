<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  📄 DocContent 文档内容页面组件
-->

<template>
  <div
    class="doc-page"
    data-pagefind-body
    :class="{ 'rz-beautify-doc-bg': beautifyDocumentBackgroundEnabled }"
    :style="beautifyDocumentBackgroundStyle"
  >
    <!-- ✨ 装饰元素 -->
    <div class="doc-decorations" data-pagefind-ignore>
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
      <div class="decoration-glass glass-1"></div>
      <div class="decoration-glass glass-2"></div>
    </div>

    <!-- 📑 左侧固定目录 -->
    <aside
      v-if="showToc && toc.length"
      class="doc-sidebar"
      data-pagefind-ignore
      :class="{ 'is-faded': isSidebarFaded }"
      @mouseenter="handleSidebarMouseEnter"
      @mouseleave="handleSidebarMouseLeave"
    >
      <div class="sidebar-toc">
        <h4 class="toc-title">📄当前文档目录</h4>
        <nav class="toc-nav">
          <div v-if="highlightCount > 0" class="toc-highlight-group">
            <a
              v-for="item in toc.slice(0, highlightCount)"
              :key="item.id"
              :href="`#${item.id}`"
              class="toc-link"
              :class="[`toc-level-${item.level}`, { 'is-active': item.id === activeTocId }]"
              @click.prevent="scrollToAnchor(item.id)"
            >
              {{ item.text }}
            </a>
          </div>
          <a
            v-for="item in toc.slice(highlightCount)"
            :key="item.id"
            :href="`#${item.id}`"
            class="toc-link"
            :class="`toc-level-${item.level}`"
            @click.prevent="scrollToAnchor(item.id)"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>
    </aside>

    <!-- 📁 右侧分类目录 -->
    <aside
      v-if="categoryDocs.length > 0 || (isRootDoc && categoryTree.length > 0)"
      class="category-sidebar"
      data-pagefind-ignore
      :class="{ 'is-faded': isSidebarFaded }"
      @mouseenter="handleSidebarMouseEnter"
      @mouseleave="handleSidebarMouseLeave"
    >
      <div class="sidebar-category">
        <!-- 📂 根目录模式：显示分类树 -->
        <template v-if="isRootDoc && categoryTree.length > 0">
          <h4 class="category-title">📂文档分类</h4>
          <nav class="category-tree">
            <div
              v-for="category in categoryTree"
              :key="category.path"
              class="category-tree-item"
              :class="{ 'is-expanded': expandedCategories.has(category.path) }"
            >
              <div class="category-header" @click="toggleCategory(category.path)">
                <span class="category-toggle">{{ expandedCategories.has(category.path) ? '📂' : '📁' }}</span>
                <span class="category-name">{{ category.name }}</span>
              </div>
              <div v-if="expandedCategories.has(category.path)" class="category-docs">
                <a
                  v-for="doc in flattenCategoryDocs(category)"
                  :key="doc.slug"
                  :href="docHref(doc.slug)"
                  class="category-link"
                  :class="{ 'is-current': doc.isCurrent }"
                >
                  <span class="doc-title">{{ doc.title }}</span>
                </a>
              </div>
            </div>
          </nav>
        </template>

        <!-- 📂 子目录模式：显示当前分类下的文档 -->
        <template v-else>
          <h4 class="category-title">📂{{ displayCategoryName }}</h4>
          <nav class="category-nav">
            <a
              v-for="doc in categoryDocs"
              :key="doc.slug"
              :href="docHref(doc.slug)"
              class="category-link"
              :class="{ 'is-current': doc.isCurrent }"
            >
              <span class="doc-title">{{ doc.title }}</span>
            </a>
          </nav>
        </template>
      </div>
    </aside>

    <!-- 🎨 页面标题 -->
    <h1 class="doc-page-title">
      <span v-if="titleIcon" class="title-icon">{{ titleIcon }}</span>
      <span class="title-text" data-pagefind-meta="title">{{ meta.title }}</span>
    </h1>

    <!-- 📄 文档主体 -->
    <main class="doc-main">
      <div class="doc-container">
        <!-- 📋 元信息卡片 -->
        <div v-if="showMeta" class="doc-meta-card" data-pagefind-ignore>
          <!-- 📂 分类路径面包屑 -->
          <div v-if="categoryFullPath" class="meta-category-path">
            <span class="meta-icon">📂</span>
            <span class="category-path-text">{{ categoryFullPath }}</span>
          </div>
          <!-- 📝 文章描述 -->
          <div v-if="meta.description" class="meta-description">
            <span class="meta-icon">💬</span>
            <p class="description-text">{{ meta.description }}</p>
          </div>
          <div class="meta-row">
            <div class="meta-item" v-if="meta.date">
              <span class="meta-icon">📅</span>
              <span class="meta-label">发布于</span>
              <span class="meta-value">{{ meta.date }}</span>
            </div>
            <div class="meta-item" v-if="meta.readTime">
              <span class="meta-icon">⏱️</span>
              <span class="meta-label">阅读时间</span>
              <span class="meta-value">{{ meta.readTime }}</span>
            </div>
            <div class="meta-item" v-if="meta.updateDate">
              <span class="meta-icon">✏️</span>
              <span class="meta-label">更新于</span>
              <span class="meta-value">{{ meta.updateDate }}</span>
            </div>
            <div class="meta-item" v-if="meta.wordCount">
              <span class="meta-icon">📝</span>
              <span class="meta-value">{{ wordCountText }}</span>
            </div>
            <div class="meta-item category-item" v-if="meta.category">
              <span class="meta-icon">📁</span>
              <span class="meta-label">分类</span>
              <span class="category-tag">{{ meta.category }}</span>
            </div>
            <div class="meta-item tags-item" v-if="meta.tags && meta.tags.length">
              <span class="meta-icon">🏷️</span>
              <span class="meta-label">标签</span>
              <div class="tags-list">
                <span v-for="tag in meta.tags" :key="tag" class="tag-item">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 📝 文档内容 -->
        <article class="doc-content rz-content" v-html="htmlContent" ref="contentRef"></article>

        <!-- 🔌 RZ Beautify: 分享与评论挂载点 -->
        <section v-if="showBeautifyShare" class="rz-beautify-share" data-pagefind-ignore>
          <div class="rz-beautify-share__title">快捷分享</div>
          <div class="rz-beautify-share__actions">
            <button
              v-if="beautifyShareChannels.includes('wechat')"
              type="button"
              class="rz-beautify-share__button"
              @click="shareTo('wechat')"
            >
              微信
            </button>
            <button
              v-if="beautifyShareChannels.includes('qq')"
              type="button"
              class="rz-beautify-share__button"
              @click="shareTo('qq')"
            >
              QQ
            </button>
            <button
              v-if="beautifyShareChannels.includes('copy')"
              type="button"
              class="rz-beautify-share__button"
              @click="shareTo('copy')"
            >
              {{ shareCopied ? '已复制' : '复制链接' }}
            </button>
          </div>
        </section>

        <section
          v-if="showBeautifyComments"
          class="rz-beautify-comments"
          data-pagefind-ignore
          :data-api-base="beautifySettings.comments.apiBase"
        >
          <div id="rz-beautify-comments-root"></div>
        </section>

        <!-- 🔗 文档导航 - 上一篇/下一篇 -->
        <nav class="doc-navigation" data-pagefind-ignore>
          <!-- ⬅️ 上一篇 -->
          <a
            v-if="navigation?.prev"
            :href="docHref(navigation.prev.slug)"
            class="nav-item nav-prev"
          >
            <span class="nav-icon">←</span>
            <div class="nav-content">
              <span class="nav-label">上一篇</span>
              <span class="nav-title">{{ navigation.prev.title }}</span>
            </div>
          </a>
          <div v-else class="nav-item nav-empty"></div>

          <!-- ➡️ 下一篇 -->
          <a
            v-if="navigation?.next"
            :href="docHref(navigation.next.slug)"
            class="nav-item nav-next"
          >
            <div class="nav-content">
              <span class="nav-label">下一篇</span>
              <span class="nav-title">{{ navigation.next.title }}</span>
            </div>
            <span class="nav-icon">→</span>
          </a>
          <div v-else class="nav-item nav-empty"></div>
        </nav>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 🔗 DocContent 文档内容页面组件脚本 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import type { DocMeta, TocItem, DocNavigation, CategoryDoc, CategoryItem } from '../../types/doc';
import type { BeautifyPluginRuntime } from '../../types/plugins';
import { docHref, withBase } from '../../utils/base';
import { disabledBeautifyRuntime } from '../../utils/beautifyRuntime';
import {
  DOC_SCROLL_NAV_OFFSET,
  saveDocScroll,
  saveDocScrollAnchor,
} from '../../utils/docScrollRestore';

/* 💕 组件属性定义 */
interface Props {
  meta: DocMeta;
  html: string;
  toc: TocItem[];
  navigation?: DocNavigation;
  showMeta?: boolean;
  showToc?: boolean;
  titleIcon?: string;
  categoryDocs?: CategoryDoc[];
  categoryName?: string;
  categoryFullPath?: string;
  categoryTree?: CategoryItem[];
  isRootDoc?: boolean;
  beautifyRuntime?: BeautifyPluginRuntime;
}

const props = withDefaults(defineProps<Props>(), {
  navigation: () => ({ prev: null, next: null }),
  showMeta: true,
  showToc: true,
  titleIcon: undefined,
  categoryDocs: () => [],
  categoryName: '',
  categoryFullPath: '',
  categoryTree: () => [],
  isRootDoc: false,
  beautifyRuntime: () => disabledBeautifyRuntime,
});

/* 📊 计算属性 */
const wordCountText = computed(() => {
  const count = props.meta.wordCount || 0;
  return `${count} 字`;
});

const htmlContent = computed(() => props.html);
const activeBeautifyRuntime = computed(() => props.beautifyRuntime ?? disabledBeautifyRuntime);
const beautifySettings = computed(() => activeBeautifyRuntime.value.settings);
const beautifyDocumentBackgroundEnabled = computed(() =>
  activeBeautifyRuntime.value.enabled &&
  beautifySettings.value.documentBackground.enabled &&
  beautifySettings.value.documentBackground.preset !== 'none'
);
const beautifyDocumentBackgroundStyle = computed<Record<string, string>>(() => {
  if (!beautifyDocumentBackgroundEnabled.value) return {};

  const background = beautifySettings.value.documentBackground;
  const image = background.preset === 'custom' && background.imageUrl
    ? `url("${withBase(background.imageUrl)}")`
    : 'radial-gradient(circle at 24px 24px, rgba(196, 151, 78, 0.16) 1px, transparent 1px), linear-gradient(135deg, rgba(255, 249, 225, 0.92), rgba(252, 239, 195, 0.66))';

  return {
    '--rz-beautify-doc-bg': image,
    '--rz-beautify-doc-bg-opacity': String(Math.min(Math.max(background.opacity, 0), 1)),
  };
});
const beautifyShareChannels = computed(() => beautifySettings.value.share.channels);
const showBeautifyShare = computed(() =>
  activeBeautifyRuntime.value.enabled &&
  beautifySettings.value.share.enabled &&
  beautifyShareChannels.value.length > 0
);
const showBeautifyComments = computed(() =>
  activeBeautifyRuntime.value.enabled &&
  beautifySettings.value.comments.enabled
);
const shareCopied = ref(false);
const currentShareUrl = ref('');

const displayCategoryName = computed(() => {
  return props.categoryName || '文档列表';
});

/* 📝 分类展开状态 */
const expandedCategories = ref<Set<string>>(new Set());

/* 📂 展平分类树中的文档（含子分类），避免只显示顶层空目录 */
function flattenCategoryDocs(category: CategoryItem): CategoryDoc[] {
  const docs = [...category.docs];
  for (const child of category.children || []) {
    docs.push(...flattenCategoryDocs(child));
  }
  return docs;
}

/* 🔗 切换分类展开/收起 */
const toggleCategory = (path: string) => {
  if (expandedCategories.value.has(path)) {
    expandedCategories.value.delete(path);
  } else {
    expandedCategories.value.add(path);
  }
};

const shareTo = async (channel: string) => {
  const url = currentShareUrl.value || window.location.href;
  const title = props.meta.title || document.title;
  if (channel === 'qq') {
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    shareCopied.value = true;
    setTimeout(() => {
      shareCopied.value = false;
    }, 1800);
  } catch (error) {
    console.warn('复制分享链接失败:', error);
  }
};

/* 🔗 滚动到锚点 */
const scrollToAnchor = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetTop = Math.max(0, element.getBoundingClientRect().top + scrollTop - DOC_SCROLL_NAV_OFFSET);
  window.scrollTo({ top: targetTop, behavior: 'smooth' });
};

/* 🎯 根据滚动位置更新目录高亮 */
const updateTocHighlight = () => {
  if (!props.toc.length) return;

  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
  const offset = navHeight + 40;
  let currentIndex = -1;

  props.toc.forEach((item, index) => {
    const el = document.getElementById(item.id);
    if (!el) return;

    const { top } = el.getBoundingClientRect();
    if (top <= offset) {
      currentIndex = index;
    }
  });

  activeTocIndex.value = currentIndex;
};

/* 🎨 内容引用 */
const contentRef = ref<HTMLElement | null>(null);

/* 🎯 当前高亮的目录项索引 */
const activeTocIndex = ref(-1);

/* 🎯 已读/当前目录项数量（从起始到当前项） */
const highlightCount = computed(() => activeTocIndex.value + 1);

/* 🎯 当前激活项 ID */
const activeTocId = computed(() => props.toc[activeTocIndex.value]?.id || '');

/* 🎨 侧边栏透明度控制 */
const isSidebarFaded = ref(false);
let sidebarFadeTimer: ReturnType<typeof setTimeout> | null = null;
const SIDEBAR_FADE_DELAY = 3000; // ◀️ 3秒后降低透明度

/* 🔗 启动侧边栏淡出计时器 */
const startSidebarFadeTimer = () => {
  // 清除已有计时器
  if (sidebarFadeTimer) {
    clearTimeout(sidebarFadeTimer);
  }
  // 设置新的计时器，3秒后降低透明度
  sidebarFadeTimer = setTimeout(() => {
    isSidebarFaded.value = true;
  }, SIDEBAR_FADE_DELAY);
};

/* 🔗 处理侧边栏鼠标移入 */
const handleSidebarMouseEnter = () => {
  // 鼠标移入，恢复透明度
  isSidebarFaded.value = false;
  // 清除计时器
  if (sidebarFadeTimer) {
    clearTimeout(sidebarFadeTimer);
    sidebarFadeTimer = null;
  }
};

/* 🔗 处理侧边栏鼠标移出 */
const handleSidebarMouseLeave = () => {
  // 鼠标移出，启动淡出计时器
  startSidebarFadeTimer();
};

/* 🔗 保存滚动位置（防抖） */
let saveScrollTimer: ReturnType<typeof setTimeout> | null = null;

const flushScrollPosition = () => {
  if (saveScrollTimer) {
    clearTimeout(saveScrollTimer);
    saveScrollTimer = null;
  }
  saveDocScroll(window.pageYOffset || document.documentElement.scrollTop);
};

const saveScrollPosition = () => {
  if (saveScrollTimer) {
    clearTimeout(saveScrollTimer);
  }

  saveScrollTimer = setTimeout(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    saveDocScroll(scrollTop);

    if (activeTocId.value) {
      saveDocScrollAnchor(activeTocId.value);
    }
  }, 120);
};

/* ⚡ 组件挂载后处理 */
onMounted(() => {
  currentShareUrl.value = window.location.href;

  // 阅读位置由 Layout 首帧 inline 脚本锚点瞬时恢复，此处仅同步目录高亮，不再滚动
  updateTocHighlight();

  // 监听滚动事件，保存位置
  window.addEventListener('scroll', saveScrollPosition);

  // 监听滚动事件，更新目录高亮
  window.addEventListener('scroll', updateTocHighlight, { passive: true });

  // 页面卸载前立即保存，避免防抖未触发导致丢失
  window.addEventListener('beforeunload', flushScrollPosition);

  // 初始化分类展开状态
  if (props.categoryTree.length > 0) {
    props.categoryTree.forEach(category => {
      if (category.isExpanded) {
        expandedCategories.value.add(category.path);
      }
    });
  }

  // ⏱️ 启动侧边栏淡出计时器（页面加载3秒后开始淡出）
  startSidebarFadeTimer();

  nextTick(() => {
    /* ◀️ 为内容中的标题添加锚点ID */
    if (contentRef.value) {
      const headings = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
      });

      /* 🖼️ 为带 title 的图片添加玻璃质感气泡提示（排除代码块内的图片） */
      const images = contentRef.value.querySelectorAll('img[title]:not(pre img):not(.code-block-wrapper img)');
      images.forEach((img) => {
        const title = img.getAttribute('title');
        if (!title) return;

        img.removeAttribute('title');
        img.setAttribute('data-title', title);

        const wrapper = document.createElement('span');
        wrapper.className = 'img-tooltip-wrapper';
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const tooltip = document.createElement('div');
        tooltip.className = 'img-tooltip';
        tooltip.textContent = title;
        wrapper.appendChild(tooltip);

        img.addEventListener('mouseenter', () => {
          tooltip.classList.add('show');
        });

        img.addEventListener('mouseleave', () => {
          tooltip.classList.remove('show');
        });
      });

      /* 🔗 为带 title 的链接添加玻璃质感气泡提示 */
      const links = contentRef.value.querySelectorAll('a[title]');
      links.forEach((link) => {
        const title = link.getAttribute('title');
        if (!title) return;

        link.removeAttribute('title');
        link.setAttribute('data-title', title);

        const wrapper = document.createElement('span');
        wrapper.className = 'link-tooltip-wrapper';
        link.parentNode?.insertBefore(wrapper, link);
        wrapper.appendChild(link);

        const tooltip = document.createElement('div');
        tooltip.className = 'link-tooltip';
        tooltip.textContent = title;
        wrapper.appendChild(tooltip);

        link.addEventListener('mouseenter', () => {
          tooltip.classList.add('show');
        });

        link.addEventListener('mouseleave', () => {
          tooltip.classList.remove('show');
        });
      });

      /* ✅ 为任务列表项添加 task-list-item 类 */
      const taskListItems = contentRef.value.querySelectorAll('li');
      taskListItems.forEach((li) => {
        if (li.querySelector('input[type="checkbox"]')) {
          li.classList.add('task-list-item');
        }
      });

      /* 📊 为表格添加包装器，实现超宽表格滚动 */
      const tables = contentRef.value.querySelectorAll('table');
      tables.forEach((table) => {
        if (table.parentElement?.classList.contains('table-wrapper')) {
          return;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });

      /* 🔧 代码块处理 - 添加复制按钮 */
      const codeBlocks = contentRef.value.querySelectorAll('pre');
      codeBlocks.forEach((block) => {
        const codeElement = block.querySelector('code');
        const languageClass = codeElement?.className || '';
        const languageMatch = languageClass.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : 'text';

        const lines = block.textContent?.split('\n') || [];
        const lineCount = Math.max(lines.length, 1);

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        const header = document.createElement('div');
        header.className = 'code-block-header-bar';

        const langLabel = document.createElement('span');
        langLabel.className = 'code-block-lang';
        langLabel.textContent = language === 'text' ? '纯文本' : language.toUpperCase();

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'code-block-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-trigger-btn';
        copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">复制</span>';

        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const code = block.textContent || '';
          navigator.clipboard.writeText(code).then(() => {
            copyBtn.innerHTML = '<span class="copy-icon">✅</span><span class="copy-text">已复制</span>';
            setTimeout(() => {
              copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">复制</span>';
            }, 2000);
          }).catch(err => {
            console.error('复制失败:', err);
          });
        });

        const leftContainer = document.createElement('div');
        leftContainer.className = 'code-block-left';
        leftContainer.appendChild(langLabel);
        header.appendChild(leftContainer);

        actionsContainer.appendChild(copyBtn);
        header.appendChild(actionsContainer);

        const body = document.createElement('div');
        body.className = 'code-block-body';

        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        const lineNumbersHtml = Array.from({ length: lineCount }, (_, i) =>
          `<div class="line-number">${i + 1}</div>`
        ).join('');
        lineNumbers.innerHTML = lineNumbersHtml;

        block.style.backgroundColor = 'transparent';
        block.style.setProperty('background-color', 'transparent', 'important');

        block.parentNode?.insertBefore(wrapper, block);
        wrapper.appendChild(header);
        wrapper.appendChild(body);
        body.appendChild(lineNumbers);
        body.appendChild(block);
      });

      /* 🎯 初始化目录高亮 */
      updateTocHighlight();
    }
  });
});

/* 🎯 组件卸载时清理 */
onUnmounted(() => {
  window.removeEventListener('scroll', saveScrollPosition);
  window.removeEventListener('scroll', updateTocHighlight);
  window.removeEventListener('beforeunload', flushScrollPosition);
  if (saveScrollTimer) {
    clearTimeout(saveScrollTimer);
  }
  flushScrollPosition();
  if (sidebarFadeTimer) {
    clearTimeout(sidebarFadeTimer);
  }
});
</script>

<style lang="scss">
/* 🎨 引入文档样式 */
@use '../../styles/doc-content.scss' as *;
</style>
