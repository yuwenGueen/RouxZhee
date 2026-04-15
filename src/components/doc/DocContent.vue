<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  📄 DocContent 文档内容页面组件
-->

<template>
  <div class="doc-page">
    <!-- ✨ 装饰元素 -->
    <div class="doc-decorations">
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
      :class="{ 'is-faded': isSidebarFaded }"
      @mouseenter="handleSidebarMouseEnter"
      @mouseleave="handleSidebarMouseLeave"
    >
      <div class="sidebar-toc">
        <h4 class="toc-title">📄当前文档目录</h4>
        <nav class="toc-nav">
          <a
            v-for="item in toc"
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
                  v-for="doc in category.docs"
                  :key="doc.slug"
                  :href="`/${doc.slug}`"
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
              :href="`/${doc.slug}`"
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
      <span class="title-text">{{ meta.title }}</span>
    </h1>

    <!-- 📄 文档主体 -->
    <main class="doc-main">
      <div class="doc-container">
        <!-- 📋 元信息卡片 -->
        <div v-if="showMeta" class="doc-meta-card">
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

        <!-- 🔗 文档导航 - 上一篇/下一篇 -->
        <nav class="doc-navigation">
          <!-- ⬅️ 上一篇 -->
          <a
            v-if="navigation?.prev"
            :href="`/${navigation.prev.slug}`"
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
            :href="`/${navigation.next.slug}`"
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
  isRootDoc: false
});

/* 📊 计算属性 */
const wordCountText = computed(() => {
  const count = props.meta.wordCount || 0;
  return `${count} 字`;
});

const htmlContent = computed(() => props.html);

const displayCategoryName = computed(() => {
  return props.categoryName || '文档列表';
});

/* 📝 分类展开状态 */
const expandedCategories = ref<Set<string>>(new Set());

/* 🔗 切换分类展开/收起 */
const toggleCategory = (path: string) => {
  if (expandedCategories.value.has(path)) {
    expandedCategories.value.delete(path);
  } else {
    expandedCategories.value.add(path);
  }
};

/* 🔗 滚动到锚点 */
const scrollToAnchor = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const navHeight = 100;
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop - navHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

/* 🎨 内容引用 */
const contentRef = ref<HTMLElement | null>(null);

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

/* 🔗 保存滚动位置 */
const saveScrollPosition = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const path = window.location.pathname;
  try {
    localStorage.setItem(`scroll_${path}`, scrollTop.toString());
  } catch (e) {
    console.warn('Failed to save scroll position:', e);
  }
};

/* 🔗 恢复滚动位置 */
const restoreScrollPosition = () => {
  const path = window.location.pathname;
  try {
    const savedScroll = localStorage.getItem(`scroll_${path}`);
    if (savedScroll) {
      const scrollTop = parseInt(savedScroll, 10);
      window.scrollTo({ top: scrollTop, behavior: 'auto' });
    }
  } catch (e) {
    console.warn('Failed to restore scroll position:', e);
  }
};

/* ⚡ 组件挂载后处理 */
onMounted(() => {
  // 恢复滚动位置
  restoreScrollPosition();

  // 监听滚动事件，保存位置
  window.addEventListener('scroll', saveScrollPosition);

  // 监听页面卸载，保存位置
  window.addEventListener('beforeunload', saveScrollPosition);

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

      /* 🖼️ 为带 title 的图片添加玻璃质感气泡提示 */
      const images = contentRef.value.querySelectorAll('img[title]');
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
    }
  });
});

/* 🎯 组件卸载时清理 */
onUnmounted(() => {
  window.removeEventListener('scroll', saveScrollPosition);
  window.removeEventListener('beforeunload', saveScrollPosition);
  // 清除侧边栏淡出计时器
  if (sidebarFadeTimer) {
    clearTimeout(sidebarFadeTimer);
  }
  saveScrollPosition();
});
</script>

<style lang="scss">
/* 🎨 引入文档样式 */
@use '../../styles/doc-content.scss' as *;
</style>
