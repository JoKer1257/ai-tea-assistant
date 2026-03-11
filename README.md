# AI茶管家 - 茶场景智能助手小程序

## 📖 项目简介

AI茶管家是一款基于微信小程序的智能茶助手，结合CloudBase云开发和AI技术，为用户提供个性化的茶叶推荐、泡茶指导和茶文化知识。

## 🚀 核心功能

- 🍵 **AI智能推荐** - 基于用户偏好的个性化茶叶推荐
- 💬 **智能对话** - AI助手实时解答茶相关问题
- 📱 **优雅界面** - 基于TDesign的现代化UI设计
- ☁️ **云端同步** - CloudBase云开发支持

## 🛠️ 技术栈

- **前端**: 微信小程序原生开发
- **UI组件**: TDesign Miniprogram
- **后端**: 腾讯云CloudBase
- **AI**: 混元AI模型
- **数据存储**: 云数据库

## 📁 项目结构

```
tea-agent/
├── miniprogram/          # 小程序前端代码
│   ├── pages/           # 页面文件
│   ├── components/      # 组件文件
│   ├── app.js          # 小程序入口
│   └── app.json        # 全局配置
├── cloudfunctions/      # 云函数
├── package.json        # 依赖配置
└── project.config.json  # 项目配置
```

## 🎯 界面优化

项目已完成界面优化：
- ✅ AI聊天弹窗留白优化
- ✅ 微交互动画效果
- ✅ 响应式设计适配
- ✅ 茶文化主题配色

## 🤖 多Agent协作

支持多Agent协作开发：
- 🎨 Frontend Design Agent - 前端界面优化
- 🎭 UI/UX Design Agent - 用户体验设计
- 📊 Data Analysis Agent - 数据分析和推荐算法
- 🔧 System Integration Agent - 系统集成

## 📦 安装和运行

1. 克隆项目
```bash
git clone https://github.com/JoKer1257/tea-agent.git
cd tea-agent
```

2. 安装依赖
```bash
npm install
```

3. 配置CloudBase
- 在微信开发者工具中导入项目
- 配置CloudBase环境ID
- 上传云函数

4. 运行项目
- 在微信开发者工具中预览
- 或扫码在真机上调试

## 🔧 开发指南

### 本地开发
- 使用微信开发者工具进行开发
- 修改代码后实时预览效果

### 云函数部署
```bash
# 部署所有云函数
wx cloud deploy

# 部署单个云函数
wx cloud deploy functions/function-name
```

## 📈 项目特色

- **智能推荐算法** - 基于用户行为的动态推荐
- **优雅交互设计** - 流畅的动画和微交互
- **多Agent架构** - 支持并行开发和优化
- **云端一体化** - 前后端无缝集成

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [TDesign](https://tdesign.tencent.com/) - 优秀的企业级UI组件库
- [腾讯云CloudBase](https://cloudbase.net/) - 强大的云开发平台
- [混元AI](https://hunyuan.tencent.com/) - 智能的AI对话能力

---

**AI茶管家** - 让茶文化更智能，让品茶更科学 🍵✨
