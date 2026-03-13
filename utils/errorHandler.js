/**
 * 小程序错误处理工具
 * 统一处理 uni.request 和其他 API 的错误
 */

import { buildApiUrl } from './appConfig'

/**
 * 安全的错误信息提取
 * @param {Error|Object|undefined|null} err 错误对象
 * @returns {string} 错误信息
 */
export const getErrorMessage = (err) => {
  if (!err || typeof err !== 'object') return 'Unknown error'
  
  // 优先级顺序获取错误信息
  return err?.errMsg || 
         err?.message || 
         err?.error || 
         err?.detail || 
         err?.data?.message ||
         JSON.stringify(err)
}

/**
 * 安全的 uni.request 包装器
 * @param {Object} options uni.request 配置
 * @returns {Promise} Promise 对象
 */
export const safeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      timeout: 10000,
      header: {
        'Content-Type': 'application/json'
      }
    }
    
    const finalOptions = { ...defaultOptions, ...options }
    
    uni.request({
      ...finalOptions,
      url: buildApiUrl(finalOptions.url),
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res)
        } else {
          const errorMsg = res.data?.message || res.data?.error || `HTTP ${res.statusCode}`
          reject(new Error(errorMsg))
        }
      },
      fail: (err) => {
        const errorMsg = getErrorMessage(err)
        reject(new Error(errorMsg))
      }
    })
  })
}

/**
 * GET 请求
 * @param {string} url 请求地址
 * @param {Object} params 查询参数
 * @param {Object} options 额外配置
 */
export const safeGet = (url, params = {}, options = {}) => {
  // 微信小程序不支持 URL 构造函数，需要手动拼接参数
  let finalUrl = url
  
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    if (queryString) {
      finalUrl += (url.includes('?') ? '&' : '?') + queryString
    }
  }
  
  return safeRequest({
    url: finalUrl,
    method: 'GET',
    ...options
  })
}

/**
 * POST 请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 额外配置
 */
export const safePost = (url, data = {}, options = {}) => {
  return safeRequest({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * 错误日志记录
 * @param {string} context 错误上下文
 * @param {Error|Object} err 错误对象
 */
export const logError = (context, err) => {
  const errorMsg = getErrorMessage(err)
  console.error(`[${context}] Error:`, errorMsg, err)
  
  // 可以在这里添加错误上报逻辑
  if (typeof wx !== 'undefined' && wx.reportAnalytics) {
    wx.reportAnalytics('js_error', {
      context,
      error: errorMsg
    })
  }
}

/**
 * 用户友好的错误提示
 * @param {string} fallback 默认提示
 * @param {Error|Object} err 错误对象
 */
export const showErrorToast = (fallback = '操作失败', err) => {
  const errorMsg = getErrorMessage(err)
  let message = fallback
  
  // 根据错误类型显示不同的提示
  if (errorMsg.includes('timeout')) {
    message = '请求超时，请检查网络连接'
  } else if (errorMsg.includes('network') || errorMsg.includes('fail')) {
    message = '网络连接异常，请稍后重试'
  } else if (errorMsg.includes('401') || errorMsg.includes('auth')) {
    message = '登录已过期，请重新登录'
  } else if (errorMsg.includes('403') || errorMsg.includes('permission')) {
    message = '权限不足，无法执行此操作'
  } else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
    message = '请求的资源不存在'
  } else if (errorMsg.includes('500') || errorMsg.includes('server')) {
    message = '服务器异常，请稍后重试'
  }
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 3000
  })
}

export default {
  getErrorMessage,
  safeRequest,
  safeGet,
  safePost,
  logError,
  showErrorToast
}
