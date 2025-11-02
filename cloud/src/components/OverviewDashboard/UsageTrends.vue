<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <div class="flex justify-between items-center">
      <p class="text-lg font-semibold leading-normal text-gray-900">云平台CPU与内存使用率</p>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
          <span class="text-sm text-gray-600">CPU</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
          <span class="text-sm text-gray-600">内存</span>
        </div>
      </div>
    </div>

    <!-- 当前使用率 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <div class="flex justify-between items-center mb-1">
          <p class="text-sm font-medium text-gray-700">CPU 使用率</p>
          <p class="text-sm font-bold text-primary">{{ currentCpuUsage }}%</p>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary h-2 rounded-full transition-all duration-500"
            :style="{ width: `${currentCpuUsage}%` }"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between items-center mb-1">
          <p class="text-sm font-medium text-gray-700">内存使用率</p>
          <p class="text-sm font-bold text-teal-500">{{ currentMemoryUsage }}%</p>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-teal-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${currentMemoryUsage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 趋势图 -->
    <div class="flex min-h-[250px] flex-1 flex-col gap-4 pt-4">
      <svg
        class="w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 450 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- 网格线 -->
        <g class="opacity-30">
          <path
            v-for="y in gridLines"
            :key="y"
            :d="`M0 ${y} L450 ${y}`"
            stroke="#e5e7eb"
            stroke-dasharray="4 2"
            stroke-width="1"
          ></path>
        </g>

        <!-- CPU趋势线 -->
        <path
          :d="cpuPath"
          stroke="#2b8cee"
          stroke-linecap="round"
          stroke-width="2.5"
          fill="none"
          class="transition-all duration-500"
        ></path>

        <!-- 内存趋势线 -->
        <path
          :d="memoryPath"
          stroke="#14b8a6"
          stroke-linecap="round"
          stroke-width="2.5"
          fill="none"
          class="transition-all duration-500"
        ></path>

        <!-- 数据点 -->
        <g v-for="(point, index) in dataPoints" :key="index">
          <circle
            :cx="point.x"
            :cy="point.cpuY"
            r="4"
            fill="#2b8cee"
            class="transition-all duration-300 hover:r-6 cursor-pointer"
            :title="`CPU: ${point.cpu}%`"
          ></circle>
          <circle
            :cx="point.x"
            :cy="point.memoryY"
            r="4"
            fill="#14b8a6"
            class="transition-all duration-300 hover:r-6 cursor-pointer"
            :title="`内存: ${point.memory}%`"
          ></circle>
        </g>
      </svg>

      <!-- 时间标签 -->
      <div class="flex justify-between text-xs text-gray-500">
        <span v-for="label in timeLabels" :key="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// 当前使用率
const currentCpuUsage = computed(() => props.data.cpu)
const currentMemoryUsage = computed(() => props.data.memory)

// 网格线
const gridLines = computed(() => [150, 112.5, 75, 37.5, 0])

// 时间标签
const timeLabels = computed(() => ['-24小时', '-18小时', '-12小时', '-6小时', '现在'])

// 生成SVG路径
function generatePath(values) {
  const points = props.data.trend.map((point, index) => {
    const x = (index / (props.data.trend.length - 1)) * 450
    const y = 150 - (values[index] / 100) * 150
    return `${x === 0 ? 'M' : 'C'} ${x} ${y}`
  })

  return points.join(' ').replace(/C/g, 'L')
}

// CPU路径
const cpuPath = computed(() => {
  const cpuValues = props.data.trend.map(point => point.cpu)
  return generatePath(cpuValues)
})

// 内存路径
const memoryPath = computed(() => {
  const memoryValues = props.data.trend.map(point => point.memory)
  return generatePath(memoryValues)
})

// 数据点
const dataPoints = computed(() => {
  return props.data.trend.map((point, index) => {
    const x = (index / (props.data.trend.length - 1)) * 450
    const cpuY = 150 - (point.cpu / 100) * 150
    const memoryY = 150 - (point.memory / 100) * 150
    return { x, cpuY, memoryY, cpu: point.cpu, memory: point.memory }
  })
})
</script>

<style scoped>
/* 使用率趋势样式 */
.bg-primary { background-color: #2b8cee; }
.text-primary { color: #2b8cee; }
</style>