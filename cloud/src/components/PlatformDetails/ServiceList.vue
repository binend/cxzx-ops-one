<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <!-- 表格头部 -->
    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">服务列表</h3>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>共 {{ services.length }} 个服务</span>
          <span class="material-symbols-outlined text-base">server</span>
        </div>
      </div>
    </div>

    <!-- 服务表格 -->
    <div class="table-container overflow-x-auto">
      <table class="service-table w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="header in tableHeaders"
              :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="sortByColumn(header.key)"
            >
              <div class="flex items-center gap-1">
                {{ header.label }}
                <span
                  v-if="sortColumn === header.key"
                  :class="[
                    'material-symbols-outlined text-sm',
                    sortDirection === 'asc' ? '' : 'rotate-180'
                  ]"
                >
                  arrow_upward
                </span>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              使用率查看
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="service in sortedServices"
            :key="service.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- 系统 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ service.system }}</div>
            </td>

            <!-- 厂商 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ service.vendor }}</div>
            </td>

            <!-- IP地址 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-mono">{{ service.ip }}</div>
            </td>

            <!-- 部署的应用名称 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ service.appName }}</div>
            </td>

            <!-- 端口 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-mono">{{ service.port }}</div>
            </td>

            <!-- 服务链接 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <a
                :href="service.serviceLink"
                target="_blank"
                class="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {{ service.serviceLink }}
              </a>
            </td>

            <!-- 硬件规格 -->
            <td class="px-6 py-4">
              <div class="text-sm text-gray-600 max-w-xs" :title="service.hardwareSpec.replace(/\n/g, ' ')">
                <span class="whitespace-pre-line">{{ service.hardwareSpec }}</span>
              </div>
            </td>

            <!-- 服务状态 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusBadgeClass(service.status)
                ]"
              >
                <span
                  :class="[
                    'material-symbols-outlined text-xs mr-1',
                    getStatusIconClass(service.status)
                  ]"
                >
                  {{ getStatusIcon(service.status) }}
                </span>
                {{ getStatusLabel(service.status) }}
              </span>
            </td>

            <!-- 操作 -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="showDetails(service)"
                class="text-primary hover:text-primary/80 transition-colors px-3 py-1 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                使用率查看
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状态 -->
    <div v-if="services.length === 0" class="text-center py-12">
      <span class="material-symbols-outlined text-6xl text-gray-300">inbox</span>
      <p class="mt-4 text-gray-500">没有找到匹配的服务</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  services: {
    type: Array,
    required: true
  }
})

const appStore = useAppStore()

// 排序状态
const sortColumn = ref('name')
const sortDirection = ref('asc')

// 表格头部
const tableHeaders = [
  { key: 'system', label: '系统' },
  { key: 'vendor', label: '厂商' },
  { key: 'ip', label: 'IP' },
  { key: 'appName', label: '部署的应用名称' },
  { key: 'port', label: '端口' },
  { key: 'serviceLink', label: '服务链接' },
  { key: 'hardwareSpec', label: '硬件规格' },
  { key: 'status', label: '服务状态' }
]

// 排序后的服务列表
const sortedServices = computed(() => {
  const services = [...props.services]
  return services.sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// 排序列
function sortByColumn(column) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}


// 显示服务详情
function showDetails(service) {
  appStore.setSelectedService(service)
  appStore.addNotification({
    type: 'info',
    title: '服务详情',
    message: `正在查看 ${service.appName} 的使用率详情`
  })
}

// 获取状态相关方法
function getStatusColor(status) {
  const colors = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

function getStatusBadgeClass(status) {
  const classes = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusIcon(status) {
  const icons = {
    normal: 'check_circle',
    warning: 'warning',
    error: 'error'
  }
  return icons[status] || 'help'
}

function getStatusIconClass(status) {
  const classes = {
    normal: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

function getStatusLabel(status) {
  const labels = {
    normal: '正常',
    warning: '警告',
    error: '错误'
  }
  return labels[status] || '未知'
}

function getServiceIcon(type) {
  const icons = {
    '订单管理系统': 'shopping_cart',
    '订单处理API': 'api',
    '数据存储系统': 'storage',
    'Web服务器': 'language',
    '缓存服务': 'memory'
  }
  return icons[type] || 'dns'
}

function getUsageColor(usage) {
  if (usage > 80) return 'bg-red-500'
  if (usage > 60) return 'bg-yellow-500'
  return 'bg-green-500'
}
</script>

<style scoped>
/* 服务列表样式 */
.text-primary { color: #2b8cee; }

.rotate-180 {
  transform: rotate(180deg);
}

/* 确保表格布局正确 */
.service-table {
  width: 100%;
  border-collapse: collapse;
}

.service-table th,
.service-table td {
  text-align: left;
  padding: 12px 16px;
  vertical-align: middle;
}

.service-table th {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}

.service-table tr:nth-child(even) {
  background-color: #f9fafb;
}

.service-table tr:hover {
  background-color: #f3f4f6;
}

/* 确保表格容器不会溢出 */
.table-container {
  width: 100%;
  overflow-x: auto;
  min-width: 0;
}
</style>