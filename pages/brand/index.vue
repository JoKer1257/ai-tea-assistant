<template>
  <view class="page bg-paper" id="tab-home">
    <!-- Navigation Bar -->
    <view class="sticky-nav nav-blur px-4 py-4 flex-row justify-between items-center border-b-line">
      <view class="flex-row items-baseline gap-2">
        <text class="font-serif font-bold text-base">{{ brandStore.brand.name || '时令' }}</text>
        <text class="text-xs text-gray-400 tracking-widest">Seasonal</text>
      </view>
      <view class="flex-row gap-4">
        <text class="iconfont text-gray-600 text-lg">🔍</text>
      </view>
    </view>

    <!-- Scrollable Content -->
    <scroll-view scroll-y class="page-scroll">
      <!-- Featured Banner -->
      <view class="px-4 py-4">
        <view class="banner-wrap rounded-sm overflow-hidden">
          <image
            src="@/static/images/tea_garden_banner.png"
            class="banner-img"
            mode="aspectFill"
            @error="handleImageError"
          />
          <view class="banner-overlay"></view>
          <view class="banner-content items-center justify-center">
            <view class="w-px h-8 bg-white mb-3" style="width:1px;height:32px;background:#fff;margin-bottom:12px;opacity:0.8"></view>
            <text class="text-xl font-serif" style="color:#fff;letter-spacing:0.4em;">{{ heroTitle }}</text>
            <text class="text-xs" style="color:rgba(255,255,255,0.8);letter-spacing:0.2em;margin-top:4px;">跨越千里的春之礼赞</text>
          </view>
        </view>
      </view>

      <!-- SKU List -->
      <view class="px-4 pb-24">
        <view
          v-for="(sku, idx) in displaySkus"
          :key="sku.id"
          class="sku-row"
          :class="{ 'sku-row-reverse': idx % 2 !== 0 }"
          @tap="goToProduct(sku.id)"
          style="margin-bottom:48px;"
        >
          <view class="sku-img-wrap">
            <image :src="sku.coverUrl" class="sku-img" mode="aspectFill" />
            <text
              class="sku-index font-serif"
              :style="idx % 2 !== 0 ? 'right:8px;' : 'left:8px;'"
            >{{ ['壹', '贰', '叁', '肆'][idx] || (idx + 1) }}</text>
          </view>
          <view class="sku-info" :style="idx % 2 !== 0 ? 'text-align:right;' : ''">
            <text class="font-serif text-lg block mb-1">{{ sku.name }}</text>
            <text class="text-xs text-gray-400 leading-relaxed block mb-3" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
              {{ sku.aiDescription || '一叶知秋，雅遇茶缘。' }}
            </text>
            <text class="font-serif text-base" style="color:var(--theme-accent)">
              ¥ {{ sku.price || '860' }}
              <text class="text-xs text-gray-400" style="font-family:sans-serif;"> / 礼献</text>
            </text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Bottom Tab Bar -->
    <view class="bottom-tab nav-blur border-t-line">
      <view class="tab-item active-tab" @tap="() => {}">
        <text class="tab-icon">🍵</text>
        <text class="tab-label font-serif" style="color:var(--theme-primary)">寻茶</text>
      </view>
      <view class="tab-item" @tap="goToAi">
        <text class="tab-icon" style="opacity:0.4">📜</text>
        <text class="tab-label font-serif text-gray-400" style="opacity:0.4">茶经</text>
      </view>
      <view class="tab-item" @tap="goToLottery">
        <text class="tab-icon" style="opacity:0.4">🧧</text>
        <text class="tab-label font-serif text-gray-400" style="opacity:0.4">福礼</text>
      </view>
      <view class="tab-item" @tap="goToUser">
        <text class="tab-icon" style="opacity:0.4">👤</text>
        <text class="tab-label font-serif text-gray-400" style="opacity:0.4">自省</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { handleImageError } from '@/utils/imageHelper'
import { goTo } from '@/utils/navigation'

const brandStore = useBrandStore()

// 从全局 options 中获取 brandId
const brandId = computed(() => brandStore.brandId || '1')

const heroTitle = computed(() => {
  const sku = brandStore.currentSku
  return sku ? sku.name : '明前·龙井'
})

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage?.options?.id || currentPage?.$page?.fullPath?.match(/id=(\w+)/)?.[1]
  if (id && !brandStore.isLoaded) {
    await brandStore.loadBrand(id)
  }

  if (currentPage?.options?.sku) {
    brandStore.setCurrentSku(currentPage.options.sku)
  }
})

const displaySkus = computed(() => {
  if (brandStore.skus.length > 0) return brandStore.skus
  return [
    { id: 1, name: '武夷大红袍', coverUrl: '/static/images/tea_dahongpao.png', price: '1280', aiDescription: '武夷岩茶之冠，岩骨花香，醇厚回甘。' },
    { id: 2, name: '极品白毫银针', coverUrl: '/static/images/tea_silver_needle.png', price: '860', aiDescription: '清雅芬芳，毫香浓郁，色白如银。' }
  ]
})

const goToProduct = (skuId) => goTo.product(brandId.value, skuId)
const goToAi = () => goTo.chat(brandId.value)
const goToLottery = () => goTo.lottery(brandId.value)
const goToUser = () => goTo.user()
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  background-color: #F2EFE9;
}
.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: rgba(242,239,233,0.9);
  padding: 16px;
  border-bottom: 1rpx solid rgba(28,25,23,0.05);
}
.border-t-line {
  border-top: 1rpx solid rgba(28,25,23,0.05);
}
.border-b-line {
  border-bottom: 1rpx solid rgba(28,25,23,0.05);
}
.page-scroll {
  height: calc(100vh - 56px - 56px);
  box-sizing: border-box;
}
.banner-wrap {
  position: relative;
  height: 160px;
  overflow: hidden;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
}
.banner-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.sku-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.sku-row-reverse {
  flex-direction: row-reverse;
}
.sku-img-wrap {
  width: 50%;
  position: relative;
  background: #fff;
  padding: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.sku-img {
  width: 100%;
  height: 200rpx;
}
.sku-index {
  position: absolute;
  top: 8px;
  font-size: 10px;
  color: var(--theme-accent, #CA8A04);
  font-style: italic;
}
.sku-info {
  width: 50%;
  padding: 0 4px;
}
.bottom-tab {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background: rgba(242,239,233,0.9);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 50;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}
.tab-icon {
  font-size: 18px;
  line-height: 1;
}
.tab-label {
  font-size: 10px;
  letter-spacing: -0.05em;
}
.active-tab .tab-label {
  color: var(--theme-primary, #1C1917);
}
</style>
