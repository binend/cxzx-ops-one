<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal">高IO服务器识别</p>
    <div class="space-y-4">
      <div
        v-for="server in servers"
        :key="server.name"
        class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        @click="handleServerClick(server)"
      >
        <div
          :class="[
            'flex items-center justify-center size-10 rounded-lg',
            getServerIconClass(server.status)
          ]"
        >
          <span class="material-symbols-outlined">{{ getServerIcon(server.type) }}</span>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-800">{{ server.name }}</p>
          <p class="text-sm text-gray-500">平均IOPS: {{ formatIOPS(server.iops) }}</p>
        </div>
        <div class="text-right">
          <p
            :class="[
              'font-bold',
              getUtilizationColorClass(server.utilization)
            ]"
          >
            {{ server.utilization }}%
          </p>
          <p class="text-xs text-gray-400">IO利用率</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  servers: {
    type: Array,
    required: true
  }
})

// 格式化IOPS数值
function formatIOPS(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return value.toLocaleString()
}

// 获取服务器图标
function getServerIcon(type) {
  const icons = {
    database: 'database',
    dns: 'dns',
    storage: 'storage',
    compute: 'memory_alt',
    network: 'router'
  }
  return icons[type] || 'dns'
}

// 获取服务器图标样式类
function getServerIconClass(status) {
  const classes = {
    critical: 'bg-red-100 text-red-500',
    warning: 'bg-yellow-100 text-yellow-500',
    normal: 'bg-green-100 text-green-500'
  }
  return classes[status] || 'bg-gray-100 text-gray-500'
}

// 获取利用率颜色类
function getUtilizationColorClass(utilization) {
  if (utilization > 90) return 'text-red-500'
  if (utilization > 80) return 'text-yellow-500'
  return 'text-green-500'
}

// 处理服务器点击
function handleServerClick(server) {
  appStore.addNotification({
    type: 'info',
    title: '服务器详情',
    message: `查看 ${server.name} 的详细信息`
  })
}
</script>

<style scoped>
/* 高IO服务器样式 */
</style>