<template>
  <div
    class="resource-card flex flex-col rounded-xl border border-gray-200 p-5 bg-white/90 backdrop-blur-sm card-shadow cursor-pointer transform transition-all duration-300 hover:scale-105"
    @click="$emit('click', resource)"
  >
    <div class="flex items-center gap-3">
      <div
        :class="[
          'flex items-center justify-center w-10 h-10 rounded-lg',
          `bg-${resource.color}-100`
        ]"
      >
        <span
          :class="[
            'material-symbols-outlined text-xl',
            `text-${resource.color}-500`
          ]"
        >
          {{ resource.icon }}
        </span>
      </div>
      <p class="text-base font-semibold text-gray-900">{{ resource.title }}</p>
    </div>

    <div class="mt-4 flex flex-col gap-1.5">
      <div class="flex justify-between items-baseline">
        <span class="text-sm text-gray-500">{{ totalLabel }}</span>
        <p class="text-xl font-bold text-gray-800">
          {{ resource.total }} {{ resource.unit }}
        </p>
      </div>
      <div class="flex justify-between items-baseline">
        <span class="text-sm text-gray-500">{{ usedLabel }}</span>
        <p class="text-xl font-bold text-gray-800">
          {{ displayValue }} {{ resource.unit }}
        </p>
      </div>
      <div class="mt-2">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-gray-500">使用率</span>
          <span
            :class="[
              'text-xs font-semibold',
              usageColorClass
            ]"
          >
            {{ resource.usagePercentage }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="[
              'h-2 rounded-full transition-all duration-500',
              usageColorBar
            ]"
            :style="{ width: `${resource.usagePercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 悬浮动画效果 -->
    <div class="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

// 计算显示标签
const totalLabel = computed(() => {
  switch (props.resource.key) {
    case 'obs':
      return 'OBS总存储空间'
    case 'cpu':
      return 'CPU总核数'
    case 'memory':
      return '内存总大小'
    case 'disk':
      return '硬盘总大小'
    default:
      return '总量'
  }
})

const usedLabel = computed(() => {
  switch (props.resource.key) {
    case 'obs':
      return 'OBS已使用存储空间'
    case 'cpu':
      return 'CPU可用核数'
    case 'memory':
      return '内存可用大小'
    case 'disk':
      return '硬盘可用大小'
    default:
      return '已使用'
  }
})

// 计算显示值
const displayValue = computed(() => {
  if (props.resource.available !== undefined) {
    return props.resource.available
  }
  return props.resource.used
})

// 使用率颜色
const usageColorClass = computed(() => {
  const percentage = props.resource.usagePercentage
  if (percentage > 80) return 'text-red-500'
  if (percentage > 60) return 'text-yellow-500'
  return 'text-green-500'
})

const usageColorBar = computed(() => {
  const percentage = props.resource.usagePercentage
  if (percentage > 80) return 'bg-red-500'
  if (percentage > 60) return 'bg-yellow-500'
  return 'bg-green-500'
})
</script>

<style scoped>
/* 资源卡片样式 */
.card-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.card-shadow:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 动态颜色类 */
.bg-red-100 { background-color: #fef2f2; }
.text-red-500 { color: #ef4444; }
.bg-blue-100 { background-color: #eff6ff; }
.text-blue-500 { color: #3b82f6; }
.bg-green-100 { background-color: #f0fdf4; }
.text-green-500 { color: #22c55e; }
.bg-yellow-100 { background-color: #fefce8; }
.text-yellow-500 { color: #eab308; }

.bg-red-500 { background-color: #ef4444; }
.bg-yellow-500 { background-color: #eab308; }
.bg-green-500 { background-color: #22c55e; }

/* 确保卡片内容对齐 */
.resource-card {
  width: 100%;
  min-width: 0;
  flex: 1;
}

.resource-card .flex {
  align-items: flex-start;
}

.resource-card .flex-1 {
  flex: 1;
  min-width: 0;
}
</style>