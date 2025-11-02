<template>
  <div class="main-content">
    <!-- 内容区域 -->
    <div class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- 云平台概览 -->
        <OverviewDashboard v-show="activeTab === 'overview'" />

        <!-- 云平台详情 -->
        <PlatformDetails v-show="activeTab === 'details'" />

        <!-- 云平台智能分析 -->
        <IntelligentAnalysis v-show="activeTab === 'analytics'" />
      </div>
    </div>

    <!-- 侧边面板 -->
    <SidePanel v-if="sidePanelOpen" :service="selectedService" @close="closeSidePanel" />

    <!-- 通知组件 -->
    <NotificationContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import OverviewDashboard from '@/components/OverviewDashboard.vue'
import PlatformDetails from '@/components/PlatformDetails.vue'
import IntelligentAnalysis from '@/components/IntelligentAnalysis.vue'
import SidePanel from '@/components/SidePanel.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'

const appStore = useAppStore()
const { activeTab, sidePanelOpen, selectedService } = storeToRefs(appStore)

// 关闭侧边面板
function closeSidePanel() {
  appStore.closeSidePanel()
}
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 100px); /* 减去头部高度 */
  padding-top: 20px;
  width: 100%;
}

.main-content > div {
  width: 100%;
  max-width: 100%;
}
</style>