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

      <!-- 存储相关图表 -->
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

      <!-- 实时监控面板 -->
      <div class="card monitoring-panel">
        <h3>实时监控</h3>
        <div class="monitoring-grid">
          <div class="monitor-item">
            <div class="monitor-label">CPU 使用率</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: realtimeMetrics.cpu + '%' }"></div>
            </div>
            <div class="monitor-value">{{ realtimeMetrics.cpu }}%</div>
          </div>
          <div class="monitor-item">
            <div class="monitor-label">内存使用率</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: realtimeMetrics.memory + '%' }"></div>
            </div>
            <div class="monitor-value">{{ realtimeMetrics.memory }}%</div>
          </div>
          <div class="monitor-item">
            <div class="monitor-label">磁盘 I/O</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: realtimeMetrics.diskIO + '%' }"></div>
            </div>
            <div class="monitor-value">{{ realtimeMetrics.diskIO }}%</div>
          </div>
          <div class="monitor-item">
            <div class="monitor-label">网络流量</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: realtimeMetrics.network + '%' }"></div>
            </div>
            <div class="monitor-value">{{ realtimeMetrics.network }}%</div>
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

// Storage charts refs
const dataVolumeChart = ref(null)
const storageTrendChart = ref(null)
const clusterCapacityChart = ref(null)
const storageTypeChart = ref(null)

// YARN charts refs
const yarnTaskStatusChart = ref(null)
const yarnQueueResourceChart = ref(null)
const yarnTaskDurationChart = ref(null)
const yarnAppTypeChart = ref(null)
const yarnSubmissionTrendChart = ref(null)

// Data distribution charts refs
const storageCapacityChart = ref(null)
const dataVolumeInventoryChart = ref(null)
const activeTableChart = ref(null)
const dataGrowthTrendChart = ref(null)
const accessHeatChart = ref(null)

let charts = {}
let updateInterval

const systemMetrics = ref({
  hive: {
    databases: 24,
    tables: 1245,
    size: '2.3 TB',
    storageUsage: 75
  },
  clickhouse: {
    databases: 8,
    tables: 89,
    qps: '1.2K'
  },
  elasticsearch: {
    indices: 24,
    docs: '45.2M',
    status: 'Yellow'
  },
  dws: {
    databases: 12,
    tables: 456,
    size: '680 GB'
  },
  yarn: {
    runningTasks: 38,
    totalTasks: 1246,
    memoryUsage: 68
  }
})

const realtimeMetrics = ref({
  cpu: 45,
  memory: 67,
  diskIO: 23,
  network: 56
})

onMounted(() => {
  initCharts()
  startRealtimeUpdates()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  Object.values(charts).forEach(chart => chart.destroy())
})

function initCharts() {
  // Hive Chart
  const hiveCtx = hiveChart.value.getContext('2d')
  charts.hive = new Chart(hiveCtx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        label: '查询量',
        data: [120, 190, 300, 500, 420, 380],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })

  // ClickHouse Chart
  const clickhouseCtx = clickhouseChart.value.getContext('2d')
  charts.clickhouse = new Chart(clickhouseCtx, {
    type: 'bar',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [{
        label: '写入量',
        data: [420, 380, 450, 520, 480, 390, 410],
        backgroundColor: '#7c3aed'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })

  // ElasticSearch Chart
  const elasticsearchCtx = elasticsearchChart.value.getContext('2d')
  charts.elasticsearch = new Chart(elasticsearchCtx, {
    type: 'doughnut',
    data: {
      labels: ['已使用', '可用'],
      datasets: [{
        data: [67, 33],
        backgroundColor: ['#fbbf24', '#e5e7eb']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

function startRealtimeUpdates() {
  updateInterval = setInterval(() => {
    realtimeMetrics.value = {
      cpu: Math.floor(Math.random() * 40) + 30,
      memory: Math.floor(Math.random() * 30) + 50,
      diskIO: Math.floor(Math.random() * 50) + 20,
      network: Math.floor(Math.random() * 60) + 30
    }
  }, 3000)
}
</script>

<style scoped>
.overview {
  padding: 40px 0;
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
  transform: translateY(-8px);
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

.chart-container {
  height: 120px;
  position: relative;
}

.monitoring-panel {
  margin-top: 32px;
}

.monitoring-panel h3 {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.monitor-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.monitor-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.monitor-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
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

  .monitoring-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>