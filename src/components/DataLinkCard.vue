<template>
  <div class="app-card">
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm font-semibold">{{ title }}</div>
      <el-tag v-if="tag" type="info">{{ tag }}</el-tag>
    </div>
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div v-for="item in items" :key="item.label" class="flex">
        <div class="text-gray-500 w-24">{{ item.label }}</div>
        <div class="flex-1 text-gray-800">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  tag: String,
  items: {
    type: Array,
    default: () => []
  }
})
</script>
