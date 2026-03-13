<template>
  <view class="page active relative overflow-hidden bg-paper" id="landing-page">
    <!-- Landing Overlay (Vignette) -->
    <view class="landing-overlay"></view>

    <!-- Cloud Layer -->
    <view class="cloud-container" :class="{ 'clouds-parted': isParted }">
      <view class="cloud-panel cloud-left"></view>
      <view class="cloud-panel cloud-right"></view>
      <view class="cloud-mist"></view>
    </view>

    <!-- Top Branding -->
    <view
      class="fixed-top flex-row justify-between items-start"
      :style="{ opacity: isParted && !isTransitioning ? 0 : 1, transition: 'opacity 0.7s' }"
    >
      <view class="flex-col gap-1">
        <view class="brand-badge">
          <text class="brand-badge-text">山水</text>
        </view>
        <text class="brand-sub">SHAN SHUI TEA</text>
      </view>
      <view class="brand-date">
        <text class="date-text">丙午年 · 春季</text>
        <view class="date-line"></view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="hero-content">
      <!-- Background Vertical Text -->
      <text class="hero-bg-text font-serif">品茗</text>

      <!-- Main Title (Vertical) -->
      <view class="title-wrap fade-in-blur" style="animation-delay:0.3s">
        <view class="title-row">
          <text class="title-main font-serif vertical-text">
            浮生半日<text class="title-accent">闲</text>
          </text>
          <text class="title-sub vertical-text">静听群山草木心</text>
        </view>
      </view>

      <!-- Center Image Card -->
      <view class="img-card-wrap fade-in-blur" style="animation-delay:0.6s">
        <view class="img-card">
          <view class="img-outer-border"></view>
          <view class="img-inner">
            <image
              src="@/static/images/tea_longjing.png"
              class="img-content"
              mode="aspectFill"
              @error="handleImageError"
            />
            <view class="img-caption">
              <text class="caption-line">产地：云雾深处</text>
              <text class="caption-line">经纬：29.12N / 110.45E</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Enter Button -->
      <view class="enter-btn-wrap fade-in-blur" style="animation-delay:0.9s">
        <button class="enter-btn btn-reset" @tap="handleEnter">
          <text class="enter-btn-text">入席</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { handleImageError } from '@/utils/imageHelper'
import { goTo } from '@/utils/navigation'

const isParted = ref(false)
const isTransitioning = ref(false)

const handleEnter = () => {
  isParted.value = true
  isTransitioning.value = true

  setTimeout(() => {
    goTo.brand('1')
  }, 2000)
}
</script>

<style scoped>
#landing-page {
  background: linear-gradient(135deg, #F2EFE9 0%, #E8E2D5 100%);
  background-size: cover;
  background-position: center;
}
.page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.landing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 60%, rgba(36, 57, 42, 0.2) 100%);
  z-index: 10;
  pointer-events: none;
}
.cloud-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  pointer-events: none;
  overflow: hidden;
}

.cloud-panel {
  position: absolute;
  top: -10%;
  height: 120%;
  width: 62%;
  opacity: 0.78;
  transition: transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.8s ease;
}
.cloud-left {
  left: -12%;
  background:
    radial-gradient(70% 48% at 68% 50%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.38) 60%, rgba(255, 255, 255, 0) 100%),
    linear-gradient(90deg, rgba(242, 239, 233, 0.72), rgba(242, 239, 233, 0.15));
}
.cloud-right {
  right: -12%;
  background:
    radial-gradient(70% 48% at 32% 50%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.38) 60%, rgba(255, 255, 255, 0) 100%),
    linear-gradient(270deg, rgba(242, 239, 233, 0.72), rgba(242, 239, 233, 0.15));
}
.cloud-mist {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 46%, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.08) 52%, rgba(255, 255, 255, 0) 80%),
    linear-gradient(180deg, rgba(242, 239, 233, 0.18) 0%, rgba(242, 239, 233, 0.05) 100%);
  opacity: 1;
  transition: opacity 1.4s ease;
}
.clouds-parted .cloud-left {
  transform: translateX(-125%);
  opacity: 0.12;
}
.clouds-parted .cloud-right {
  transform: translateX(125%);
  opacity: 0.12;
}
.clouds-parted .cloud-mist {
  opacity: 0;
}
.clouds-parted {
  transition: opacity 1.2s ease 0.35s;
  opacity: 0;
}
.cloud-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 52%, rgba(255, 255, 255, 0) 42%, rgba(36, 57, 42, 0.06) 100%);
  opacity: 0.85;
  transition: opacity 1.2s ease;
}
.clouds-parted::after {
  opacity: 0;
}
.fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  padding: 24px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
}
.brand-badge {
  border: 2px solid var(--theme-accent, #CA8A04);
  padding: 2px 4px;
  display: inline-block;
}
.brand-badge-text {
  color: var(--theme-accent, #CA8A04);
  font-weight: bold;
  font-size: 16px;
}
.brand-sub {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: #6B7280;
  text-transform: uppercase;
  margin-top: 4px;
  display: block;
}
.brand-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: var(--theme-primary, #1C1917);
}
.date-text {
  font-size: 12px;
  letter-spacing: -0.05em;
}
.date-line {
  width: 40px;
  height: 1px;
  background: var(--theme-primary, #1C1917);
  margin-top: 4px;
  opacity: 0.4;
}
.hero-content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  position: relative;
  z-index: 20;
}
.hero-bg-text {
  position: absolute;
  right: -15%;
  top: 25%;
  font-size: 25vh;
  color: rgba(28,25,23,0.05);
  pointer-events: none;
  writing-mode: vertical-rl;
  user-select: none;
}
.title-wrap {
  z-index: 20;
}
.title-row {
  display: flex;
  flex-direction: row-reverse;
  gap: 24px;
  align-items: flex-start;
}
.title-main {
  font-size: 30px;
  writing-mode: vertical-rl;
  padding: 12px;
  border-right: 1rpx solid rgba(202,138,4,0.2);
  color: var(--theme-primary, #1C1917);
}
.title-accent {
  background: linear-gradient(180deg, var(--theme-accent, #CA8A04), #a06010);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title-sub {
  font-size: 12px;
  font-weight: 300;
  color: #6B7280;
  writing-mode: vertical-rl;
  letter-spacing: 0.8em;
  padding-top: 64px;
}
.img-card-wrap {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
.img-card {
  width: 180px;
  height: 220px;
  position: relative;
}
.img-outer-border {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 1rpx solid rgba(28,25,23,0.1);
}
.img-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  background: #fff;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
}
.img-content {
  width: 100%;
  height: 100%;
}
.img-caption {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 9px;
  color: #fff;
  background: rgba(28,25,23,0.8);
  padding: 8px;
  backdrop-filter: blur(4px);
}
.caption-line {
  display: block;
}
.caption-line:first-child {
  border-bottom: 1rpx solid rgba(255,255,255,0.2);
  padding-bottom: 4px;
  margin-bottom: 4px;
}
.enter-btn-wrap {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}
.enter-btn {
  position: relative;
  padding: 12px 40px;
  border: 1rpx solid var(--theme-primary, #1C1917);
  overflow: hidden;
  background: transparent;
}
.btn-reset {
  border-radius: 0;
  line-height: inherit;
}
.btn-reset::after {
  border: none;
}
.enter-btn-text {
  position: relative;
  z-index: 10;
  color: var(--theme-primary, #1C1917);
  letter-spacing: 1em;
  font-size: 14px;
}
.vertical-text {
  writing-mode: vertical-rl;
}
.fade-in-blur {
  animation: fadeInBlur 1.8s ease-out forwards;
  opacity: 0;
}
@keyframes fadeInBlur {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
