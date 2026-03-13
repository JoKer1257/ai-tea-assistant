<script setup>
import { onLaunch, onShow, onHide, onError, onUnhandledRejection } from "@dcloudio/uni-app"

// CloudBase 环境配置
const CLOUDBASE_ENV = "prod-2gijgxup3e1a84b0"

onLaunch(() => {
  console.log("App Launch")
  
  // #ifdef MP-WEIXIN
  // 初始化微信云开发
  try {
    if (typeof wx !== 'undefined' && wx.cloud) {
      wx.cloud.init({
        env: CLOUDBASE_ENV,
        traceUser: true
      })
      console.log("CloudBase 初始化成功", CLOUDBASE_ENV)
    } else {
      console.warn("当前环境不支持 wx.cloud，请在微信开发者工具中开通云开发")
    }
  } catch (error) {
    console.error("CloudBase 初始化失败:", error)
  }
  // #endif
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})

onError((error) => {
  console.error("App Error:", error || 'Unknown error')
})

onUnhandledRejection((event) => {
  console.error("Unhandled Rejection:", event?.reason || event || 'Unknown error')
})
</script>

<style>
/* 全局样式已统一由 main.js 中的 style.css 注入 */

/* 基础样式 - Uni-app 中 body 建议写成 page */
page {
  font-family: 'PingFang SC', 'Noto Sans TC', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
  background-color: #F2EFE9;
}

/* 图标基础样式 */
.icon {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
  text-align: center;
}

/* 图标尺寸 */
.icon-xs { font-size: 12px; }
.icon-sm { font-size: 14px; }
.icon-md { font-size: 16px; }
.icon-lg { font-size: 18px; }
.icon-xl { font-size: 20px; }
.icon-2xl { font-size: 24px; }
.icon-3xl { font-size: 32px; }

/* 图标颜色 */
.icon-primary { color: #1C1917; }
.icon-accent { color: #CA8A04; }
.icon-success { color: #16A34A; }
.icon-error { color: #DC2626; }
.icon-warning { color: #D97706; }
.icon-info { color: #2563EB; }
.icon-gray { color: #6B7280; }
.icon-light { color: #F9FAFB; }

/* 茶平台专用图标 */
.icon-search:before { content: "🔍"; }
.icon-user:before { content: "👤"; }
.icon-heart:before { content: "❤️"; }
.icon-star:before { content: "⭐"; }
.icon-share:before { content: "📤"; }
.icon-home:before { content: "🏠"; }
.icon-back:before { content: "‹"; }
.icon-menu:before { content: "☰"; }
.icon-close:before { content: "✕"; }
.icon-check:before { content: "✓"; }
.icon-arrow-right:before { content: "›"; }
.icon-tea:before { content: "🍵"; }
.icon-leaf:before { content: "🍃"; }
.icon-cup:before { content: "☕"; }
.icon-flower:before { content: "🌸"; }
.icon-mountain:before { content: "⛰️"; }
.icon-water:before { content: "💧"; }
.icon-lottery:before { content: "🎰"; }
.icon-prize:before { content: "🏆"; }
.icon-ticket:before { content: "🎫"; }
.icon-gift:before { content: "🎁"; }
.icon-robot:before { content: "🤖"; }
.icon-chat:before { content: "💬"; }
.icon-smart:before { content: "✨"; }
</style>
