<template>
  <div class="bottom-nav" style="position: fixed; bottom: 0; left: 0; width: 100%; height: 14vw; max-height: 56px; z-index: 100; pointer-events: auto; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-top: 1px solid rgba(36, 57, 42, 0.05); display: flex; align-items: center; justify-content: space-around; background-color: rgba(242, 239, 233, 0.9);">
    <div 
      class="tab-btn"
      :class="{ active: currentRoute === 'home' }"
      @click="navigateTo('home')"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      style="padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px;"
    >
      <div style="color: #24392A; font-size: 16px;" :style="{ opacity: currentRoute === 'home' ? 1 : 0.4 }">🍵</div>
      <span style="font-size: 10px; font-family: serif; letter-spacing: -0.05em;" :style="{ color: currentRoute === 'home' ? '#24392A' : '#9CA3AF' }">寻茶</span>
    </div>
    <div 
      class="tab-btn"
      :class="{ active: currentRoute === 'ai' }"
      @click="navigateTo('ai')"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      style="padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px;"
    >
      <div style="color: #24392A; font-size: 16px;" :style="{ opacity: currentRoute === 'ai' ? 1 : 0.4 }">📜</div>
      <span style="font-size: 10px; font-family: serif; letter-spacing: -0.05em;" :style="{ color: currentRoute === 'ai' ? '#24392A' : '#9CA3AF' }">茶经</span>
    </div>
    <div 
      class="tab-btn"
      :class="{ active: currentRoute === 'lottery' }"
      @click="navigateTo('lottery')"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      style="padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px;"
    >
      <div style="color: #24392A; font-size: 16px;" :style="{ opacity: currentRoute === 'lottery' ? 1 : 0.4 }">🎯</div>
      <span style="font-size: 10px; font-family: serif; letter-spacing: -0.05em;" :style="{ color: currentRoute === 'lottery' ? '#24392A' : '#9CA3AF' }">抽奖</span>
    </div>
    <div 
      class="tab-btn"
      :class="{ active: currentRoute === 'gift' }"
      @click="navigateTo('gift')"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      style="padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px;"
    >
      <div style="color: #24392A; font-size: 16px;" :style="{ opacity: currentRoute === 'gift' ? 1 : 0.4 }">🧧</div>
      <span style="font-size: 10px; font-family: serif; letter-spacing: -0.05em;" :style="{ color: currentRoute === 'gift' ? '#24392A' : '#9CA3AF' }">福礼</span>
    </div>
    <div 
      class="tab-btn"
      :class="{ active: currentRoute === 'profile' }"
      @click="navigateTo('profile')"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      style="padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px;"
    >
      <div style="color: #24392A; font-size: 16px;" :style="{ opacity: currentRoute === 'profile' ? 1 : 0.4 }">👤</div>
      <span style="font-size: 10px; font-family: serif; letter-spacing: -0.05em;" :style="{ color: currentRoute === 'profile' ? '#24392A' : '#9CA3AF' }">自省</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前路由
const currentRoute = computed(() => {
  return route.name || 'home'
})

// 触摸反馈
const handleTouchStart = (e) => {
  e.currentTarget.style.transform = 'scale(0.95)'
}

const handleTouchEnd = (e) => {
  e.currentTarget.style.transform = 'scale(1)'
}

// 路由跳转
const navigateTo = (path) => {
  router.push({ name: path })
}
</script>

<style scoped>
.tab-btn:hover {
  background-color: rgba(93, 112, 82, 0.1);
}

.tab-btn.active {
  background-color: rgba(93, 112, 82, 0.15);
}

/* 移动端触摸优化 */
.tab-btn:active {
  transform: scale(0.95);
}
</style>
