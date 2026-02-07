<template>
  <div>
    <el-steps :active="activeIndex" align-center>
      <el-step
        v-for="(node, index) in nodes"
        :key="node.name"
        :title="node.name"
        :description="node.statusLabel"
      />
    </el-steps>
    <div class="node-list mt-4">
      <div
        v-for="node in nodes"
        :key="node.name"
        class="node-card"
        :class="node.status"
      >
        <div>
          <div class="text-sm font-medium">{{ node.name }}</div>
          <div class="text-xs text-gray-500">处理人：{{ node.owner || '未分配' }}</div>
        </div>
        <div class="text-right">
          <div class="text-xs">处理时间：{{ node.time || '待办' }}</div>
          <span class="flow-pill" :class="statusClass(node.status)">{{ node.statusLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  }
})

const activeIndex = computed(() => {
  const index = props.nodes.findIndex((node) => node.status !== 'done')
  return index === -1 ? props.nodes.length : index
})

const statusClass = (status) => {
  if (status === 'done') return 'done'
  if (status === 'reject') return 'reject'
  return 'pending'
}
</script>
