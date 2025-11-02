<template>
  <div class="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 animate-slideDown">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <span class="material-symbols-outlined text-red-500">warning</span>
        系统警告
      </h2>
      <a
        href="#"
        class="text-sm text-primary hover:underline flex items-center gap-1 transition-colors"
        @click.prevent="showAllAlerts"
      >
        <span>查看全部</span>
        <span class="material-symbols-outlined text-base">arrow_forward</span>
      </a>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center justify-end gap-3 mb-3">
        <span class="text-sm text-gray-500">排序:</span>
        <button
          v-for="option in sortOptions"
          :key="option.key"
          @click="setSortBy(option.key)"
          :class="[
            'flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-md transition-colors px-3',
            sortBy === option.key
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          ]"
        >
          <p class="text-sm font-medium leading-normal">{{ option.label }}</p>
          <span class="material-symbols-outlined text-base">arrow_drop_down</span>
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="alert in sortedAlerts"
          :key="alert.id"
          :class="[
            'block p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-[1.02]',
            getAlertClasses(alert.type)
          ]"
          @click="handleAlertClick(alert)"
        >
          <div class="flex justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'material-symbols-outlined text-xl',
                  getAlertIconClass(alert.type)
                ]"
              >
                {{ getAlertIcon(alert.type) }}
              </span>
              <div class="flex items-center gap-2">
                <h3 :class="getAlertTitleClass(alert.type)">
                  {{ alert.title }}
                </h3>
                <p class="text-gray-600 text-sm">{{ alert.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                  getPriorityClass(alert.priority)
                ]"
              >
                {{ getPriorityLabel(alert.priority) }}
              </span>
              <span class="text-xs text-gray-500 whitespace-nowrap">{{ alert.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 告警统计 -->
    <div class="mt-4 grid grid-cols-3 gap-4">
      <div class="text-center p-2 bg-red-50 rounded-lg">
        <div class="text-xl font-bold text-red-600">{{ criticalAlerts }}</div>
        <div class="text-xs text-gray-500">严重告警</div>
      </div>
      <div class="text-center p-2 bg-yellow-50 rounded-lg">
        <div class="text-xl font-bold text-yellow-600">{{ warningAlerts }}</div>
        <div class="text-xs text-gray-500">警告告警</div>
      </div>
      <div class="text-center p-2 bg-green-50 rounded-lg">
        <div class="text-xl font-bold text-green-600">{{ normalAlerts }}</div>
        <div class="text-xs text-gray-500">正常状态</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  alerts: {
    type: Array,
    required: true
  }
})

const sortBy = ref('time')

// 排序选项
const sortOptions = [
  { key: 'time', label: '时间 (最新)' },
  { key: 'priority', label: '优先级 (高到低)' }
]

// 排序后的告警
const sortedAlerts = computed(() => {
  const alerts = [...props.alerts]
  return alerts.sort((a, b) => {
    if (sortBy.value === 'time') {
      // 简单的时间排序，实际应该解析时间字符串
      return 0
    } else if (sortBy.value === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return 0
  })
})

// 告警统计
const criticalAlerts = computed(() => props.alerts.filter(alert => alert.priority === 'high').length)
const warningAlerts = computed(() => props.alerts.filter(alert => alert.priority === 'medium').length)
const normalAlerts = computed(() => props.alerts.filter(alert => alert.priority === 'low').length)

// 设置排序方式
function setSortBy(key) {
  sortBy.value = key
}

// 获取告警样式类
function getAlertClasses(type) {
  const classes = {
    error: 'bg-red-50 border-red-200 hover:bg-red-100',
    warning: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    info: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    success: 'bg-green-50 border-green-200 hover:bg-green-100'
  }
  return classes[type] || classes.info
}

function getAlertIcon(type) {
  const icons = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    success: 'check_circle'
  }
  return icons[type] || 'info'
}

function getAlertIconClass(type) {
  const classes = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    success: 'text-green-500'
  }
  return classes[type] || 'text-blue-500'
}

function getAlertTitleClass(type) {
  const classes = {
    error: 'text-red-600 font-medium',
    warning: 'text-yellow-600 font-medium',
    info: 'text-blue-600 font-medium',
    success: 'text-green-600 font-medium'
  }
  return classes[type] || 'text-blue-600 font-medium'
}

function getPriorityClass(priority) {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

function getPriorityLabel(priority) {
  const labels = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || '低'
}

// 处理告警点击
function handleAlertClick(alert) {
  appStore.addNotification({
    type: alert.type,
    title: '告警详情',
    message: `查看告警：${alert.title}`
  })
}

// 显示所有告警
function showAllAlerts() {
  appStore.addNotification({
    type: 'info',
    title: '告警列表',
    message: '显示所有告警信息'
  })
}
</script>

<style scoped>
/* 告警面板样式 */
.text-primary { color: #2b8cee; }
.bg-primary { background-color: #2b8cee; }
</style>