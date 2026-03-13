/**
 * 图片处理工具
 * 处理微信小程序中的图片加载问题
 */

/**
 * 图片域名白名单
 * 微信小程序需要配置 requestLegalDomain
 */
const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'cdn.jsdelivr.net',
  'file.example.com' // 替换为你的实际图片域名
]

/**
 * 本地图片映射
 * 当外部图片无法加载时使用的本地图片
 */
const LOCAL_IMAGE_FALLBACKS = {
  // 茶叶相关图片
  tea: {
    default: '/static/images/tea_longjing.png',
    oolong: '/static/images/tea_tieguanyin.png',
    green: '/static/images/tea_longjing.png',
    white: '/static/images/tea_silver_needle.png',
    black: '/static/images/tea_dahongpao.png'
  },
  // 品牌相关图片
  brand: {
    hero: '/static/images/tea_garden_banner.png',
    logo: '/static/images/logo.png'
  },
  // 用户头像
  avatar: '/static/images/tea_master_craft.png',
  // 默认图片
  placeholder: '/static/images/tea_longjing.png'
}

/**
 * 检查图片 URL 是否在白名单中
 * @param {string} url 图片 URL
 * @returns {boolean}
 */
export const isAllowedImageDomain = (url) => {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  try {
    const domain = url.split('//')[1]?.split('/')[0]
    return ALLOWED_IMAGE_DOMAINS.some(allowed => domain?.includes(allowed))
  } catch {
    return false
  }
}

/**
 * 获取图片的备用本地路径
 * @param {string} originalUrl 原始图片 URL
 * @param {string} type 图片类型
 * @returns {string}
 */
export const getFallbackImage = (originalUrl, type = 'placeholder') => {
  // 根据原始 URL 推断图片类型
  if (originalUrl.includes('tea') || originalUrl.includes('leaf')) {
    return LOCAL_IMAGE_FALLBACKS.tea.default
  }
  
  if (originalUrl.includes('brand') || originalUrl.includes('hero')) {
    return LOCAL_IMAGE_FALLBACKS.brand.hero
  }
  
  if (originalUrl.includes('avatar') || originalUrl.includes('user')) {
    return LOCAL_IMAGE_FALLBACKS.avatar
  }
  
  return LOCAL_IMAGE_FALLBACKS.placeholder
}

/**
 * 处理图片 URL，返回可用的图片地址
 * @param {string} url 原始图片 URL
 * @param {string} fallbackType 备用图片类型
 * @returns {string}
 */
export const processImageUrl = (url, fallbackType = 'placeholder') => {
  if (!url || typeof url !== 'string') {
    return getFallbackImage('', fallbackType)
  }

  if (url.startsWith('@/static/')) {
    return url.replace('@', '')
  }
  
  // 如果是本地路径，直接返回
  if (url.startsWith('/') || url.startsWith('./')) {
    return url
  }
  
  // 如果是允许的域名，尝试使用
  if (isAllowedImageDomain(url)) {
    return url
  }
  
  // 否则返回备用图片
  return getFallbackImage(url, fallbackType)
}

/**
 * 图片加载错误处理
 * @param {Event} event 错误事件
 * @param {string} fallbackType 备用图片类型
 */
export const handleImageError = (event, fallbackType = 'placeholder') => {
  const currentSrc = event?.detail?.currentSrc || event?.target?.src || ''
  const fallbackSrc = getFallbackImage(currentSrc, fallbackType)
  console.warn('图片加载失败，建议将绑定值切换到备用图:', fallbackSrc)
  return fallbackSrc
}

/**
 * 创建图片组件的数据
 * @param {string} src 图片源
 * @param {Object} options 选项
 * @returns {Object}
 */
export const createImageData = (src, options = {}) => {
  const {
    fallbackType = 'placeholder',
    mode = 'aspectFill',
    lazy = true,
    showLoading = true,
    showError = true
  } = options
  
  return {
    src: processImageUrl(src, fallbackType),
    mode,
    lazy,
    showLoading,
    showError,
    onError: (event) => handleImageError(event, fallbackType)
  }
}

/**
 * 预加载图片
 * @param {string[]} urls 图片 URL 数组
 * @returns {Promise}
 */
export const preloadImages = (urls) => {
  if (typeof Image === 'undefined') {
    return Promise.resolve(urls.map((url) => processImageUrl(url)))
  }

  return Promise.all(
    urls.map(url => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => resolve(null) // 失败也 resolve，不阻塞
        img.src = processImageUrl(url)
      })
    })
  )
}

/**
 * 获取图片尺寸信息
 * @param {string} url 图片 URL
 * @returns {Promise<Object>}
 */
export const getImageInfo = (url) => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: processImageUrl(url),
      success: (res) => resolve(res),
      fail: (err) => {
        console.warn('获取图片信息失败:', err)
        resolve({ width: 300, height: 200 }) // 返回默认尺寸
      }
    })
  })
}

export default {
  ALLOWED_IMAGE_DOMAINS,
  LOCAL_IMAGE_FALLBACKS,
  isAllowedImageDomain,
  getFallbackImage,
  processImageUrl,
  handleImageError,
  createImageData,
  preloadImages,
  getImageInfo
}
