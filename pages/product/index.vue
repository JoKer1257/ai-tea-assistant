<template>
  <view class="product-page">

    <!-- Hero Image -->
    <view class="hero-wrap">
      <image
        :src="sku?.coverUrl || 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=600'"
        class="hero-img"
        mode="aspectFill"
      />
      <view class="hero-gradient"></view>

      <!-- Back Button -->
      <view class="hero-back" @tap="goBack">
        <text class="back-arrow-circle">‹</text>
      </view>
    </view>

    <!-- Product Info -->
    <view class="product-info">
      <!-- Bg scroll text -->
      <text class="bg-text font-serif vertical-text">{{ bgText }}</text>

      <!-- Identity -->
      <view class="identity-section">
        <view class="category-row">
          <view class="category-line"></view>
          <text class="category-label font-serif">{{ categoryLabel }}</text>
        </view>
        <text class="product-name font-serif">{{ sku?.name || '凝霭 · 高山云雾' }}</text>
        <text class="product-origin">{{ sku?.origin || '武夷山' }} · 核心小产区</text>
      </view>

      <!-- Flavor Tags -->
      <scroll-view scroll-x class="tags-scroll" :show-scrollbar="false">
        <view class="tags-row">
          <view v-for="tag in (sku?.flavorTags || ['清幽', '回甘', '花香'])" :key="tag" class="flavor-tag">
            <text class="flavor-tag-text font-serif">{{ tag }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- Tabs -->
      <view class="tabs-row">
        <view
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="tab-item"
          @tap="activeTab = idx"
        >
          <text class="tab-text font-serif" :style="activeTab === idx ? 'color:var(--theme-primary,#1C1917);font-weight:bold;' : 'color:rgba(120,113,108,0.4);'">{{ tab }}</text>
          <view v-if="activeTab === idx" class="tab-active-line"></view>
        </view>
      </view>
      <view class="tab-border"></view>

      <!-- Tab Content -->
      <view class="tab-content">
        <!-- 品鉴 -->
        <view v-if="activeTab === 0">
          <text class="desc-text">{{ sku?.aiDescription || '此道佳茗，经由资深茶师监制，十二道手工工序层层历练，方得其岩骨花香之灵魂。' }}</text>
        </view>

        <!-- 溯源 -->
        <view v-else-if="activeTab === 1">
          <view
            v-for="item in traceItems"
            :key="item.l"
            class="trace-item"
          >
            <text class="trace-label font-serif">{{ item.l }}</text>
            <text class="trace-value">{{ item.v }}</text>
          </view>
        </view>

        <!-- 冲泡 -->
        <view v-else class="brew-grid">
          <view v-for="item in brewGuide" :key="item.label" class="brew-item">
            <text class="brew-icon">{{ item.emoji }}</text>
            <text class="brew-label">{{ item.label }}</text>
            <text class="brew-value font-serif">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <view style="height:100px;"></view>
    </view>

    <!-- Bottom Action -->
    <view class="product-footer">
      <view class="footer-btn outline-btn" @tap="goToAi">
        <text class="btn-text font-serif">书房咨询</text>
      </view>
      <view class="footer-btn primary-btn" @tap="() => uni.showToast({ title: '敬请期待', icon: 'none' })">
        <text class="btn-text-light font-serif">结缘此茶</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { goTo } from '@/utils/navigation'

const brandStore = useBrandStore()
const brandId = ref('1')
const skuId = ref(null)

const sku = computed(() => brandStore.currentSku)

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  
  brandId.value = options.brandId || brandStore.brandId || '1'
  skuId.value = options.skuId
  
  if (!brandStore.isLoaded) {
    await brandStore.loadBrand(brandId.value)
  }
  
  if (skuId.value) {
    brandStore.setCurrentSku(skuId.value)
  }
})

const goBack = () => goTo.back()
const goToAi = () => goTo.chat(brandId.value)

const tabs = ['品鉴', '溯源', '冲泡']
const activeTab = ref(0)

const bgText = computed(() => sku.value?.name?.split('·')[1]?.trim() || '灵感')

const categoryMap = {
  green: '绿茶', black: '红茶', white: '白茶',
  dark: '黑茶', oolong: '乌龙茶', puer: '普洱',
  yellow: '黄茶', flower: '花茶'
}
const categoryLabel = computed(() => sku.value ? (categoryMap[sku.value.category] || sku.value.category || '乌龙茶') : '乌龙茶')

const traceItems = computed(() => {
  const ti = sku.value?.traceInfo || {}
  return [
    { l: '产地', v: sku.value?.origin || '武夷核心产区' },
    { l: '批号', v: ti.batch_no || '—' },
    { l: '茶园', v: ti.farm_name || '直属标准茶园' }
  ]
})

const brewGuide = computed(() => {
  const bp = sku.value?.brewParams || {}
  return [
    { label: '水温', value: bp.water_temp ? `${bp.water_temp}°C` : '90-95°C', emoji: '🌡' },
    { label: '时间', value: bp.time_sec ? `${bp.time_sec}秒` : '45秒', emoji: '⏱' },
    { label: '茶水比', value: bp.ratio || '1:15', emoji: '⚖' }
  ]
})
</script>

<style scoped>
.product-page {
  min-height: 100vh;
  background: #F2EFE9;
}
.hero-wrap {
  position: relative;
  width: 100%;
  height: 58vh;
  overflow: hidden;
}
.hero-img {
  width: 100%;
  height: 100%;
}
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--theme-bg, #F2EFE9), transparent 50%, rgba(28,25,23,0.1) 100%);
}
.hero-back {
  position: absolute;
  top: calc(16px + var(--status-bar-height, 0px));
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0,0,0,0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-arrow-circle {
  font-size: 24px;
  color: rgba(255,255,255,0.9);
  line-height: 1;
}
.product-info {
  position: relative;
  padding: 0 32px;
  margin-top: -24px;
}
.bg-text {
  position: absolute;
  right: -5%;
  top: 40px;
  font-size: 10vh;
  color: rgba(28,25,23,0.05);
  pointer-events: none;
  user-select: none;
  writing-mode: vertical-rl;
}
.vertical-text {
  writing-mode: vertical-rl;
}
.identity-section {
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}
.category-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.category-line {
  width: 32px;
  height: 1px;
  background: var(--theme-accent, #CA8A04);
  opacity: 0.4;
}
.category-label {
  font-size: 11px;
  letter-spacing: 0.4em;
  color: var(--theme-accent, #CA8A04);
}
.product-name {
  font-size: 32px;
  font-weight: 500;
  color: var(--theme-primary, #1C1917);
  line-height: 1.2;
  display: block;
  margin-bottom: 12px;
}
.product-origin {
  font-size: 13px;
  letter-spacing: 0.15em;
  color: #78716C;
}
.tags-scroll {
  white-space: nowrap;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}
.tags-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.flavor-tag {
  flex-shrink: 0;
  padding: 6px 16px;
  border: 1rpx solid rgba(28,25,23,0.1);
  background: rgba(255,255,255,0.4);
}
.flavor-tag-text {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--theme-primary, #1C1917);
}
.tabs-row {
  display: flex;
  flex-direction: row;
  gap: 40px;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}
.tab-item {
  position: relative;
  padding-bottom: 8px;
}
.tab-text {
  font-size: 15px;
  letter-spacing: 0.1em;
}
.tab-active-line {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--theme-accent, #CA8A04);
  opacity: 0.6;
}
.tab-border {
  height: 1rpx;
  background: rgba(28,25,23,0.05);
  margin-bottom: 24px;
}
.tab-content {
  min-height: 200px;
  position: relative;
  z-index: 1;
}
.desc-text {
  font-size: 15px;
  line-height: 2.4;
  color: rgba(12,10,9,0.8);
  text-align: justify;
  letter-spacing: 0.05em;
  display: block;
}
.trace-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1rpx dashed rgba(28,25,23,0.1);
}
.trace-label {
  font-size: 12px;
  color: #78716C;
}
.trace-value {
  font-size: 14px;
  color: var(--theme-primary, #1C1917);
  letter-spacing: 0.1em;
}
.brew-grid {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.brew-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(255,255,255,0.3);
  border: 1rpx solid rgba(28,25,23,0.05);
}
.brew-icon {
  font-size: 20px;
  margin-bottom: 8px;
  opacity: 0.7;
}
.brew-label {
  font-size: 10px;
  color: #78716C;
  margin-bottom: 4px;
}
.brew-value {
  font-size: 13px;
  color: var(--theme-primary, #1C1917);
}
.product-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: rgba(242,239,233,0.9);
  backdrop-filter: blur(12px);
  border-top: 1rpx solid rgba(28,25,23,0.05);
  z-index: 40;
}
.footer-btn {
  flex: 1;
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.outline-btn {
  border: 1rpx solid var(--theme-primary, #1C1917);
  background: transparent;
}
.primary-btn {
  background: var(--theme-primary, #1C1917);
}
.btn-text {
  font-size: 14px;
  letter-spacing: 0.2em;
  color: var(--theme-primary, #1C1917);
}
.btn-text-light {
  font-size: 14px;
  letter-spacing: 0.2em;
  color: #F2EFE9;
}
</style>
