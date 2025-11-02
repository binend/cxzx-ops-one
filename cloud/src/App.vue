<template>
  <div class="relative min-h-screen w-full bg-white">
    <!-- Three.js 背景层 -->
    <ThreeBackground />

    <!-- 主内容层 -->
    <div class="content-layer">
      <!-- 头部导航 -->
      <AppHeader />

      <!-- 页面内容 -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import ThreeBackground from '@/components/ThreeBackground.vue'
import AppHeader from '@/components/AppHeader.vue'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 系统启动
})

onUnmounted(() => {
  // 系统关闭
})
</script>

<style scoped>
/* 应用层样式 */
</style>