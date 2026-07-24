<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  👥 RZ 团队页面组件
  配置来源：src/page-templates/team.md
-->

<template>
  <div class="team-page-wrapper">
    <main class="team-page">
      <!-- 品牌信息 -->
      <div class="brand-section-wrapper">
        <div class="brand-decorations" aria-hidden="true">
          <img
            class="brand-deco brand-deco-top"
            src="https://rz-icon.xxdevops.cn/icons/image-star.png"
            alt=""
            loading="lazy"
          />
          <img
            class="brand-deco brand-deco-left"
            src="https://rz-icon.xxdevops.cn/icons/image-free.png"
            alt=""
            loading="lazy"
          />
          <img
            class="brand-deco brand-deco-right-top"
            src="https://rz-icon.xxdevops.cn/icons/image-light.png"
            alt=""
            loading="lazy"
          />
          <img
            class="brand-deco brand-deco-right-bottom"
            src="https://rz-icon.xxdevops.cn/icons/image-like.png"
            alt=""
            loading="lazy"
          />
        </div>
        <section class="team-brand-section card-with-decoration">
          <div class="brand-left">
            <div class="brand-logo-wrapper">
              <img
                :src="config.brand.logo"
                :alt="config.brand.name"
                class="brand-logo"
                loading="eager"
              />
            </div>
          </div>
          <div class="brand-right">
            <h1 class="brand-name">{{ config.brand.name }}</h1>
            <p class="brand-short-name">品牌简称 {{ config.brand.shortName }}</p>
          </div>
        </section>
      </div>

      <!-- 品牌含义 -->
      <section class="team-meaning-section">
        <div class="meaning-card meaning-card-left card-with-decoration">
          <h2 class="meaning-title">{{ config.meaning.left.title }}</h2>
          <p
            v-for="(line, index) in config.meaning.left.lines"
            :key="`meaning-left-${index}`"
            class="meaning-line"
          >
            {{ line }}
          </p>
        </div>

        <div class="meaning-center">
          <div class="meaning-sparkle" aria-hidden="true">
            <div class="sparkle-track">
              <span class="sparkle-dot"></span>
            </div>
            <p
              v-for="(line, index) in config.meaning.center"
              :key="`meaning-center-${index}`"
              class="meaning-center-line"
            >
              {{ line }}
            </p>
          </div>
        </div>

        <div class="meaning-card meaning-card-right card-with-decoration">
          <h2 class="meaning-title">{{ config.meaning.right.title }}</h2>
          <p
            v-for="(line, index) in config.meaning.right.lines"
            :key="`meaning-right-${index}`"
            class="meaning-line"
          >
            {{ line }}
          </p>
        </div>
      </section>

      <!-- 介绍卡片 + 品牌 Slogan -->
      <section class="team-info-section">
        <div class="intro-card card-with-decoration">
          <p
            v-for="(line, index) in config.intro.lines"
            :key="`intro-${index}`"
            class="intro-line"
          >
            {{ line }}
          </p>
        </div>

        <div
          class="slogan-card card-with-decoration"
          @mouseenter="pauseSloganCarousel"
          @mouseleave="resumeSloganCarousel"
        >
          <div class="slogan-stage">
            <span class="slogan-measure" aria-hidden="true">{{ longestSlogan }}</span>
            <span
              v-for="(part, index) in config.slogan.parts"
              :key="`slogan-${index}`"
              class="slogan-part"
              :style="{ animationDelay: `${index * 2.5}s` }"
            >
              {{ part }}
            </span>
          </div>
          <span class="slogan-watermark" aria-hidden="true">{{ config.brand.name }}</span>
        </div>
      </section>

      <!-- 团队成员 + 投喂支持 -->
      <div class="team-bottom-section">
        <section class="team-members-section">
          <SectionTitle subtitle="TEAM MEMBERS" title="团队成员" />
          <div class="members-grid">
            <component
              :is="member.link ? 'a' : 'div'"
              v-for="(member, index) in config.members"
              :key="`member-${index}`"
              :href="member.link"
              target="_blank"
              rel="noopener noreferrer"
              class="member-card card-with-decoration"
            >
              <div class="member-avatar-wrapper">
                <img
                  :src="member.avatar"
                  :alt="member.name"
                  class="member-avatar"
                  loading="lazy"
                />
              </div>
              <div class="member-info">
                <div class="member-header">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <span class="member-tag">{{ member.tag }}</span>
                </div>
                <p class="member-description">{{ member.description }}</p>
              </div>
            </component>
          </div>
        </section>

        <section class="team-sponsor-section">
          <SectionTitle subtitle="SPONSOR" title="投喂支持" />
          <div class="sponsor-amounts">
            <button
              v-for="(amount, index) in config.sponsor.amounts"
              :key="`amount-${index}`"
              type="button"
              class="sponsor-amount-card"
              :class="{ active: selectedAmount === amount }"
              @click="selectedAmount = amount"
            >
              <span class="amount-value">{{ amount }}</span>
              <span class="amount-unit">元</span>
            </button>
          </div>
          <button
            type="button"
            class="sponsor-button"
            :disabled="!selectedAmount"
            @click="handleSponsor"
          >
            {{ config.sponsor.buttonText }}
          </button>
        </section>
      </div>

      <!-- RouxZhee 主题 -->
      <section class="team-themes-section">
        <SectionTitle subtitle="THEMES" title="RouxZhee 主题" />
        <div class="themes-grid">
          <a
            v-for="(theme, index) in themesWithBase"
            :key="`theme-${index}`"
            :href="theme.link"
            target="_blank"
            rel="noopener noreferrer"
            class="theme-card card-with-decoration"
          >
            <div class="theme-cover-wrapper">
              <img
                :src="theme.cover"
                :alt="theme.title"
                class="theme-cover"
                loading="lazy"
              />
            </div>
            <div class="theme-wave-divider" aria-hidden="true">
              <svg
                viewBox="-12 0 36 120"
                preserveAspectRatio="none"
                class="theme-wave-svg"
              >
                <path
                  d="M0,0 C4,0 12,20 12,30 C12,40 4,60 0,60 C-4,60 -12,80 -12,90 C-12,100 -4,120 0,120 L24,120 L24,0 Z"
                  fill="var(--about-card-bg)"
                />
              </svg>
            </div>
            <div class="theme-info">
              <div class="theme-header">
                <h3 class="theme-title">{{ theme.title }}</h3>
                <span v-if="theme.tag" class="theme-tag">{{ theme.tag }}</span>
              </div>
              <p class="theme-description">{{ theme.description }}</p>
            </div>
          </a>
        </div>
      </section>

      <!-- RouxZhee 插件 -->
      <section class="team-plugins-section">
        <SectionTitle subtitle="PLUGINS" title="RouxZhee 插件" />
        <div class="plugins-grid">
          <a
            v-for="(plugin, index) in pluginsWithBase"
            :key="`plugin-${index}`"
            :href="plugin.link"
            target="_blank"
            rel="noopener noreferrer"
            class="plugin-card card-with-decoration"
          >
            <div class="plugin-cover-wrapper">
              <img
                :src="plugin.cover"
                :alt="plugin.title"
                class="plugin-cover"
                loading="lazy"
              />
            </div>
            <div class="plugin-wave-divider" aria-hidden="true">
              <svg
                viewBox="-12 0 36 120"
                preserveAspectRatio="none"
                class="plugin-wave-svg"
              >
                <path
                  d="M0,0 C4,0 12,20 12,30 C12,40 4,60 0,60 C-4,60 -12,80 -12,90 C-12,100 -4,120 0,120 L24,120 L24,0 Z"
                  fill="var(--about-card-bg)"
                />
              </svg>
            </div>
            <div class="plugin-info">
              <h3 class="plugin-title">{{ plugin.title }}</h3>
              <p class="plugin-description">{{ plugin.description }}</p>
            </div>
          </a>
        </div>
      </section>

      <!-- ⏳ 页面时间线导航 -->
      <nav class="team-timeline" aria-label="页面导航">
        <div class="timeline-track">
          <button
            v-for="(item, index) in timelineItems"
            :key="`timeline-${index}`"
            type="button"
            class="timeline-node"
            :class="{ active: activeIndex === index }"
            :aria-label="item.label"
            @click="scrollToSection(item.selector)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <span class="timeline-dot"></span>
            <Transition name="timeline-bubble">
              <span
                v-if="hoveredIndex === index"
                class="timeline-bubble"
              >
                <strong class="timeline-bubble-title">{{ item.label }}</strong>
                <span class="timeline-bubble-desc">{{ item.description }}</span>
              </span>
            </Transition>
          </button>
        </div>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 👥 RZ 团队页面组件脚本 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { TeamConfig } from '../types/team';
import SectionTitle from './SectionTitle.vue';
import { withBase } from '../utils/base';

interface Props {
  config: TeamConfig;
}

const props = defineProps<Props>();
const config = props.config;

/* 🎨 RouxZhee 主题数据 */
interface ThemeItem {
  title: string;
  description: string;
  link: string;
  cover: string;
  tag?: string;
}

const themes: ThemeItem[] = [
  {
    title: 'RouxZhee',
    description: '当前正在使用的官方主题，清新极简，专注阅读体验',
    link: '/',
    cover: '/assets/shiroki.avif',
    tag: '当前主题',
  },
  {
    title: '文档主题',
    description: '为文档中心设计的主题，结构清晰，检索高效',
    link: '/doc/',
    cover: '/assets/img/RouxZhee-shilitu.jpg',
  },
  {
    title: '企业主题',
    description: '适合企业官网的商务风格主题，稳重专业',
    link: '/about/',
    cover: '/assets/img/fileName.png',
  },
  {
    title: '导航主题',
    description: '聚合常用链接的导航首页主题，一目了然',
    link: '/site/',
    cover: '/RouxZhee-LOGO.png',
  },
];

/* 🔌 RouxZhee 插件数据 */
interface PluginItem {
  title: string;
  description: string;
  link: string;
  cover: string;
}

const plugins: PluginItem[] = [
  {
    title: '会员等级插件',
    description: '灵活的会员等级体系，支持积分与权限联动',
    link: '#',
    cover: '/assets/shiroki.avif',
  },
  {
    title: '特效插件',
    description: '为背景与交互添加丰富动效，提升页面活力',
    link: '#',
    cover: '/assets/img/RouxZhee-shilitu.jpg',
  },
  {
    title: '后台管理',
    description: '可视化后台管理面板，轻松配置站点内容与用户',
    link: '#',
    cover: '/assets/img/fileName.png',
  },
  {
    title: '统计插件',
    description: '集成访问统计与数据分析，掌握站点运营状况',
    link: '#',
    cover: '/RouxZhee-LOGO.png',
  },
  {
    title: '付费内容插件',
    description: '支持文章、资源付费解锁，构建内容变现能力',
    link: '#',
    cover: '/assets/img/RouxZhee-shilitu.jpg',
  },
  {
    title: '登录注册插件',
    description: '提供完整的登录、注册与密码找回流程',
    link: '#',
    cover: '/assets/shiroki.avif',
  },
  {
    title: '用户管理',
    description: '集中管理用户信息、状态与权限分配',
    link: '#',
    cover: '/RouxZhee-LOGO.png',
  },
  {
    title: '权限插件',
    description: '细粒度权限控制，为不同角色分配功能访问权',
    link: '#',
    cover: '/assets/img/fileName.png',
  },
];

/* 📂 为站内资源/链接拼接 base 前缀 */
function withBaseTheme(item: ThemeItem): ThemeItem {
  return { ...item, link: withBase(item.link), cover: withBase(item.cover) };
}
function withBasePlugin(item: PluginItem): PluginItem {
  return { ...item, link: withBase(item.link), cover: withBase(item.cover) };
}
const themesWithBase = computed(() => themes.map(withBaseTheme));
const pluginsWithBase = computed(() => plugins.map(withBasePlugin));
const longestSlogan = computed(() => {
  const parts = config.slogan.parts || [];
  return parts.slice().sort((a, b) => b.length - a.length)[0] || '';
});

/* ☕ 当前选中的投喂金额 */
const selectedAmount = ref<number | null>(config.sponsor.amounts[0] ?? null);

/* 🚀 投喂按钮点击：预留支付 API 接入点 */
function handleSponsor() {
  if (!selectedAmount.value) return;

  const apiUrl = config.sponsor.apiUrl?.trim();
  if (apiUrl) {
    // 后续接入真实支付 API
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: selectedAmount.value }),
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('投喂接口调用失败:', error);
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(`投喂金额：${selectedAmount.value} 元，请接入 sponsor.apiUrl`);
  }
}

/* ⏸️ Slogan 轮播悬停暂停：等当前文字完全显示后再暂停 */
let pauseTimerId: number | null = null;
const SLOGAN_CYCLE_MS = 7500;
// 每段 slogan 进入 opacity:1 后的“完全显示”时间段（基于统一循环时间轴）
const SLOGAN_HOLD_RANGES: Array<[number, number]> = [
  [750, 1875],   // 0：0s
  [3250, 4375],  // 1：2.5s
  [5750, 6875],  // 2：5s
];

function getSloganAnimations(): Animation[] {
  const stage = document.querySelector('.slogan-stage');
  if (!stage) return [];
  try {
    return Array.from(stage.getAnimations({ subtree: true })).filter((anim) => {
      const target = anim.effect?.target;
      return target instanceof Element && target.classList.contains('slogan-part');
    });
  } catch {
    return Array.from(stage.getAnimations()).filter((anim) => {
      const target = anim.effect?.target;
      return target instanceof Element && target.classList.contains('slogan-part');
    });
  }
}

function getSloganCycleTime(): number | null {
  const anims = getSloganAnimations();
  if (!anims.length) return null;
  const currentTime = anims[0].currentTime;
  if (currentTime == null) return null;
  return (currentTime as number) % SLOGAN_CYCLE_MS;
}

function pauseSloganCarousel() {
  if (pauseTimerId != null) {
    clearTimeout(pauseTimerId);
    pauseTimerId = null;
  }

  const animations = getSloganAnimations();
  if (!animations.length) return;

  const doPause = () => {
    animations.forEach((anim) => anim.pause());
  };

  const cycleTime = getSloganCycleTime();
  if (cycleTime == null) {
    doPause();
    return;
  }

  // 若当前已处于某段文字的完全显示阶段，直接暂停
  const isInHold = SLOGAN_HOLD_RANGES.some(
    ([start, end]) => cycleTime >= start && cycleTime <= end
  );
  if (isInHold) {
    doPause();
    return;
  }

  // 否则等待下一段文字进入完全显示阶段
  const nextStart =
    SLOGAN_HOLD_RANGES.map(([start]) => start)
      .filter((start) => start > cycleTime)
      .sort((a, b) => a - b)[0] ?? SLOGAN_CYCLE_MS + SLOGAN_HOLD_RANGES[0][0];
  const waitMs = nextStart - cycleTime;

  pauseTimerId = window.setTimeout(() => {
    doPause();
    pauseTimerId = null;
  }, waitMs);
}

function resumeSloganCarousel() {
  if (pauseTimerId != null) {
    clearTimeout(pauseTimerId);
    pauseTimerId = null;
  }
  getSloganAnimations().forEach((anim) => {
    if (anim.playState === 'paused') anim.play();
  });
}

/* ⏳ 页面时间线导航 */
interface TimelineItem {
  selector: string;
  label: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    selector: '.team-brand-section',
    label: '品牌信息',
    description: '了解 RouxZhee 的品牌由来、含义与核心理念',
  },
  {
    selector: '.team-bottom-section',
    label: '投喂团队',
    description: '认识团队成员，选择金额投喂支持项目持续发展',
  },
  {
    selector: '.team-themes-section',
    label: 'RouxZhee 主题',
    description: '探索官方主题方案，为站点选择最佳视觉风格',
  },
  {
    selector: '.team-plugins-section',
    label: 'RouxZhee 插件',
    description: '按需安装功能插件，扩展站点的业务能力',
  },
];

const activeIndex = ref(0);
const hoveredIndex = ref<number | null>(null);
let timelineSections: HTMLElement[] = [];
let timelineScrollListener: (() => void) | null = null;

function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateTimelineActiveIndex() {
  if (!timelineSections.length) return;
  const scrollY = window.scrollY + window.innerHeight / 3;
  let current = 0;
  for (let i = timelineSections.length - 1; i >= 0; i--) {
    const section = timelineSections[i];
    if (section && section.offsetTop <= scrollY) {
      current = i;
      break;
    }
  }
  activeIndex.value = current;
}

function initTimeline() {
  if (typeof window === 'undefined') return;
  timelineSections = timelineItems
    .map((item) => document.querySelector(item.selector))
    .filter(Boolean) as HTMLElement[];
  updateTimelineActiveIndex();
  timelineScrollListener = () => updateTimelineActiveIndex();
  window.addEventListener('scroll', timelineScrollListener, { passive: true });
}

function destroyTimeline() {
  if (timelineScrollListener) {
    window.removeEventListener('scroll', timelineScrollListener);
    timelineScrollListener = null;
  }
  timelineSections = [];
}

/* 🎴 卡片 3D 跟随鼠标倾斜效果 */
const TILT_MAX_ANGLE = 10;
const TILT_CARDS_SELECTOR = '.team-page .card-with-decoration, .team-page .sponsor-amount-card, .team-page .brand-logo-wrapper';

function handleTiltMove(event: MouseEvent) {
  const card = event.currentTarget as HTMLElement;
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -TILT_MAX_ANGLE;
  const rotateY = ((x - centerX) / centerX) * TILT_MAX_ANGLE;
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

let tiltCards: HTMLElement[] = [];
function initTiltEffect() {
  if (typeof window === 'undefined') return;
  tiltCards = Array.from(document.querySelectorAll(TILT_CARDS_SELECTOR)) as HTMLElement[];
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', handleTiltMove);
    card.addEventListener('mouseleave', handleTiltLeave);
  });
}

function destroyTiltEffect() {
  tiltCards.forEach((card) => {
    card.removeEventListener('mousemove', handleTiltMove);
    card.removeEventListener('mouseleave', handleTiltLeave);
    card.classList.remove('is-tilted');
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
  tiltCards = [];
}

onMounted(() => {
  initTiltEffect();
  initTimeline();
});

onUnmounted(() => {
  if (pauseTimerId != null) {
    clearTimeout(pauseTimerId);
  }
  destroyTiltEffect();
  destroyTimeline();
});
</script>

<style scoped lang="scss">
@use '../styles/team-page.scss' as *;
</style>
