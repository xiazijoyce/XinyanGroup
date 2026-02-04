<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">需求单列表</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="需求单列表" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按单号/客户/品牌筛选" class="w-[260px]" />
        <el-select v-model="statusFilter" placeholder="结案状态" class="w-[160px]">
          <el-option label="全部" value="" />
          <el-option label="进行中" value="进行中" />
          <el-option label="已结案" value="已结案" />
        </el-select>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="需求单号" width="140" />
        <el-table-column prop="customer" label="客户" width="140" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="product" label="成品" min-width="160" />
        <el-table-column prop="quantity" label="需求数量" width="120" align="right" />
        <el-table-column label="流程进度" width="160">
          <template #default="scope">
            <el-progress :percentage="calcProgress(scope.row.nodes)" :status="progressStatus(scope.row.nodes)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="结案状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已结案' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="toQuote(scope.row)">一键转报价</el-button>
            <el-button size="small" type="success" @click="closeCase(scope.row)">结案</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="需求单详情" width="820px">
      <div class="space-y-4">
        <DataLinkCard
          title="基础信息"
          :items="[
            { label: '需求单号', value: current.id },
            { label: '客户', value: current.customer },
            { label: '品牌', value: current.brand },
            { label: '成品', value: current.product }
          ]"
        />
        <FlowNodes :nodes="current.nodes || []" />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ExportPrintActions from '../../components/ExportPrintActions.vue'
import FlowNodes from '../../components/FlowNodes.vue'
import DataLinkCard from '../../components/DataLinkCard.vue'
import { getStore, updateRequirement } from '../../utils/dataStore'

const router = useRouter()
const keyword = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)

const store = getStore()
const tableData = reactive(
  store.requirements.length
    ? store.requirements
    : [
        {
          id: 'REQ-240501',
          customer: '澄光生物',
          brand: '澄光',
          product: '润泽补水面霜',
          quantity: '12000',
          status: '进行中',
          nodes: [
            { name: '文案', status: 'done', statusLabel: '已办', owner: '文案组', time: '2024-05-02' },
            { name: '打样彩盒', status: 'done', statusLabel: '已办', owner: '打样组', time: '2024-05-04' },
            { name: '备案送检', status: 'pending', statusLabel: '待办', owner: '', time: '' },
            { name: '检测报告', status: 'pending', statusLabel: '待办', owner: '', time: '' },
            { name: '备案上传', status: 'pending', statusLabel: '待办', owner: '', time: '' }
          ]
        }
      ]
)

const columns = [
  { label: '需求单号', prop: 'id' },
  { label: '客户', prop: 'customer' },
  { label: '品牌', prop: 'brand' },
  { label: '成品', prop: 'product' },
  { label: '需求数量', prop: 'quantity' },
  { label: '结案状态', prop: 'status' }
]

const current = reactive({})

const filteredData = computed(() => {
  return tableData.filter((item) => {
    const matchKeyword = !keyword.value || item.id.includes(keyword.value) || item.customer.includes(keyword.value) || item.brand.includes(keyword.value)
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

const calcProgress = (nodes) => {
  if (!nodes) return 0
  const done = nodes.filter((node) => node.status === 'done').length
  return Math.round((done / nodes.length) * 100)
}

const progressStatus = (nodes) => {
  if (nodes.some((node) => node.status === 'reject')) return 'exception'
  return 'success'
}

const viewDetail = (row) => {
  Object.assign(current, row)
  dialogVisible.value = true
}

const toQuote = (row) => {
  router.push({ path: '/quotes/new', query: { req: row.id } })
}

const closeCase = (row) => {
  row.status = '已结案'
  updateRequirement(row)
}
</script>
