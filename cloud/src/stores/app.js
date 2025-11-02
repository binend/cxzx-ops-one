import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const activeTab = ref('overview')
  const loading = ref(false)
  const sidePanelOpen = ref(false)
  const notifications = ref([])
  const selectedService = ref(null)

  // 云平台数据
  const resourceData = ref({
    obs: {
      total: 1000,
      used: 850,
      unit: 'GB'
    },
    cpu: {
      total: 128,
      available: 36,
      unit: '核'
    },
    memory: {
      total: 256,
      available: 90,
      unit: 'GB'
    },
    disk: {
      total: 10,
      available: 2.5,
      unit: 'TB'
    }
  })

  const usageTrends = ref({
    cpu: 72,
    memory: 65,
    trend: [
      { time: -24, cpu: 45, memory: 52 },
      { time: -18, cpu: 58, memory: 61 },
      { time: -12, cpu: 65, memory: 68 },
      { time: -6, cpu: 71, memory: 64 },
      { time: 0, cpu: 72, memory: 65 }
    ]
  })

  const regionData = ref({
    huadong: { production: 55, testing: 35, development: 10 },
    huabei: { production: 40, testing: 30, development: 30 },
    overseas: { production: 25, testing: 45, development: 30 }
  })

  const sfsData = ref({
    capacity: { used: 2.5, total: 5, unit: 'TB' },
    iops: { read: 5000, write: 2100 },
    throughput: 256
  })

  const alerts = ref([
    {
      id: 1,
      type: 'error',
      title: '服务异常',
      description: '订单管理系统 (172.16.10.26) order-worker-01 服务无响应',
      time: '2分钟前',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: '高CPU使用率',
      description: '订单处理API (172.16.10.26) CPU 使用率超过 95%',
      time: '15分钟前',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'warning',
      title: '磁盘空间不足',
      description: '数据存储系统 (172.16.10.28) 磁盘空间使用率达到 88%',
      time: '1小时前',
      priority: 'medium'
    }
  ])

  // Getters
  const obsUsagePercentage = computed(() => {
    return Math.round((resourceData.value.obs.used / resourceData.value.obs.total) * 100)
  })

  const cpuUsagePercentage = computed(() => {
    return Math.round(((resourceData.value.cpu.total - resourceData.value.cpu.available) / resourceData.value.cpu.total) * 100)
  })

  const memoryUsagePercentage = computed(() => {
    return Math.round(((resourceData.value.memory.total - resourceData.value.memory.available) / resourceData.value.memory.total) * 100)
  })

  const diskUsagePercentage = computed(() => {
    return Math.round(((resourceData.value.disk.total - resourceData.value.disk.available) / resourceData.value.disk.total) * 100)
  })

  const highPriorityAlerts = computed(() => {
    return alerts.value.filter(alert => alert.priority === 'high')
  })

  // Actions
  function setActiveTab(tab) {
    activeTab.value = tab
  }

  function setLoading(value) {
    loading.value = value
  }

  function openSidePanel() {
    sidePanelOpen.value = true
  }

  function closeSidePanel() {
    sidePanelOpen.value = false
    selectedService.value = null
  }

  function setSelectedService(service) {
    selectedService.value = service
    sidePanelOpen.value = true
  }

  function addNotification(notification) {
    notifications.value.push({
      id: Date.now(),
      ...notification
    })
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function updateResourceData(newData) {
    resourceData.value = { ...resourceData.value, ...newData }
  }

  function updateUsageTrends(newTrends) {
    usageTrends.value = { ...usageTrends.value, ...newTrends }
  }

  function addAlert(alert) {
    alerts.value.unshift({
      id: Date.now(),
      ...alert
    })
  }

  function removeAlert(id) {
    const index = alerts.value.findIndex(alert => alert.id === id)
    if (index > -1) {
      alerts.value.splice(index, 1)
    }
  }

  return {
    // 状态
    activeTab,
    loading,
    sidePanelOpen,
    notifications,
    selectedService,
    resourceData,
    usageTrends,
    regionData,
    sfsData,
    alerts,

    // Getters
    obsUsagePercentage,
    cpuUsagePercentage,
    memoryUsagePercentage,
    diskUsagePercentage,
    highPriorityAlerts,

    // Actions
    setActiveTab,
    setLoading,
    openSidePanel,
    closeSidePanel,
    setSelectedService,
    addNotification,
    removeNotification,
    updateResourceData,
    updateUsageTrends,
    addAlert,
    removeAlert
  }
})