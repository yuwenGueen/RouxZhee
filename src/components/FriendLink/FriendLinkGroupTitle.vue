<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🔗 友链分组装饰标题组件
-->

<template>
  <section class="friend-link-group-title">
    <section class="title-inner">
      <!-- 左上角装饰 -->
      <section class="corner corner-top-left">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.7 19.7" width="18" height="18">
          <path
            d="M6,6V18.7H1V1H18.7V6Z"
            fill="var(--bg-color)"
            stroke="rgba(112,183,189,0.6)"
            stroke-width="2px"
          />
        </svg>
      </section>

      <section class="title-box">
        <section class="title-text">
          <strong>{{ title }}</strong>
        </section>
      </section>

      <section class="title-divider"></section>

      <section v-if="subtitle" class="title-subtitle">
        <span>{{ subtitle }}</span>
      </section>

      <!-- 右下角装饰：对齐整个标题块（含副标题）的右下角 -->
      <section class="corner corner-bottom-right">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.7 19.7" width="18" height="18">
          <path
            d="M13.74,13.74V1h5V18.7H1v-5Z"
            fill="var(--bg-color)"
            stroke="rgba(112,183,189,0.6)"
            stroke-width="2px"
          />
        </svg>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
interface Props {
  /** 分组主标题 */
  title: string;
  /** 分组副标题（英文/小字） */
  subtitle?: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.friend-link-group-title {
  margin: 10px auto;
  text-align: center;
}

.title-inner {
  position: relative;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  padding: 18px 24px;
}

.title-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.corner {
  width: 18px;
  height: 18px;
  position: absolute;
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 18px;
    max-height: 18px;
  }
}

.corner-top-left {
  top: 0;
  left: 0;
  transform: translate(-55%, -45%);
}

.corner-bottom-right {
  bottom: 0;
  right: 0;
  transform: translate(55%, 45%);
}

.title-text {
  font-size: 20px;
  color: var(--text-color);
  text-align: center;
  padding: 0 24px;
  text-shadow:
    rgba(112, 183, 189, 0.5) 0 0.063em 0,
    rgba(112, 183, 189, 0.5) 0.063em 0 0,
    rgba(112, 183, 189, 0.5) 0.063em 0.063em 0;

  strong {
    font-weight: 600;
  }
}

.title-divider {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed rgba(112, 183, 189, 0.5);
  margin: 5px 0;
}

.title-subtitle {
  font-size: 13px;
  color: rgba(112, 183, 189, 0.75);
  text-align: center;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .title-inner {
    padding: 14px 18px;
  }

  .corner {
    width: 14px;
    height: 14px;

    svg {
      max-width: 14px;
      max-height: 14px;
    }
  }

  .title-text {
    font-size: 17px;
    padding: 0 18px;
  }

  .title-subtitle {
    font-size: 11px;
  }
}
</style>
