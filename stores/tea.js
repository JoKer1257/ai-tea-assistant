import { defineStore } from 'pinia'
import { teaAPI, aiAPI, userAPI } from '@/api/tea'

export const useTeaStore = defineStore('tea', {
  state: () => ({
    // 茶品数据
    teaList: [],
    currentTea: null,
    
    // 礼盒数据
    giftList: [],
    currentGift: null,
    
    // AI对话
    messages: [],
    currentSessionId: null,
    isStreaming: false,
    
    // 用户数据
    userInfo: {
      name: '茶客',
      tastedCount: 12,
      collectionCount: 8,
      shareCount: 5,
      points: 168
    },
    
    // 收藏
    collections: [],
    
    // 搜索结果
    searchResults: [],
    
    // 加载状态
    loading: false,
    error: null
  }),
  
  getters: {
    // 获取热门茶品
    popularTeas: (state) => {
      return state.teaList.slice(0, 4)
    },
    
    // 获取推荐礼盒
    recommendedGifts: (state) => {
      return state.giftList.filter(gift => gift.rating >= 4.8)
    },
    
    // 获取最近对话
    recentMessages: (state) => {
      return state.messages.slice(-10)
    }
  },
  
  actions: {
    // 加载茶品列表
    async loadTeaList(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await teaAPI.getTeaList(params)
        this.teaList = response.data || this.getDefaultTeaList()
      } catch (error) {
        console.error('Failed to load tea list:', error)
        this.error = error.message
        // 使用默认数据
        this.teaList = this.getDefaultTeaList()
      } finally {
        this.loading = false
      }
    },
    
    // 加载茶品详情
    async loadTeaDetail(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await teaAPI.getTeaDetail(id)
        this.currentTea = response.data
      } catch (error) {
        console.error('Failed to load tea detail:', error)
        this.error = error.message
        // 从列表中查找
        this.currentTea = this.teaList.find(tea => tea.id == id)
      } finally {
        this.loading = false
      }
    },
    
    // 加载礼盒列表
    async loadGiftList(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await teaAPI.getGiftList(params)
        this.giftList = response.data || this.getDefaultGiftList()
      } catch (error) {
        console.error('Failed to load gift list:', error)
        this.error = error.message
        // 使用默认数据
        this.giftList = this.getDefaultGiftList()
      } finally {
        this.loading = false
      }
    },
    
    // AI对话
    async sendMessage(message) {
      if (this.isStreaming) return
      
      // 添加用户消息
      this.messages.push({
        type: 'user',
        content: message,
        timestamp: new Date()
      })
      
      this.isStreaming = true
      
      try {
        // 模拟流式回复
        const response = await this.simulateAIResponse(message)
        
        // 添加AI回复
        this.messages.push({
          type: 'ai',
          content: response,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Failed to send message:', error)
        this.error = error.message
      } finally {
        this.isStreaming = false
      }
    },
    
    // 模拟AI回复
    async simulateAIResponse(message) {
      // 知识库
      const knowledge = {
        '龙井': '西湖龙井，产于杭州西湖山区。明前采摘，一芽一叶，炒制扁平光滑，色泽翠绿。冲泡水温85°C，投茶3g，注水150ml，浸泡2-3分钟。香气豆香明显，滋味甘醇鲜爽。',
        '大红袍': '武夷大红袍，岩茶之王。产于武夷山九龙窠，生长在岩壁之上。条索紧结，色泽乌褐，汤色橙黄明亮。岩韵明显，兰花香持久，滋味醇厚回甘。',
        '铁观音': '安溪铁观音，乌龙茶代表。卷曲紧结如蜻蜓头，砂绿油润。香气高扬，有天然的兰花香。滋味醇厚甘鲜，回甘悠长，七泡仍有余香。',
        '白毫银针': '福鼎白毫银针，白茶极品。满披白毫，如针似雪。只采单芽，不炒不揉，自然萎凋。滋味清鲜淡雅，毫香显露，汤色杏黄明亮。'
      }
      
      // 检查关键词
      for (const [teaName, description] of Object.entries(knowledge)) {
        if (message.includes(teaName)) {
          return description
        }
      }
      
      // 默认回复
      return `关于"${message}"，这是茶中佳品。每款茶都有其独特的生长环境与制作工艺。建议您提供更具体的茶名，我将为您详细解读其产地特征、制作工艺与品饮之道。`
    },
    
    // 搜索茶品
    async searchTeas(keyword) {
      this.loading = true
      this.error = null
      
      try {
        const response = await teaAPI.searchTeas(keyword)
        this.searchResults = response.data || []
      } catch (error) {
        console.error('Failed to search teas:', error)
        this.error = error.message
        // 本地搜索
        this.searchResults = this.teaList.filter(tea => 
          tea.name.includes(keyword) || 
          tea.description.includes(keyword)
        )
      } finally {
        this.loading = false
      }
    },
    
    // 加载用户信息
    async loadUserInfo() {
      try {
        const response = await userAPI.getUserInfo()
        this.userInfo = response.data || this.userInfo
      } catch (error) {
        console.error('Failed to load user info:', error)
        // 使用默认数据
      }
    },
    
    // 切换收藏
    toggleCollection(tea) {
      const index = this.collections.findIndex(item => item.id === tea.id)
      if (index > -1) {
        this.collections.splice(index, 1)
      } else {
        this.collections.push(tea)
      }
    },
    
    // 清空对话
    clearMessages() {
      this.messages = []
      this.currentSessionId = null
    },
    
    // 默认茶品数据
    getDefaultTeaList() {
      return [
        {
          id: 1,
          name: '武夷大红袍',
          description: '岩骨花香，百年母树工艺传承，汤色琥珀澄亮。',
          price: '1,280',
          unit: '礼盒装',
          image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=400&auto=format&fit=crop',
          number: '壹',
          category: '乌龙茶',
          origin: '福建武夷山',
          rating: 4.9
        },
        {
          id: 2,
          name: '极品白毫银针',
          description: '满披白毫，如针似雪，滋味清鲜毫香显。',
          price: '860',
          unit: '50g',
          image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8c792?q=80&w=400&auto=format&fit=crop',
          number: '贰',
          category: '白茶',
          origin: '福建福鼎',
          rating: 4.8
        },
        {
          id: 3,
          name: '西湖龙井',
          description: '色绿香郁，味甘形美，明前采摘尤为珍贵。',
          price: '680',
          unit: '250g',
          image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=400&auto=format&fit=crop',
          number: '叁',
          category: '绿茶',
          origin: '杭州西湖',
          rating: 4.7
        },
        {
          id: 4,
          name: '安溪铁观音',
          description: '兰花香显，观音韵足，七泡有余香。',
          price: '520',
          unit: '250g',
          image: 'https://images.unsplash.com/photo-1546852199-2d8e8c531631?q=80&w=400&auto=format&fit=crop',
          number: '肆',
          category: '乌龙茶',
          origin: '福建安溪',
          rating: 4.6
        }
      ]
    },
    
    // 默认礼盒数据
    getDefaultGiftList() {
      return [
        {
          id: 1,
          name: '山水雅集礼盒',
          description: '内含大红袍、白毫银针、龙井各30g，手工锦盒包装',
          price: '1,680',
          unit: '套',
          image: 'https://images.unsplash.com/photo-1600210492493-0946e0a64c8a?q=80&w=400&auto=format&fit=crop',
          rating: '4.9',
          category: '综合茶礼'
        },
        {
          id: 2,
          name: '禅意茶器礼盒',
          description: '汝窑茶具一套 + 特级铁观音50g，礼盒装',
          price: '980',
          unit: '套',
          image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=400&auto=format&fit=crop',
          rating: '4.8',
          category: '茶器套装'
        },
        {
          id: 3,
          name: '四季茗茶礼盒',
          description: '春茶、夏茶、秋茶、冬茶各50g，四季时令精选',
          price: '1,280',
          unit: '套',
          image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=400&auto=format&fit=crop',
          rating: '4.7',
          category: '时令茶礼'
        },
        {
          id: 4,
          name: '大师监制礼盒',
          description: '非遗传承人手工制作，限量版收藏级茶品',
          price: '3,280',
          unit: '套',
          image: 'https://images.unsplash.com/photo-1546852199-2d8e8c531631?q=80&w=400&auto=format&fit=crop',
          rating: '5.0',
          category: '收藏级茶礼'
        },
        {
          id: 5,
          name: '商务茗茶套装',
          description: '高端商务场合专用，含茶具+茶点+茶书',
          price: '2,180',
          unit: '套',
          image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=400&auto=format&fit=crop',
          rating: '4.6',
          category: '商务茶礼'
        }
      ]
    }
  }
})
