import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 茶品相关API
export const teaAPI = {
  // 获取茶品列表
  getTeaList: (params = {}) => {
    return api.get('/teas', { params })
  },
  
  // 获取茶品详情
  getTeaDetail: (id) => {
    return api.get(`/teas/${id}`)
  },
  
  // 获取礼盒列表
  getGiftList: (params = {}) => {
    return api.get('/gifts', { params })
  },
  
  // 获取礼盒详情
  getGiftDetail: (id) => {
    return api.get(`/gifts/${id}`)
  },
  
  // 搜索茶品
  searchTeas: (keyword) => {
    return api.get('/teas/search', { params: { keyword } })
  }
}

// AI茶经相关API
export const aiAPI = {
  // 发送消息
  sendMessage: (message, sessionId = null) => {
    return api.post('/ai/chat', { message, session_id: sessionId })
  },
  
  // 获取对话历史
  getChatHistory: (sessionId) => {
    return api.get(`/ai/sessions/${sessionId}/messages`)
  },
  
  // 创建新会话
  createSession: () => {
    return api.post('/ai/sessions')
  }
}

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getUserInfo: () => {
    return api.get('/user/info')
  },
  
  // 更新用户信息
  updateUserInfo: (data) => {
    return api.put('/user/info', data)
  },
  
  // 获取用户收藏
  getUserCollections: () => {
    return api.get('/user/collections')
  },
  
  // 获取用户订单
  getUserOrders: () => {
    return api.get('/user/orders')
  },
  
  // 获取用户优惠券
  getUserCoupons: () => {
    return api.get('/user/coupons')
  }
}

// 扫码相关API
export const scanAPI = {
  // 扫码解析
  scanQRCode: (params) => {
    return api.get('/scan', { params })
  },
  
  // 记录扫码日志
  logScan: (data) => {
    return api.post('/scan/log', data)
  }
}

export default api
