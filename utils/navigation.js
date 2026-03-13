/**
 * 统一导航工具类
 * 提供一致的页面跳转和返回体验
 */

/**
 * 导航模式枚举
 */
export const NAVIGATION_MODES = {
  PUSH: 'push',        // navigateTo - 可返回
  REPLACE: 'replace',  // redirectTo - 不可返回
  BACK: 'back',        // navigateBack - 返回上一页
  RESTART: 'restart'   // 重启到指定页面
}

/**
 * 页面路径常量
 */
export const PAGE_PATHS = {
  WELCOME: '/pages/welcome/index',
  BRAND: '/pages/brand/index',
  PRODUCT: '/pages/product/index',
  CHAT: '/pages/chat/index',
  LOTTERY: '/pages/lottery/index',
  SCAN: '/pages/scan/index',
  RESULT: '/pages/result/index',
  COUPONS: '/pages/coupons/index',
  USER: '/pages/user/index'
}

/**
 * 统一导航工具类
 */
export class UnifiedNavigation {
  constructor() {
    this.currentPage = null
    this.pageStack = []
    this.init()
  }

  /**
   * 初始化导航系统
   */
  init() {
    try {
      const pages = getCurrentPages()
      if (pages && pages.length > 0) {
        this.currentPage = pages[pages.length - 1]
        this.updatePageStack(pages)
      }
    } catch (error) {
      console.warn('导航初始化失败:', error)
    }
  }

  /**
   * 更新页面栈
   * @param {Array} pages 页面数组
   */
  updatePageStack(pages) {
    this.pageStack = pages.map(page => ({
      route: page.route,
      options: page.options || {},
      __wxExparserNodeId: page.__wxExparserNodeId
    }))
  }

  /**
   * 统一的页面跳转方法
   * @param {string} path 目标页面路径
   * @param {Object} options 跳转选项
   * @returns {Promise}
   */
  async navigateTo(path, options = {}) {
    const {
      mode = NAVIGATION_MODES.PUSH,
      animationType = 'pop-in',
      animationDuration = 300,
      params = {},
      success,
      fail,
      complete
    } = options

    try {
      // 构建完整路径
      const fullPath = this.buildFullPath(path, params)
      
      // 记录跳转日志
      console.log(`导航跳转: ${this.currentPage?.route} -> ${fullPath} (模式: ${mode})`)

      return new Promise((resolve, reject) => {
        const config = {
          url: fullPath,
          animationType,
          animationDuration,
          success: (res) => {
            console.log('导航成功:', res)
            success?.(res)
            resolve(res)
          },
          fail: (err) => {
            console.error('导航失败:', err)
            fail?.(err)
            reject(err)
          },
          complete: (res) => {
            complete?.(res)
            // 更新当前页面信息
            this.init()
          }
        }

        switch (mode) {
          case NAVIGATION_MODES.PUSH:
            uni.navigateTo(config)
            break
          case NAVIGATION_MODES.REPLACE:
            uni.redirectTo(config)
            break
          case NAVIGATION_MODES.RESTART:
            uni.reLaunch(config)
            break
          default:
            uni.navigateTo(config)
        }
      })
    } catch (error) {
      console.error('导航异常:', error)
      throw error
    }
  }

  /**
   * 统一的返回方法
   * @param {Object} options 返回选项
   * @returns {Promise}
   */
  async navigateBack(options = {}) {
    const {
      delta = 1,
      animationType = 'pop-out',
      animationDuration = 300,
      success,
      fail,
      complete
    } = options

    try {
      const pages = getCurrentPages()
      
      // 检查是否可以返回
      if (pages.length <= 1) {
        console.warn('已经是第一页，无法返回')
        // 可以选择跳转到首页或其他页面
        return this.navigateTo(PAGE_PATHS.BRAND, { mode: NAVIGATION_MODES.REPLACE })
      }

      console.log(`返回上一页 (delta: ${delta})`)

      return new Promise((resolve, reject) => {
        uni.navigateBack({
          delta,
          animationType,
          animationDuration,
          success: (res) => {
            console.log('返回成功:', res)
            success?.(res)
            resolve(res)
          },
          fail: (err) => {
            console.error('返回失败:', err)
            fail?.(err)
            reject(err)
          },
          complete: (res) => {
            complete?.(res)
            // 更新当前页面信息
            this.init()
          }
        })
      })
    } catch (error) {
      console.error('返回异常:', error)
      throw error
    }
  }

  /**
   * 构建完整路径
   * @param {string} path 基础路径
   * @param {Object} params 查询参数
   * @returns {string}
   */
  buildFullPath(path, params = {}) {
    let fullPath = path
    
    if (Object.keys(params).length > 0) {
      const queryString = Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      
      if (queryString) {
        fullPath += (path.includes('?') ? '&' : '?') + queryString
      }
    }
    
    return fullPath
  }

  /**
   * 获取当前页面信息
   * @returns {Object}
   */
  getCurrentPage() {
    return this.currentPage
  }

  /**
   * 获取页面栈深度
   * @returns {number}
   */
  getStackDepth() {
    return this.pageStack.length
  }

  /**
   * 检查是否可以返回
   * @returns {boolean}
   */
  canGoBack() {
    return this.pageStack.length > 1
  }

  /**
   * 清空页面栈并跳转到指定页面
   * @param {string} path 目标页面路径
   * @param {Object} params 查询参数
   * @returns {Promise}
   */
  async restartTo(path, params = {}) {
    return this.navigateTo(path, {
      mode: NAVIGATION_MODES.RESTART,
      params
    })
  }

  /**
   * 替换当前页面
   * @param {string} path 目标页面路径
   * @param {Object} params 查询参数
   * @returns {Promise}
   */
  async replaceTo(path, params = {}) {
    return this.navigateTo(path, {
      mode: NAVIGATION_MODES.REPLACE,
      params
    })
  }
}

/**
 * 茶平台专用导航方法
 */
export class TeaPlatformNavigation extends UnifiedNavigation {
  constructor() {
    super()
  }

  /**
   * 跳转到品牌页面
   * @param {string} brandId 品牌ID
   * @param {string} skuId SKU ID
   * @param {Object} options 额外选项
   */
  async goToBrand(brandId, skuId = null, options = {}) {
    const params = { id: brandId }
    if (skuId) params.sku = skuId
    
    return this.navigateTo(PAGE_PATHS.BRAND, {
      params,
      ...options
    })
  }

  /**
   * 跳转到产品详情页
   * @param {string} brandId 品牌ID
   * @param {string} skuId SKU ID
   * @param {Object} options 额外选项
   */
  async goToProduct(brandId, skuId, options = {}) {
    return this.navigateTo(PAGE_PATHS.PRODUCT, {
      params: { brandId, skuId },
      ...options
    })
  }

  /**
   * 跳转到AI聊天页面
   * @param {string} brandId 品牌ID
   * @param {Object} options 额外选项
   */
  async goToChat(brandId, options = {}) {
    return this.navigateTo(PAGE_PATHS.CHAT, {
      params: { brandId },
      ...options
    })
  }

  /**
   * 跳转到抽奖页面
   * @param {string} brandId 品牌ID
   * @param {Object} options 额外选项
   */
  async goToLottery(brandId, options = {}) {
    return this.navigateTo(PAGE_PATHS.LOTTERY, {
      params: { brandId },
      ...options
    })
  }

  /**
   * 跳转到扫码页面
   * @param {Object} options 额外选项
   */
  async goToScan(options = {}) {
    return this.navigateTo(PAGE_PATHS.SCAN, options)
  }

  /**
   * 跳转到品鉴纪要页面
   * @param {string} brandId 品牌ID
   * @param {Object} options 额外选项
   */
  async goToResult(brandId, options = {}) {
    return this.navigateTo(PAGE_PATHS.RESULT, {
      params: { brandId },
      ...options
    })
  }

  /**
   * 跳转到优惠券页面
   * @param {Object} options 额外选项
   */
  async goToCoupons(options = {}) {
    return this.navigateTo(PAGE_PATHS.COUPONS, options)
  }

  /**
   * 跳转到用户中心
   * @param {Object} options 额外选项
   */
  async goToUser(options = {}) {
    return this.navigateTo(PAGE_PATHS.USER, options)
  }

  /**
   * 欢迎页完成后跳转到品牌页
   * @param {string} brandId 品牌ID
   */
  async welcomeComplete(brandId = '1') {
    return this.replaceTo(PAGE_PATHS.BRAND, { id: brandId })
  }

  /**
   * 扫码结果处理
   * @param {string} brandId 品牌ID
   * @param {string} skuId SKU ID
   * @param {string} sn 序列号
   */
  async handleScanResult(brandId, skuId = null, sn = null) {
    if (!brandId) {
      return this.restartTo(PAGE_PATHS.WELCOME)
    }

    const params = { id: brandId }
    if (skuId) params.sku = skuId
    if (sn) params.sn = sn

    return this.replaceTo(PAGE_PATHS.BRAND, params)
  }
}

// 创建全局导航实例
export const navigation = new TeaPlatformNavigation()

/**
 * 便捷的导航方法
 */
export const goTo = {
  brand: (brandId, skuId, options) => navigation.goToBrand(brandId, skuId, options),
  product: (brandId, skuId, options) => navigation.goToProduct(brandId, skuId, options),
  chat: (brandId, options) => navigation.goToChat(brandId, options),
  lottery: (brandId, options) => navigation.goToLottery(brandId, options),
  scan: (options) => navigation.goToScan(options),
  result: (brandId, options) => navigation.goToResult(brandId, options),
  coupons: (options) => navigation.goToCoupons(options),
  user: (options) => navigation.goToUser(options),
  welcome: () => navigation.navigateTo(PAGE_PATHS.WELCOME),
  back: (options) => navigation.navigateBack(options)
}

export default {
  UnifiedNavigation,
  TeaPlatformNavigation,
  navigation,
  goTo,
  NAVIGATION_MODES,
  PAGE_PATHS
}
