<template>
  <div class="overview">
    <div class="container">
      <!-- 系统警告面板 -->
      <div class="alert-panel">
        <div class="alert-title">
          <span>⚠️</span>
          系统警告
        </div>
        <div class="alert-item">
          <div class="alert-icon alert-warning"></div>
          <span>ClickHouse集群节点ch-03内存使用率超过80%</span>
        </div>
        <div class="alert-item">
          <div class="alert-icon alert-info"></div>
          <span>Hive表partition_log需要优化，建议执行分区清理</span>
        </div>
        <div class="alert-item">
          <div class="alert-icon alert-critical"></div>
          <span>ElasticSearch索引es_daily_2024磁盘空间不足，剩余15%</span>
        </div>
      </div>

      <div class="charts-grid">
        <!-- 系统卡片 - 先显示关键数据，图表延迟加载 -->
        <div class="card system-card" data-system="hive">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">Hive</h3>
              <span class="status-badge success">运行中</span>
            </div>
            </div>
          <div class="metrics">
            <div class="metric">
              <span class="metric-label">数据库总数</span>
              <span class="metric-value">{{ systemMetrics.hive.databases }}</span>
              <span class="metric-unit">个</span>
            </div>
            <div class="metric">
              <span class="metric-label">表总数</span>
              <span class="metric-value">{{ systemMetrics.hive.tables }}</span>
              <span class="metric-unit">张</span>
            </div>
            <div class="metric">
              <span class="metric-label">存储使用率</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: systemMetrics.hive.storageUsage + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div v-if="!chartsLoaded.system" class="chart-loading">
              <div class="loading-spinner"></div>
            </div>
            <canvas v-show="chartsLoaded.system" ref="hiveChart"></canvas>
          </div>
        </div>

        <!-- ClickHouse 卡片 -->
        <div class="card system-card" data-system="clickhouse">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">ClickHouse</h3>
              <span class="status-badge success">运行中</span>
            </div>
            </div>
          <div class="metrics">
            <div class="metric">
              <span class="metric-label">数据库总数</span>
              <span class="metric-value">{{ systemMetrics.clickhouse.databases }}</span>
              <span class="metric-unit">个</span>
            </div>
            <div class="metric">
              <span class="metric-label">表总数</span>
              <span class="metric-value">{{ systemMetrics.clickhouse.tables }}</span>
              <span class="metric-unit">张</span>
            </div>
            <div class="metric">
              <span class="metric-label">查询/秒</span>
              <span class="metric-value">{{ systemMetrics.clickhouse.qps }}</span>
            </div>
          </div>
          <div class="chart-container">
            <div v-if="!chartsLoaded.system" class="chart-loading">
              <div class="loading-spinner"></div>
            </div>
            <canvas v-show="chartsLoaded.system" ref="clickhouseChart"></canvas>
          </div>
        </div>

        <!-- ElasticSearch 卡片 -->
        <div class="card system-card" data-system="elasticsearch">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">ElasticSearch</h3>
              <span class="status-badge warning">负载警告</span>
            </div>
              </div>
          <div class="metrics">
            <div class="metric">
              <span class="metric-label">索引</span>
              <span class="metric-value">{{ systemMetrics.elasticsearch.indices }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">文档数量</span>
              <span class="metric-value">{{ systemMetrics.elasticsearch.docs }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">集群状态</span>
              <span class="metric-value">{{ systemMetrics.elasticsearch.status }}</span>
            </div>
          </div>
          <div class="chart-container">
            <div v-if="!chartsLoaded.system" class="chart-loading">
              <div class="loading-spinner"></div>
            </div>
            <canvas v-show="chartsLoaded.system" ref="elasticsearchChart"></canvas>
          </div>
        </div>

        <!-- DWS 卡片 -->
        <div class="card system-card" data-system="dws">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">DWS 数据库</h3>
              <span class="status-badge success">运行中</span>
            </div>
              </div>
          <div class="metrics">
            <div class="metric">
              <span class="metric-label">数据库总数</span>
              <span class="metric-value">{{ systemMetrics.dws.databases }}</span>
              <span class="metric-unit">个</span>
            </div>
            <div class="metric">
              <span class="metric-label">表总数</span>
              <span class="metric-value">{{ systemMetrics.dws.tables }}</span>
              <span class="metric-unit">张</span>
            </div>
            <div class="metric">
              <span class="metric-label">存储大小</span>
              <span class="metric-value">{{ systemMetrics.dws.size }}</span>
            </div>
          </div>
          <div class="chart-container">
            <div v-if="!chartsLoaded.system" class="chart-loading">
              <div class="loading-spinner"></div>
            </div>
            <canvas v-show="chartsLoaded.system" ref="dwsChart"></canvas>
          </div>
        </div>

        <!-- YARN 卡片 -->
        <div class="card system-card" data-system="yarn">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">Hadoop YARN</h3>
              <span class="status-badge success">运行中</span>
            </div>
                </div>
          <div class="metrics">
            <div class="metric">
              <span class="metric-label">运行任务数</span>
              <span class="metric-value">{{ systemMetrics.yarn.runningTasks }}</span>
              <span class="metric-unit">个</span>
            </div>
            <div class="metric">
              <span class="metric-label">总任务数</span>
              <span class="metric-value">{{ systemMetrics.yarn.totalTasks }}</span>
              <span class="metric-unit">个</span>
            </div>
            <div class="metric">
              <span class="metric-label">集群内存使用</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: systemMetrics.yarn.memoryUsage + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div v-if="!chartsLoaded.system" class="chart-loading">
              <div class="loading-spinner"></div>
            </div>
            <canvas v-show="chartsLoaded.system" ref="yarnChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 存储概览 - 懒加载 -->
      <div class="storage-charts">
        <h3 class="section-title">存储概览</h3>
        <div class="charts-grid">
          <div v-for="(chart, index) in storageCharts" :key="chart.id" class="card">
            <div class="card-title">{{ chart.title }}</div>
            <div class="chart-container">
              <div v-if="!chartsLoaded.storage" class="chart-loading">
                <div class="loading-spinner"></div>
              </div>
              <canvas v-show="chartsLoaded.storage" :id="chart.ref"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- YARN任务统计 - 懒加载 -->
      <div class="charts-section">
        <h3 class="section-title">YARN任务统计</h3>
        <div class="charts-grid">
          <div v-for="(chart, index) in yarnCharts" :key="chart.id" class="card chart-card">
            <div class="card-title">
              {{ chart.title }}
              <div class="chart-subtitle">{{ chart.subtitle }}</div>
            </div>
            <div class="chart-container">
              <div v-if="!chartsLoaded.yarn" class="chart-loading">
                <div class="loading-spinner"></div>
              </div>
              <canvas v-show="chartsLoaded.yarn" :id="chart.ref"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据分布统计 - 懒加载 -->
      <div class="charts-section">
        <h3 class="section-title">数据分布统计</h3>
        <div class="charts-grid">
          <div v-for="(chart, index) in dataCharts" :key="chart.id" class="card chart-card">
            <div class="card-title">
              {{ chart.title }}
              <div class="chart-subtitle">{{ chart.subtitle }}</div>
            </div>
            <div class="chart-container">
              <div v-if="!chartsLoaded.data" class="chart-loading">
                <div class="loading-spinner"></div>
              </div>
              <canvas v-show="chartsLoaded.data" :id="chart.ref"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Chart refs
const hiveChart = ref(null)
const clickhouseChart = ref(null)
const elasticsearchChart = ref(null)
const dwsChart = ref(null)
const yarnChart = ref(null)

// Loading states
const chartsLoaded = ref({
  system: false,
  storage: false,
  yarn: false,
  data: false
})

// Chart configurations
const storageCharts = ref([
  { id: 'dataVolume', title: '数据量分布', ref: 'dataVolumeChart' },
  { id: 'storageTrend', title: '存储使用趋势', ref: 'storageTrendChart' },
  { id: 'clusterCapacity', title: '集群容量概览', ref: 'clusterCapacityChart' },
  { id: 'storageType', title: '存储类型分布', ref: 'storageTypeChart' }
])

const yarnCharts = ref([
  { id: 'taskStatus', title: '任务执行状态', subtitle: '当前任务状态分布', ref: 'yarnTaskStatusChart' },
  { id: 'queueResource', title: '队列资源使用', subtitle: '各队列资源分配情况', ref: 'yarnQueueResourceChart' },
  { id: 'taskDuration', title: '任务执行时间', subtitle: '24小时任务执行趋势', ref: 'yarnTaskDurationChart' },
  { id: 'appType', title: '应用类型分布', subtitle: '不同类型应用占比', ref: 'yarnAppTypeChart' },
  { id: 'submissionTrend', title: '任务提交趋势', subtitle: '24小时任务提交量', ref: 'yarnSubmissionTrendChart' }
])

const dataCharts = ref([
  { id: 'storageCapacity', title: '存储容量分布', subtitle: '各系统存储容量对比', ref: 'storageCapacityChart' },
  { id: 'dataVolumeInventory', title: '数据量分布', subtitle: '各数据库数据量占比', ref: 'dataVolumeInventoryChart' },
  { id: 'activeTable', title: '活跃表数量', subtitle: '各系统活跃表统计', ref: 'activeTableChart' },
  { id: 'dataGrowthTrend', title: '数据增长趋势', subtitle: '近6个月数据增长情况', ref: 'dataGrowthTrendChart' },
  { id: 'accessHeat', title: '访问热度分布', subtitle: '各系统访问频次', ref: 'accessHeatChart' }
])

let charts = {}
let updateInterval

const systemMetrics = ref({
  hive: { databases: 24, tables: 1245, size: '2.3 TB', storageUsage: 75 },
  clickhouse: { databases: 8, tables: 89, qps: '1.2K' },
  elasticsearch: { indices: 24, docs: '45.2M', status: 'Yellow' },
  dws: { databases: 12, tables: 456, size: '680 GB' },
  yarn: { runningTasks: 38, totalTasks: 1246, memoryUsage: 68 }
})

// 新增：直接从DOM元素创建图表的函数
function createChartFromElement(canvasElement, type, color) {
  if (!canvasElement) return

  const ctx = canvasElement.getContext('2d')
  if (!ctx) return

  // 根据canvas元素ID确定图表数据
  const chartId = canvasElement.id
  let labels, data

  switch (chartId) {
    // YARN Charts
    case 'yarnTaskStatusChart':
      labels = ['运行中 🏃', '等待中 ⏳', '已完成 ✅', '失败 ❌', '已杀死 🚫']
      data = [38, 24, 1156, 18, 10]
      break
    case 'yarnQueueResourceChart':
      labels = ['default', 'production', 'development', 'analytics', 'batch']
      data = [45, 78, 32, 56, 41]
      break
    case 'yarnTaskDurationChart':
      labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
      data = [12.5, 8.2, 15.6, 22.4, 18.9, 14.7]
      break
    case 'yarnAppTypeChart':
      labels = ['Spark 📊', 'MapReduce 🗺️', 'Hive 🍯', 'Flink 🌊', 'Pig 🐷']
      data = [456, 312, 289, 124, 65]
      break
    case 'yarnSubmissionTrendChart':
      labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00']
      data = [12, 8, 15, 22, 45, 78, 92]
      break

    // Storage Charts
    case 'dataVolumeChart':
      labels = ['Hive', 'ClickHouse', 'ElasticSearch', 'DWS']
      data = [2450, 1680, 920, 680]
      break
    case 'storageTrendChart':
      labels = ['1月', '2月', '3月', '4月', '5月', '6月']
      data = [1200, 1350, 1500, 1650, 1800, 2100]
      break
    case 'clusterCapacityChart':
      labels = ['Hive 🏗️', 'ClickHouse ⚡', 'ElasticSearch 🔍', 'DWS 🎯']
      data = [125.6, 68.4, 45.8, 38.2]
      break
    case 'storageTypeChart':
      labels = ['HDFS', 'SSD', '内存', '其他']
      data = [45, 30, 15, 10]
      break

    // Data Distribution Charts
    case 'storageCapacityChart':
      labels = ['Hive 🏗️', 'ClickHouse ⚡', 'ElasticSearch 🔍', 'DWS 🎯']
      data = [125.6, 68.4, 45.8, 38.2]
      break
    case 'dataVolumeInventoryChart':
      labels = ['Hive 📊', 'ClickHouse 📈', 'ElasticSearch 📉', 'DWS 🎯']
      data = [2450, 1680, 920, 680]
      break
    case 'activeTableChart':
      labels = ['Hive 🏗️', 'ClickHouse ⚡', 'ElasticSearch 🔍', 'DWS 🎯']
      data = [1200, 620, 420, 380]
      break
    case 'dataGrowthTrendChart':
      labels = ['1月', '2月', '3月', '4月', '5月', '6月']
      data = [1800, 1950, 2100, 2300, 2450, 2680]
      break
    case 'accessHeatChart':
      labels = ['Hive', 'ClickHouse', 'ElasticSearch', 'DWS']
      data = [3500, 2800, 4200, 1900]
      break

    // 默认数据
    default:
      labels = type === 'line' || type === 'bar'
        ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        : ['A', 'B', 'C', 'D', 'E']
      data = labels.map(() => Math.random() * 100 + 50)
  }

  new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label: '数据',
        data,
        borderColor: color,
        backgroundColor: type === 'line' ? `${color}20` :
                      type === 'doughnut' || type === 'pie' ?
                      ['#22c55e', '#fbbf24', '#3b82f6', '#ef4444', '#8b5cf6'] : color,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type === 'doughnut' || type === 'pie' ? true : false,
          position: 'bottom'
        },
        tooltip: { enabled: true }
      },
      scales: (type === 'doughnut' || type === 'pie') ? {} : {
        y: { beginAtZero: true }
      },
      animation: {
        duration: 800
      }
    }
  })
}

onMounted(() => {
  // 立即显示系统数据，图表延迟加载
  setTimeout(() => initSystemCharts(), 300)
  setTimeout(() => initStorageCharts(), 800)
  setTimeout(() => initYarnCharts(), 1300)
  setTimeout(() => initDataCharts(), 1800)
  startRealtimeUpdates()
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
  Object.values(charts).forEach(chart => chart.destroy())
})

function initSystemCharts() {
  // 系统图表 - 直接使用ref获取DOM元素
  setTimeout(() => {
    if (hiveChart.value) createChartFromElement(hiveChart.value, 'line', '#4f46e5')
    if (clickhouseChart.value) createChartFromElement(clickhouseChart.value, 'bar', '#7c3aed')
    if (elasticsearchChart.value) createChartFromElement(elasticsearchChart.value, 'doughnut', '#fbbf24')
    if (dwsChart.value) createChartFromElement(dwsChart.value, 'line', '#9333ea')
    if (yarnChart.value) createChartFromElement(yarnChart.value, 'bar', '#f59e0b')
    chartsLoaded.value.system = true
  }, 100)
}

function initStorageCharts() {
  nextTick(() => {
    const storageChartIds = ['dataVolumeChart', 'storageTrendChart', 'clusterCapacityChart', 'storageTypeChart']
    const colors = ['#4f46e5', '#7c3aed', '#fbbf24', '#10b981']
    const types = ['pie', 'line', 'bar', 'doughnut']

    storageChartIds.forEach((id, index) => {
      const element = document.getElementById(id)
      if (element) createChartFromElement(element, types[index], colors[index])
    })
    chartsLoaded.value.storage = true
  })
}

function initYarnCharts() {
  nextTick(() => {
    const yarnChartIds = ['yarnTaskStatusChart', 'yarnQueueResourceChart', 'yarnTaskDurationChart', 'yarnAppTypeChart', 'yarnSubmissionTrendChart']
    const colors = ['#22c55e', '#fbbf24', '#3b82f6', '#8b5cf6', '#ef4444']
    const types = ['doughnut', 'bar', 'line', 'pie', 'line']

    yarnChartIds.forEach((id, index) => {
      const element = document.getElementById(id)
      if (element) createChartFromElement(element, types[index], colors[index])
    })
    chartsLoaded.value.yarn = true
  })
}

function initDataCharts() {
  nextTick(() => {
    const dataChartIds = ['storageCapacityChart', 'dataVolumeInventoryChart', 'activeTableChart', 'dataGrowthTrendChart', 'accessHeatChart']
    const colors = ['#f59e0b', '#10b981', '#6366f1', '#84cc16', '#14b8a6']
    const types = ['bar', 'pie', 'doughnut', 'line', 'bar']

    dataChartIds.forEach((id, index) => {
      const element = document.getElementById(id)
      if (element) createChartFromElement(element, types[index], colors[index])
    })
    chartsLoaded.value.data = true
  })
}


function startRealtimeUpdates() {
  updateInterval = setInterval(() => {
    // 更新关键指标
    systemMetrics.value.hive.storageUsage = Math.floor(Math.random() * 30) + 60
    systemMetrics.value.yarn.runningTasks = Math.floor(Math.random() * 20) + 30
    systemMetrics.value.yarn.memoryUsage = Math.floor(Math.random() * 20) + 60
  }, 3000)
}
</script>

<style scoped>
.overview {
  padding: 40px 0;
}

.alert-panel {
  background: linear-gradient(135deg, #fff7ed, #fef3c7);
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  animation: slideInRight 0.5s ease-out;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 16px;
  font-size: 16px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(251, 191, 36, 0.2);
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-icon::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.alert-warning::before {
  background: #fbbf24;
}

.alert-info::before {
  background: #3b82f6;
}

.alert-critical::before {
  background: #ef4444;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

/* 超宽屏幕 - 5列布局 */
@media (min-width: 1600px) {
  .dashboard-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}

/* 大屏幕 - 4列布局 */
@media (min-width: 1200px) and (max-width: 1599px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
}

/* 中等屏幕 - 3列布局 */
@media (min-width: 900px) and (max-width: 1199px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

/* 小屏幕 - 2列布局 */
@media (min-width: 600px) and (max-width: 899px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

/* 移动端 - 单列布局 */
@media (max-width: 599px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* 图表网格布局 - 针对图表的响应式设计 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

/* 超宽屏幕 - 5列图表布局 */
@media (min-width: 1800px) {
  .charts-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}

/* 大屏幕 - 4列图表布局 */
@media (min-width: 1400px) and (max-width: 1799px) {
  .charts-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
}

/* 中大屏幕 - 3列图表布局 */
@media (min-width: 1000px) and (max-width: 1399px) {
  .charts-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

/* 中等屏幕 - 2列图表布局 */
@media (min-width: 700px) and (max-width: 999px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* 小屏幕和移动端 - 单列图表布局 */
@media (max-width: 699px) {
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.system-card {
  transition: all 0.3s ease;
}

.system-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.system-info {
  flex: 1;
}

.system-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.system-icon {
  font-size: 24px;
  margin-left: 8px;
}

/* 更紧凑的状态标签样式 */
.system-card .status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

/* 系统卡片更紧凑的布局 */
.system-card {
  padding: 16px !important;
  min-width: 0; /* 防止flex子项溢出 */
}

/* 确保系统卡片内容不会溢出 */
.system-card .card-header {
  min-width: 0;
  flex-wrap: wrap;
}

.system-card .system-info {
  min-width: 0;
  flex: 1;
}

/* 进度条在小屏幕上的优化 */
.system-card .progress-bar {
  width: 100%;
  min-width: 80px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.metric-unit {
  font-size: 10px;
  color: #6b7280;
  margin-left: 2px;
}

.chart-container {
  height: 120px;
  position: relative;
}

.chart-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.storage-charts,
.charts-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1f2937;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.chart-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  font-weight: 400;
}

.chart-card .chart-container {
  height: 200px;
}

/* 图表响应式高度调整 */
@media (min-width: 1800px) {
  .chart-card .chart-container {
    height: 220px;
  }
}

@media (min-width: 1400px) and (max-width: 1799px) {
  .chart-card .chart-container {
    height: 210px;
  }
}

@media (min-width: 1000px) and (max-width: 1399px) {
  .chart-card .chart-container {
    height: 200px;
  }
}

@media (min-width: 700px) and (max-width: 999px) {
  .chart-card .chart-container {
    height: 180px;
  }
}

@media (max-width: 699px) {
  .chart-card .chart-container {
    height: 160px;
  }

  .chart-title {
    font-size: 14px;
  }

  .chart-subtitle {
    font-size: 11px;
  }
}

/* 超宽屏幕 - 5列时字体调整 */
@media (min-width: 1600px) {
  .system-name {
    font-size: 16px;
  }

  .system-icon {
    font-size: 24px;
  }

  .metric-value {
    font-size: 16px;
  }

  .metric-label {
    font-size: 11px;
  }
}

/* 大屏幕 - 4列时字体调整 */
@media (min-width: 1200px) and (max-width: 1599px) {
  .system-name {
    font-size: 15px;
  }

  .system-icon {
    font-size: 22px;
  }

  .metric-value {
    font-size: 15px;
  }
}

/* 中等屏幕 - 3列时字体调整 */
@media (min-width: 900px) and (max-width: 1199px) {
  .system-name {
    font-size: 14px;
  }

  .system-icon {
    font-size: 20px;
  }

  .metric-value {
    font-size: 14px;
  }
}

/* 小屏幕 - 2列时字体调整 */
@media (min-width: 600px) and (max-width: 899px) {
  .system-name {
    font-size: 16px;
    white-space: normal;
  }

  .system-icon {
    font-size: 26px;
  }

  .metric-value {
    font-size: 16px;
  }

  .system-card {
    padding: 18px !important;
  }
}

/* 移动端 - 单列时字体调整 */
@media (max-width: 599px) {
  .system-card {
    padding: 20px !important;
  }

  .system-name {
    font-size: 18px;
    white-space: normal;
  }

  .system-icon {
    font-size: 28px;
  }

  .metric-value {
    font-size: 18px;
  }

  .metrics {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>