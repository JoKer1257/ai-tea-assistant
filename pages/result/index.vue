<template>
  <scroll-view scroll-y class="result-page">

    <!-- Header -->
    <view class="result-header">
      <view
        class="header-back"
        :style="{ opacity: isLoading ? 0 : 1 }"
        @tap="isLoading ? null : goBack()"
      >
        <text class="back-arrow">‹</text>
      </view>
      <text class="header-title">品鉴纪要</text>
      <view style="width:44px;"></view>
    </view>

    <!-- Loading State -->
    <view v-if="isLoading" class="loading-wrap">
      <view class="loading-ring"></view>
      <text class="loading-text">正在研判您的专属茶韵...</text>
    </view>

    <!-- Result Content -->
    <view v-else class="result-content">

      <!-- Identity Portrait -->
      <view class="identity-section">
        <view class="identity-line"></view>
        <text class="user-type font-serif">{{ resultData.userType }}</text>
        <view class="accent-separator"></view>
        <text class="user-desc">{{ resultData.description }}</text>
      </view>

      <!-- Product Pairings -->
      <view class="pairings-section">
        <text class="pairings-title">— 甄选佳茗 —</text>

        <view
          v-for="(sku, idx) in displaySkus"
          :key="idx"
          class="pairing-item"
        >
          <image :src="sku.coverUrl" class="pairing-img" mode="aspectFill" />
          <view class="pairing-info">
            <view class="pairing-name-row">
              <text v-if="idx === 0" class="badge-best">绝配</text>
              <text class="pairing-name font-serif">{{ sku.name }}</text>
            </view>
            <text class="pairing-desc">
              {{ idx === 0 ? '契合度极高。茶汤透亮，入口柔滑，正合您的心意。' : '另出机杼。不妨一试另一重天地的妙处。' }}
            </text>
          </view>
        </view>
      </view>

      <!-- Bottom Spacer for fixed footer -->
      <view style="height:120px;"></view>
    </view>

    <!-- Fixed Bottom Actions -->
    <view v-if="!isLoading" class="result-footer">
      <view class="footer-btn primary-btn" @tap="goToLottery">
        <text class="btn-text font-serif">领取典藏体验券</text>
      </view>
      <text class="footer-link">前往线上茶铺</text>
    </view>

  </scroll-view>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { goTo } from '@/utils/navigation'

const brandStore = useBrandStore()
const brandId = ref('1')
const record = ref(null)
const isLoading = ref(true)

const resultData = computed(() => {
  const rating = Number(record.value?.rating || 0)
  const userType = rating >= 4.8 ? '山岚知音' : '茶席雅客'

  return {
    userType,
    description: record.value?.notes || `${brandStore.brand.name || '雅鉴'}为您甄选了更契合当下心境的茶款，宜缓饮、宜静品，也宜在回甘里慢慢体会这份茶韵。`
  }
})

const displaySkus = computed(() => {
  if (brandStore.skus.length > 0) {
    return brandStore.skus.slice(0, 2)
  }

  return [
    { id: 1, name: '武夷大红袍', coverUrl: '/static/images/tea_dahongpao.png' },
    { id: 2, name: '极品白毫银针', coverUrl: '/static/images/tea_silver_needle.png' }
  ]
})

onMounted(async () => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.options || {}
    
    brandId.value = options.brandId || brandStore.brandId || '1'
    
    if (!brandStore.isLoaded) {
      await brandStore.loadBrand(brandId.value)
    }
    
    record.value = {
      id: 'T20240310001',
      date: new Date().toLocaleDateString(),
      tea: brandStore.currentSku?.name || '武夷大红袍',
      rating: 4.8,
      notes: '岩韵明显，回甘持久，茶汤橙黄透亮。第一泡香气突出，第二泡岩韵更佳，第三泡依然保持良好口感。'
    }
  } finally {
    isLoading.value = false
  }
})

const goBack = () => goTo.back()
const goToLottery = () => goTo.lottery(brandId.value)
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #F2EFE9;
}
.result-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(12px + var(--status-bar-height, 0px));
}
.header-back {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-arrow {
  font-size: 28px;
  color: #1C1917;
}
.header-title {
  font-size: 12px;
  letter-spacing: 0.3em;
  color: #78716C;
}
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
}
.loading-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid rgba(202,138,4,0.2);
  border-top-color: #CA8A04;
  animation: spin 3s linear infinite;
  margin-bottom: 32px;
}
.loading-text {
  font-size: 16px;
  letter-spacing: 0.2em;
  color: #78716C;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.result-content {
  padding: 0 32px;
}
.identity-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}
.identity-line {
  width: 1px;
  height: 64px;
  background: linear-gradient(to bottom, transparent, var(--theme-accent, #CA8A04));
  margin-bottom: 24px;
  opacity: 0.6;
}
.user-type {
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--theme-primary, #1C1917);
  margin-bottom: 24px;
}
.accent-separator {
  width: 32px;
  height: 1px;
  background: var(--theme-accent, #CA8A04);
  margin-bottom: 24px;
  opacity: 0.6;
}
.user-desc {
  font-size: 14px;
  line-height: 2.4;
  color: rgba(12,10,9,0.9);
  text-align: justify;
  letter-spacing: 0.05em;
}
.pairings-section {
  width: 100%;
}
.pairings-title {
  font-size: 14px;
  letter-spacing: 0.2em;
  color: #78716C;
  display: block;
  text-align: center;
  margin-bottom: 24px;
}
.pairing-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-bottom: 1rpx solid rgba(12,10,9,0.1);
  margin-bottom: 0;
}
.pairing-img {
  width: 80px;
  height: 100px;
  flex-shrink: 0;
}
.pairing-info {
  flex: 1;
  padding: 4px 0 4px 20px;
}
.pairing-name-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.badge-best {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--theme-accent, #CA8A04);
  border: 1rpx solid var(--theme-accent, #CA8A04);
  padding: 2px 6px;
}
.pairing-name {
  font-size: 18px;
  font-weight: 500;
  color: #0C0A09;
}
.pairing-desc {
  font-size: 12px;
  line-height: 1.8;
  color: #78716C;
}
.result-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 32px 32px;
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
  background: linear-gradient(to bottom, transparent, #F2EFE9 40%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.footer-btn {
  width: 100%;
  max-width: 320px;
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.primary-btn {
  background: var(--theme-primary, #1C1917);
}
.btn-text {
  color: #F2EFE9;
  font-size: 14px;
  letter-spacing: 0.2em;
}
.footer-link {
  font-size: 13px;
  letter-spacing: 0.2em;
  color: rgba(120,113,108,0.6);
}
</style>
