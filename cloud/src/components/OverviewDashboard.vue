<template>
  <div class="animate-fadeIn w-full">
    <!-- 资源统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
      <ResourceCard
        v-for="resource in resources"
        :key="resource.key"
        :resource="resource"
        @click="handleResourceClick"
        class="w-full"
      />
    </div>

    <!-- 环境与区域分布 -->
    <div class="mb-6 w-full">
      <RegionDistribution :data="regionData" />
    </div>

    <!-- CPU与内存使用率趋势 -->
    <div class="mb-6 w-full">
      <UsageTrends :data="usageTrends" />
    </div>

    <!-- SFS存储统计 -->
    <div class="w-full">
      <SFSStorage :data="sfsData" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import ResourceCard from './OverviewDashboard/ResourceCard.vue'
import RegionDistribution from './OverviewDashboard/RegionDistribution.vue'
import UsageTrends from './OverviewDashboard/UsageTrends.vue'
import SFSStorage from './OverviewDashboard/SFSStorage.vue'

const appStore = useAppStore()

// 资源数据
const resources = computed(() => [
  {
    key: 'obs',
    title: '华为云OBS存储',
    icon: 'cloud_done',
    color: 'red',
    total: appStore.resourceData.obs.total,
    used: appStore.resourceData.obs.used,
    unit: 'GB',
    usagePercentage: appStore.obsUsagePercentage
  },
  {
    key: 'cpu',
    title: '云平台CPU',
    icon: 'memory_alt',
    color: 'blue',
    total: appStore.resourceData.cpu.total,
    available: appStore.resourceData.cpu.available,
    unit: '核',
    usagePercentage: appStore.cpuUsagePercentage
  },
  {
    key: 'memory',
    title: '云平台内存',
    icon: 'memory',
    color: 'green',
    total: appStore.resourceData.memory.total,
    available: appStore.resourceData.memory.available,
    unit: 'GB',
    usagePercentage: appStore.memoryUsagePercentage
  },
  {
    key: 'disk',
    title: '云平台硬盘',
    icon: 'save',
    color: 'yellow',
    total: appStore.resourceData.disk.total,
    available: appStore.resourceData.disk.available,
    unit: 'TB',
    usagePercentage: appStore.diskUsagePercentage
  }
])

const regionData = computed(() => appStore.regionData)
const usageTrends = computed(() => appStore.usageTrends)
const sfsData = computed(() => appStore.sfsData)

// 处理资源卡片点击
function handleResourceClick(resource) {
  appStore.addNotification({
    type: 'info',
    title: '资源详情',
    message: `查看${resource.title}详细信息`
  })
}
</script>

<style scoped>
/* 概览仪表盘样式 */
</style>