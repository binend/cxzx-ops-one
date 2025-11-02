<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-lg font-semibold leading-normal text-gray-900">环境与区域分布</p>
      <div class="flex items-center gap-2 flex-wrap">
        <div
          v-for="env in environments"
          :key="env.key"
          class="flex items-center gap-1.5"
        >
          <div
            :class="[
              'w-2.5 h-2.5 rounded-full',
              `bg-${env.color}-500`
            ]"
          ></div>
          <span class="text-sm text-gray-600">{{ env.label }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 min-h-[300px]">
      <!-- 柱状图 -->
      <div class="flex flex-col">
        <div class="flex-grow flex flex-col justify-end gap-2">
          <div
            v-for="percentage in [60, 40, 20, 0]"
            :key="percentage"
            class="flex items-end gap-2"
          >
            <div class="w-8 text-xs text-right text-gray-500">{{ percentage }}%</div>
            <div
              :class="[
                'flex-1 h-0.5',
                percentage === 0 ? 'bg-gray-300' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>

        <div class="flex items-start gap-4 pt-2 pl-10 h-40">
          <div
            v-for="region in regions"
            :key="region.key"
            class="flex flex-col items-center gap-2 h-full w-full"
          >
            <div class="flex items-end h-full w-full gap-2">
              <div
                v-for="env in environments"
                :key="env.key"
                class="h-full flex flex-col justify-end w-1/3"
              >
                <div
                  :class="[
                    'transition-all duration-500 hover:opacity-80',
                    `bg-${env.color}-500`
                  ]"
                  :style="{ height: `${getRegionData(region.key, env.key)}%` }"
                  :title="`${env.label}: ${getRegionData(region.key, env.key)}%`"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ region.label }}</p>
          </div>
        </div>
      </div>

      <!-- 饼图 -->
      <div class="flex items-center justify-center">
        <div class="relative w-48 h-48 sm:w-56 sm:h-56">
          <svg class="w-full h-full" viewBox="0 0 36 36">
            <circle
              v-for="(segment, index) in pieSegments"
              :key="index"
              :cx="18"
              :cy="18"
              fill="none"
              r="15.9155"
              :stroke-dasharray="segment.dasharray"
              :stroke-dashoffset="segment.offset"
              :stroke="segment.color"
              stroke-width="4"
              class="transition-all duration-300 hover:opacity-80"
            ></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-gray-900 animate-pulse">100%</span>
            <span class="text-sm text-gray-500">总资源</span>
          </div>
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

// 环境配置
const environments = [
  { key: 'production', label: '生产环境', color: 'blue' },
  { key: 'testing', label: '测试环境', color: 'green' },
  { key: 'development', label: '开发环境', color: 'yellow' }
]

// 区域配置
const regions = [
  { key: 'huadong', label: '华东' },
  { key: 'huabei', label: '华北' },
  { key: 'overseas', label: '海外' }
]

// 获取区域数据
function getRegionData(region, environment) {
  return props.data[region]?.[environment] || 0
}

// 计算饼图数据
const pieSegments = computed(() => {
  let offset = 0
  const totalPercentage = 100

  return environments.map((env, index) => {
    const percentage = totalPercentage / environments.length
    const dasharray = `${percentage}, 100`
    const currentOffset = offset

    offset += percentage

    const color = {
      blue: '#3b82f6',
      green: '#22c55e',
      yellow: '#eab308'
    }[env.color]

    return {
      dasharray,
      offset: -currentOffset,
      color
    }
  })
})
</script>

<style scoped>
/* 区域分布样式 */
.bg-blue-500 { background-color: #3b82f6; }
.bg-green-500 { background-color: #22c55e; }
.bg-yellow-500 { background-color: #eab308; }
.stroke-blue-500 { stroke: #3b82f6; }
.stroke-green-500 { stroke: #22c55e; }
.stroke-yellow-500 { stroke: #eab308; }
</style>