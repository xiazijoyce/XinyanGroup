<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">原料数据</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="原料数据" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按原料名称/品类查询" class="w-[240px]" />
        <el-button type="primary" @click="openDialog">新增原料</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="原料ID" width="100" />
        <el-table-column prop="name" label="原料名称" min-width="160" />
        <el-table-column prop="category" label="品类" width="120" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="price" label="单价(元/kg)" width="140" align="right" />
        <el-table-column prop="stock" label="库存数量" width="120" align="right" />
        <el-table-column prop="supplier" label="供应商" width="140" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="原料信息" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="原料名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="品类">
          <el-input v-model="form.category" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="form.price" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="form.stock" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="form.supplier" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRow">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ExportPrintActions from '../../components/ExportPrintActions.vue'

const keyword = ref('')
const dialogVisible = ref(false)
const editingId = ref(null)
const form = reactive({
  id: '',
  name: '',
  category: '',
  spec: '',
  price: '',
  stock: '',
  supplier: '',
  status: '启用'
})

const tableData = reactive([
  { id: 'RM-001', name: '透明质酸钠', category: '保湿剂', spec: '25kg/桶', price: '380.0000', stock: '1200.00', supplier: '安信原料', status: '启用' },
  { id: 'RM-002', name: '烟酰胺', category: '功效剂', spec: '10kg/袋', price: '520.0000', stock: '560.00', supplier: '嘉澜原料', status: '启用' },
  { id: 'RM-003', name: '角鲨烷', category: '油脂类', spec: '20kg/桶', price: '610.5000', stock: '300.00', supplier: '恒美供应', status: '启用' },
  { id: 'RM-004', name: '积雪草提取物', category: '植物提取', spec: '5kg/袋', price: '780.0000', stock: '180.00', supplier: '植萃科技', status: '禁用' },
  { id: 'RM-005', name: '神经酰胺', category: '修护剂', spec: '2kg/桶', price: '1200.0000', stock: '60.00', supplier: '澜芯原料', status: '启用' },
  { id: 'RM-006', name: '透明油', category: '溶剂', spec: '25kg/桶', price: '260.0000', stock: '980.00', supplier: '久蓝化工', status: '启用' },
  { id: 'RM-007', name: '氨基酸表活', category: '表面活性', spec: '50kg/桶', price: '420.0000', stock: '750.00', supplier: '润泽原料', status: '启用' },
  { id: 'RM-008', name: '甜菜碱', category: '保湿剂', spec: '25kg/桶', price: '310.5000', stock: '640.00', supplier: '嘉澜原料', status: '启用' },
  { id: 'RM-009', name: '熊果苷', category: '功效剂', spec: '5kg/袋', price: '980.0000', stock: '90.00', supplier: '安信原料', status: '启用' },
  { id: 'RM-010', name: '微囊香精', category: '香精', spec: '1kg/瓶', price: '1500.0000', stock: '30.00', supplier: '香韵供应', status: '禁用' }
])

const columns = [
  { label: '原料ID', prop: 'id' },
  { label: '原料名称', prop: 'name' },
  { label: '品类', prop: 'category' },
  { label: '规格', prop: 'spec' },
  { label: '单价(元/kg)', prop: 'price' },
  { label: '库存数量', prop: 'stock' },
  { label: '供应商', prop: 'supplier' },
  { label: '状态', prop: 'status' }
]

const filteredData = computed(() => {
  if (!keyword.value) return tableData
  return tableData.filter((item) => item.name.includes(keyword.value) || item.category.includes(keyword.value))
})

const openDialog = () => {
  editingId.value = null
  Object.assign(form, { id: '', name: '', category: '', spec: '', price: '', stock: '', supplier: '', status: '启用' })
  dialogVisible.value = true
}

const editRow = (row) => {
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const saveRow = () => {
  if (editingId.value) {
    const index = tableData.findIndex((item) => item.id === editingId.value)
    if (index !== -1) tableData[index] = { ...form }
  } else {
    tableData.unshift({ ...form, id: `RM-${String(tableData.length + 1).padStart(3, '0')}` })
  }
  dialogVisible.value = false
}

const removeRow = (row) => {
  const index = tableData.findIndex((item) => item.id === row.id)
  if (index !== -1) tableData.splice(index, 1)
}
</script>
