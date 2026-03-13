/**
 * 微信小程序图标工具
 * 替代 Font Awesome，使用 Emoji 和 Symbol 字符
 */

/**
 * 图标映射表
 */
export const ICONS = {
  // 导航类
  search: '🔍',
  user: '👤',
  home: '🏠',
  back: '‹',
  arrowRight: '›',
  menu: '☰',
  close: '✕',
  
  // 功能类
  heart: '❤️',
  star: '⭐',
  share: '📤',
  check: '✓',
  edit: '✏️',
  delete: '🗑️',
  copy: '📋',
  download: '⬇️',
  upload: '⬆️',
  
  // 茶相关
  tea: '🍵',
  leaf: '🍃',
  cup: '☕',
  flower: '🌸',
  mountain: '⛰️',
  water: '💧',
  
  // 状态类
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  loading: '⏳',
  
  // 社交类
  like: '👍',
  comment: '💬',
  favorite: '⭐',
  bookmark: '🔖',
  
  // 商业类
  cart: '🛒',
  gift: '🎁',
  coupon: '🎫',
  money: '💰',
  tag: '🏷️',
  
  // 时间类
  clock: '🕐',
  calendar: '📅',
  timer: '⏰',
  
  // 位置类
  location: '📍',
  map: '🗺️',
  phone: '📞',
  email: '✉️',
  
  // 媒体类
  image: '🖼️',
  video: '🎥',
  music: '🎵',
  camera: '📷',
  
  // 茶平台专用
  brand: '🏮',
  quality: '🌟',
  origin: '🌍',
  process: '⚗️',
  package: '📦',
  
  // 抽奖相关
  lottery: '🎰',
  prize: '🏆',
  ticket: '🎫',
  dice: '🎲',
  gift: '🎁',
  
  // AI 相关
  robot: '🤖',
  brain: '🧠',
  chat: '💬',
  smart: '✨',
  magic: '🪄'
}

/**
 * 获取图标字符
 * @param {string} name 图标名称
 * @returns {string} 图标字符
 */
export const getIcon = (name) => {
  return ICONS[name] || '❓'
}

/**
 * 图标组件样式
 */
export const iconStyles = {
  base: {
    display: 'inline-block',
    fontStyle: 'normal',
    fontVariant: 'normal',
    textRendering: 'auto',
    lineHeight: '1',
    textAlign: 'center'
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  },
  colors: {
    primary: '#1C1917',
    accent: '#CA8A04',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#D97706',
    info: '#2563EB',
    gray: '#6B7280',
    light: '#F9FAFB'
  }
}

/**
 * 生成图标类名
 * @param {string} name 图标名称
 * @param {string} size 尺寸
 * @param {string} color 颜色
 * @returns {string} CSS 类名
 */
export const getIconClass = (name, size = 'md', color = 'primary') => {
  return `icon icon-${name} icon-${size} icon-${color}`
}

/**
 * Vue 组件用：计算图标样式
 * @param {string} size 尺寸
 * @param {string} color 颜色
 * @returns {object} 样式对象
 */
export const getIconStyle = (size = 'md', color = 'primary') => {
  return {
    fontSize: iconStyles.sizes[size] || iconStyles.sizes.md,
    color: iconStyles.colors[color] || iconStyles.colors.primary,
    ...iconStyles.base
  }
}

export default {
  ICONS,
  getIcon,
  getIconClass,
  getIconStyle,
  iconStyles
}
