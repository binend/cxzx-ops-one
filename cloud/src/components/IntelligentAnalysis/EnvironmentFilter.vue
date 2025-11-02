<template>
  <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 pl-4 pr-2 shadow-sm hover:bg-gray-50 transition-colors">
    <p class="text-gray-700 text-sm font-medium leading-normal">环境: {{ selectedLabel }}</p>
    <span class="material-symbols-outlined text-gray-500 text-xl">expand_more</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'production'
  }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'production', label: '生产环境' },
  { value: 'testing', label: '测试环境' },
  { value: 'development', label: '开发环境' },
  { value: 'staging', label: '预发布环境' }
]

const selectedLabel = computed(() => {
  const option = options.find(opt => opt.value === props.modelValue)
  return option?.label || '生产环境'
})
</script>

<style scoped>
/* 环境过滤器样式 */
</style>