<template>
  <div id="app">
    <LoadingOverlay v-if="loading" @complete="loading = false" />
    <template v-else>
      <ThreeBackground />
      <AppHeader />
      <main class="main-content">
        <OverviewDashboard v-show="activeSection === 'overview'" />
        <DatabaseInventory v-show="activeSection === 'inventory'" />
        <IOAnalysis v-show="activeSection === 'io-analysis'" />
      </main>
      <FieldModal v-if="showModal" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from './stores/app'
import AppHeader from './components/AppHeader.vue'
import OverviewDashboard from './components/OverviewDashboardOptimized.vue'
import DatabaseInventory from './components/DatabaseInventory.vue'
import IOAnalysis from './components/IOAnalysis.vue'
import FieldModal from './components/FieldModal.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import ThreeBackground from './components/ThreeBackground.vue'

const appStore = useAppStore()
const { activeSection, showModal } = storeToRefs(appStore)

const loading = ref(true)

onMounted(() => {
  // Reduce loading time for better UX
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
</script>

<style>
#app {
  position: relative;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  position: relative;
  z-index: 1;
}
</style>