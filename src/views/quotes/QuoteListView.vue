<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">报价单列表</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="报价单列表" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按单号/客户筛选" class="w-[240px]" />
        <el-select v-model="statusFilter" placeholder="审核状态" class="w-[160px]">
          <el-option label="全部" value="" />
          <el-option label="草稿" value="草稿" />
          <el-option label="待审核" value="待审核" />
          <el-option label="审核通过" value="审核通过" />
          <el-option label="审核驳回" value="审核驳回" />
        </el-select>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="报价单号" width="140" />
        <el-table-column prop="requirementId" label="需求单号" width="140" />
        <el-table-column prop="customer" label="客户" width="140" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="product" label="成品" min-width="160" />
        <el-table-column prop="quantity" label="报价数量" width="120" align="right" />
        <el-table-column prop="totalQuote" label="总报价" width="120" align="right" />
        <el-table-column prop="status" label="审核状态" width="120">
          <template #default="scope">
            <el-tag :type="statusTag(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="approve(scope.row)">审核通过</el-button>
            <el-button size="small" type="danger" @click="reject(scope.row)">审核驳回</el-button>
            <el-button size="small" type="warning" @click="archive(scope.row)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="报价单详情" width="820px">
      <div class="space-y-4">
        <DataLinkCard
          title="报价基础信息"
          :items="[
            { label: '报价单号', value: current.id },
            { label: '客户', value: current.customer },
            { label: '成品', value: current.product },
            { label: '总报价', value: current.totalQuote }
          ]"
        />
        <div class="app-card">
          <div class="text-sm font-semibold mb-2">审核状态：{{ current.status }}</div>
          <div class="text-xs text-gray-500">驳回原因：{{ current.rejectReason || '无' }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ExportPrintActions from '../../components/ExportPrintActions.vue'
import DataLinkCard from '../../components/DataLinkCard.vue'
import { getStore, updateQuote } from '../../utils/dataStore'

const keyword = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)
const current = reactive({})

const store = getStore()
const tableData = reactive(
  store.quotes.length
    ? store.quotes
    : [
        { id: 'QT-240501', requirementId: 'REQ-240501', customer: '澄光生物', brand: '澄光', product: '润泽补水面霜', quantity: '12000', totalQuote: '356000.00', status: '待审核' }
      ]
)

const columns = [
  { label: '报价单号', prop: 'id' },
  { label: '需求单号', prop: 'requirementId' },
  { label: '客户', prop: 'customer' },
  { label: '品牌', prop: 'brand' },
  { label: '成品', prop: 'product' },
  { label: '报价数量', prop: 'quantity' },
  { label: '总报价', prop: 'totalQuote' },
  { label: '审核状态', prop: 'status' }
]

const filteredData = computed(() => {
  return tableData.filter((item) => {
    const matchKeyword = !keyword.value || item.id.includes(keyword.value) || item.customer.includes(keyword.value)
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const statusTag = (status) => {
  if (status === '审核通过') return 'success'
  if (status === '审核驳回') return 'danger'
  if (status === '待审核') return 'warning'
  return 'info'
}

const viewDetail = (row) => {
  Object.assign(current, row)
  dialogVisible.value = true
}

const approve = (row) => {
  row.status = '审核通过'
  updateQuote(row)
}

const reject = (row) => {
  row.status = '审核驳回'
  row.rejectReason = '参数需调整'
  updateQuote(row)
}

const archive = (row) => {
  row.status = '已归档'
  updateQuote(row)
}
</script>
