<template>
  <div class="animate-fadeIn w-full">
    <!-- 时间范围和应用过滤器 -->
    <div class="flex gap-3 flex-wrap mb-6 w-full">
      <TimeRangeFilter v-model="selectedTimeRange" />
      <ApplicationFilter v-model="selectedApplication" />
      <EnvironmentFilter v-model="selectedEnvironment" />
    </div>

    <!-- 资源使用异常趋势图 -->
    <div class="mb-6 w-full">
      <TrendChart :data="trendData" />
    </div>

    <!-- 分析面板 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 w-full">
      <!-- 高IO服务器识别 -->
      <div class="w-full">
        <HighIOServers :servers="highIOServers" />
      </div>

      <!-- 服务网络流量分析 -->
      <div class="w-full">
        <NetworkTrafficAnalysis :traffic="networkTraffic" />
      </div>

      <!-- CPU利用率异常识别 -->
      <div class="w-full">
        <CPUAnomalyDetection :anomalies="cpuAnomalies" />
      </div>
    </div>

    <!-- 智能告警与建议 -->
    <div class="w-full">
      <IntelligentAlerts :alerts="intelligentAlerts" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import TimeRangeFilter from './IntelligentAnalysis/TimeRangeFilter.vue'
import ApplicationFilter from './IntelligentAnalysis/ApplicationFilter.vue'
import EnvironmentFilter from './IntelligentAnalysis/EnvironmentFilter.vue'
import TrendChart from './IntelligentAnalysis/TrendChart.vue'
import HighIOServers from './IntelligentAnalysis/HighIOServers.vue'
import NetworkTrafficAnalysis from './IntelligentAnalysis/NetworkTrafficAnalysis.vue'
import CPUAnomalyDetection from './IntelligentAnalysis/CPUAnomalyDetection.vue'
import IntelligentAlerts from './IntelligentAnalysis/IntelligentAlerts.vue'

const appStore = useAppStore()

// 过滤器状态
const selectedTimeRange = ref('24h')
const selectedApplication = ref('all')
const selectedEnvironment = ref('production')

// 趋势数据
const trendData = computed(() => ({
  timeRange: selectedTimeRange.value,
  metrics: generateTrendData()
}))

// 高IO服务器
const highIOServers = ref([
  {
    name: 'db-master-01',
    type: 'database',
    iops: 15200,
    utilization: 95,
    status: 'critical'
  },
  {
    name: 'data-proc-03',
    type: 'dns',
    iops: 12500,
    utilization: 91,
    status: 'warning'
  },
  {
    name: 'cache-node-05',
    type: 'storage',
    iops: 8900,
    utilization: 82,
    status: 'warning'
  }
])

// 网络流量数据
const networkTraffic = ref([
  {
    name: '数据同步服务',
    traffic: 1200,
    unit: 'MB/s',
    percentage: 85,
    status: 'high'
  },
  {
    name: '视频流服务',
    traffic: 850,
    unit: 'MB/s',
    percentage: 60,
    status: 'medium'
  },
  {
    name: 'API网关',
    traffic: 310,
    unit: 'MB/s',
    percentage: 25,
    status: 'normal'
  },
  {
    name: '用户认证服务',
    traffic: 95,
    unit: 'MB/s',
    percentage: 10,
    status: 'normal'
  }
])

// CPU异常数据
const cpuAnomalies = ref([
  {
    name: 'compute-heavy-01',
    issue: '长期过高',
    usage: 98,
    type: 'bottleneck',
    recommendation: '升级实例规格或优化代码'
  },
  {
    name: 'batch-job-02',
    issue: '长期过高',
    usage: 95,
    type: 'bottleneck',
    recommendation: '检查批处理任务逻辑'
  },
  {
    name: 'web-server-15',
    issue: '长期过低',
    usage: 5,
    type: 'waste',
    recommendation: '考虑降级实例规格以节省成本'
  }
])

// 智能告警
const intelligentAlerts = ref([
  {
    type: '高磁盘I/O',
    resource: 'db-master-01',
    description: 'IO利用率持续超过95%',
    suggestion: '升级磁盘为更高性能的IOPS类型或优化数据库查询',
    priority: 'high'
  },
  {
    type: '高网络流量',
    resource: '数据同步服务',
    description: '网络流出量异常增大',
    suggestion: '检查服务逻辑，启用压缩或考虑使用CDN',
    priority: 'high'
  },
  {
    type: 'CPU利用率过高',
    resource: 'compute-heavy-01',
    description: 'CPU利用率持续高于98%',
    suggestion: '升级实例规格或对应用进行性能分析和代码优化',
    priority: 'medium'
  },
  {
    type: 'CPU利用率过低',
    resource: 'web-server-15',
    description: 'CPU利用率长期低于5%',
    suggestion: '考虑降级实例规格以节省成本',
    priority: 'low'
  }
])

// 生成趋势数据
function generateTrendData() {
  const points = []
  const now = Date.now()

  for (let i = 24; i >= 0; i--) {
    const time = now - i * 60 * 60 * 1000
    const baseValue = 50
    const variation = Math.sin(i * 0.5) * 30
    const spike = (i === 8 || i === 16) ? 40 : 0

    points.push({
      time: new Date(time).toISOString(),
      cpu: Math.max(0, Math.min(100, baseValue + variation + spike + Math.random() * 10)),
      memory: Math.max(0, Math.min(100, baseValue + variation * 0.8 + Math.random() * 8))
    })
  }

  return points
}

// 监听过滤器变化
watch([selectedTimeRange, selectedApplication, selectedEnvironment], () => {
  // 根据过滤器重新加载数据
  refreshAnalysisData()
})

// 刷新分析数据
function refreshAnalysisData() {
  appStore.setLoading(true)

  setTimeout(() => {
    // 模拟数据刷新
    highIOServers.value.forEach(server => {
      server.iops = server.iops + (Math.random() - 0.5) * 1000
      server.utilization = Math.max(0, Math.min(100, server.utilization + (Math.random() - 0.5) * 5))
    })

    networkTraffic.value.forEach(service => {
      service.traffic = service.traffic + (Math.random() - 0.5) * 100
      service.percentage = Math.min(100, service.percentage + (Math.random() - 0.5) * 10)
    })

    appStore.setLoading(false)
  }, 1000)
}

onMounted(() => {
  refreshAnalysisData()

  // 设置定时刷新
  const interval = setInterval(refreshAnalysisData, 30000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
/* 智能分析样式 */
</style>