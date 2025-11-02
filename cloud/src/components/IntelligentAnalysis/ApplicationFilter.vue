<template>
  <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 pl-4 pr-2 shadow-sm hover:bg-gray-50 transition-colors">
    <p class="text-gray-700 text-sm font-medium leading-normal">应用: {{ selectedLabel }}</p>
    <span class="material-symbols-outlined text-gray-500 text-xl">expand_more</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'all', label: '全部应用' },
  { value: 'order', label: '订单系统' },
  { value: 'payment', label: '支付系统' },
  { value: 'user', label: '用户系统' },
  { value: 'inventory', label: '库存系统' }
]

const selectedLabel = computed(() => {
  const option = options.find(opt => opt.value === props.modelValue)
  return option?.label || '全部应用'
})
</script>

<style scoped>
/* 应用过滤器样式 */
</style>