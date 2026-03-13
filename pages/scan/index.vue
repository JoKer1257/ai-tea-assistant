<template>
  <view class="min-h-screen flex-col items-center justify-center" style="background:var(--theme-bg,#F2EFE9);display:flex;">
    <view class="loading-ring" />
    <text class="text-xs tracking-widest" style="color:var(--theme-text-sub,#78716C);letter-spacing:0.3em;font-size:13px;margin-top:16px;">正在为您准备...</text>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { goTo } from '@/utils/navigation'

const brandStore = useBrandStore()

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  const { bid, sid, sn } = options

  if (!bid) {
    goTo.welcome()
    return
  }

  try {
    await brandStore.scanQrCode(bid, sid, sn)
    
    const dest = sid
      ? `/pages/brand/index?id=${bid}&sku=${sid}`
      : `/pages/brand/index?id=${bid}`
    
    goTo.brand(bid, sid)
  } catch {
    goTo.welcome()
  }
})
</script>

<style scoped>
.loading-ring {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(202,138,4,0.2);
  border-top-color: #CA8A04;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
