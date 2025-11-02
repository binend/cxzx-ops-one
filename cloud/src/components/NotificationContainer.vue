<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'flex items-center gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm max-w-md transform transition-all duration-300',
          getNotificationClasses(notification.type)
        ]"
      >
        <!-- 图标 -->
        <div class="flex-shrink-0">
          <span
            :class="[
              'material-symbols-outlined text-xl',
              getIconClasses(notification.type)
            ]"
          >
            {{ getIcon(notification.type) }}
          </span>
        </div>

        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">
            {{ notification.title }}
          </p>
          <p class="text-sm text-gray-600 mt-1">
            {{ notification.message }}
          </p>
        </div>

        <!-- 关闭按钮 -->
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>

        <!-- 进度条 -->
        <div class="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg transition-all duration-300"
             :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const notifications = computed(() => appStore.notifications)
let autoRemoveTimers = new Map()

// 计算进度百分比
const progressPercentage = computed(() => {
  // 这里简化处理，实际应该根据每个通知的剩余时间计算
  return 100
})

// 获取通知样式类
function getNotificationClasses(type) {
  const classes = {
    success: 'bg-green-50 border border-green-200 text-green-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border border-blue-200 text-blue-800'
  }
  return classes[type] || classes.info
}

// 获取图标
function getIcon(type) {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[type] || 'info'
}

// 获取图标样式类
function getIconClasses(type) {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[type] || 'text-blue-600'
}

// 移除通知
function removeNotification(id) {
  appStore.removeNotification(id)

  // 清除定时器
  if (autoRemoveTimers.has(id)) {
    clearTimeout(autoRemoveTimers.get(id))
    autoRemoveTimers.delete(id)
  }
}

// 自动移除通知
function scheduleAutoRemove(notification) {
  const timer = setTimeout(() => {
    removeNotification(notification.id)
  }, 5000) // 5秒后自动移除

  autoRemoveTimers.set(notification.id, timer)
}

// 监听新通知
onMounted(() => {
  // 监听通知变化
  const unwatch = appStore.$subscribe((mutation, state) => {
    if (mutation.type === 'direct' && mutation.events?.key === 'notifications') {
      const newNotifications = mutation.events.newValue || []
      const oldNotifications = mutation.events.oldValue || []

      // 找出新增的通知
      newNotifications.forEach(notification => {
        if (!oldNotifications.find(n => n.id === notification.id)) {
          scheduleAutoRemove(notification)
        }
      })
    }
  })

  onUnmounted(() => {
    unwatch()

    // 清理所有定时器
    autoRemoveTimers.forEach(timer => clearTimeout(timer))
    autoRemoveTimers.clear()
  })
})
</script>

<style scoped>
/* 通知容器样式 */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>