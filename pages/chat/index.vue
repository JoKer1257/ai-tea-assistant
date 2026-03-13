<template>
  <view class="chat-page">
    <!-- Nav Bar -->
    <view class="chat-nav">
      <view class="nav-back" @tap="goBack">
        <text class="nav-back-arrow">‹</text>
      </view>
      <text class="nav-title font-serif">AI 品茶助手</text>
      <view style="width:44px;"></view>
    </view>

    <!-- Messages Area -->
    <scroll-view
      scroll-y
      :scroll-top="scrollTop"
      class="chat-messages"
      scroll-with-animation
    >
      <view style="height:12px;"></view>
      <view
        v-for="(msg, index) in messages"
        :key="index"
        class="msg-row"
        :class="msg.role === 'user' ? 'msg-row-user' : 'msg-row-ai'"
      >
        <!-- AI Avatar -->
        <view v-if="msg.role === 'assistant'" class="ai-avatar">
          <text style="font-size:20px;">🍵</text>
        </view>

        <!-- Bubble -->
        <view
          class="msg-bubble"
          :class="msg.role === 'user' ? 'bubble-user' : 'bubble-ai'"
        >
          <view v-if="msg.loading" class="loading-dots">
            <view class="dot dot1"></view>
            <view class="dot dot2"></view>
            <view class="dot dot3"></view>
          </view>
          <text v-else class="msg-text">{{ msg.content }}</text>
          <!-- 流式响应指示器 -->
          <view v-if="msg.streaming" class="streaming-indicator">
            <text class="streaming-dot">▪</text>
          </view>
        </view>
      </view>
      <view style="height:16px;"></view>
    </scroll-view>

    <!-- Input Area -->
    <view class="chat-input-area">
      <!-- 快捷问题 -->
      <view class="quick-questions">
        <text 
          v-for="question in quickQuestions" 
          :key="question"
          class="quick-question"
          @tap="sendQuickQuestion(question)"
        >
          {{ question }}
        </text>
      </view>
      
      <view class="input-wrap">
        <input
          v-model="inputText"
          class="chat-input"
          placeholder="问问茶叶特点或冲泡方法..."
          placeholder-style="color:#A8A29E;font-size:14px;"
          :disabled="isLoading"
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view
          class="send-btn"
          :class="{ 'send-btn-disabled': !inputText.trim() || isLoading }"
          @tap="sendMessage"
        >
          <text class="send-btn-text">发送</text>
        </view>
      </view>
      
      <!-- 功能按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @tap="clearChat">
          <text class="icon icon-sm icon-primary">🔄</text>
          <text class="action-text">重置</text>
        </view>
        <view class="action-btn" @tap="getChatHistory">
          <text class="icon icon-sm icon-primary">📋</text>
          <text class="action-text">历史</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { cloudBaseTeaMaster } from '@/utils/cloudBaseAI'
import { goTo } from '@/utils/navigation'
import aiService from '@/services/aiService'

const brandStore = useBrandStore()
const inputText = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
let scrollVal = 0

let sessionId = null
let brandId = '1'

// 快捷问题
const quickQuestions = ref([
  '这款茶怎么冲泡？',
  '有什么功效？',
  '适合什么人群？',
  '如何保存？',
  '产地在哪里？'
])

const canUseCloudBase = () => cloudBaseTeaMaster.isAvailable?.()

const getGreeting = () => `您好！我是${brandStore.brand.aiName || '品茶助手'}。这款茶怎么泡最好喝？或者您想了解它的产地故事吗？`

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  brandId = currentPage?.options?.brandId || brandStore.brandId || '1'

  if (!brandStore.isLoaded) {
    await brandStore.loadBrand(brandId)
  }

  messages.value = [
    { 
      role: 'assistant', 
      content: getGreeting()
    }
  ]
})

const messages = ref([
  { role: 'assistant', content: '您好！我是品茶助手。这款茶怎么泡最好喝？或者您想了解它的产地故事吗？' }
])

const scrollToBottom = () => {
  nextTick(() => {
    scrollVal += 9999
    scrollTop.value = scrollVal
  })
}

const goBack = () => goTo.back()

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''

  const loadingMsg = { role: 'assistant', content: '', loading: true }
  messages.value.push(loadingMsg)
  scrollToBottom()
  isLoading.value = true

  try {
    // 构建上下文
    const context = {
      brandId: brandId,
      brandName: brandStore.brand.name,
      skuId: brandStore.currentSkuId,
      skuName: brandStore.currentSku?.name,
      userName: '茶友'
    }

    // 使用 CloudBase AI 扩展流式对话
    const response = canUseCloudBase()
      ? await cloudBaseTeaMaster.chat(text, sessionId, context)
      : await aiService.chatOnce(text)
    
    // 更新会话ID
    if (!sessionId) {
      sessionId = canUseCloudBase()
        ? cloudBaseTeaMaster.generateSessionId()
        : aiService.getOpenId()
    }

    const idx = messages.value.length - 1
    messages.value[idx] = {
      role: 'assistant',
      content: response,
      loading: false,
      timestamp: new Date()
    }

  } catch (error) {
    console.error('AI 聊天失败:', error)
    const context = {
      brandId,
      brandName: brandStore.brand.name,
      skuId: brandStore.currentSkuId,
      skuName: brandStore.currentSku?.name,
      userName: '茶友'
    }
    
    const idx = messages.value.length - 1
    messages.value[idx] = { 
      role: 'assistant', 
      content: cloudBaseTeaMaster.getFallbackResponse(text, context), 
      loading: false 
    }
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 流式发送消息（高级功能）
const sendStreamMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''

  const loadingMsg = { role: 'assistant', content: '', loading: true, streaming: true }
  messages.value.push(loadingMsg)
  scrollToBottom()
  isLoading.value = true

  try {
    // 构建上下文
    const context = {
      brandId: brandId,
      brandName: brandStore.brand.name,
      skuId: brandStore.currentSkuId,
      skuName: brandStore.currentSku?.name,
      userName: '茶友'
    }

    // 更新会话ID
    if (!sessionId) {
      sessionId = cloudBaseTeaMaster.generateSessionId()
    }

    const idx = messages.value.length - 1
    let fullResponse = ''

    // 流式接收响应
    for await (const chunk of cloudBaseTeaMaster.chatStream(text, sessionId, context)) {
      fullResponse += chunk
      messages.value[idx] = {
        role: 'assistant',
        content: fullResponse,
        loading: false,
        streaming: true,
        timestamp: new Date()
      }
      scrollToBottom()
    }

    // 完成流式响应
    messages.value[idx] = {
      role: 'assistant',
      content: fullResponse,
      loading: false,
      streaming: false,
      timestamp: new Date()
    }

  } catch (error) {
    console.error('流式 AI 聊天失败:', error)
    
    const idx = messages.value.length - 1
    messages.value[idx] = { 
      role: 'assistant', 
      content: '抱歉，我现在无法回答。请稍后再试，或者咨询我们的茶艺师。', 
      loading: false,
      streaming: false
    }
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 清除聊天记录
const clearChat = () => {
  if (sessionId && canUseCloudBase()) {
    cloudBaseTeaMaster.clearSession(sessionId)
    sessionId = null
  }

  if (!canUseCloudBase()) {
    aiService.clearHistory()
    sessionId = aiService.getOpenId()
  }
  
  messages.value = [
    { 
      role: 'assistant', 
      content: getGreeting()
    }
  ]
}

// 获取聊天历史
const getChatHistory = async () => {
  if (sessionId && canUseCloudBase()) {
    const history = cloudBaseTeaMaster.getSessionHistory(sessionId)
    console.log('聊天历史:', history)
    uni.showModal({
      title: '聊天历史',
      content: `共有 ${history.length} 条对话记录`,
      showCancel: false
    })
    return
  }

  if (!canUseCloudBase()) {
    const history = await aiService.getChatHistory()
    uni.showModal({
      title: '聊天历史',
      content: `共有 ${history.sessions?.length || 0} 条对话记录`,
      showCancel: false
    })
  } else {
    uni.showToast({
      title: '暂无聊天记录',
      icon: 'none'
    })
  }
}

// 发送快捷问题
const sendQuickQuestion = (question) => {
  inputText.value = question
  sendMessage()
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F5F5F0;
}
.chat-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #FAFAF9;
  border-bottom: 1rpx solid rgba(0,0,0,0.05);
  padding-top: calc(12px + var(--status-bar-height, 0px));
}
.nav-back {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-back-arrow {
  font-size: 28px;
  color: #1C1917;
  line-height: 1;
}
.nav-title {
  font-size: 16px;
  color: #1C1917;
  letter-spacing: 0.1em;
}
.chat-messages {
  flex: 1;
  padding: 0 16px;
  overflow: hidden;
}
.msg-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: flex-end;
}
.msg-row-user {
  justify-content: flex-end;
}
.msg-row-ai {
  justify-content: flex-start;
}
.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  flex-shrink: 0;
}
.msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
}
.bubble-ai {
  background: #fff;
  border: 1rpx solid rgba(0,0,0,0.06);
  border-bottom-left-radius: 4px;
  color: #1C1917;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.bubble-user {
  background: #1C1917;
  border-bottom-right-radius: 4px;
  color: #F2EFE9;
}
.msg-text {
  white-space: pre-wrap;
}
.loading-dots {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  height: 20px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #A8A29E;
  animation: bounce 1.2s infinite;
}
.dot2 { animation-delay: 0.2s; }
.dot3 { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
.chat-input-area {
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background: #FAFAF9;
  border-top: 1rpx solid rgba(0,0,0,0.05);
}

/* 快捷问题 */
.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.quick-question {
  background: rgba(28,25,23,0.05);
  border: 1rpx solid rgba(28,25,23,0.1);
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: #5D7052;
  transition: all 0.2s ease;
}

.quick-question:active {
  background: rgba(202,138,4,0.1);
  border-color: rgba(202,138,4,0.3);
  transform: scale(0.95);
}

.input-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #F2EFE9;
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
  border: 1rpx solid rgba(0,0,0,0.08);
  margin-bottom: 12px;
}

.chat-input {
  flex: 1;
  height: 36px;
  font-size: 14px;
  color: #1C1917;
  background: transparent;
}

.send-btn {
  background: #1C1917;
  border-radius: 20px;
  padding: 6px 16px;
  margin-left: 8px;
}

.send-btn-disabled {
  opacity: 0.4;
}

.send-btn-text {
  color: #F2EFE9;
  font-size: 13px;
}

/* 功能按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  background: transparent;
  transition: all 0.2s ease;
}

.action-btn:active {
  background: rgba(28,25,23,0.05);
  transform: scale(0.95);
}

.action-text {
  font-size: 10px;
  color: #78716C;
}

/* 流式响应样式 */
.streaming-indicator {
  display: inline-block;
  margin-left: 8px;
  vertical-align: middle;
}

.streaming-dot {
  color: #CA8A04;
  font-size: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
