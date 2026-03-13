<template>
  <scroll-view scroll-y class="user-page">

    <!-- Header -->
    <view class="user-header">
      <view class="back-btn" @tap="goBack">
        <text class="icon icon-lg icon-primary">‹</text>
      </view>
      <view style="flex:1;"></view>
      <view class="settings-btn">
        <!-- Settings Icon SVG -->
        <text style="font-size:20px;color:#1C1917;opacity:0.5;">⚙</text>
      </view>
    </view>

    <!-- Profile Section -->
    <view class="profile-section">
      <!-- Avatar with spinning ring -->
      <view class="avatar-wrap">
        <view class="spin-ring"></view>
        <view class="avatar-inner">
          <image
            src="@/static/images/tea_master_craft.png"
            class="avatar-img"
            mode="aspectFill"
          />
        </view>
      </view>

      <text class="user-name font-serif">墨客·无尘</text>
      <view class="user-meta">
        <text class="meta-label">相识 </text>
        <text class="meta-count font-serif">拾肆</text>
        <text class="meta-label"> 盏茶的光阴</text>
      </view>
    </view>

    <!-- Stats Row -->
    <view class="stats-row">
      <view class="stat-item" @tap="() => {}">
        <text class="stat-num font-serif">贰</text>
        <text class="stat-label">Brewing</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @tap="() => {}">
        <text class="stat-num font-serif">拾</text>
        <text class="stat-label">Collected</text>
      </view>
    </view>

    <!-- Menu List -->
    <view class="menu-list">
      <view v-for="item in menuItems" :key="item.title" class="menu-item" @tap="handleMenuClick(item.path)">
        <view class="menu-left">
          <text class="menu-icon">{{ item.icon }}</text>
          <text class="menu-title font-serif">{{ item.title }}</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

  </scroll-view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { goTo } from '@/utils/navigation'

const userInfo = ref({
  avatar: '/static/images/tea_master_craft.png',
  nickname: '茶友小王',
  level: '品茶新手',
  points: 1280,
  joinDate: '2024-03-01'
})

const menuItems = ref([
  { icon: '📋', title: '我的订单', path: null },
  { icon: '🎫', title: '我的优惠券', path: '/pages/coupons/index' },
  { icon: '📝', title: '品鉴记录', path: '/pages/result/index' },
  { icon: '⚙️', title: '设置', path: null },
  { icon: '❓', title: '帮助与反馈', path: null }
])

onMounted(() => {
  // 可以在这里加载用户信息
})

const goBack = () => goTo.back()

const handleMenuClick = (path) => {
  if (path) {
    // 使用统一的导航方法
    if (path === '/pages/coupons/index') {
      goTo.coupons()
    } else if (path === '/pages/result/index') {
      goTo.result()
    } else {
      // 其他页面跳转
      uni.navigateTo({ url: path })
    }
  }
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息并跳转到欢迎页
        goTo.welcome()
      }
    }
  })
}
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  background: #F2EFE9;
}
.user-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  position: relative;
}

.back-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(28,25,23,0.05);
  transition: all 0.2s ease;
}

.back-btn:active {
  background: rgba(28,25,23,0.1);
  transform: scale(0.95);
}

.settings-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(28,25,23,0.05);
  transition: all 0.2s ease;
}

.settings-btn:active {
  background: rgba(28,25,23,0.1);
  transform: scale(0.95);
}
.avatar-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  margin-bottom: 24px;
}
.spin-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  border: 1rpx solid rgba(202,138,4,0.6);
  border-right-color: transparent;
  animation: spin 18s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.avatar-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(28,25,23,0.05);
  padding: 4px;
  box-sizing: border-box;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.user-name {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--theme-primary, #1C1917);
  margin-bottom: 8px;
}
.user-meta {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.meta-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(120,113,108,0.6);
}
.meta-count {
  font-size: 16px;
  color: var(--theme-accent, #CA8A04);
  margin: 0 4px;
}
.stats-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 64px;
  max-width: 320px;
  margin: 0 auto 64px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 26px;
  color: var(--theme-primary, #1C1917);
  margin-bottom: 4px;
}
.stat-label {
  font-size: 10px;
  color: rgba(120,113,108,0.8);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(28,25,23,0.05);
  transform: rotate(15deg);
}
.menu-list {
  padding: 0 40px;
  max-width: 480px;
  margin: 0 auto;
}
.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 8px;
  border-bottom: 1rpx solid rgba(28,25,23,0.05);
}
.menu-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
}
.menu-icon {
  font-size: 20px;
  opacity: 0.5;
}
.menu-title {
  font-size: 15px;
  letter-spacing: 0.15em;
  color: var(--theme-primary, #1C1917);
}
.menu-arrow {
  font-size: 18px;
  color: rgba(120,113,108,0.3);
}
</style>
