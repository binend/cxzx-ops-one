<template>
  <div class="animate-fadeIn w-full">
    <!-- 告警监控 -->
    <div class="mb-6 w-full">
      <AlertPanel :alerts="alerts" />
    </div>

    <!-- 搜索和过滤 -->
    <div class="mb-6 w-full">
      <SearchFilter @search="handleSearch" @filter="handleFilter" />
    </div>

    <!-- 服务列表 -->
    <div class="w-full">
      <ServiceList :services="filteredServices" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import AlertPanel from './PlatformDetails/AlertPanel.vue'
import SearchFilter from './PlatformDetails/SearchFilter.vue'
import ServiceList from './PlatformDetails/ServiceList.vue'

const appStore = useAppStore()

// 告警数据
const alerts = computed(() => appStore.alerts)

// 服务数据
const services = ref([
  {
    id: 1,
    system: '企业生产管理系统',
    vendor: 'Dell',
    ip: '172.16.10.26',
    appName: '订单管理系统-worker',
    port: '8080',
    serviceLink: 'http://172.16.10.26:8080',
    hardwareSpec: 'CPU: 8核\n内存: 32GB\n磁盘: 500GB SSD',
    status: 'error',
    lastUpdate: '2分钟前'
  },
  {
    id: 2,
    system: '智能分析平台',
    vendor: 'HP',
    ip: '172.16.10.27',
    appName: '订单处理API',
    port: '8081',
    serviceLink: 'http://172.16.10.27:8081',
    hardwareSpec: 'CPU: 4核\n内存: 16GB\n磁盘: 256GB SSD',
    status: 'warning',
    lastUpdate: '15分钟前'
  },
  {
    id: 3,
    system: '大数据存储系统',
    vendor: 'IBM',
    ip: '172.16.10.28',
    appName: '数据存储系统',
    port: '3306',
    serviceLink: 'mysql://172.16.10.28:3306',
    hardwareSpec: 'CPU: 16核\n内存: 64GB\n磁盘: 2TB HDD',
    status: 'warning',
    lastUpdate: '1小时前'
  },
  {
    id: 4,
    system: '企业门户系统',
    vendor: 'Lenovo',
    ip: '172.16.10.15',
    appName: 'Web服务器',
    port: '80,443',
    serviceLink: 'http://172.16.10.15',
    hardwareSpec: 'CPU: 2核\n内存: 8GB\n磁盘: 100GB SSD',
    status: 'normal',
    lastUpdate: '刚刚'
  },
  {
    id: 5,
    system: '分布式缓存平台',
    vendor: '华为',
    ip: '172.16.10.05',
    appName: '缓存服务',
    port: '6379',
    serviceLink: 'redis://172.16.10.05:6379',
    hardwareSpec: 'CPU: 4核\n内存: 16GB\n磁盘: 200GB SSD',
    status: 'normal',
    lastUpdate: '5分钟前'
  },
  {
    id: 6,
    system: '容器云平台',
    vendor: '阿里云',
    ip: '172.16.10.30',
    appName: '容器编排系统',
    port: '6443',
    serviceLink: 'https://172.16.10.30:6443',
    hardwareSpec: 'CPU: 32核\n内存: 128GB\n磁盘: 1TB NVMe',
    status: 'normal',
    lastUpdate: '3分钟前'
  },
  {
    id: 7,
    system: '企业数据库集群',
    vendor: '腾讯云',
    ip: '172.16.10.31',
    appName: '数据库主节点',
    port: '5432',
    serviceLink: 'postgresql://172.16.10.31:5432',
    hardwareSpec: 'CPU: 8核\n内存: 32GB\n磁盘: 500GB SSD',
    status: 'normal',
    lastUpdate: '10分钟前'
  }
])

// 搜索和过滤状态
const searchQuery = ref('')
const filterStatus = ref('all')

// 过滤后的服务列表
const filteredServices = computed(() => {
  return services.value.filter(service => {
    const matchesSearch = searchQuery.value === '' ||
      service.system.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.vendor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.ip.includes(searchQuery.value) ||
      service.appName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.serviceLink.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.hardwareSpec.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesFilter = filterStatus.value === 'all' || service.status === filterStatus.value

    return matchesSearch && matchesFilter
  })
})

// 处理搜索
function handleSearch(query) {
  searchQuery.value = query
}

// 处理过滤
function handleFilter(status) {
  filterStatus.value = status
}


onMounted(() => {
  // 模拟实时更新
  setInterval(() => {
    services.value.forEach(service => {
      // 随机更新CPU和内存使用率
      service.cpu = Math.max(0, Math.min(100, service.cpu + (Math.random() - 0.5) * 10))
      service.memory = Math.max(0, Math.min(100, service.memory + (Math.random() - 0.5) * 8))
    })
  }, 5000)
})
</script>

<style scoped>
/* 平台详情样式 */
</style>