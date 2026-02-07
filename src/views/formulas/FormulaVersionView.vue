<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">配方版本管理</div>
        <ExportPrintActions :columns="columns" :data="versions" filename="配方版本管理" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按配方号/版本筛选" class="w-[240px]" />
        <el-button type="primary" @click="createVersion">更新配方生成新版本</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="code" label="配方号" width="120" />
        <el-table-column prop="version" label="版本号" width="120" />
        <el-table-column prop="product" label="适配成品" min-width="160" />
        <el-table-column prop="unitCost" label="配方单价" width="140" align="right" />
        <el-table-column prop="updateBy" label="更新人" width="120" />
        <el-table-column prop="updateAt" label="更新时间" width="160" />
        <el-table-column prop="remark" label="更新说明" min-width="200" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="rollback(scope.row)">回滚</el-button>
            <el-button size="small" type="success" @click="archive(scope.row)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="版本详情" width="720px">
      <div class="app-card">
        <div class="text-sm mb-2">配方：{{ currentVersion.code }} / {{ currentVersion.version }}</div>
        <el-table :data="currentVersion.materials" border>
          <el-table-column prop="name" label="原料名称" min-width="180" />
          <el-table-column prop="amount" label="添加量(g)" width="140" />
          <el-table-column prop="cost" label="成本(元)" width="140" align="right" />
        </el-table>
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

const keyword = ref('')
const dialogVisible = ref(false)
const currentVersion = reactive({ code: '', version: '', materials: [] })

const versions = reactive([
  {
    code: 'F-1001',
    version: 'V1.0',
    product: '润泽补水面霜',
    unitCost: '12.3200',
    updateBy: '张敏',
    updateAt: '2024-05-12 10:20',
    remark: '首次建档',
    materials: [
      { name: '透明质酸钠', amount: '150', cost: '57.00' },
      { name: '角鲨烷', amount: '50', cost: '30.52' }
    ]
  },
  {
    code: 'F-1001',
    version: 'V2.0',
    product: '润泽补水面霜',
    unitCost: '14.8800',
    updateBy: '张敏',
    updateAt: '2024-06-18 15:10',
    remark: '提升保湿效果，增加神经酰胺',
    materials: [
      { name: '透明质酸钠', amount: '160', cost: '60.80' },
      { name: '角鲨烷', amount: '60', cost: '36.63' },
      { name: '神经酰胺', amount: '30', cost: '36.00' }
    ]
  },
  {
    code: 'F-1002',
    version: 'V1.1',
    product: '清透粉底液',
    unitCost: '18.4200',
    updateBy: '李艳',
    updateAt: '2024-06-05 09:30',
    remark: '调整色粉比例',
    materials: [
      { name: '烟酰胺', amount: '80', cost: '41.60' },
      { name: '透明油', amount: '200', cost: '52.00' }
    ]
  }
])

const columns = [
  { label: '配方号', prop: 'code' },
  { label: '版本号', prop: 'version' },
  { label: '适配成品', prop: 'product' },
  { label: '配方单价', prop: 'unitCost' },
  { label: '更新人', prop: 'updateBy' },
  { label: '更新时间', prop: 'updateAt' },
  { label: '更新说明', prop: 'remark' }
]

const filteredData = computed(() => {
  if (!keyword.value) return versions
  return versions.filter((item) => item.code.includes(keyword.value) || item.version.includes(keyword.value))
})

const viewDetail = (row) => {
  Object.assign(currentVersion, row)
  dialogVisible.value = true
}

const createVersion = () => {
  versions.unshift({
    code: 'F-1003',
    version: 'V1.1',
    product: '修护精华',
    unitCost: '21.6800',
    updateBy: '陈静',
    updateAt: '2024-06-28 11:20',
    remark: '替换部分植物提取物',
    materials: [
      { name: '积雪草提取物', amount: '40', cost: '31.20' },
      { name: '神经酰胺', amount: '20', cost: '24.00' }
    ]
  })
}

const rollback = () => {}
const archive = () => {}
</script>
