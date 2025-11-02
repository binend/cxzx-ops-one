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

      <div class="dashboard-grid">
        <!-- Hive 卡片 -->
        <div class="card system-card" data-system="hive">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">Hive</h3>
              <span class="status-badge success">运行中</span>
            </div>
            <div class="system-icon">🍯</div>
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
            <canvas ref="hiveChart"></canvas>
          </div>
        </div>

        <!-- ClickHouse 卡片 -->
        <div class="card system-card" data-system="clickhouse">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">ClickHouse</h3>
              <span class="status-badge success">运行中</span>
            </div>
            <div class="system-icon">🚀</div>
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
            <canvas ref="clickhouseChart"></canvas>
          </div>
        </div>

        <!-- ElasticSearch 卡片 -->
        <div class="card system-card" data-system="elasticsearch">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">ElasticSearch</h3>
              <span class="status-badge warning">负载警告</span>
            </div>
            <div class="system-icon">🔍</div>
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
            <canvas ref="elasticsearchChart"></canvas>
          </div>
        </div>

        <!-- DWS 卡片 -->
        <div class="card system-card" data-system="dws">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">DWS 数据库</h3>
              <span class="status-badge success">运行中</span>
            </div>
            <div class="system-icon">🎯</div>
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
            <canvas ref="dwsChart"></canvas>
          </div>
        </div>

        <!-- YARN 卡片 -->
        <div class="card system-card" data-system="yarn">
          <div class="card-header">
            <div class="system-info">
              <h3 class="system-name">Hadoop YARN</h3>
              <span class="status-badge success">运行中</span>
            </div>
            <div class="system-icon">🐘</div>
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
            <canvas ref="yarnChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 存储概览 -->
      <div class="storage-charts">
        <h3 class="section-title">存储概览</h3>
        <div class="dashboard-grid">
          <div class="card">
            <div class="card-title">数据量分布</div>
            <div class="chart-container">
              <canvas ref="dataVolumeChart"></canvas>
            </div>
          </div>
          <div class="card">
            <div class="card-title">存储使用趋势</div>
            <div class="chart-container">
              <canvas ref="storageTrendChart"></canvas>
            </div>
          </div>
          <div class="card">
            <div class="card-title">集群容量概览</div>
            <div class="chart-container">
              <canvas ref="clusterCapacityChart"></canvas>
            </div>
          </div>
          <div class="card">
            <div class="card-title">存储类型分布</div>
            <div class="chart-container">
              <canvas ref="storageTypeChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- YARN任务统计 -->
      <div class="charts-section">
        <h3 class="section-title">YARN任务统计</h3>
        <div class="dashboard-grid">
          <div class="card chart-card">
            <div class="card-title">
              任务执行状态
              <div class="chart-subtitle">当前任务状态分布</div>
            </div>
            <div class="chart-container">
              <canvas ref="yarnTaskStatusChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              队列资源使用
              <div class="chart-subtitle">各队列资源分配情况</div>
            </div>
            <div class="chart-container">
              <canvas ref="yarnQueueResourceChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              任务执行时间
              <div class="chart-subtitle">24小时任务执行趋势</div>
            </div>
            <div class="chart-container">
              <canvas ref="yarnTaskDurationChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              应用类型分布
              <div class="chart-subtitle">不同类型应用占比</div>
            </div>
            <div class="chart-container">
              <canvas ref="yarnAppTypeChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              任务提交趋势
              <div class="chart-subtitle">24小时任务提交量</div>
            </div>
            <div class="chart-container">
              <canvas ref="yarnSubmissionTrendChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据分布统计 -->
      <div class="charts-section">
        <h3 class="section-title">数据分布统计</h3>
        <div class="dashboard-grid">
          <div class="card chart-card">
            <div class="card-title">
              存储容量分布
              <div class="chart-subtitle">各系统存储容量对比</div>
            </div>
            <div class="chart-container">
              <canvas ref="storageCapacityChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              数据量分布
              <div class="chart-subtitle">各数据库数据量占比</div>
            </div>
            <div class="chart-container">
              <canvas ref="dataVolumeInventoryChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              活跃表数量
              <div class="chart-subtitle">各系统活跃表统计</div>
            </div>
            <div class="chart-container">
              <canvas ref="activeTableChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              数据增长趋势
              <div class="chart-subtitle">近6个月数据增长情况</div>
            </div>
            <div class="chart-container">
              <canvas ref="dataGrowthTrendChart"></canvas>
            </div>
          </div>
          <div class="card chart-card">
            <div class="card-title">
              访问热度分布
              <div class="chart-subtitle">各系统访问频次</div>
            </div>
            <div class="chart-container">
              <canvas ref="accessHeatChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Chart refs
const hiveChart = ref(null)
const clickhouseChart = ref(null)
const elasticsearchChart = ref(null)
const dwsChart = ref(null)
const yarnChart = ref(null)
const dataVolumeChart = ref(null)
const storageTrendChart = ref(null)
const clusterCapacityChart = ref(null)
const storageTypeChart = ref(null)
const yarnTaskStatusChart = ref(null)
const yarnQueueResourceChart = ref(null)
const yarnTaskDurationChart = ref(null)
const yarnAppTypeChart = ref(null)
const yarnSubmissionTrendChart = ref(null)
const storageCapacityChart = ref(null)
const dataVolumeInventoryChart = ref(null)
const activeTableChart = ref(null)
const dataGrowthTrendChart = ref(null)
const accessHeatChart = ref(null)

let charts = {}
let updateInterval

const systemMetrics = ref({
  hive: { databases: 24, tables: 1245, size: '2.3 TB', storageUsage: 75 },
  clickhouse: { databases: 8, tables: 89, qps: '1.2K' },
  elasticsearch: { indices: 24, docs: '45.2M', status: 'Yellow' },
  dws: { databases: 12, tables: 456, size: '680 GB' },
  yarn: { runningTasks: 38, totalTasks: 1246, memoryUsage: 68 }
})

onMounted(() => {
  initCharts()
  startRealtimeUpdates()
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
  Object.values(charts).forEach(chart => chart.destroy())
})

function initCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  }

  // System charts (Hive, ClickHouse, ElasticSearch, DWS, YARN)
  createSystemChart(hiveChart, 'line', '#4f46e5')
  createSystemChart(clickhouseChart, 'bar', '#7c3aed')
  createSystemChart(elasticsearchChart, 'doughnut', '#fbbf24')
  createSystemChart(dwsChart, 'line', '#9333ea')
  createSystemChart(yarnChart, 'bar', '#f59e0b')

  // Storage charts
  createDataVolumeChart()
  createStorageTrendChart()
  createClusterCapacityChart()
  createStorageTypeChart()

  // YARN charts
  createYarnTaskStatusChart()
  createYarnQueueResourceChart()
  createYarnTaskDurationChart()
  createYarnAppTypeChart()
  createYarnSubmissionTrendChart()

  // Data distribution charts
  createStorageCapacityChart()
  createDataVolumeInventoryChart()
  createActiveTableChart()
  createDataGrowthTrendChart()
  createAccessHeatChart()
}

function createSystemChart(chartRef, type, color) {
  if (!chartRef.value) return
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type,
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        label: '数据',
        data: Array(6).fill(0).map(() => Math.random() * 100 + 50),
        borderColor: color,
        backgroundColor: type === 'line' ? `${color}20` : color
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: type === 'doughnut' ? {} : { y: { beginAtZero: true } }
    }
  })
}

function createDataVolumeChart() {
  createPieChart(dataVolumeChart, ['Hive (2,450GB)', 'ClickHouse (1,680GB)', 'ElasticSearch (920GB)', 'DWS (680GB)'])
}

function createStorageTrendChart() {
  createLineChart(storageTrendChart, ['1月', '2月', '3月', '4月', '5月', '6月'])
}

function createClusterCapacityChart() {
  createBarChart(clusterCapacityChart, ['Hive 🏗️', 'ClickHouse ⚡', 'ElasticSearch 🔍', 'DWS 🎯'])
}

function createStorageTypeChart() {
  createPieChart(storageTypeChart, ['HDFS 45%', 'SSD 30%', '内存 15%', '其他 10%'])
}

function createYarnTaskStatusChart() {
  createDoughnutChart(yarnTaskStatusChart, ['运行中 🏃', '等待中 ⏳', '已完成 ✅', '失败 ❌', '已杀死 🚫'])
}

function createYarnQueueResourceChart() {
  createBarChart(yarnQueueResourceChart, ['default', 'production', 'development', 'analytics', 'batch'])
}

function createYarnTaskDurationChart() {
  createLineChart(yarnTaskDurationChart, ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'])
}

function createYarnAppTypeChart() {
  createPieChart(yarnAppTypeChart, ['Spark 📊', 'MapReduce 🗺️', 'Hive 🍯', 'Flink 🌊', 'Pig 🐷'])
}

function createYarnSubmissionTrendChart() {
  createLineChart(yarnSubmissionTrendChart, ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'])
}

function createStorageCapacityChart() {
  createBarChart(storageCapacityChart, ['Hive 🏗️', 'ClickHouse ⚡', 'ElasticSearch 🔍', 'DWS 🎯'])
}

function createDataVolumeInventoryChart() {
  createPieChart(dataVolumeInventoryChart, ['Hive 📊', 'ClickHouse 📈', 'ElasticSearch 📉', 'DWS 🎯'])
}

function createActiveTableChart() {
  createDoughnutChart(activeTableChart, ['Hive 🏗️', 'ClickHouse ⚡', 'ElasticSearch 🔍', 'DWS 🎯'])
}

function createDataGrowthTrendChart() {
  createLineChart(dataGrowthTrendChart, ['1月', '2月', '3月', '4月', '5月', '6月'])
}

function createAccessHeatChart() {
  createBarChart(accessHeatChart, ['Hive', 'ClickHouse', 'ElasticSearch', 'DWS'])
}

// Helper functions
function createPieChart(chartRef, labels) {
  if (!chartRef.value) return
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: labels.map(() => Math.random() * 100 + 50),
        backgroundColor: ['#4f46e5', '#7c3aed', '#fbbf24', '#ef4444', '#10b981']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

function createLineChart(chartRef, labels) {
  if (!chartRef.value) return
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '数据',
        data: labels.map(() => Math.random() * 100 + 50),
        borderColor: '#4f46e5',
        tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  })
}

function createBarChart(chartRef, labels) {
  if (!chartRef.value) return
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '数据',
        data: labels.map(() => Math.random() * 100 + 50),
        backgroundColor: '#4f46e5'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  })
}

function createDoughnutChart(chartRef, labels) {
  if (!chartRef.value) return
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: labels.map(() => Math.random() * 100 + 50),
        backgroundColor: ['#22c55e', '#fbbf24', '#3b82f6', '#ef4444', '#8b5cf6']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

function startRealtimeUpdates() {
  updateInterval = setInterval(() => {
    // Update metrics
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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
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
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.system-icon {
  font-size: 32px;
  margin-left: 16px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.metric-unit {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

.chart-container {
  height: 120px;
  position: relative;
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

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metrics {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>