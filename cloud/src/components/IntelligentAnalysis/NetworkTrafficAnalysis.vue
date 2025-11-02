<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal">服务网络流量分析</p>
    <div class="space-y-4">
      <div
        v-for="service in traffic"
        :key="service.name"
        class="space-y-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">{{ service.name }}</span>
          <span
            :class="[
              'text-sm font-semibold',
              getTrafficColorClass(service.status)
            ]"
          >
            {{ service.traffic }} {{ service.unit }}
          </span>
        </div>
        <div class="relative">
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              :class="[
                'h-2.5 rounded-full transition-all duration-500',
                getTrafficBarClass(service.status)
              ]"
              :style="{ width: `${service.percentage}%` }"
            ></div>
          </div>
          <!-- 流量指示器 -->
          <div
            :class="[
              'absolute top-0 h-2.5 w-1 rounded-full transition-all duration-500',
              getTrafficIndicatorClass(service.status)
            ]"
            :style="{ left: `${service.percentage}%`, transform: 'translateX(-50%)' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 流量统计 -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-blue-600">{{ totalTraffic }}</div>
          <div class="text-xs text-gray-500">总流量</div>
        </div>
        <div>
          <div class="text-lg font-bold text-green-600">{{ activeServices }}</div>
          <div class="text-xs text-gray-500">活跃服务</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  traffic: {
    type: Array,
    required: true
  }
})

// 计算总流量
const totalTraffic = computed(() => {
  const total = props.traffic.reduce((sum, service) => {
    return sum + service.traffic
  }, 0)

  if (total >= 1000) {
    return `${(total / 1000).toFixed(1)} GB/s`
  }
  return `${total} MB/s`
})

// 计算活跃服务数
const activeServices = computed(() => {
  return props.traffic.filter(service => service.percentage > 10).length
})

// 获取流量颜色类
function getTrafficColorClass(status) {
  const classes = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    normal: 'text-gray-700'
  }
  return classes[status] || 'text-gray-700'
}

// 获取流量条颜色类
function getTrafficBarClass(status) {
  const classes = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    normal: 'bg-primary'
  }
  return classes[status] || 'bg-gray-400'
}

// 获取流量指示器颜色类
function getTrafficIndicatorClass(status) {
  const classes = {
    high: 'bg-red-600 animate-pulse',
    medium: 'bg-yellow-600',
    normal: 'bg-blue-600'
  }
  return classes[status] || 'bg-gray-600'
}
</script>

<style scoped>
/* 网络流量分析样式 */
.text-primary { color: #2b8cee; }
.bg-primary { background-color: #2b8cee; }
</style>