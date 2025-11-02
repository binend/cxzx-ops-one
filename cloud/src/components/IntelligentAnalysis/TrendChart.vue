<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <div class="flex justify-between items-center">
      <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal">资源使用异常趋势图</p>
      <div class="flex gap-2 text-sm">
        <button
          v-for="metric in metrics"
          :key="metric.key"
          @click="selectedMetric = metric.key"
          :class="[
            'px-3 py-1 rounded-md font-semibold transition-colors',
            selectedMetric === metric.key
              ? 'bg-primary/10 text-primary'
              : 'text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100'
          ]"
        >
          {{ metric.label }}
        </button>
      </div>
    </div>

    <div class="h-64 relative">
      <!-- SVG趋势图 -->
      <svg
        class="w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 800 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- 网格线 -->
        <defs>
          <pattern id="grid" width="80" height="50" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- 异常区域标记 -->
        <g v-for="anomaly in anomalies" :key="anomaly.id">
          <rect
            :x="anomaly.x"
            y="0"
            :width="anomaly.width"
            height="250"
            fill="#F56C6C"
            opacity="0.1"
          />
          <circle
            :cx="anomaly.x + anomaly.width / 2"
            :cy="anomaly.y"
            r="5"
            fill="#F56C6C"
            class="animate-pulse"
          />
        </g>

        <!-- 趋势线 -->
        <path
          :d="trendPath"
          stroke="#2b8cee"
          stroke-width="2"
          fill="none"
          class="transition-all duration-500"
        />

        <!-- 异常路径段 -->
        <path
          v-for="segment in anomalySegments"
          :key="segment.id"
          :d="segment.path"
          stroke="#F56C6C"
          stroke-width="2.5"
          fill="none"
          class="transition-all duration-300"
        />

        <!-- 数据点 -->
        <g v-for="(point, index) in dataPoints" :key="index">
          <circle
            :cx="point.x"
            :cy="point.y"
            r="3"
            :fill="point.isAnomaly ? '#F56C6C' : '#2b8cee'"
            :class="point.isAnomaly ? 'animate-pulse' : ''"
            class="cursor-pointer hover:r-4 transition-all"
            :title="`${point.value}% (${point.time})`"
          />
        </g>

        <!-- 阈值线 -->
        <line
          x1="0"
          y1="50"
          x2="800"
          y2="50"
          stroke="#ef4444"
          stroke-width="1"
          stroke-dasharray="5,5"
          opacity="0.5"
        />
        <text x="5" y="45" fill="#ef4444" font-size="12">阈值 (90%)</text>
      </svg>

      <!-- 悬浮提示 -->
      <div
        v-if="hoveredPoint"
        class="absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none z-10"
        :style="{ left: hoveredPoint.x + 'px', top: hoveredPoint.y - 40 + 'px' }"
      >
        <div>数值: {{ hoveredPoint.value }}%</div>
        <div>时间: {{ hoveredPoint.time }}</div>
        <div v-if="hoveredPoint.isAnomaly" class="text-red-300">⚠️ 异常</div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>正常</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>异常</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-0.5 bg-red-500"></div>
          <span>阈值线</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">refresh</span>
        <span>自动刷新 (30s)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const selectedMetric = ref('cpu')
const hoveredPoint = ref(null)
let refreshInterval = null

// 指标配置
const metrics = [
  { key: 'cpu', label: 'CPU' },
  { key: 'memory', label: '内存' },
  { key: 'network', label: '网络' },
  { key: 'disk', label: '磁盘I/O' }
]

// 异常检测
const anomalies = computed(() => {
  const threshold = 90
  const points = dataPoints.value
  const anomalyZones = []

  points.forEach((point, index) => {
    if (point.value > threshold) {
      const x = (index / (points.length - 1)) * 800
      anomalyZones.push({
        id: index,
        x: Math.max(0, x - 20),
        width: 40,
        y: point.y
      })
    }
  })

  return anomalyZones
})

// 异常路径段
const anomalySegments = computed(() => {
  const threshold = 90
  const points = dataPoints.value
  const segments = []

  for (let i = 1; i < points.length; i++) {
    if (points[i].value > threshold || points[i - 1].value > threshold) {
      const pathData = `M${points[i - 1].x} ${points[i - 1].y} L${points[i].x} ${points[i].y}`
      segments.push({
        id: i,
        path: pathData
      })
    }
  }

  return segments
})

// 数据点
const dataPoints = computed(() => {
  const metrics = props.data.metrics || []
  const threshold = 90

  return metrics.map((point, index) => {
    const value = selectedMetric.value === 'cpu' ? point.cpu : point.memory
    const x = (index / (metrics.length - 1)) * 800
    const y = 250 - (value / 100) * 200

    return {
      x,
      y,
      value: Math.round(value),
      time: new Date(point.time).toLocaleTimeString(),
      isAnomaly: value > threshold
    }
  })
})

// 趋势路径
const trendPath = computed(() => {
  const points = dataPoints.value
  if (points.length === 0) return ''

  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'C'} ${point.x} ${point.y}`
  })

  return pathData.join(' ').replace(/C/g, 'L')
})

// 处理鼠标移动
function handleMouseMove(event) {
  const svg = event.currentTarget
  const rect = svg.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 查找最近的数据点
  const closestPoint = dataPoints.value.reduce((closest, point) => {
    const distance = Math.abs(point.x - x)
    const closestDistance = Math.abs(closest.x - x)
    return distance < closestDistance ? point : closest
  }, dataPoints.value[0])

  if (Math.abs(closestPoint.x - x) < 20 && Math.abs(closestPoint.y - y) < 20) {
    hoveredPoint.value = closestPoint
  } else {
    hoveredPoint.value = null
  }
}

// 处理鼠标离开
function handleMouseLeave() {
  hoveredPoint.value = null
}

onMounted(() => {
  // 设置定时刷新
  refreshInterval = setInterval(() => {
    // 模拟数据更新
    hoveredPoint.value = null
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
/* 趋势图样式 */
.bg-primary\/10 { background-color: rgba(43, 140, 238, 0.1); }
.text-primary { color: #2b8cee; }
</style>