<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🔗 友链页面主组件
-->

<template>
  <div class="friend-link-wrapper">
    <main class="friend-link-page">
      <!-- 页面主标题 -->
      <header class="friend-link-header">
        <h1 class="page-title">
          <template v-for="(segment, index) in titleSegments" :key="index">
            <span
              v-if="segment.type === 'emoji'"
              class="page-title-emoji"
            >{{ segment.content }}</span>
            <SvgGradientText v-else :text="segment.content" />
          </template>
        </h1>
      </header>

      <!-- 顶部 Banner：头像滚动 -->
      <section
        v-if="config.banner.show && allLinks.length > 0"
        class="friend-link-banner"
      >
        <div class="global-stars" ref="starsContainer" :class="{ show: isShowing }">
          <svg
            v-for="(style, index) in starStyles"
            :key="index"
            class="star-item"
            :class="`gstar-${index + 1}`"
            :style="style"
            viewBox="0 0 24 24"
          >
            <path
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            />
          </svg>
        </div>

        <div class="banner-small-title">{{ typewriterText }}</div>

        <div v-if="config.banner.showButtonGroup" class="banner-button-group">
          <button
            class="banner-button secondary"
            @click="handleRandomVisit"
            :disabled="allLinks.length === 0"
            aria-label="随机访问友链"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            <span class="banner-button-text">
              <span class="banner-button-text-original">随机访问</span>
              <span class="banner-button-text-hover">打开盲盒！</span>
            </span>
          </button>
        </div>

        <div class="tags-group-all">
          <div class="tags-group-wrapper">
            <div
              v-for="(row, index) in avatarRows"
              :key="index"
              class="tags-group-row"
              :class="{ 'offset-start': index % 2 === 0 }"
            >
              <div class="tags-group-content">
                <a
                  v-for="(link, linkIndex) in row"
                  :key="`${link.link}-${linkIndex}`"
                  class="tags-group-icon"
                  target="_blank"
                  :href="link.link"
                  rel="external nofollow noopener"
                  @mouseenter="handleAvatarMouseEnter($event, link)"
                  @mouseleave="handleAvatarMouseLeave"
                >
                  <img
                    :src="link.avatar"
                    :alt="link.name"
                    loading="lazy"
                    :class="{ irregular: link.irregular }"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 友链分组列表 -->
      <section
        v-for="(group, index) in config.groups"
        :key="index"
        class="friend-link-group"
      >
        <FriendLinkGroupTitle :title="group.title" :subtitle="group.subtitle" />
        <p class="group-desc">{{ group.desc }}</p>

        <div class="links-grid">
          <div v-for="link in group.list" :key="link.link" class="links-grid__item">
            <FriendLinkItem :data="link" />
          </div>
        </div>
      </section>

      <!-- 📜 页面版权信息 -->
      <footer class="friend-link-footer">
        <p>本页面由 时光笔记 开发 🪐 由 白木 改版</p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import FriendLinkItem from './FriendLinkItem.vue';
import FriendLinkGroupTitle from './FriendLinkGroupTitle.vue';
import SvgGradientText from './SvgGradientText.vue';
import { useFriendLinkStars } from './useFriendLinkStars';
import { friendLinkConfig } from '../../config/friend-link.config';
import { splitTextAndEmoji } from '../../utils/textSegments';
import { useHintPill } from '../../composables/useHintPill';
import type { FriendLinkItem as FriendLinkItemType } from '../../types/friend-link';

const config = friendLinkConfig;
const titleSegments = computed(() => splitTextAndEmoji(config.title));

const allLinks = computed(() => {
  return config.groups.reduce<FriendLinkItemType[]>((acc, group) => {
    acc.push(...group.list);
    return acc;
  }, []);
});

const avatarRows = computed(() => {
  const avatars = allLinks.value;
  if (avatars.length === 0) return [[], []];

  const mid = Math.ceil(avatars.length / 2);
  const row1 = avatars.slice(0, mid);
  const row2 = avatars.slice(mid);

  return [
    [...row1, ...row1, ...row1, ...row1],
    [...row2, ...row2, ...row2, ...row2],
  ];
});

const handleRandomVisit = () => {
  if (allLinks.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * allLinks.value.length);
  const randomLink = allLinks.value[randomIndex];
  window.open(randomLink.link, '_blank');
};

const { starStyles, isShowing, setWrap, onAvatarEnter, onAvatarLeave } = useFriendLinkStars();
const starsContainer = ref<HTMLElement | null>(null);

// 💬 导航状态提示胶囊
const { show: showHint, hide: hideHint } = useHintPill();

const handleAvatarMouseEnter = (event: MouseEvent, link: FriendLinkItemType) => {
  onAvatarEnter(event);
  showHint(`点击查看 🎉${link.name}`);
};

const handleAvatarMouseLeave = () => {
  onAvatarLeave();
  hideHint();
};

// ⌨️ Banner 小标题打字机效果（无光标符号）
const typewriterText = ref('');
let typewriterTimer: ReturnType<typeof setTimeout> | null = null;

const startTypewriter = () => {
  const text = config.banner.smallTitle;
  let index = 0;
  let isDeleting = false;
  typewriterText.value = '';

  const typeNext = () => {
    if (!isDeleting) {
      // 逐字打字
      if (index < text.length) {
        typewriterText.value += text[index];
        index++;
        typewriterTimer = setTimeout(typeNext, 120);
      } else {
        // 打完后停留 2s，进入删除阶段
        typewriterTimer = setTimeout(() => {
          isDeleting = true;
          typewriterTimer = setTimeout(typeNext, 300);
        }, 2000);
      }
    } else {
      // 逐字删除
      if (index > 0) {
        index--;
        typewriterText.value = text.slice(0, index);
        typewriterTimer = setTimeout(typeNext, 80);
      } else {
        // 删除完成后重新打字
        isDeleting = false;
        typewriterText.value = '';
        typewriterTimer = setTimeout(typeNext, 300);
      }
    }
  };

  typeNext();
};

onMounted(() => {
  if (starsContainer.value) {
    setWrap(starsContainer.value);
  }
  startTypewriter();
});

onBeforeUnmount(() => {
  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
  }
});
</script>
