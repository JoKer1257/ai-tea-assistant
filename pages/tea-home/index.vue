<template>
  <scroll-view 
    scroll-y 
    class="tea-home-page" 
    @scroll="handleScroll"
  >
    <!-- 顶部品牌区 - 滚动渐变效果 -->
    <view class="brand-header" :class="{ 'brand-header-scroll': isScroll }">
      <image class="brand-bg" src="/static/images/tea_garden_banner.png" mode="aspectFill"></image>
      <view class="brand-mask"></view>
      <view class="brand-content">
        <text class="brand-title font-serif">雅鉴 · 以茶为媒，寻味东方</text>
        <text class="brand-slogan">凝霭 · 高山云雾 跨越千里的春之礼赞</text>
      </view>
    </view>

    <!-- 品牌故事卡片 - 上滑动画 -->
    <view class="brand-story" :class="{ 'brand-story-show': showStory }">
      <image class="story-img" src="/static/images/tea_master_craft.png" mode="aspectFill"></image>
      <view class="story-content">
        <text class="story-title font-serif">关于雅鉴</text>
        <text class="story-desc">
          我们深耕武夷山脉十余年，只甄选核心产区的明前茶与正岩茶。坚持手工炭焙，让每一片茶叶都保留山野本味，以茶为礼，传递东方生活美学。
        </text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view 
        v-for="product in products" 
        :key="product.id" 
        class="product-item"
        @tap="goToProduct(product.id)"
      >
        <view class="product-content">
          <!-- 左侧图片和基本信息 -->
          <view class="product-left">
            <image class="product-img" :src="product.image" mode="aspectFill"></image>
            <view class="product-tag">{{ product.tag }}</view>
            <text class="product-name font-serif">{{ product.name }}</text>
            <view class="product-price">
              <text>¥{{ product.price }}</text>
              <text class="gift-tag">雅鉴礼献</text>
            </view>
          </view>
          
          <!-- 右侧介绍和冲泡方法 -->
          <view class="product-right">
            <!-- 茶叶介绍 -->
            <view class="product-description">
              <text class="desc-text">{{ product.description }}</text>
            </view>
            
            <!-- 冲泡方法 -->
            <view class="brewing-info">
              <view class="brewing-title">
                <text class="brewing-icon">🫖</text>
                <text class="brewing-text">冲泡方法</text>
              </view>
              <view class="brewing-details">
                <view class="brewing-item">
                  <text class="brewing-label">水温:</text>
                  <text class="brewing-value">{{ product.brewing.water }}</text>
                </view>
                <view class="brewing-item">
                  <text class="brewing-label">时间:</text>
                  <text class="brewing-value">{{ product.brewing.time }}</text>
                </view>
                <view class="brewing-item">
                  <text class="brewing-label">比例:</text>
                  <text class="brewing-value">{{ product.brewing.ratio }}</text>
                </view>
              </view>
              <view class="brewing-steps">
                <text class="steps-text">{{ product.brewing.steps }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view style="height: 120rpx;"></view>
  </scroll-view>

  <!-- 底部导航 -->
  <view class="tab-bar">
    <view class="tab-item" @tap="goToHome">
      <text class="tab-icon">🍵</text>
      <text class="tab-text">寻茶</text>
    </view>
    <view class="tab-item" @tap="goToChat">
      <text class="tab-icon">📜</text>
      <text class="tab-text">茶经</text>
    </view>
    <view class="tab-item" @tap="goToLottery">
      <text class="tab-icon">🎁</text>
      <text class="tab-text">福礼</text>
    </view>
    <view class="tab-item" @tap="goToUser">
      <text class="tab-icon">👤</text>
      <text class="tab-text">自省</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { goTo } from '@/utils/navigation'

// 响应式数据
const isScroll = ref(false)
const showStory = ref(false)

// 商品数据
const products = ref([
  {
    id: 1,
    image: "/static/images/tea_longjing.png",
    tag: "雅鉴核心产区 · 海拔1800米",
    name: "凝霭·高山云雾",
    price: 298,
    description: "产于杭州西湖龙井村，采摘明前嫩芽，外形扁平光滑，色泽翠绿，香气清高持久。",
    brewing: {
      water: "85°C",
      time: "3-4分钟",
      ratio: "1:50",
      steps: "温杯→投茶→注水→闷泡→出汤"
    }
  },
  {
    id: 2,
    image: "/static/images/tea_dahongpao.png",
    tag: "雅鉴正岩标杆 · 三坑两涧核心区",
    name: "岩骨·肉桂正岩",
    price: 398,
    description: "武夷山岩茶之王，生长于岩石缝隙中，具有独特的岩韵，香气浓郁，滋味醇厚回甘。",
    brewing: {
      water: "95°C",
      time: "5-6分钟",
      ratio: "1:30",
      steps: "温壶→投茶→高冲→闷泡→分杯"
    }
  },
  {
    id: 3,
    image: "/static/images/tea_silver_needle.png",
    tag: "雅鉴明前采摘 · 手工炭焙",
    name: "清露·龙井春茶",
    price: 258,
    description: "福鼎白茶珍品，芽头肥壮，满披白毫，滋味鲜爽甘甜，具有清热解毒的功效。",
    brewing: {
      water: "80°C",
      time: "2-3分钟",
      ratio: "1:60",
      steps: "温杯→投茶→沿壁注水→闷泡→出汤"
    }
  },
  {
    id: 4,
    image: "/static/images/tea_tieguanyin.png",
    tag: "雅鉴古树普洱 · 十年陈化",
    name: "陈韵·普洱熟茶",
    price: 458,
    description: "安溪铁观音，兰花香明显，滋味醇厚甘鲜，七泡有余香，具有独特的观音韵。",
    brewing: {
      water: "100°C",
      time: "4-5分钟",
      ratio: "1:40",
      steps: "温壶→投茶→高冲→闷泡→分杯"
    }
  }
])

// 滚动事件处理
const handleScroll = (e) => {
  const scrollTopValue = e.detail.scrollTop
  
  // 滚动距离超过100rpx时触发渐变
  isScroll.value = scrollTopValue > 100

  // 滚动到品牌故事区域时触发上滑动画
  if (scrollTopValue > 200 && !showStory.value) {
    showStory.value = true
  }
}

// 导航方法
const goToHome = () => {
  // 滚动到顶部 - 使用 uni.pageScrollTo
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}

const goToChat = () => goTo.chat('1')
const goToLottery = () => goTo.lottery('1')
const goToUser = () => goTo.user()

const goToProduct = (productId) => {
  goTo.product('1', productId)
}
</script>

<style scoped>
/* 全局样式 - 浅茶褐色主调 */
.tea-home-page {
  min-height: 100vh;
  background-color: #f9f6f0; /* 浅米色背景 */
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  padding-bottom: 120rpx; /* 给底部导航留空间 */
}

/* 顶部品牌区 - 基础样式 */
.brand-header {
  position: relative;
  width: 100%;
  height: 400rpx;
  overflow: hidden;
  transition: all 0.3s ease;
}

.brand-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.brand-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); /* 半透明白色遮罩 */
  z-index: 2;
}

.brand-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 3;
  width: 80%;
}

.brand-title {
  display: block;
  font-size: 36rpx;
  color: #5c4033; /* 深茶褐色 */
  font-weight: 600;
  margin-bottom: 20rpx;
  letter-spacing: 0.2em;
}

.brand-slogan {
  display: block;
  font-size: 28rpx;
  color: #8b6e4e; /* 浅茶褐色 */
  line-height: 1.5;
  letter-spacing: 0.1em;
}

/* 滚动时的渐变效果 */
.brand-header-scroll {
  height: 200rpx;
}

.brand-header-scroll .brand-content {
  opacity: 0.8;
}

.brand-header-scroll .brand-title {
  font-size: 30rpx;
}

.brand-header-scroll .brand-slogan {
  font-size: 24rpx;
}

/* 品牌故事卡片 - 基础样式 */
.brand-story {
  display: flex;
  margin: 40rpx 30rpx;
  padding: 16rpx;
  background-color: #fff;
  border: 1rpx solid #e8d9c8; /* 浅茶褐边框 */
  border-radius: 16rpx;
  transform: translateY(50rpx);
  opacity: 0;
  transition: all 0.8s ease;
  box-shadow: 0 4rpx 12rpx rgba(92, 64, 51, 0.08);
}

/* 上滑动画效果 */
.brand-story-show {
  transform: translateY(0);
  opacity: 1;
}

.story-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
  object-fit: cover;
}

.story-content {
  flex: 1;
  min-width: 0; /* 防止flex子元素溢出 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.story-title {
  display: block;
  font-size: 28rpx;
  color: #5c4033;
  font-weight: 600;
  margin-bottom: 12rpx;
  line-height: 1.3;
}

.story-desc {
  display: block;
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 商品列表 */
.product-list {
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;
}

.product-item {
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease; /* 上浮+阴影动画 */
}

/* 商品卡片hover/点击效果 */
.product-item:active {
  transform: translateY(-8rpx);
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
}

/* 商品内容容器 */
.product-content {
  display: flex;
  gap: 20rpx;
}

/* 左侧图片和基本信息 */
.product-left {
  flex: 0 0 200rpx;
  display: flex;
  flex-direction: column;
}

.product-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
}

.product-tag {
  display: inline-block;
  background-color: #f0e6d9; /* 浅茶褐背景 */
  color: #8b6e4e;
  font-size: 18rpx;
  padding: 4rpx 8rpx;
  border-radius: 20rpx;
  margin-bottom: 12rpx;
  align-self: flex-start;
}

.product-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.product-price {
  display: flex;
  align-items: center;
}

.product-price text:first-child {
  font-size: 28rpx;
  color: #e64340;
  font-weight: 600;
  margin-right: 8rpx;
}

.gift-tag {
  font-size: 18rpx;
  color: #8b6e4e;
  background-color: #f9f6f0;
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}

/* 茶叶介绍 */
.product-description {
  margin-bottom: 15rpx;
  padding: 12rpx;
  background-color: #fafafa;
  border-radius: 8rpx;
  border-left: 3rpx solid #8b6e4e;
}

.desc-text {
  font-size: 20rpx;
  color: #666;
  line-height: 1.4;
}

/* 冲泡方法 */
.brewing-info {
  padding: 12rpx;
  background-color: #f9f6f0;
  border-radius: 8rpx;
  border: 1rpx solid #e8d9c8;
}

.brewing-title {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.brewing-icon {
  font-size: 18rpx;
  margin-right: 6rpx;
}

.brewing-text {
  font-size: 20rpx;
  color: #5c4033;
  font-weight: 600;
}

.brewing-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.brewing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.brewing-label {
  font-size: 16rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.brewing-value {
  font-size: 18rpx;
  color: #8b6e4e;
  font-weight: 600;
}

.brewing-steps {
  margin-top: 8rpx;
  padding-top: 8rpx;
  border-top: 1rpx dashed #e8d9c8;
}

.steps-text {
  font-size: 18rpx;
  color: #666;
  line-height: 1.3;
  text-align: center;
}

/* 底部导航 - 浅茶褐色主调 */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #8b6e4e; /* 浅茶褐色底色 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  padding: 10rpx;
  transition: all 0.2s ease;
}

.tab-item:active {
  opacity: 0.7;
  transform: scale(0.95);
}

.tab-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 24rpx;
}

/* 字体样式 */
.font-serif {
  font-family: "PingFang SC", "Microsoft YaHei", "SimSun", serif;
}

/* H5特有样式优化 */
@media (min-width: 768px) {
  .tea-home-page {
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .product-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .product-item {
    margin-bottom: 0;
  }
}

/* H5滚动条优化 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #8b6e4e;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5c4033;
}
</style>
