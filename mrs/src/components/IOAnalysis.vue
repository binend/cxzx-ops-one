<template>
  <div class="io-analysis">
    <div class="container">
      <!-- IO 指标卡片 -->
      <div class="metrics-grid">
        <div class="card metric-card">
          <div class="metric-header">
            <div class="metric-info">
              <h3>读取 I/O</h3>
              <span class="metric-unit">MB/s</span>
            </div>
            <div class="metric-icon">📖</div>
          </div>
          <div class="metric-value">{{ ioMetrics.read }}</div>
          <div class="metric-chart">
            <canvas ref="readChart"></canvas>
          </div>
        </div>

        <div class="card metric-card">
          <div class="metric-header">
            <div class="metric-info">
              <h3>写入 I/O</h3>
              <span class="metric-unit">MB/s</span>
            </div>
            <div class="metric-icon">✏️</div>
          </div>
          <div class="metric-value">{{ ioMetrics.write }}</div>
          <div class="metric-chart">
            <canvas ref="writeChart"></canvas>
          </div>
        </div>

        <div class="card metric-card">
          <div class="metric-header">
            <div class="metric-info">
              <h3>CPU 使用率</h3>
              <span class="metric-unit">%</span>
            </div>
            <div class="metric-icon">💻</div>
          </div>
          <div class="metric-value">{{ ioMetrics.cpu }}</div>
          <div class="metric-chart">
            <canvas ref="cpuChart"></canvas>
          </div>
        </div>

        <div class="card metric-card">
          <div class="metric-header">
            <div class="metric-info">
              <h3>内存使用率</h3>
              <span class="metric-unit">%</span>
            </div>
            <div class="metric-icon">🧠</div>
          </div>
          <div class="metric-value">{{ ioMetrics.memory }}</div>
          <div class="metric-chart">
            <canvas ref="memoryChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 3D 可视化 -->
      <div class="card visualization-card">
        <div class="visualization-header">
          <h3>数据流向可视化</h3>
          <div class="controls">
            <button @click="toggleAnimation" class="control-btn">
              {{ isAnimating ? '暂停' : '播放' }}
            </button>
            <button @click="resetVisualization" class="control-btn">
              重置
            </button>
          </div>
        </div>
        <div ref="visualizationContainer" class="visualization-container"></div>
      </div>

      <!-- 高 IO 表格 -->
      <div class="card high-io-table">
        <h3>高 IO 表格 TOP 10</h3>
        <div class="table-wrapper">
          <table class="io-table">
            <thead>
              <tr>
                <th>排名</th>
                <th>表名</th>
                <th>数据库</th>
                <th>读取 (MB/s)</th>
                <th>写入 (MB/s)</th>
                <th>总 I/O (MB/s)</th>
                <th>趋势</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(table, index) in topIOTables" :key="index">
                <td>
                  <span class="rank-badge" :class="getRankClass(index)">
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="table-name">{{ table.name }}</td>
                <td>{{ table.database }}</td>
                <td>{{ table.read }}</td>
                <td>{{ table.write }}</td>
                <td class="total-io">{{ table.total }}</td>
                <td>
                  <span :class="['trend-icon', table.trend]">
                    {{ getTrendIcon(table.trend) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { Chart, registerables } from 'chart.js'
import * as THREE from 'three'

Chart.register(...registerables)

const appStore = useAppStore()
const { ioMetrics } = storeToRefs(appStore)

const readChart = ref(null)
const writeChart = ref(null)
const cpuChart = ref(null)
const memoryChart = ref(null)
const visualizationContainer = ref(null)

let charts = {}
let threeScene, threeCamera, threeRenderer
let isAnimating = ref(true)
let animationId

const topIOTables = ref([
  { name: 'fact_orders', database: 'warehouse', read: 45, write: 23, total: 68, trend: 'up' },
  { name: 'access_logs', database: 'logs', read: 38, write: 31, total: 69, trend: 'up' },
  { name: 'user_behavior', database: 'analytics', read: 52, write: 12, total: 64, trend: 'down' },
  { name: 'system_metrics', database: 'metrics', read: 28, write: 28, total: 56, trend: 'stable' },
  { name: 'dim_users', database: 'warehouse', read: 31, write: 18, total: 49, trend: 'up' },
  { name: 'products_index', database: 'search', read: 42, write: 5, total: 47, trend: 'down' },
  { name: 'error_logs', database: 'logs', read: 25, write: 20, total: 45, trend: 'stable' },
  { name: 'sales_summary', database: 'analytics', read: 22, write: 19, total: 41, trend: 'up' },
  { name: 'dim_products', database: 'warehouse', read: 19, write: 16, total: 35, trend: 'down' },
  { name: 'users_index', database: 'search', read: 18, write: 14, total: 32, trend: 'stable' }
])

onMounted(() => {
  initCharts()
  initIOVisualization()
  startMetricsUpdate()
})

onUnmounted(() => {
  if (animationId) {
    clearInterval(animationId)
  }
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  Object.values(charts).forEach(chart => chart.destroy())
  if (threeRenderer) {
    threeRenderer.dispose()
  }
})

function initCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { beginAtZero: true, display: false }
    },
    elements: {
      line: { tension: 0.4, borderWidth: 2 },
      point: { radius: 0 }
    }
  }

  // Read Chart
  const readCtx = readChart.value.getContext('2d')
  charts.read = new Chart(readCtx, {
    type: 'line',
    data: {
      labels: Array(20).fill(''),
      datasets: [{
        data: Array(20).fill(0).map(() => Math.random() * 100 + 50),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }]
    },
    options: chartOptions
  })

  // Write Chart
  const writeCtx = writeChart.value.getContext('2d')
  charts.write = new Chart(writeCtx, {
    type: 'line',
    data: {
      labels: Array(20).fill(''),
      datasets: [{
        data: Array(20).fill(0).map(() => Math.random() * 80 + 30),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)'
      }]
    },
    options: chartOptions
  })

  // CPU Chart
  const cpuCtx = cpuChart.value.getContext('2d')
  charts.cpu = new Chart(cpuCtx, {
    type: 'line',
    data: {
      labels: Array(20).fill(''),
      datasets: [{
        data: Array(20).fill(0).map(() => Math.random() * 60 + 20),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    },
    options: chartOptions
  })

  // Memory Chart
  const memoryCtx = memoryChart.value.getContext('2d')
  charts.memory = new Chart(memoryCtx, {
    type: 'line',
    data: {
      labels: Array(20).fill(''),
      datasets: [{
        data: Array(20).fill(0).map(() => Math.random() * 70 + 40),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    },
    options: chartOptions
  })
}

function initIOVisualization() {
  if (!visualizationContainer.value) return

  // 场景设置
  threeScene = new THREE.Scene()
  threeCamera = new THREE.PerspectiveCamera(
    75,
    visualizationContainer.value.clientWidth / visualizationContainer.value.clientHeight,
    0.1,
    1000
  )

  threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  threeRenderer.setSize(
    visualizationContainer.value.clientWidth,
    visualizationContainer.value.clientHeight
  )
  threeRenderer.setPixelRatio(window.devicePixelRatio)
  visualizationContainer.value.appendChild(threeRenderer.domElement)

  // 创建简化的 IO 流可视化
  createIOFlow()

  threeCamera.position.z = 30

  animate()
}

function createIOFlow() {
  // 创建节点
  const nodes = []
  const nodeGeometry = new THREE.SphereGeometry(1, 32, 16)
  const nodeMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x10b981 }),
    new THREE.MeshPhongMaterial({ color: 0xf59e0b }),
    new THREE.MeshPhongMaterial({ color: 0x3b82f6 }),
    new THREE.MeshPhongMaterial({ color: 0x8b5cf6 })
  ]

  for (let i = 0; i < 8; i++) {
    const material = nodeMaterials[i % 4]
    const node = new THREE.Mesh(nodeGeometry, material)
    node.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    )
    threeScene.add(node)
    nodes.push(node)
  }

  // 创建连接线
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4f46e5,
    transparent: true,
    opacity: 0.3
  })

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() > 0.6) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          nodes[i].position,
          nodes[j].position
        ])
        const line = new THREE.Line(lineGeometry, lineMaterial)
        threeScene.add(line)
      }
    }
  }

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040, 1)
  threeScene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x4f46e5, 1, 100)
  pointLight.position.set(10, 10, 10)
  threeScene.add(pointLight)

  // 动画节点
  nodes.forEach((node, index) => {
    node.userData = {
      originalPosition: node.position.clone(),
      speed: Math.random() * 0.02 + 0.01,
      offset: Math.random() * Math.PI * 2
    }
  })
}

function animate() {
  if (!isAnimating.value) return

  animationId = requestAnimationFrame(animate)

  // 旋转场景
  threeScene.rotation.y += 0.005

  // 动画节点
  threeScene.children.forEach(child => {
    if (child instanceof THREE.Mesh && child.userData.originalPosition) {
      const time = Date.now() * 0.001
      const userData = child.userData
      child.position.y = userData.originalPosition.y + Math.sin(time * userData.speed + userData.offset) * 2
    }
  })

  threeRenderer.render(threeScene, threeCamera)
}

function toggleAnimation() {
  isAnimating.value = !isAnimating.value
  if (isAnimating.value) {
    animate()
  }
}

function resetVisualization() {
  threeScene.rotation.set(0, 0, 0)
}

function startMetricsUpdate() {
  animationId = setInterval(() => {
    appStore.updateIOMetrics()
    updateCharts()
  }, 2000)
}

function updateCharts() {
  Object.values(charts).forEach(chart => {
    if (chart.data.datasets[0]) {
      const data = chart.data.datasets[0].data
      data.shift()
      data.push(Math.random() * 100)
      chart.update('none')
    }
  })
}

function getRankClass(index) {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

function getTrendIcon(trend) {
  switch (trend) {
    case 'up': return '📈'
    case 'down': return '📉'
    case 'stable': return '➡️'
    default: return '➡️'
  }
}
</script>

<style scoped>
.io-analysis {
  padding: 40px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.metric-unit {
  font-size: 12px;
  color: #6b7280;
}

.metric-icon {
  font-size: 24px;
  margin-left: 16px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.metric-chart {
  height: 60px;
  position: relative;
}

.visualization-card {
  margin-bottom: 32px;
}

.visualization-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.visualization-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  padding: 8px 16px;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid #4f46e5;
  border-radius: 6px;
  color: #4f46e5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(79, 70, 229, 0.2);
}

.visualization-container {
  height: 400px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  position: relative;
}

.high-io-table h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1f2937;
}

.table-wrapper {
  overflow-x: auto;
}

.io-table {
  width: 100%;
  border-collapse: collapse;
}

.io-table th,
.io-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.io-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.io-table td {
  font-size: 14px;
  color: #374151;
}

.rank-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 12px;
}

.rank-badge.gold {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  color: white;
}

.rank-badge.silver {
  background: linear-gradient(45deg, #e5e7eb, #9ca3af);
  color: white;
}

.rank-badge.bronze {
  background: linear-gradient(45deg, #f97316, #ea580c);
  color: white;
}

.table-name {
  font-weight: 500;
  color: #1f2937;
}

.total-io {
  font-weight: 600;
  color: #4f46e5;
}

.trend-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .visualization-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .visualization-container {
    height: 300px;
  }

  .table-wrapper {
    margin: 0 -16px;
  }

  .io-table {
    font-size: 12px;
  }

  .io-table th,
  .io-table td {
    padding: 8px;
  }
}
</style>