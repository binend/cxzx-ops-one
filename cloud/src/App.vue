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
  console.log('云平台智能运维管理系统已启动')
})

onUnmounted(() => {
  console.log('系统已关闭')
})
</script>

<style scoped>
/* 应用层样式 */
</style>