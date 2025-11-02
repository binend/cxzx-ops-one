<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal">CPU利用率异常识别</p>
    <div class="space-y-3">
      <div
        v-for="anomaly in anomalies"
        :key="anomaly.name"
        :class="[
          'flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer',
          getAnomalyBgClass(anomaly.type)
        ]"
        @click="handleAnomalyClick(anomaly)"
      >
        <div class="flex items-center gap-3">
          <span
            :class="[
              'material-symbols-outlined text-xl',
              getAnomalyIconClass(anomaly.type)
            ]"
          >
            {{ getAnomalyIcon(anomaly.type) }}
          </span>
          <div>
            <p class="font-semibold text-gray-800">{{ anomaly.name }}</p>
            <p class="text-sm text-gray-500">{{ anomaly.issue }} ({{ anomaly.usage }}%)</p>
          </div>
        </div>
        <span
          :class="[
            'text-xs font-semibold px-2.5 py-0.5 rounded-full',
            getAnomalyLabelClass(anomaly.type)
          ]"
        >
          {{ getAnomalyLabel(anomaly.type) }}
        </span>
      </div>
    </div>

    <!-- 异常统计 -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-3 bg-red-50 rounded-lg">
          <div class="text-xl font-bold text-red-600">{{ bottleneckCount }}</div>
          <div class="text-xs text-gray-500">性能瓶颈</div>
        </div>
        <div class="text-center p-3 bg-yellow-50 rounded-lg">
          <div class="text-xl font-bold text-yellow-600">{{ wasteCount }}</div>
          <div class="text-xs text-gray-500">资源浪费</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  anomalies: {
    type: Array,
    required: true
  }
})

// 计算异常数量
const bottleneckCount = computed(() => {
  return props.anomalies.filter(anomaly => anomaly.type === 'bottleneck').length
})

const wasteCount = computed(() => {
  return props.anomalies.filter(anomaly => anomaly.type === 'waste').length
})

// 获取异常背景样式类
function getAnomalyBgClass(type) {
  const classes = {
    bottleneck: 'bg-red-50 hover:bg-red-100',
    waste: 'bg-yellow-50 hover:bg-yellow-100'
  }
  return classes[type] || 'bg-gray-50 hover:bg-gray-100'
}

// 获取异常图标
function getAnomalyIcon(type) {
  const icons = {
    bottleneck: 'arrow_upward',
    waste: 'arrow_downward'
  }
  return icons[type] || 'error'
}

// 获取异常图标样式类
function getAnomalyIconClass(type) {
  const classes = {
    bottleneck: 'text-red-500',
    waste: 'text-yellow-500'
  }
  return classes[type] || 'text-gray-500'
}

// 获取异常标签
function getAnomalyLabel(type) {
  const labels = {
    bottleneck: '性能瓶颈',
    waste: '资源浪费'
  }
  return labels[type] || '异常'
}

// 获取异常标签样式类
function getAnomalyLabelClass(type) {
  const classes = {
    bottleneck: 'bg-red-100 text-red-800',
    waste: 'bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

// 处理异常点击
function handleAnomalyClick(anomaly) {
  appStore.addNotification({
    type: 'warning',
    title: '异常详情',
    message: `${anomaly.name}: ${anomaly.recommendation}`
  })
}
</script>

<style scoped>
/* CPU异常检测样式 */
</style>