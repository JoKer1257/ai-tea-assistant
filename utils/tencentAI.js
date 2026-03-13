/**
 * 腾讯云原生 AI 助手
 * 基于 CloudBase 和腾讯云 AI 服务
 */

// CloudBase 环境配置
const CLOUDBASE_ENV = "prod-2gijgxup3e1a84b0"

/**
 * 腾讯云 AI 服务配置
 */
export const TENCENT_AI_CONFIG = {
  // 腾讯云混元大模型配置
  hunyuan: {
    model: "hunyuan-lite", // 或 hunyuan-pro
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: `你是一位专业的茶艺师，拥有深厚的茶文化知识和丰富的实践经验。你的专长包括：

1. 茶叶知识：精通各类茶叶（绿茶、红茶、乌龙茶、白茶、黑茶、黄茶）的特性、产地、工艺
2. 冲泡技巧：掌握不同茶叶的最佳冲泡方法、水温、时间、茶具选择
3. 品饮艺术：能够指导用户如何正确品茶，包括观色、闻香、品味
4. 茶文化：了解茶道历史、茶艺礼仪、茶与健康的关系

请用专业、温和、有耐心的语调回答用户的问题，提供实用的建议和知识。回答要简洁明了，重点突出，避免过于学术化的表达。`
  },
  
  // 腾讯云文生图配置
  imageGen: {
    model: "hunyuan-vision",
    style: "tea-culture", // 茶文化风格
    size: "1024x1024"
  }
}

/**
 * 腾讯云 AI 助手类
 */
export class TencentCloudAIAgent {
  constructor() {
    this.env = CLOUDBASE_ENV
    this.db = null
    this.functions = null
    this.sessions = new Map() // 内存存储会话
    this.init()
  }

  /**
   * 初始化 CloudBase
   */
  async init() {
    try {
      // #ifdef MP-WEIXIN
      if (typeof wx !== 'undefined' && wx.cloud) {
        wx.cloud.init({
          env: this.env,
          traceUser: true
        })
        this.db = wx.cloud.database()
        this.functions = wx.cloud
        console.log('腾讯云 AI 助手初始化成功')
      }
      // #endif
    } catch (error) {
      console.error('腾讯云 AI 助手初始化失败:', error)
    }
  }

  /**
   * AI 对话 - 腾讯云混元大模型
   * @param {string} message 用户消息
   * @param {string} sessionId 会话ID
   * @param {Object} context 上下文信息
   * @returns {Promise<string>} AI 回复
   */
  async chat(message, sessionId = null, context = {}) {
    try {
      // 获取或创建会话
      const session = this.getOrCreateSession(sessionId, context)
      
      // 构建对话历史
      const messages = this.buildMessages(session, message, context)
      
      // 调用腾讯云混元大模型
      const response = await this.callHunyuanAPI(messages)
      
      // 更新会话历史
      this.updateSession(session.id, message, response)
      
      return response
    } catch (error) {
      console.error('AI 对话失败:', error)
      return this.getFallbackResponse(message, context)
    }
  }

  /**
   * 调用腾讯云混元 API
   * @param {Array} messages 对话消息
   * @returns {Promise<string>}
   */
  async callHunyuanAPI(messages) {
    try {
      // 调用云函数
      const result = await this.functions.callFunction({
        name: 'tencent-ai-chat',
        data: {
          model: TENCENT_AI_CONFIG.hunyuan.model,
          messages: messages,
          temperature: TENCENT_AI_CONFIG.hunyuan.temperature,
          max_tokens: TENCENT_AI_CONFIG.hunyuan.maxTokens
        }
      })
      
      return result.result?.content || '抱歉，我现在无法回答这个问题。'
    } catch (error) {
      console.error('调用混元 API 失败:', error)
      throw error
    }
  }

  /**
   * 获取或创建会话
   * @param {string} sessionId 会话ID
   * @param {Object} context 上下文
   * @returns {Object} 会话对象
   */
  getOrCreateSession(sessionId, context = {}) {
    if (!sessionId) {
      sessionId = this.generateSessionId()
    }
    
    let session = this.sessions.get(sessionId)
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        context: {
          brandId: context.brandId || '1',
          skuId: context.skuId || null,
          userName: context.userName || '茶友',
          ...context
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.sessions.set(sessionId, session)
    }
    
    return session
  }

  /**
   * 构建对话消息
   * @param {Object} session 会话对象
   * @param {string} message 用户消息
   * @param {Object} context 上下文
   * @returns {Array} 消息数组
   */
  buildMessages(session, message, context) {
    const messages = []
    
    // 系统提示词
    let systemPrompt = TENCENT_AI_CONFIG.hunyuan.systemPrompt
    
    // 根据上下文调整系统提示
    if (context.brandName || context.skuName) {
      systemPrompt += `\n\n当前正在为顾客介绍【${context.brandName || '茶品牌'}】的【${context.skuName || '茶叶产品'}】。`
    }
    
    if (session.context.userName) {
      systemPrompt += `\n\n顾客称呼：${session.context.userName}`
    }
    
    messages.push({
      role: 'system',
      content: systemPrompt
    })
    
    // 添加历史对话（最近5轮）
    const recentMessages = session.messages.slice(-10)
    recentMessages.forEach(msg => {
      messages.push({
        role: 'user',
        content: msg.user
      })
      messages.push({
        role: 'assistant',
        content: msg.assistant
      })
    })
    
    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: message
    })
    
    return messages
  }

  /**
   * 更新会话
   * @param {string} sessionId 会话ID
   * @param {string} userMessage 用户消息
   * @param {string} assistantMessage AI回复
   */
  updateSession(sessionId, userMessage, assistantMessage) {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.messages.push({
        user: userMessage,
        assistant: assistantMessage,
        timestamp: new Date()
      })
      session.updatedAt = new Date()
      
      // 限制消息数量，避免上下文过长
      if (session.messages.length > 20) {
        session.messages = session.messages.slice(-20)
      }
    }
  }

  /**
   * 生成会话ID
   * @returns {string}
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 获取备用回复
   * @param {string} message 用户消息
   * @param {Object} context 上下文
   * @returns {string}
   */
  getFallbackResponse(message, context) {
    const fallbacks = [
      '这款茶建议用90-95℃的水温冲泡，第一泡醒茶10秒后倒掉，从第二泡开始品饮，每泡延长5-10秒。',
      '此茶产自高山云雾之中，海拔1800米，昼夜温差大，造就其独特的高山韵味。',
      '茶汤入口清甜，回甘绵长，适合清晨或午后静心品饮。',
      '冲泡时请注意水质，建议使用纯净水或山泉水，这样能更好地展现茶叶的香气。',
      '品茶时建议小口慢饮，让茶汤在口中停留片刻，感受其层次丰富的味道变化。'
    ]
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }

  /**
   * 获取会话历史
   * @param {string} sessionId 会话ID
   * @returns {Array}
   */
  getSessionHistory(sessionId) {
    const session = this.sessions.get(sessionId)
    return session ? session.messages : []
  }

  /**
   * 清除会话
   * @param {string} sessionId 会话ID
   */
  clearSession(sessionId) {
    this.sessions.delete(sessionId)
  }

  /**
   * 获取所有会话
   * @returns {Array}
   */
  getAllSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      context: session.context,
      messageCount: session.messages.length,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }))
  }
}

/**
 * 茶艺师专业问答
 */
export class TeaMasterAI extends TencentCloudAIAgent {
  constructor() {
    super()
    this.teaKnowledgeBase = this.initTeaKnowledge()
  }

  /**
   * 初始化茶叶知识库
   */
  initTeaKnowledge() {
    return {
      // 茶叶分类知识
      categories: {
        green: {
          name: '绿茶',
          features: '清汤绿叶，口感清爽，富含维生素',
          brewing: '水温80-85℃，时间1-2分钟',
          examples: ['龙井', '碧螺春', '黄山毛峰']
        },
        black: {
          name: '红茶',
          features: '红汤红叶，口感醇厚，性温和',
          brewing: '水温90-95℃，时间2-3分钟',
          examples: ['正山小种', '祁门红茶', '滇红']
        },
        oolong: {
          name: '乌龙茶',
          features: '青汤黄叶，香气馥郁，回味悠长',
          brewing: '水温95-100℃，时间1-2分钟',
          examples: ['铁观音', '大红袍', '凤凰单丛']
        },
        white: {
          name: '白茶',
          features: '汤色浅黄，口感清淡，天然纯净',
          brewing: '水温85-90℃，时间2-3分钟',
          examples: ['白毫银针', '白牡丹', '寿眉']
        }
      },
      
      // 冲泡技巧
      brewingTips: [
        '温杯：用热水烫杯，提高茶具温度',
        '投茶：根据茶具大小投入适量茶叶',
        '注水：沿杯壁注水，避免直接冲击茶叶',
        '出汤：掌握好时间，避免过度浸泡',
        '分茶：均匀分茶，保证口感一致'
      ],
      
      // 品茶礼仪
      teaEtiquette: [
        '持杯：右手持杯，左手托底',
        '闻香：先闻其香，再品其味',
        '小口：小口慢饮，细细品味',
        '回甘：感受茶汤在口中的变化',
        '谢茶：品茶后表示感谢'
      ]
    }
  }

  /**
   * 专业茶叶问答
   * @param {string} question 问题
   * @returns {string}
   */
  async askTeaQuestion(question) {
    // 检查是否是茶叶专业问题
    const keywords = ['茶叶', '冲泡', '水温', '时间', '绿茶', '红茶', '乌龙茶', '白茶', '品茶']
    const isTeaQuestion = keywords.some(keyword => question.includes(keyword))
    
    if (isTeaQuestion) {
      // 基于知识库回答
      const knowledge = this.searchTeaKnowledge(question)
      if (knowledge) {
        return knowledge
      }
    }
    
    // 调用通用 AI
    return await this.chat(question, null, { domain: 'tea' })
  }

  /**
   * 搜索茶叶知识
   * @param {string} question 问题
   * @returns {string|null}
   */
  searchTeaKnowledge(question) {
    const knowledge = this.teaKnowledgeBase
    
    // 简单的关键词匹配
    if (question.includes('绿茶')) {
      return `绿茶是不发酵茶，具有清汤绿叶的特点。${knowledge.categories.green.features}。冲泡建议：${knowledge.categories.green.brewing}。代表茶品：${knowledge.categories.green.examples.join('、')}。`
    }
    
    if (question.includes('红茶')) {
      return `红茶是全发酵茶，具有红汤红叶的特点。${knowledge.categories.black.features}。冲泡建议：${knowledge.categories.black.brewing}。代表茶品：${knowledge.categories.black.examples.join('、')}。`
    }
    
    if (question.includes('乌龙茶')) {
      return `乌龙茶是半发酵茶，具有青汤黄叶的特点。${knowledge.categories.oolong.features}。冲泡建议：${knowledge.categories.oolong.brewing}。代表茶品：${knowledge.categories.oolong.examples.join('、')}。`
    }
    
    if (question.includes('白茶')) {
      return `白茶是微发酵茶，具有汤色浅黄的特点。${knowledge.categories.white.features}。冲泡建议：${knowledge.categories.white.brewing}。代表茶品：${knowledge.categories.white.examples.join('、')}。`
    }
    
    if (question.includes('冲泡') || question.includes('泡茶')) {
      const tips = knowledge.brewingTips.join('；')
      return `冲泡好茶的关键步骤：${tips}。记住"好茶要好泡，好泡要好水"。`
    }
    
    return null
  }
}

// 创建全局实例
export const aiAgent = new TencentCloudAIAgent()
export const teaMaster = new TeaMasterAI()

export default {
  TencentCloudAIAgent,
  TeaMasterAI,
  aiAgent,
  teaMaster,
  TENCENT_AI_CONFIG
}
