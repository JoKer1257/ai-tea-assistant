/**
 * CloudBase 云开发工具类
 * 支持微信小程序和 H5 双端
 */

// CloudBase 环境配置
const CLOUDBASE_ENV = "prod-2gijgxup3e1a84b0"

// 后端 API 地址 (CloudRun)
const API_BASE_URL = "https://tea-platform-api-231619-7-1409876108.sh.run.tcloudbase.com"

/**
 * 云数据库操作
 */
export const db = {
  /**
   * 获取数据库引用
   */
  getDb() {
    // #ifdef MP-WEIXIN
    return wx.cloud.database()
    // #endif
    // #ifdef H5
    // H5 端需要使用 @cloudbase/js-sdk
    console.warn("H5 端请使用 @cloudbase/js-sdk")
    return null
    // #endif
  },

  /**
   * 查询集合数据
   * @param {string} collection 集合名称
   * @param {object} options 查询选项
   */
  async get(collection, options = {}) {
    const database = this.getDb()
    if (!database) return []

    try {
      let query = database.collection(collection)
      
      if (options.where) query = query.where(options.where)
      if (options.orderBy) query = query.orderBy(options.orderBy.field, options.orderBy.order || 'desc')
      if (options.limit) query = query.limit(options.limit)
      if (options.skip) query = query.skip(options.skip)

      const res = await query.get()
      return res?.data || []
    } catch (e) {
      console.error('数据库查询失败:', e)
      return []
    }
  },

  /**
   * 添加数据
   * @param {string} collection 集合名称
   * @param {object} data 数据
   */
  async add(collection, data) {
    const database = this.getDb()
    if (!database) return null

    try {
      const res = await database.collection(collection).add({ data })
      return res
    } catch (e) {
      console.error('数据库添加失败:', e)
      throw e
    }
  },

  /**
   * 更新数据
   * @param {string} collection 集合名称
   * @param {object} where 查询条件
   * @param {object} data 更新数据
   */
  async update(collection, where, data) {
    const database = this.getDb()
    if (!database) return null

    try {
      const res = await database.collection(collection).where(where).update({ data })
      return res
    } catch (e) {
      console.error('数据库更新失败:', e)
      throw e
    }
  },

  /**
   * 删除数据
   * @param {string} collection 集合名称
   * @param {object} where 查询条件
   */
  async remove(collection, where) {
    const database = this.getDb()
    if (!database) return null

    try {
      const res = await database.collection(collection).where(where).remove()
      return res
    } catch (e) {
      console.error('数据库删除失败:', e)
      throw e
    }
  }
}

/**
 * 云函数操作
 */
export const cloudFunction = {
  /**
   * 调用云函数
   * @param {string} name 云函数名称
   * @param {object} data 参数
   */
  async call(name, data = {}) {
    // #ifdef MP-WEIXIN
    try {
      const res = await wx.cloud.callFunction({
        name,
        data
      })
      return res?.result || null
    } catch (e) {
      console.error('云函数调用失败:', e)
      throw e
    }
    // #endif

    // #ifdef H5
    // H5 端通过 HTTP 调用云函数
    console.warn("H5 端请使用 HTTP API 调用云函数")
    return null
    // #endif
  }
}

/**
 * 云存储操作
 */
export const cloudStorage = {
  /**
   * 上传文件
   * @param {string} cloudPath 云端路径
   * @param {string} filePath 本地文件路径
   */
  async upload(cloudPath, filePath) {
    // #ifdef MP-WEIXIN
    try {
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return res?.fileID || null
    } catch (e) {
      console.error('文件上传失败:', e)
      return null
    }
    // #endif

    // #ifdef H5
    console.warn("H5 端请使用 @cloudbase/js-sdk 上传文件")
    return null
    // #endif
  },

  /**
   * 下载文件
   * @param {string} fileID 文件ID
   */
  async download(fileID) {
    // #ifdef MP-WEIXIN
    try {
      const res = await wx.cloud.downloadFile({
        fileID
      })
      return res?.tempFilePath || null
    } catch (e) {
      console.error('文件下载失败:', e)
      return null
    }
    // #endif

    // #ifdef H5
    console.warn("H5 端请使用 @cloudbase/js-sdk 下载文件")
    return null
    // #endif
  },

  /**
   * 获取临时链接
   * @param {string[]} fileIDs 文件ID列表
   */
  async getTempUrl(fileIDs) {
    // #ifdef MP-WEIXIN
    try {
      const res = await wx.cloud.getTempFileURL({
        fileList: fileIDs
      })
      return res?.fileList || []
    } catch (e) {
      console.error('获取临时链接失败:', e)
      return []
    }
    // #endif

    // #ifdef H5
    console.warn("H5 端请使用 @cloudbase/js-sdk 获取临时链接")
    return []
    // #endif
  }
}

/**
 * 用户认证
 */
export const auth = {
  /**
   * 获取用户 OpenID (小程序端自动获取)
   */
  async getOpenId() {
    // #ifdef MP-WEIXIN
    try {
      // 小程序端通过云函数获取 OpenID
      const res = await wx.cloud.callFunction({
        name: 'getOpenId'
      })
      return res?.result?.openid || null
    } catch (e) {
      console.error('获取 OpenID 失败:', e)
      return null
    }
    // #endif

    // #ifdef H5
    console.warn("H5 端需要用户登录授权")
    return null
    // #endif
  }
}

/**
 * 后端 API 调用 (CloudRun)
 */
export const api = {
  baseUrl: API_BASE_URL,

  /**
   * GET 请求
   */
  async get(path, params = {}) {
    try {
      // 微信小程序不支持 URL 构造函数，需要手动拼接
      let finalUrl = `${this.baseUrl}${path}`
      
      if (params && Object.keys(params).length > 0) {
        const queryString = Object.keys(params)
          .filter(key => params[key] !== undefined && params[key] !== null)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
          .join('&')
        
        if (queryString) {
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString
        }
      }
      
      const res = await uni.request({
        url: finalUrl,
        method: 'GET'
      })
      return res?.data || null
    } catch (e) {
      const errorMsg = e?.errMsg || e?.message || e || 'Unknown error'
      console.error('API GET 请求失败:', errorMsg)
      return null
    }
  },

  /**
   * POST 请求
   */
  async post(path, data = {}) {
    try {
      const res = await uni.request({
        url: `${this.baseUrl}${path}`,
        method: 'POST',
        data,
        header: {
          'Content-Type': 'application/json'
        }
      })
      return res?.data || null
    } catch (e) {
      const errorMsg = e?.errMsg || e?.message || e || 'Unknown error'
      console.error('API POST 请求失败:', errorMsg)
      return null
    }
  }
}

// 默认导出
export default {
  env: CLOUDBASE_ENV,
  db,
  cloudFunction,
  cloudStorage,
  auth,
  api
}
