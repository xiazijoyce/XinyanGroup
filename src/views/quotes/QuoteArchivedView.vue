<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">已归档报价</div>
        <ExportPrintActions :columns="columns" :data="archivedData" filename="已归档报价" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按单号/客户筛选" class="w-[240px]" />
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="报价单号" width="140" />
        <el-table-column prop="customer" label="客户" width="140" />
        <el-table-column prop="product" label="成品" min-width="160" />
        <el-table-column prop="totalQuote" label="总报价" width="140" align="right" />
        <el-table-column prop="archivedAt" label="归档时间" width="180" />
        <el-table-column label="操作" width="160">
          <template #default>
            <el-button size="small" type="primary">导出</el-button>
            <el-button size="small" type="success">打印</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ExportPrintActions from '../../components/ExportPrintActions.vue'
import { getStore } from '../../utils/dataStore'

const keyword = ref('')
const store = getStore()

const defaultArchived = [
  { id: 'QT-240320', customer: '悦颜集团', product: '维稳修护乳', totalQuote: '498000.00', archivedAt: '2024-03-28 14:10' },
  { id: 'QT-240318', customer: '植本实验室', product: '修护舒缓精华', totalQuote: '312000.00', archivedAt: '2024-03-26 09:40' }
]

const archivedData = reactive(
  store.quotes.filter((item) => item.status === '已归档').length
    ? store.quotes.filter((item) => item.status === '已归档').map((item) => ({ ...item, archivedAt: item.archivedAt || new Date().toLocaleString() }))
    : defaultArchived
)

const columns = [
  { label: '报价单号', prop: 'id' },
  { label: '客户', prop: 'customer' },
  { label: '成品', prop: 'product' },
  { label: '总报价', prop: 'totalQuote' },
  { label: '归档时间', prop: 'archivedAt' }
]

const filteredData = computed(() => {
  if (!keyword.value) return archivedData
  return archivedData.filter((item) => item.id.includes(keyword.value) || item.customer.includes(keyword.value))
})
</script>
