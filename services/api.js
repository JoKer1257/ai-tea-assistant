import { buildApiUrl } from '../utils/appConfig.js'

const clearAuthState = () => {
  if (typeof uni !== 'undefined' && uni.removeStorageSync) {
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('openid')
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('openid')
  }

  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

/**
 * 带认证的 fetch 请求
 */
export async function fetchWithAuth(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // 包含 cookies
    ...options,
  }

  const response = await fetch(buildApiUrl(url), config)
  
  if (!response.ok) {
    // 如果是 401 未授权，可能是 token 过期
    if (response.status === 401) {
      clearAuthState()
    }
    
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response
}

/**
 * GET 请求
 */
export async function get(url, params = {}) {
  const searchParams = new URLSearchParams(params)
  const urlWithParams = searchParams.toString() ? `${url}?${searchParams}` : url
  return fetchWithAuth(urlWithParams)
}

/**
 * POST 请求
 */
export async function post(url, data = {}) {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PUT 请求
 */
export async function put(url, data = {}) {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE 请求
 */
export async function del(url) {
  return fetchWithAuth(url, {
    method: 'DELETE',
  })
}

/**
 * 上传文件
 */
export async function upload(url, formData) {
  return fetchWithAuth(url, {
    method: 'POST',
    headers: {}, // 不设置 Content-Type，让浏览器自动设置
    body: formData,
  })
}
