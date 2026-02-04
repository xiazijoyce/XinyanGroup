<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">已结案需求</div>
        <ExportPrintActions :columns="columns" :data="closedData" filename="已结案需求" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按单号/客户筛选" class="w-[240px]" />
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="需求单号" width="140" />
        <el-table-column prop="customer" label="客户" width="140" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="product" label="成品" min-width="160" />
        <el-table-column prop="quantity" label="需求数量" width="120" align="right" />
        <el-table-column prop="closedAt" label="结案时间" width="180" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" type="primary" @click="toQuote(scope.row)">一键转报价</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ExportPrintActions from '../../components/ExportPrintActions.vue'
import { getStore } from '../../utils/dataStore'

const router = useRouter()
const keyword = ref('')

const store = getStore()
const closedData = reactive(
  store.requirements.filter((item) => item.status === '已结案').map((item) => ({ ...item, closedAt: item.closedAt || new Date().toLocaleString() }))
)

const columns = [
  { label: '需求单号', prop: 'id' },
  { label: '客户', prop: 'customer' },
  { label: '品牌', prop: 'brand' },
  { label: '成品', prop: 'product' },
  { label: '需求数量', prop: 'quantity' },
  { label: '结案时间', prop: 'closedAt' }
]

const filteredData = computed(() => {
  if (!keyword.value) return closedData
  return closedData.filter((item) => item.id.includes(keyword.value) || item.customer.includes(keyword.value))
})

const toQuote = (row) => {
  router.push({ path: '/quotes/new', query: { req: row.id } })
}
</script>
