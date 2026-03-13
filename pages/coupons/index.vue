<template>
  <view class="coupons-page">

    <!-- Header -->
    <view class="coupons-nav">
      <view class="nav-back" @tap="goBack">
        <text class="back-arrow">‹</text>
      </view>
      <text class="nav-title font-serif">我的票券</text>
      <view style="width:44px;"></view>
    </view>

    <!-- Tabs -->
    <view class="tabs-bar">
      <view class="tab-btn" @tap="activeTab = 'unused'">
        <text class="tab-text font-serif" :style="activeTab === 'unused' ? 'color:var(--theme-primary,#1C1917);' : 'color:rgba(120,113,108,0.5);'">待使用</text>
        <view v-if="activeTab === 'unused'" class="tab-active-dot"></view>
      </view>
      <view class="tab-btn" @tap="activeTab = 'used'">
        <text class="tab-text font-serif" :style="activeTab === 'used' ? 'color:var(--theme-primary,#1C1917);' : 'color:rgba(120,113,108,0.5);'">已核销</text>
        <view v-if="activeTab === 'used'" class="tab-active-dot"></view>
      </view>
    </view>

    <!-- Coupon List -->
    <scroll-view scroll-y class="coupon-list">
      <view v-if="filteredCoupons.length === 0" class="empty-state">
        <text class="empty-text font-serif">此处空无一物</text>
      </view>

      <view
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="coupon-card"
        @tap="showDetail(coupon)"
      >
        <!-- Left Amount -->
        <view
          class="coupon-left"
          :style="coupon.status === 'unused' ? 'color:var(--theme-primary,#1C1917);' : 'color:rgba(120,113,108,0.4);'"
        >
          <text class="coupon-amount font-serif">{{ coupon.amount }}</text>
          <text class="coupon-type-label font-serif">Ticket</text>
        </view>

        <!-- Dashed Divider -->
        <view class="coupon-divider"></view>

        <!-- Right Info -->
        <view class="coupon-right">
          <view class="coupon-title-row">
            <text class="coupon-badge font-serif">壹</text>
            <text
              class="coupon-title font-serif"
              :style="coupon.status === 'used' ? 'opacity:0.5;text-decoration:line-through;' : ''"
            >{{ coupon.title }}</text>
          </view>
          <text class="coupon-desc">{{ coupon.desc }}</text>
          <view class="coupon-footer">
            <text class="coupon-expiry">至：{{ coupon.expiry }}</text>
            <text v-if="coupon.status === 'unused'" class="coupon-leaf">🍃</text>
          </view>
        </view>
      </view>

      <view style="height:32px;"></view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { goTo } from '@/utils/navigation'

const activeTab = ref('unused')
const coupons = ref([
  {
    id: 1, type: 'experiential', amount: '七折', condition: '无门槛',
    title: '【凝霭】专属体验券',
    desc: '限购大师手制凝霭高山云雾茶一罐，品味高山雪韵。',
    expiry: '2026.04.15', status: 'unused'
  },
  {
    id: 2, type: 'discount', amount: '贰拾', condition: '满199可用',
    title: '全品类品鉴券',
    desc: '适用于除限定茶器外的所有常规茶品。',
    expiry: '2026.05.01', status: 'unused'
  },
  {
    id: 3, type: 'discount', amount: '伍拾', condition: '满399可用',
    title: '茶缘新客礼',
    desc: '新客专享，领略东方雅鉴全线风采。',
    expiry: '2026.02.01', status: 'used'
  }
])
const loading = ref(true)

onMounted(async () => {
  // 模拟加载优惠券数据
  setTimeout(() => {
    loading.value = false
  }, 1000)
})

const filteredCoupons = computed(() =>
  coupons.value.filter(c => c.status === activeTab.value)
)

const showDetail = (coupon) => {
  if (coupon.status === 'unused') {
    uni.showModal({
      title: coupon.title,
      content: `${coupon.desc}\n有效期至：${coupon.expiry}`,
      confirmText: '立即使用',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          uni.showToast({ title: '请在消费时出示此券', icon: 'none' })
        }
      }
    })
  }
}

const goBack = () => goTo.back()

const useCoupon = (couponId) => {
  const coupon = coupons.value.find(c => c.id === couponId)
  if (coupon && coupon.status === 'unused') {
    uni.showModal({
      title: '使用优惠券',
      content: `确定使用【${coupon.title}】？`,
      success: (res) => {
        if (res.confirm) {
          coupon.status = 'used'
          uni.showToast({
            title: '优惠券已使用',
            icon: 'success'
          })
        }
      }
    })
  }
}
</script>

<style scoped>
.coupons-page {
  min-height: 100vh;
  background: #F2EFE9;
  display: flex;
  flex-direction: column;
}
.coupons-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(12px + var(--status-bar-height, 0px));
  border-bottom: 1rpx solid rgba(28,25,23,0.05);
  background: rgba(242,239,233,0.9);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 40;
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
  font-size: 15px;
  letter-spacing: 0.2em;
  color: var(--theme-primary, #1C1917);
}
.tabs-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 64px;
  padding: 24px 24px 16px;
}
.tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.tab-text {
  font-size: 15px;
  letter-spacing: 0.2em;
}
.tab-active-dot {
  width: 24px;
  height: 2px;
  background: var(--theme-accent, #CA8A04);
}
.coupon-list {
  flex: 1;
  padding: 0 32px;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}
.empty-text {
  font-size: 14px;
  color: rgba(120,113,108,0.4);
  letter-spacing: 0.3em;
}
.coupon-card {
  display: flex;
  flex-direction: row;
  border: 1rpx solid rgba(28,25,23,0.1);
  background: rgba(255,255,255,0.4);
  margin-bottom: 32px;
  width: 100%;
  max-width: 480px;
}
.coupon-left {
  width: 100px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}
.coupon-amount {
  font-size: 28px;
  letter-spacing: 0.1em;
}
.coupon-type-label {
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-top: 4px;
}
.coupon-divider {
  width: 1rpx;
  background: repeating-linear-gradient(to bottom, rgba(28,25,23,0.1) 0, rgba(28,25,23,0.1) 4px, transparent 4px, transparent 8px);
}
.coupon-right {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.coupon-title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.coupon-badge {
  font-size: 10px;
  color: var(--theme-accent, #CA8A04);
  border: 1rpx solid rgba(202,138,4,0.3);
  padding: 1px 4px;
}
.coupon-title {
  font-size: 16px;
  color: var(--theme-primary, #1C1917);
  letter-spacing: 0.05em;
}
.coupon-desc {
  font-size: 11px;
  color: #78716C;
  line-height: 1.6;
  margin-bottom: 8px;
  display: block;
}
.coupon-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.coupon-expiry {
  font-size: 10px;
  color: rgba(120,113,108,0.5);
}
.coupon-leaf {
  font-size: 12px;
  opacity: 0.6;
}
</style>
