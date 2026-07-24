<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🔍 Pagefind 搜索弹窗
-->

<template>
    <Transition name="search-fade">
    <div
      v-if="isOpen"
      class="rouxzhee-search-overlay"
      role="presentation"
      @click.self="close"
    >
      <div
        class="rouxzhee-search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="搜索文档"
        @keydown="handleModalKeyDown"
      >
        <!-- 🔍 搜索输入区 -->
        <div class="search-header">
          <svg class="search-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="search-input"
            placeholder="搜索文档内容..."
            autocomplete="off"
            spellcheck="false"
            aria-label="搜索关键词"
            @input="handleInput"
            @keydown="handleInputKeyDown"
          />
          <button class="search-close-btn" aria-label="关闭搜索" @click="close">
            <span class="search-esc-hint">ESC</span>
            <svg class="search-close-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- 📋 搜索结果区 -->
        <div class="search-body">
          <!-- 未构建索引 -->
          <div v-if="indexMissing" class="search-state">
            <span class="state-icon">📦</span>
            <p class="state-title">搜索索引尚未生成</p>
            <p class="state-desc">请先运行 <code>npm run build</code> 构建站点并生成索引</p>
          </div>

          <!-- 空查询提示 -->
          <div v-else-if="!query.trim()" class="search-state">
            <span class="state-icon">🔍</span>
            <p class="state-title">输入关键词开始搜索</p>
            <p class="state-desc">支持中文模糊匹配，可搜索文档标题与正文内容</p>
          </div>

          <!-- 加载中 -->
          <div v-else-if="isSearching" class="search-state">
            <span class="state-spinner" aria-hidden="true"></span>
            <p class="state-title">搜索中...</p>
          </div>

          <!-- 无结果 -->
          <div v-else-if="results.length === 0" class="search-state">
            <span class="state-icon">⁉️</span>
            <p class="state-title">未找到相关文档</p>
            <p class="state-desc">试试其他关键词，或检查拼写</p>
          </div>

          <!-- 结果列表 -->
          <ul v-else class="search-results" role="listbox" aria-label="搜索结果">
            <li
              v-for="(item, index) in results"
              :key="item.id"
              class="search-result-item"
              :class="{
                'is-active': index === activeIndex,
                'is-sub': item.isSubResult,
              }"
              role="option"
              :aria-selected="index === activeIndex"
              @mouseenter="activeIndex = index"
              @click="navigateTo(item.url)"
            >
              <div class="result-main">
                <span v-if="item.isSubResult" class="result-sub-badge">章节</span>
                <h4 class="result-title">{{ item.title }}</h4>
                <p class="result-excerpt" v-html="item.excerpt"></p>
              </div>
              <svg class="result-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
          </ul>
        </div>

        <!-- ⌨️ 快捷键提示 -->
        <div class="search-footer">
          <div class="search-hints">
            <span class="hint-item"><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
            <span class="hint-item"><kbd>Enter</kbd> 打开</span>
            <span class="hint-item"><kbd>Esc</kbd> 关闭</span>
          </div>
          <span v-if="resultCount > 0" class="search-count">{{ resultCount }} 条结果</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import {
  getPagefind,
  isPagefindAvailable,
  flattenSearchResults,
  type FlatSearchResult,
} from '../utils/pagefind';

const isOpen = ref(false);
const query = ref('');
const results = ref<FlatSearchResult[]>([]);
const activeIndex = ref(0);
const isSearching = ref(false);
const indexMissing = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

let searchToken = 0;

const resultCount = computed(() => results.value.length);

function open() {
  isOpen.value = true;
  query.value = '';
  results.value = [];
  activeIndex.value = 0;
  document.body.style.overflow = 'hidden';

  nextTick(async () => {
    inputRef.value?.focus();
    indexMissing.value = !(await isPagefindAvailable());
  });
}

function close() {
  isOpen.value = false;
  query.value = '';
  results.value = [];
  activeIndex.value = 0;
  document.body.style.overflow = '';
}

function navigateTo(url: string) {
  close();
  window.location.href = url;
}

async function performSearch(term: string) {
  const token = ++searchToken;

  if (!term.trim()) {
    results.value = [];
    isSearching.value = false;
    return;
  }

  const pagefind = await getPagefind();
  if (!pagefind) {
    indexMissing.value = true;
    isSearching.value = false;
    return;
  }

  isSearching.value = true;

  try {
    const response = await pagefind.debouncedSearch(term.trim(), {}, 200);
    if (token !== searchToken) return;

    results.value = await flattenSearchResults(response);
    activeIndex.value = 0;
  } catch (error) {
    console.warn('[SearchModal] 搜索失败:', error);
    if (token === searchToken) {
      results.value = [];
    }
  } finally {
    if (token === searchToken) {
      isSearching.value = false;
    }
  }
}

function handleInput() {
  performSearch(query.value);
}

function handleInputKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (results.value.length > 0) {
      activeIndex.value = (activeIndex.value + 1) % results.value.length;
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (results.value.length > 0) {
      activeIndex.value =
        (activeIndex.value - 1 + results.value.length) % results.value.length;
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const item = results.value[activeIndex.value];
    if (item) navigateTo(item.url);
  }
}

function handleModalKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }
}

function handleOpenSearch() {
  open();
}

function handleGlobalKeyDown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }
}

watch(isOpen, (open) => {
  if (!open) {
    searchToken++;
    isSearching.value = false;
  }
});

onMounted(() => {
  window.addEventListener('rouxzhee-open-search', handleOpenSearch);
  document.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('rouxzhee-open-search', handleOpenSearch);
  document.removeEventListener('keydown', handleGlobalKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease;

  .rouxzhee-search-modal {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
  }
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;

  .rouxzhee-search-modal {
    transform: translateY(-12px) scale(0.98);
    opacity: 0;
  }
}

.rouxzhee-search-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 1.5rem 2rem;
  background: var(--search-overlay-bg);
  backdrop-filter: blur(var(--search-overlay-blur));
  -webkit-backdrop-filter: blur(var(--search-overlay-blur));
}

.rouxzhee-search-modal {
  width: 100%;
  max-width: 640px;
  background: var(--search-modal-bg);
  border: 1px solid var(--search-modal-border);
  border-radius: var(--card-border-radius);
  box-shadow: var(--search-modal-shadow);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.search-input-icon {
  flex-shrink: 0;
  color: var(--text-secondary);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 1.0625rem;
  color: var(--text-color);

  &::placeholder {
    color: var(--text-secondary);
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
}

.search-close-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.625rem;
  background: var(--search-kbd-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--search-kbd-bg-hover);
    border-color: var(--secondary-color);
  }
}

.search-esc-hint {
  font-family: var(--rouxzhee-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.search-close-icon {
  display: none;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.search-body {
  max-height: min(50vh, 420px);
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
}

.search-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.state-icon {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.state-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-color);
  border-top-color: var(--secondary-color);
  border-radius: 50%;
  animation: search-spin 0.7s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes search-spin {
  to { transform: rotate(360deg); }
}

.state-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.state-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;

  code {
    padding: 0.125rem 0.375rem;
    background: var(--search-kbd-bg);
    border-radius: 4px;
    font-family: var(--rouxzhee-font-family-mono);
    font-size: 0.8125rem;
    color: var(--primary-color);
  }
}

.search-results {
  list-style: none;
  padding: 0.5rem;
  margin: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;

  &:hover,
  &.is-active {
    background: var(--search-result-hover-bg);
    border-color: var(--search-result-hover-border);
  }

  &.is-active {
    box-shadow: var(--search-result-active-shadow);
  }

  &.is-sub {
    padding-left: 1.5rem;

    .result-title {
      font-size: 0.9375rem;
    }
  }
}

.result-main {
  flex: 1;
  min-width: 0;
}

.result-sub-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--secondary-color);
  background: var(--search-sub-badge-bg);
  border-radius: 6px;
}

.result-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0 0 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-excerpt {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  :deep(mark) {
    background: var(--search-highlight-bg);
    color: var(--search-highlight-color);
    padding: 0 0.125rem;
    border-radius: 2px;
    font-weight: 600;
  }
}

.result-arrow {
  flex-shrink: 0;
  color: var(--text-secondary);
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--transition-fast);

  .search-result-item:hover &,
  .search-result-item.is-active & {
    opacity: 1;
    transform: translateX(0);
    color: var(--secondary-color);
  }
}

.search-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-color);
  background: var(--search-footer-bg);
}

.search-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hint-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.375rem;
  padding: 0.125rem 0.375rem;
  font-family: var(--rouxzhee-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--search-kbd-bg);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  line-height: 1.4;
}

.search-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .rouxzhee-search-overlay {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .rouxzhee-search-modal {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: none;
    min-height: 100%;
    min-height: 100dvh;
    border-radius: 0;
    border: none;
    --search-modal-bg: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);

    :global(.dark-mode) & {
      --search-modal-bg: rgba(15, 23, 42, 0.55);
    }
  }

  .search-header {
    padding: 0.875rem 1rem;
    flex-shrink: 0;
  }

  .search-input {
    font-size: 16px;
  }

  .search-close-btn {
    width: 36px;
    height: 36px;
    padding: 0;
  }

  .search-esc-hint {
    display: none;
  }

  .search-close-icon {
    display: block;
  }

  .search-body {
    max-height: none;
    flex: 1;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .search-results {
    padding: 0.375rem;
  }

  .search-result-item {
    padding: 1rem;
    gap: 0.625rem;
    border-radius: 10px;

    &.is-sub {
      padding-left: 1.25rem;
    }
  }

  .result-title {
    font-size: 0.9375rem;
  }

  .result-excerpt {
    font-size: 0.8125rem;
  }

  .search-footer {
    padding: 0.625rem 1rem;
    padding-bottom: calc(0.625rem + env(safe-area-inset-bottom));
    flex-shrink: 0;
  }

  .search-hints {
    display: none;
  }
}
</style>
