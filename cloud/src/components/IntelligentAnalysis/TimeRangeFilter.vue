<template>
  <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 pl-4 pr-2 shadow-sm hover:bg-gray-50 transition-colors">
    <p class="text-gray-700 text-sm font-medium leading-normal">时间范围: {{ selectedLabel }}</p>
    <span class="material-symbols-outlined text-gray-500 text-xl">expand_more</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '24h'
  }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: '1h', label: '过去1小时' },
  { value: '6h', label: '过去6小时' },
  { value: '24h', label: '过去24小时' },
  { value: '7d', label: '过去7天' },
  { value: '30d', label: '过去30天' }
]

const selectedLabel = computed(() => {
  const option = options.find(opt => opt.value === props.modelValue)
  return option?.label || '过去24小时'
})
</script>

<style scoped>
/* 时间范围过滤器样式 */
</style>