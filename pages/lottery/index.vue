<template>
  <view class="lottery-page">

    <!-- Nav Bar -->
    <view class="lottery-nav">
      <view
        class="nav-back"
        :style="{ opacity: hasDrawn ? 0 : 1 }"
        @tap="hasDrawn ? null : goBack()"
      >
        <text class="back-arrow">‹</text>
      </view>
      <text class="nav-title font-serif">佳茗结缘</text>
      <view style="width:44px;"></view>
    </view>

    <!-- Title Section -->
    <view class="title-section">
      <view class="accent-line"></view>
      <text class="main-title font-serif">求其上上签</text>
      <text class="sub-title">{{ activityInfo?.description || '心有林泉，机缘自现。翻启一枚盲盒，试问今日茶缘。' }}</text>

      <!-- Chances Dots -->
      <view v-if="chancesLeft !== null" class="chances-wrap">
        <view
          v-for="i in maxChances"
          :key="i"
          class="chance-dot"
          :style="i <= chancesLeft ? 'background:var(--theme-accent,#CA8A04);' : 'background:transparent;'"
        ></view>
        <text class="chances-text font-serif">今日余 {{ chancesLeft }} 缘</text>
      </view>
    </view>

    <!-- Fortune Grid -->
    <view class="grid-wrap">
      <view class="fortune-grid">
        <view
          v-for="(_, i) in 9"
          :key="i"
          class="fortune-tile"
          :class="{ 'tile-disabled': hasDrawn || isDrawing }"
          @tap="drawFortune(i)"
          @click="drawFortune(i)"
        >
          <view class="tile-inner" :class="{ 'is-flipped': flippedIndex === i || (revealAll && i !== flippedIndex) }">
            <!-- Front -->
            <view class="tile-front">
              <view v-if="!isStarted" class="tile-diamond"></view>
            </view>
            <!-- Back -->
            <view
              class="tile-back"
              :style="i === flippedIndex
                ? 'background:var(--theme-primary,#1C1917);border-color:rgba(202,138,4,0.5);'
                : 'background:rgba(28,25,23,0.2);opacity:0.4;filter:grayscale(1);'"
            >
              <text
                class="tile-label font-serif"
                :style="i === flippedIndex ? 'color:var(--theme-accent,#CA8A04);' : 'color:rgba(28,25,23,0.6);'"
              >{{ tileLabels[i] }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Loading -->
      <view v-if="isDrawing" class="drawing-loading">
        <view class="loading-ring"></view>
        <text class="loading-text font-serif">正在卜算茶缘...</text>
      </view>
    </view>

    <!-- Result Panel -->
    <view v-if="hasDrawn" class="result-panel">
      <view v-if="drawResult.isWin" class="result-win">
        <text class="result-prize font-serif">🎉 {{ drawResult.prizeName }}</text>
        <view class="result-btn" @tap="goCoupons" @click="goCoupons">
          <text class="result-btn-text font-serif">呈览福礼</text>
        </view>
      </view>
      <view v-else class="result-lose">
        <text class="result-lose-text font-serif">缘分尚浅，期待来日方长</text>
      </view>
      <text class="back-link font-serif" @tap="goBrand" @click="goBrand">返回寻茶</text>
    </view>

  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { goTo } from '@/utils/navigation'
import { buildApiUrl } from '@/utils/appConfig'
import { buildDrawPayload, normalizeLotteryInfoResponse } from '@/utils/lotteryPayload'

const brandStore = useBrandStore()
const brandId = ref('1')
const scanSn = ref('')
const activityInfo = ref({ id: 1, description: '心有林泉，机缘自现。翻启一枚盲盒，试问今日茶缘。' })
const chancesLeft = ref(1)
const maxChances = ref(1)
const activityId = ref(1)

const hasDrawn = ref(false)
const isDrawing = ref(false)
const isStarted = ref(false)
const flippedIndex = ref(-1)
const revealAll = ref(false)

const drawResult = ref({ isWin: false, prizeName: '', couponCode: '' })

const tileLabels = ref(['上上签', '得佳茗', '半生闲', '遇知音', '茶缘至', '空欢喜', '得佳茗', '遇知音', '半生闲'])

const applyFallbackActivity = () => {
  activityInfo.value = { id: 1, description: '心有林泉，机缘自现。翻启一枚盲盒，试问今日茶缘。' }
  activityId.value = 1
  chancesLeft.value = 1
  maxChances.value = 1
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  brandId.value = currentPage?.options?.brandId || currentPage?.options?.id || brandStore.brandId || '1'
  scanSn.value = currentPage?.options?.sn || ''
  await loadActivity()
})

const loadActivity = async () => {
  uni.request({
    url: buildApiUrl(`/lottery/info/${brandId.value}`),
    method: 'GET',
    timeout: 4000,
    success: (res) => {
      if (res.statusCode === 200 && res.data) {
        const normalized = normalizeLotteryInfoResponse(res.data)

        if (normalized.activityInfo) {
          activityInfo.value = normalized.activityInfo
          activityId.value = normalized.activityId
          chancesLeft.value = normalized.chancesLeft
          maxChances.value = normalized.maxChances
          if (normalized.tileLabels.length > 0) {
            tileLabels.value = Array.from(
              { length: 9 },
              (_, index) => normalized.tileLabels[index % normalized.tileLabels.length]
            )
          }
        } else {
          activityInfo.value = { id: null, description: '当前暂无抽奖活动，请稍后再来。' }
          activityId.value = null
          chancesLeft.value = 0
          maxChances.value = 1
        }
      } else {
        applyFallbackActivity()
      }
    },
    fail: (err) => {
      // 安全的错误处理
      const errorMsg = err?.errMsg || err?.message || 'Unknown error'
      console.warn('Load activity failed:', errorMsg)
      applyFallbackActivity()
    }
  })
}

const drawFortune = (index) => {
  if (hasDrawn.value || isDrawing.value) return
  if (!activityId.value) {
    uni.showToast({ title: '当前暂无抽奖活动', icon: 'none' })
    return
  }
  if (chancesLeft.value !== null && chancesLeft.value <= 0) {
    uni.showToast({ title: '今日茶缘已尽，明日再来', icon: 'none' })
    return
  }

  isStarted.value = true
  flippedIndex.value = index
  isDrawing.value = true

  uni.request({
    url: buildApiUrl('/lottery/draw'),
    method: 'POST',
    timeout: 4000,
    header: { 'Content-Type': 'application/json' },
    data: buildDrawPayload({
      brandId: brandId.value,
      activityId: activityId.value,
      scanSn: scanSn.value || null
    }),
    success: (res) => {
      if (res.statusCode === 200 && res.data) {
        const data = res.data
        drawResult.value = {
          isWin: data.is_win,
          prizeName: data.coupon_code ? data.prize_name || '专属优惠券' : '',
          couponCode: data.coupon_code || ''
        }
      } else {
        mockDraw()
      }
    },
    fail: (err) => {
      // 安全的错误处理
      const errorMsg = err?.errMsg || err?.message || 'Unknown error'
      console.warn('Draw lottery failed:', errorMsg)
      mockDraw()
    },
    complete: () => {
      isDrawing.value = false
      hasDrawn.value = true
      if (chancesLeft.value !== null) {
        chancesLeft.value = Math.max(0, chancesLeft.value - 1)
      }
      setTimeout(() => { revealAll.value = true }, 400)
    }
  })
}

const mockDraw = () => {
  const isWin = Math.random() > 0.4
  drawResult.value = {
    isWin,
    prizeName: isWin ? '【凝霭】尝鲜七折体验券' : '',
    couponCode: isWin ? 'YJ' + Math.random().toString(36).slice(2, 10).toUpperCase() : ''
  }
}

const goCoupons = () => goTo.coupons()
const goBack = () => goTo.back()
const goBrand = () => goBack()
</script>

<style scoped>
.lottery-page {
  min-height: 100vh;
  background: #F2EFE9;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}
.lottery-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(12px + var(--status-bar-height, 0px));
  border-bottom: 1rpx solid rgba(28,25,23,0.05);
  background: rgba(242,239,233,0.9);
}
.nav-back {
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
.nav-title {
  font-size: 14px;
  color: var(--theme-primary, #1C1917);
  letter-spacing: 0.2em;
}
.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 32px 40px;
}
.accent-line {
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, transparent, var(--theme-accent, #CA8A04));
  margin-bottom: 16px;
  opacity: 0.5;
}
.main-title {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--theme-primary, #1C1917);
  margin-bottom: 12px;
}
.sub-title {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #78716C;
  line-height: 1.8;
}
.chances-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
}
.chance-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1rpx solid rgba(202,138,4,0.3);
}
.chances-text {
  font-size: 10px;
  color: #78716C;
  opacity: 0.7;
  margin-left: 4px;
}
.grid-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}
.fortune-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 320px;
}
.fortune-tile {
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
}
.tile-disabled {
  pointer-events: none;
}
.tile-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}
.tile-inner.is-flipped {
  transform: rotateY(180deg);
}
.tile-front, .tile-back {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.tile-front {
  border: 1rpx solid rgba(28,25,23,0.1);
  background: rgba(255,255,255,0.4);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.tile-diamond {
  width: 24px;
  height: 24px;
  border: 1rpx solid rgba(202,138,4,0.3);
  transform: rotate(45deg);
  opacity: 0.4;
}
.tile-back {
  transform: rotateY(180deg);
  border: 1rpx solid transparent;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.tile-label {
  font-size: 13px;
  letter-spacing: 0.2em;
  writing-mode: vertical-rl;
}
.drawing-loading {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.loading-ring {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(202,138,4,0.2);
  border-top-color: #CA8A04;
  animation: spin 1s linear infinite;
}
.loading-text {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #78716C;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.result-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 32px;
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
  background: rgba(242,239,233,0.96);
  backdrop-filter: blur(12px);
  border-top: 1rpx solid rgba(28,25,23,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.result-win {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
}
.result-prize {
  font-size: 18px;
  color: var(--theme-primary, #1C1917);
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}
.result-btn {
  width: 100%;
  background: var(--theme-primary, #1C1917);
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  active-opacity: 0.85;
}
.result-btn-text {
  color: #F2EFE9;
  font-size: 14px;
  letter-spacing: 0.2em;
}
.result-lose {
  margin-bottom: 8px;
}
.result-lose-text {
  font-size: 16px;
  color: #78716C;
}
.back-link {
  margin-top: 24px;
  font-size: 12px;
  color: rgba(120,113,108,0.6);
  letter-spacing: 0.2em;
}
</style>
