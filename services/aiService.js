// AI 服务 - 处理与后端 AI 接口的通信
import { fetchWithAuth } from './api'
import { buildApiUrl } from '../utils/appConfig.js'

class AIService {
  constructor() {
    this.cachedOpenId = null
  }

  /**
   * 发送消息并返回完整回复文本
   */
  async chatOnce(message, options = {}) {
    let fullContent = ''

    await this.streamChat(message, {
      ...options,
      onChunk: (chunk, payload) => {
        fullContent += chunk
        options.onChunk?.(chunk, payload)
      }
    })

    return fullContent
  }

  /**
   * 兼容旧调用方式的流式聊天
   */
  async chat(message, onChunk, onComplete, onError) {
    try {
      await this.streamChat(message, {
        onChunk: (chunk, payload) => onChunk?.(payload || { content: chunk }),
        onComplete
      })
    } catch (error) {
      console.error('AI Chat Error:', error)
      onError?.(error)
    }
  }

  /**
   * 流式读取 SSE 并向上层输出文本块
   */
  async streamChat(message, options = {}) {
    const {
      openid = this.getOpenId(),
      onChunk,
      onComplete
    } = options

    const response = await fetch(buildApiUrl('/ai/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message,
          openid
        }),
      })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body?.getReader) {
      throw new Error('当前环境不支持流式读取 AI 响应')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        onComplete?.()
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) {
          continue
        }

        const data = line.slice(6).trim()
        if (data === '[DONE]') {
          onComplete?.()
          return
        }

        try {
          const parsed = JSON.parse(data)
          const chunk = parsed.content || ''
          if (chunk) {
            onChunk?.(chunk, parsed)
          }
        } catch (error) {
          console.warn('Failed to parse SSE data:', data, error)
        }
      }
    }
  }

  /**
   * 获取用户 openid（从本地存储或 cookie）
   */
  getOpenId() {
    let openid = ''

    if (typeof uni !== 'undefined' && uni.getStorageSync) {
      openid = uni.getStorageSync('openid')
    }

    if (!openid && typeof localStorage !== 'undefined') {
      openid = localStorage.getItem('openid')
    }
    
    if (!openid) {
      this.cachedOpenId = this.cachedOpenId || `dev_user_${Date.now()}`
      openid = this.cachedOpenId

      if (typeof uni !== 'undefined' && uni.setStorageSync) {
        uni.setStorageSync('openid', openid)
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('openid', openid)
      }
    }
    
    if (!openid && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'openid' && value) {
          openid = value
          break
        }
      }
    }
    
    return openid || this.cachedOpenId || `dev_user_${Date.now()}`
  }

  /**
   * 检查今日 AI 使用次数
   */
  async checkDailyLimit() {
    try {
      const response = await fetchWithAuth(`/ai/limit?openid=${encodeURIComponent(this.getOpenId())}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Check AI limit error:', error)
      return { remaining: 10, used: 0, limit: 10 } // 默认限制
    }
  }

  /**
   * 获取 AI 对话历史
   */
  async getChatHistory(page = 1, limit = 20) {
    try {
      const response = await fetchWithAuth(`/ai/history?page=${page}&limit=${limit}&openid=${encodeURIComponent(this.getOpenId())}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Get chat history error:', error)
      return { sessions: [], total: 0 }
    }
  }

  /**
   * 清除对话历史
   */
  async clearHistory() {
    try {
      const response = await fetchWithAuth(`/ai/history?openid=${encodeURIComponent(this.getOpenId())}`, {
        method: 'DELETE'
      })
      return response.ok
    } catch (error) {
      console.error('Clear history error:', error)
      return false
    }
  }
}

// 创建单例实例
const aiService = new AIService()

export default aiService
