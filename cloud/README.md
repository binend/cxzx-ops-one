# 云平台智能运维管理系统 - Vue3版本

基于Vue3 + Three.js + Tailwind CSS构建的现代化云平台智能运维管理系统，具有丰富的交互动画和视觉效果。

## 🚀 技术栈

### 核心框架
- **Vue 3.4.0** - 渐进式JavaScript框架，使用Composition API
- **Vite 5.0** - 现代化前端构建工具
- **Vue Router 4** - 官方路由管理器

### 状态管理
- **Pinia 2.1.7** - Vue官方推荐的状态管理库

### UI与样式
- **Tailwind CSS 3.4** - 实用优先的CSS框架
- **Material Symbols** - Google Material Design图标库
- **Inter Font** - 现代化字体

### 3D与动画
- **Three.js 0.160** - 3D图形渲染库
- **VueUse 10.7** - Vue组合式工具集

### 数据可视化
- **Chart.js 4.4** - 图表库
- **Vue Chart.js 5.3** - Vue图表组件

## ✨ 功能特性

### 🎯 核心功能
1. **云平台概览** - 资源统计、区域分布、使用率趋势
2. **云平台详情** - 服务监控、告警管理、实时状态
3. **云平台智能分析** - 异常检测、趋势分析、智能告警

### 🎨 视觉效果
- **Three.js 3D背景** - 粒子系统、浮动几何体、动态连线
- **丰富的CSS动画** - 淡入淡出、滑动、缩放、旋转效果
- **响应式设计** - 适配桌面、平板、移动设备
- **白色背景主题** - 清新简洁的界面设计

### 🔄 交互体验
- **实时数据更新** - 自动刷新服务状态和资源使用率
- **智能通知系统** - 右上角弹出式通知提醒
- **侧边面板** - 详细的服务使用率信息展示
- **悬浮效果** - 卡片悬停、按钮点击反馈

## 📁 项目结构

```
cloud-platform-vue/
├── src/
│   ├── components/          # 组件目录
│   │   ├── OverviewDashboard/     # 概览仪表盘子组件
│   │   ├── PlatformDetails/       # 平台详情子组件
│   │   ├── IntelligentAnalysis/   # 智能分析子组件
│   │   ├── ThreeBackground.vue    # Three.js 3D背景
│   │   ├── SidePanel.vue          # 侧边面板
│   │   └── NotificationContainer.vue # 通知容器
│   ├── views/               # 页面组件
│   │   └── Home.vue         # 主页面
│   ├── stores/              # 状态管理
│   │   └── app.js           # 应用状态
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── assets/              # 静态资源
│   │   └── styles/          # 样式文件
│   │       └── global.css   # 全局样式
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── public/                  # 公共资源
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.js          # Vite配置
├── tailwind.config.js      # Tailwind配置
└── README.md               # 项目说明
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
cd cloud-platform-vue
npm install
# 或
yarn install
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## 🎮 使用指南

### 主要页面功能

#### 1. 云平台概览
- **资源统计卡片** - 显示OBS存储、CPU、内存、硬盘的使用情况
- **环境与区域分布** - 柱状图和饼图展示不同环境在各个区域的分布
- **CPU与内存使用率趋势** - 实时曲线图展示24小时内的使用趋势
- **SFS存储统计** - 详细的文件系统存储信息

#### 2. 云平台详情
- **告警监控** - 实时告警信息展示和分类
- **搜索过滤** - 按名称、IP、状态过滤服务
- **服务列表** - 详细的资源使用率表格
- **查看使用率** - 点击按钮显示详细信息侧边面板

#### 3. 云平台智能分析
- **时间范围过滤** - 选择不同的分析时间范围
- **异常趋势图** - 识别资源使用异常
- **高IO服务器识别** - 显示高负载服务器列表
- **网络流量分析** - 各服务网络使用情况
- **智能告警建议** - AI生成的优化建议

### 交互特性
- **卡片悬停** - 鼠标悬停显示动画效果
- **实时更新** - 数据自动刷新（30秒间隔）
- **通知提醒** - 操作反馈和系统通知
- **响应式设计** - 适配不同屏幕尺寸

## 🎨 Three.js 3D背景效果

系统集成了丰富的Three.js 3D动画效果：

### 粒子系统
- 150个动态粒子，具有呼吸动画效果
- 白色系配色方案（蓝、绿、白色）
- 粒子大小和透明度动态变化

### 浮动几何体
- 5个随机分布的多面体
- 旋转和浮动动画
- 玻璃态材质效果

### 动态连线
- 20条连接线，模拟网络连接
- 透明度呼吸效果
- 增强视觉层次感

### 相机动画
- 轻微的相机移动，增加沉浸感
- 保持最佳观看角度

## 🔧 自定义配置

### 修改主题颜色
在 `tailwind.config.js` 中修改颜色配置：

```javascript
theme: {
  extend: {
    colors: {
      primary: '#2b8cee', // 修改主色调
      // 其他颜色...
    }
  }
}
```

### 调整Three.js效果
在 `ThreeBackground.vue` 中修改参数：

```javascript
// 粒子数量
const particleCount = 150

// 几何体数量
for (let i = 0; i < 5; i++) {
  // 修改几何体数量和属性
}
```

### 自定义动画
在 `global.css` 中添加新的动画：

```css
@keyframes customAnimation {
  from { /* 起始状态 */ }
  to { /* 结束状态 */ }
}
```

## 📱 响应式支持

- **桌面端** (>=1024px) - 完整功能展示
- **平板端** (768px-1023px) - 适配布局调整
- **移动端** (<768px) - 简化界面，保持核心功能

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Three.js](https://threejs.org/) - 3D图形库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Material Symbols](https://fonts.google.com/icons) - 图标库
- [Vite](https://vitejs.dev/) - 现代化构建工具

---

**云平台智能运维管理系统** - 让运维更智能、更高效！ 🚀