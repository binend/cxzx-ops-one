<template>
  <div class="fixed inset-0 z-50">
    <!-- 遮罩层 -->
    <div
      class="fixed inset-0 bg-black/60 transition-opacity duration-300"
      :class="overlayClass"
      @click="closePanel"
      style="z-index: 9998;"
    ></div>

    <!-- 侧边面板 -->
    <div
      class="side-panel fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-hidden"
      :class="panelClass"
    >
      <!-- 头部 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 class="text-lg font-semibold text-gray-900">服务使用率详情</h2>
        <button
          @click="closePanel"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="side-panel-content flex-1 overflow-auto p-6">
        <!-- 服务使用率详情标题 -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">服务使用率详情</h2>
            <button
              @click="closePanel"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- 时间范围选择 -->
        <div class="mb-6">
          <h3 class="text-md font-medium text-gray-900 mb-4">查询时间范围</h3>
          <div class="flex gap-2">
            <button
              v-for="range in timeRanges"
              :key="range.key"
              @click="selectTimeRange(range.key)"
              :class="[
                'flex-1 px-3 py-2 text-sm rounded-lg transition-colors font-medium',
                selectedTimeRange === range.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ range.label }}
            </button>
          </div>
        </div>

        <!-- 折线图区域 -->
        <div class="mb-6">
          <h3 class="text-md font-medium text-gray-900 mb-4">{{ getTimeRangeLabel() }}使用率趋势</h3>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <!-- 图表容器 -->
            <div class="h-64 relative">
              <svg class="w-full h-full" viewBox="0 0 400 240">
                <!-- 网格线 -->
                <g class="grid-lines">
                  <!-- 水平网格线 -->
                  <line x1="40" y1="40" x2="380" y2="40" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="40" y1="80" x2="380" y2="80" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="40" y1="120" x2="380" y2="120" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="40" y1="160" x2="380" y2="160" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="40" y1="200" x2="380" y2="200" stroke="#e5e7eb" stroke-width="1"/>

                  <!-- 垂直网格线 -->
                  <line x1="100" y1="40" x2="100" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="160" y1="40" x2="160" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="220" y1="40" x2="220" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="280" y1="40" x2="280" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                  <line x1="340" y1="40" x2="340" y2="200" stroke="#e5e7eb" stroke-width="1"/>
                </g>

                <!-- 坐标轴 -->
                <line x1="40" y1="40" x2="40" y2="200" stroke="#374151" stroke-width="2"/>
                <line x1="40" y1="200" x2="380" y2="200" stroke="#374151" stroke-width="2"/>

                <!-- Y轴标签 -->
                <text x="30" y="45" text-anchor="end" class="text-xs fill-gray-600">100%</text>
                <text x="30" y="85" text-anchor="end" class="text-xs fill-gray-600">75%</text>
                <text x="30" y="125" text-anchor="end" class="text-xs fill-gray-600">50%</text>
                <text x="30" y="165" text-anchor="end" class="text-xs fill-gray-600">25%</text>
                <text x="30" y="205" text-anchor="end" class="text-xs fill-gray-600">0%</text>

                <!-- CPU使用率折线 -->
                <g class="cpu-line">
                  <path
                    :d="generateLineChartData('cpu')"
                    stroke="#2b8cee"
                    stroke-width="3"
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <!-- 数据点 -->
                  <circle
                    v-for="(point, index) in getChartData('cpu')"
                    :key="`cpu-${index}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    fill="#2b8cee"
                    class="cursor-pointer hover:r-6"
                  />
                </g>

                <!-- 内存使用率折线 -->
                <g class="memory-line">
                  <path
                    :d="generateLineChartData('memory')"
                    stroke="#22c55e"
                    stroke-width="3"
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <!-- 数据点 -->
                  <circle
                    v-for="(point, index) in getChartData('memory')"
                    :key="`memory-${index}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    fill="#22c55e"
                    class="cursor-pointer hover:r-6"
                  />
                </g>

                <!-- 磁盘IO折线 -->
                <g class="diskio-line">
                  <path
                    :d="generateLineChartData('diskIO')"
                    stroke="#f97316"
                    stroke-width="3"
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <!-- 数据点 -->
                  <circle
                    v-for="(point, index) in getChartData('diskIO')"
                    :key="`diskio-${index}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    fill="#f97316"
                    class="cursor-pointer hover:r-6"
                  />
                </g>

                <!-- 网络流量折线 -->
                <g class="network-line">
                  <path
                    :d="generateLineChartData('network')"
                    stroke="#a855f7"
                    stroke-width="3"
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <!-- 数据点 -->
                  <circle
                    v-for="(point, index) in getChartData('network')"
                    :key="`network-${index}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    fill="#a855f7"
                    class="cursor-pointer hover:r-6"
                  />
                </g>
              </svg>
            </div>

            <!-- 图例 -->
            <div class="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-1 bg-blue-500 rounded"></div>
                <span class="text-sm text-gray-600">CPU使用率 (%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-1 bg-green-500 rounded"></div>
                <span class="text-sm text-gray-600">内存使用率 (%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-1 bg-orange-500 rounded"></div>
                <span class="text-sm text-gray-600">磁盘IO (MB/s)</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-1 bg-purple-500 rounded"></div>
                <span class="text-sm text-gray-600">网络流量 (MB/s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>最后更新: {{ lastUpdate }}</span>
          <button
            @click="refreshData"
            :disabled="isRefreshing"
            class="flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            <span
              :class="['material-symbols-outlined text-sm', isRefreshing ? 'animate-spin' : '']"
            >
              refresh
            </span>
            刷新
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  service: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const appStore = useAppStore()

const isRefreshing = ref(false)
const selectedService = ref(null)
const lastUpdate = ref(new Date().toLocaleTimeString())
const selectedTimeRange = ref('7days')

// 时间范围选项
const timeRanges = [
  { key: '7days', label: '7天' },
  { key: '1month', label: '1个月' },
  { key: '3months', label: '3个月' },
  { key: '6months', label: '半年' }
]

// 模拟不同时间范围的使用率数据
const usageDataByTimeRange = {
  '7days': {
    cpu: 85,
    avgCpu: 78,
    memory: 72,
    avgMemory: 68,
    diskIO: 45,
    avgDiskIO: 38,
    network: 120,
    avgNetwork: 95
  },
  '1month': {
    cpu: 82,
    avgCpu: 75,
    memory: 69,
    avgMemory: 65,
    diskIO: 42,
    avgDiskIO: 36,
    network: 108,
    avgNetwork: 88
  },
  '3months': {
    cpu: 79,
    avgCpu: 73,
    memory: 66,
    avgMemory: 62,
    diskIO: 38,
    avgDiskIO: 33,
    network: 95,
    avgNetwork: 78
  },
  '6months': {
    cpu: 76,
    avgCpu: 71,
    memory: 63,
    avgMemory: 59,
    diskIO: 35,
    avgDiskIO: 31,
    network: 82,
    avgNetwork: 68
  }
}

// 使用父组件控制显示状态
const panelClass = computed(() => {
  return 'translate-x-0' // 显示状态
})

const overlayClass = computed(() => {
  return 'opacity-100' // 显示状态
})

// 关闭面板
function closePanel() {
  setTimeout(() => {
    emit('close')
  }, 300)
}

// 选择时间范围
function selectTimeRange(range) {
  selectedTimeRange.value = range
}

// 获取时间范围标签
function getTimeRangeLabel() {
  const range = timeRanges.find(r => r.key === selectedTimeRange.value)
  return range ? range.label : '7天'
}

// 获取当前使用率数据
function getCurrentUsageData() {
  return usageDataByTimeRange[selectedTimeRange.value] || usageDataByTimeRange['7days']
}

// 生成折线图数据
function getChartData(metric) {
  const data = getCurrentUsageData()
  const baseValue = metric === 'cpu' ? data.cpu :
                   metric === 'memory' ? data.memory :
                   metric === 'diskIO' ? data.diskIO : data.network

  const points = []
  const pointCount = 7 // 7个数据点
  const xStep = 340 / (pointCount - 1) // X轴步长

  for (let i = 0; i < pointCount; i++) {
    const x = 40 + i * xStep
    const variation = Math.sin(i * 1.2) * 15 + Math.random() * 10 - 5
    let value

    if (metric === 'diskIO') {
      value = Math.max(0, Math.min(100, baseValue + variation))
    } else if (metric === 'network') {
      value = Math.max(0, Math.min(100, (baseValue + variation) * 0.8)) // 网络流量缩放
    } else {
      value = Math.max(0, Math.min(100, baseValue + variation))
    }

    // 将值映射到Y轴坐标 (200-40的范围)
    const y = 200 - (value / 100) * 160

    points.push({ x, y, value })
  }

  return points
}

// 生成折线路径
function generateLineChartData(metric) {
  const points = getChartData(metric)
  if (points.length === 0) return ''

  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  return pathData
}

// 刷新数据
function refreshData() {
  isRefreshing.value = true
  setTimeout(() => {
    // 模拟数据刷新
    const currentData = getCurrentUsageData()
    Object.keys(currentData).forEach(key => {
      const variation = (Math.random() - 0.5) * 10
      if (key.includes('avg')) {
        currentData[key] = Math.max(0, Math.min(100, currentData[key] + variation * 0.5))
      } else {
        currentData[key] = Math.max(0, currentData[key] + variation)
      }
    })
    lastUpdate.value = new Date().toLocaleTimeString()
    isRefreshing.value = false
  }, 1000)
}

// 获取状态相关方法
function getStatusBadgeClass(status) {
  const classes = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const labels = {
    normal: '正常',
    warning: '警告',
    error: '错误'
  }
  return labels[status] || '未知'
}

// 监听传入的服务数据
watch(() => props.service, (newService) => {
  if (newService) {
    selectedService.value = { ...newService }
  }
}, { immediate: true })

onMounted(() => {
  // 如果没有传入服务数据，使用默认数据
  if (!props.service) {
    selectedService.value = {
      appName: '订单管理系统-worker',
      ip: '172.16.10.26',
      system: '企业生产管理系统',
      status: 'error'
    }
  }

  // 设置定时刷新
  setInterval(() => {
    refreshData()
  }, 10000)
})
</script>

<style scoped>
/* 侧边面板样式 */
.side-panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
  width: 100%;
  max-width: 24rem;
  transform: translateX(0);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  background: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.side-panel.translate-x-0 {
  transform: translateX(0);
}

.side-panel.translate-x-full {
  transform: translateX(100%);
}

.side-panel-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* 确保内容不溢出 */
.panel-section {
  width: 100%;
  box-sizing: border-box;
}

.info-grid {
  display: grid;
  gap: 12px;
  width: 100%;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.info-label {
  flex: 0 0 auto;
  margin-right: 8px;
}

.info-value {
  flex: 1;
  text-align: right;
  word-break: break-all;
  min-width: 0;
}

/* 进度条样式 */
.progress-container {
  width: 100%;
  flex: 1;
  min-width: 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .side-panel {
    max-width: 100vw;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-value {
    text-align: left;
  }
}
</style>