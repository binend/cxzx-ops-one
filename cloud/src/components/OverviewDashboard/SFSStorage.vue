<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <p class="text-lg font-semibold leading-normal text-gray-900">SFS存储相关统计</p>

    <div class="flex flex-col gap-5 pt-1">
      <!-- 容量使用 -->
      <div class="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
        <div class="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg shrink-0 animate-pulse">
          <span class="material-symbols-outlined text-2xl text-orange-500">database</span>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500">容量使用</p>
          <p class="text-xl font-bold text-gray-900">
            {{ data.capacity.used }} / {{ data.capacity.total }} {{ data.capacity.unit }}
          </p>
          <div class="mt-2 w-full bg-orange-200 rounded-full h-2">
            <div
              class="bg-orange-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${capacityUsagePercentage}%` }"
            ></div>
          </div>
        </div>
        <div class="text-right">
          <span class="text-2xl font-bold text-orange-500">{{ capacityUsagePercentage }}%</span>
          <p class="text-xs text-gray-400">已使用</p>
        </div>
      </div>

      <!-- IOPS -->
      <div class="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 transition-all duration-300">
        <div class="w-12 h-12 flex items-center justify-center bg-sky-100 rounded-lg shrink-0 animate-pulse">
          <span class="material-symbols-outlined text-2xl text-sky-500">speed</span>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500">IOPS (读/写)</p>
          <p class="text-xl font-bold text-gray-900">
            {{ formatIOPS(data.iops.read) }} / {{ formatIOPS(data.iops.write) }}
          </p>
        </div>
        <div class="flex gap-2">
          <div class="text-center">
            <div class="flex items-center gap-1 text-xs text-sky-600">
              <span class="material-symbols-outlined text-sm">arrow_downward</span>
              <span>读</span>
            </div>
            <span class="text-sm font-semibold text-sky-700">{{ formatIOPS(data.iops.read) }}</span>
          </div>
          <div class="text-center">
            <div class="flex items-center gap-1 text-xs text-green-600">
              <span class="material-symbols-outlined text-sm">arrow_upward</span>
              <span>写</span>
            </div>
            <span class="text-sm font-semibold text-green-700">{{ formatIOPS(data.iops.write) }}</span>
          </div>
        </div>
      </div>

      <!-- 吞吐量 -->
      <div class="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300">
        <div class="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-lg shrink-0 animate-pulse">
          <span class="material-symbols-outlined text-2xl text-emerald-500">swap_horiz</span>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500">吞吐量</p>
          <p class="text-xl font-bold text-gray-900">{{ data.throughput }} MB/s</p>
        </div>
        <div class="text-right">
          <div class="flex items-center gap-2 text-emerald-600">
            <div class="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">
              <span class="material-symbols-outlined text-sm">trending_up</span>
            </div>
            <span class="text-xs font-semibold">高性能</span>
          </div>
        </div>
      </div>

      <!-- 性能指标 -->
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="text-center p-3 rounded-lg bg-gray-50">
          <div class="text-2xl font-bold text-gray-800">{{ performanceScore }}</div>
          <div class="text-xs text-gray-500">性能评分</div>
        </div>
        <div class="text-center p-3 rounded-lg bg-blue-50">
          <div class="text-2xl font-bold text-blue-600">{{ responseTime }}ms</div>
          <div class="text-xs text-gray-500">响应时间</div>
        </div>
        <div class="text-center p-3 rounded-lg bg-green-50">
          <div class="text-2xl font-bold text-green-600">{{ uptime }}%</div>
          <div class="text-xs text-gray-500">可用性</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// 容量使用率
const capacityUsagePercentage = computed(() => {
  return Math.round((props.data.capacity.used / props.data.capacity.total) * 100)
})

// 格式化IOPS数值
function formatIOPS(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return value.toString()
}

// 模拟性能数据
const performanceScore = computed(() => {
  const baseScore = 85
  const cpuLoad = 72
  const memoryLoad = 65
  const iopsLoad = (props.data.iops.read + props.data.iops.write) / 10000
  const score = baseScore - (cpuLoad + memoryLoad) * 0.1 - iopsLoad * 5
  return Math.max(0, Math.round(score))
})

const responseTime = computed(() => {
  const baseTime = 12
  const loadFactor = (props.data.iops.read + props.data.iops.write) / 10000
  const time = baseTime + loadFactor * 8
  return Math.round(time)
})

const uptime = computed(() => {
  return 99.9 // 模拟高可用性
})
</script>

<style scoped>
/* SFS存储样式 */
</style>