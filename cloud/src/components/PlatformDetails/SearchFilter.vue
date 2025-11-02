<template>
  <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 搜索框 -->
      <div class="col-span-1 md:col-span-2 lg:col-span-2">
        <label class="flex flex-col min-w-40 h-12 w-full">
          <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div class="text-gray-600 flex bg-gray-100 items-center justify-center pl-4 rounded-l-lg">
              <span class="material-symbols-outlined">search</span>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-inset border border-gray-300 bg-white h-full placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
              placeholder="按应用名称或IP地址搜索..."
              @input="handleSearch"
            />
          </div>
        </label>
      </div>

      <!-- 状态过滤器 -->
      <div class="flex items-end gap-2">
        <label class="flex flex-col min-w-40 h-12 w-full">
          <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div class="text-gray-600 flex bg-gray-100 items-center justify-center pl-4 rounded-l-lg">
              <span class="material-symbols-outlined">filter_list</span>
            </div>
            <select
              v-model="selectedStatus"
              class="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-inset border border-gray-300 bg-white h-full px-4 text-base font-normal leading-normal"
              @change="handleFilter"
            >
              <option value="all">全部状态</option>
              <option value="normal">正常</option>
              <option value="warning">警告</option>
              <option value="error">错误</option>
            </select>
          </div>
        </label>

        <!-- 刷新按钮 -->
        <button
          @click="handleRefresh"
          :disabled="isRefreshing"
          class="flex items-center justify-center gap-2 h-12 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span
            :class="[
              'material-symbols-outlined',
              isRefreshing ? 'animate-spin' : ''
            ]"
          >
            refresh
          </span>
          <span class="text-sm font-medium">刷新</span>
        </button>
      </div>
    </div>

    <!-- 快速过滤标签 -->
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="tag in quickTags"
        :key="tag.key"
        @click="setQuickFilter(tag.key)"
        :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors',
          activeQuickFilter === tag.key
            ? 'bg-primary text-white'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        <span class="material-symbols-outlined text-base">{{ tag.icon }}</span>
        {{ tag.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'filter'])

// 搜索状态
const searchQuery = ref('')
const selectedStatus = ref('all')
const activeQuickFilter = ref('')
const isRefreshing = ref(false)

// 快速过滤标签
const quickTags = [
  { key: 'high-cpu', label: '高CPU使用', icon: 'memory' },
  { key: 'high-memory', label: '高内存使用', icon: 'storage' },
  { key: 'disk-warning', label: '磁盘警告', icon: 'sd_storage' },
  { key: 'offline', label: '离线服务', icon: 'error' }
]

// 处理搜索
function handleSearch() {
  emit('search', searchQuery.value)
}

// 处理过滤
function handleFilter() {
  emit('filter', selectedStatus.value)
}

// 设置快速过滤
function setQuickFilter(key) {
  if (activeQuickFilter.value === key) {
    activeQuickFilter.value = ''
    selectedStatus.value = 'all'
  } else {
    activeQuickFilter.value = key
    selectedStatus.value = getFilterFromQuickTag(key)
  }
  handleFilter()
}

// 根据快速标签获取过滤条件
function getFilterFromQuickTag(tagKey) {
  const mapping = {
    'high-cpu': 'warning',
    'high-memory': 'warning',
    'disk-warning': 'warning',
    'offline': 'error'
  }
  return mapping[tagKey] || 'all'
}

// 处理刷新
function handleRefresh() {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    // 触发搜索和过滤更新
    handleSearch()
    handleFilter()
  }, 1000)
}
</script>

<style scoped>
/* 搜索过滤样式 */
.form-input:focus,
.form-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(43, 140, 238, 0.1);
}

.bg-primary { background-color: #2b8cee; }
.text-primary { color: #2b8cee; }

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>