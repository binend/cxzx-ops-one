<template>
  <div class="intelligent-alerts flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white/90 backdrop-blur-sm card-shadow">
    <p class="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal">智能告警与建议</p>
    <div class="overflow-x-auto">
      <table class="alerts-table text-sm text-left">
        <thead class="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th class="px-4 py-3" scope="col">告警类型</th>
            <th class="px-4 py-3" scope="col">相关资源</th>
            <th class="px-4 py-3" scope="col">问题描述</th>
            <th class="px-4 py-3" scope="col">优化建议</th>
            <th class="px-4 py-3 text-center" scope="col">优先级</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr
            v-for="(alert, index) in alerts"
            :key="index"
            :class="[
              'border-b transition-colors hover:bg-gray-50 cursor-pointer',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            ]"
            @click="handleAlertClick(alert)"
          >
            <td class="px-4 py-3 font-medium">{{ alert.type }}</td>
            <td class="px-4 py-3">{{ alert.resource }}</td>
            <td class="px-4 py-3">{{ alert.description }}</td>
            <td class="px-4 py-3">{{ alert.suggestion }}</td>
            <td class="px-4 py-3 text-center">
              <span
                :class="[
                  'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                  getPriorityClass(alert.priority)
                ]"
              >
                {{ getPriorityLabel(alert.priority) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 告警统计和操作 -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span>共 {{ alerts.length }} 条告警</span>
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
            高优先级: {{ highPriorityCount }}
          </span>
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
            中优先级: {{ mediumPriorityCount }}
          </span>
          <span class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            低优先级: {{ lowPriorityCount }}
          </span>
        </div>
        <div class="flex gap-2">
          <button
            @click="exportAlerts"
            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            导出报告
          </button>
          <button
            @click="refreshAlerts"
            :disabled="isRefreshing"
            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center gap-1"
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
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  alerts: {
    type: Array,
    required: true
  }
})

const isRefreshing = ref(false)

// 计算优先级数量
const highPriorityCount = computed(() => {
  return props.alerts.filter(alert => alert.priority === 'high').length
})

const mediumPriorityCount = computed(() => {
  return props.alerts.filter(alert => alert.priority === 'medium').length
})

const lowPriorityCount = computed(() => {
  return props.alerts.filter(alert => alert.priority === 'low').length
})

// 获取优先级样式类
function getPriorityClass(priority) {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

// 获取优先级标签
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
    type: 'info',
    title: '告警详情',
    message: `${alert.type}: ${alert.description}`
  })
}

// 导出告警
function exportAlerts() {
  const reportData = props.alerts.map(alert => ({
    告警类型: alert.type,
    相关资源: alert.resource,
    问题描述: alert.description,
    优化建议: alert.suggestion,
    优先级: getPriorityLabel(alert.priority)
  }))

  // 简化的导出逻辑（实际应该生成CSV或PDF）
  // 导出告警报告数据

  appStore.addNotification({
    type: 'success',
    title: '导出成功',
    message: `已导出 ${props.alerts.length} 条告警数据`
  })
}

// 刷新告警
function refreshAlerts() {
  isRefreshing.value = true

  setTimeout(() => {
    // 模拟刷新数据
    isRefreshing.value = false
    appStore.addNotification({
      type: 'success',
      title: '刷新完成',
      message: '告警数据已更新'
    })
  }, 1000)
}
</script>

<style scoped>
/* 智能告警样式 */
.intelligent-alerts {
  width: 100%;
  min-width: 0;
}

.alerts-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.alerts-table th,
.alerts-table td {
  padding: 12px;
  text-align: left;
  vertical-align: middle;
  word-wrap: break-word;
  max-width: 0;
}

.alerts-table th:nth-child(1),
.alerts-table td:nth-child(1) {
  width: 15%;
}

.alerts-table th:nth-child(2),
.alerts-table td:nth-child(2) {
  width: 15%;
}

.alerts-table th:nth-child(3),
.alerts-table td:nth-child(3) {
  width: 25%;
}

.alerts-table th:nth-child(4),
.alerts-table td:nth-child(4) {
  width: 30%;
}

.alerts-table th:nth-child(5),
.alerts-table td:nth-child(5) {
  width: 15%;
  text-align: center;
}

.alerts-table tbody tr {
  transition: background-color 0.2s ease;
}

.alerts-table tbody tr:hover {
  background-color: #f9fafb;
}

/* 确保表格响应式 */
@media (max-width: 768px) {
  .alerts-table {
    font-size: 0.875rem;
  }

  .alerts-table th,
  .alerts-table td {
    padding: 8px;
  }
}
</style>