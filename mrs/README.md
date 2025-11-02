# 大数据运维系统 (MRS)

一个基于 Vue 3 的现代化大数据运维平台，提供实时监控、数据可视化和库表管理功能。

## 🚀 功能特性

### 📊 总览面板
- **系统状态监控**: 实时显示 Hive、ClickHouse、ElasticSearch 的运行状态
- **性能指标**: CPU、内存、磁盘 I/O、网络流量等关键指标
- **可视化图表**: 使用 Chart.js 提供丰富的数据可视化
- **实时更新**: 自动刷新数据，确保监控信息的时效性

### 🗄️ 库表清单
- **多数据库支持**: Hive、ClickHouse、ElasticSearch、DWS
- **层级浏览**: 数据库 → 表 → 字段的层级结构
- **搜索功能**: 快速搜索数据库和表
- **详细信息**: 表结构、字段类型、备注等详细信息
- **交互式界面**: 点击查看详情，支持字段级别的信息展示

### 📈 高 IO 分析
- **IO 指标监控**: 读取/写入 I/O、CPU、内存使用率
- **3D 可视化**: 使用 Three.js 创建的数据流向可视化
- **TOP 排行**: 高 IO 表格 TOP 10 排行榜
- **趋势分析**: 显示性能指标的变化趋势

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **样式**: CSS3 + 动画效果
- **图表库**: Chart.js + Vue-chartjs
- **3D 渲染**: Three.js
- **响应式设计**: 移动端适配

## 📁 项目结构

```
mrs/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── AppHeader.vue   # 页面头部和导航
│   │   ├── OverviewDashboard.vue  # 总览面板
│   │   ├── DatabaseInventory.vue  # 库表清单
│   │   ├── IOAnalysis.vue  # IO 分析
│   │   ├── FieldModal.vue  # 字段详情弹窗
│   │   ├── LoadingOverlay.vue  # 加载动画
│   │   └── ThreeBackground.vue  # 3D 背景
│   ├── composables/        # 组合式函数
│   │   └── useData.js      # 数据生成逻辑
│   ├── stores/            # Pinia 状态管理
│   │   └── app.js         # 应用状态
│   ├── assets/styles/     # 样式文件
│   │   └── global.css     # 全局样式
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🚦 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🎨 设计特点

### 现代化 UI
- **毛玻璃效果**: 使用 backdrop-filter 创建现代化的半透明效果
- **渐变配色**: 紫色系渐变主题，视觉效果出色
- **流畅动画**: 页面切换、元素悬停等交互动画
- **响应式布局**: 适配各种屏幕尺寸

### 性能优化
- **组件化设计**: 模块化的组件结构，便于维护
- **懒加载**: 按需加载页面组件
- **状态管理**: 使用 Pinia 进行统一的状态管理
- **内存管理**: Three.js 场景的正确清理和销毁

### 用户体验
- **加载动画**: 系统初始化时的进度显示
- **实时更新**: 数据的定时刷新机制
- **交互反馈**: 悬停效果、点击状态等视觉反馈
- **无缝切换**: 页面间的平滑切换

## 📊 数据模拟

项目使用模拟数据来展示功能：

- **数据库配置**: 在 `composables/useData.js` 中定义
- **表数据生成**: 动态生成表结构和字段信息
- **实时指标**: 定时更新性能指标数据
- **3D 动画**: Three.js 创建的粒子系统和数据流

## 🔧 自定义配置

### 添加新的数据库类型
1. 在 `composables/useData.js` 中的 `generateDatabaseConfig` 函数添加新配置
2. 在 `DatabaseInventory.vue` 中的 `dbTypes` 数组添加新类型

### 修改主题颜色
主要颜色定义在 `assets/styles/global.css` 中：
- 主色调: `#4f46e5` 到 `#7c3aed` 的渐变
- 状态色: 成功 `#22c55e`、警告 `#fbbf24`、错误 `#ef4444`

### 调整动画效果
动画关键帧定义在各个组件的 `<style>` 块中，可以根据需要调整时长和效果。

## 📱 响应式支持

- **桌面端**: 完整功能展示，多列布局
- **平板端**: 适配中等屏幕，调整布局间距
- **移动端**: 单列布局，优化触摸交互

## 🚀 性能优化

- **代码分割**: Vite 自动进行代码分割
- **组件懒加载**: 按需加载页面组件
- **图表优化**: Chart.js 的性能配置
- **3D 渲染优化**: Three.js 的内存管理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License

---

**注意**: 这是一个演示项目，使用模拟数据展示功能。在实际使用中，需要连接真实的数据源和 API。