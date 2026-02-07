<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">包材数据</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="包材数据" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按包材名称/类型查询" class="w-[240px]" />
        <el-button type="primary" @click="openDialog">新增包材</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="包材ID" width="100" />
        <el-table-column prop="name" label="包材名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="price" label="单价(元/个)" width="140" align="right" />
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

    <el-dialog v-model="dialogVisible" title="包材信息" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="包材名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.type" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="form.brand" placeholder="选择品牌">
            <el-option v-for="brand in brandOptions" :key="brand" :label="brand" :value="brand" />
          </el-select>
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
import { brandOptions } from '../../utils/brandData'

const keyword = ref('')
const dialogVisible = ref(false)
const editingId = ref(null)
const form = reactive({
  id: '',
  name: '',
  type: '',
  spec: '',
  brand: '',
  price: '',
  stock: '',
  supplier: '',
  status: '启用'
})

const tableData = reactive([
  { id: 'PK-001', name: '水润玻璃瓶', type: '瓶', spec: '100ml', brand: '澄光', price: '1.2000', stock: '5000.00', supplier: '清澈包材', status: '启用' },
  { id: 'PK-002', name: '磨砂泵头', type: '泵', spec: '28/410', brand: '澄光', price: '0.6800', stock: '8000.00', supplier: '清澈包材', status: '启用' },
  { id: 'PK-003', name: '亮面纸盒', type: '盒', spec: '120*60*40', brand: '初色', price: '0.4500', stock: '12000.00', supplier: '印象包装', status: '启用' },
  { id: 'PK-004', name: '铝管', type: '管', spec: '50ml', brand: '清肌', price: '0.9800', stock: '6000.00', supplier: '新锐包材', status: '启用' },
  { id: 'PK-005', name: '真空瓶', type: '瓶', spec: '30ml', brand: '植本', price: '2.4000', stock: '3200.00', supplier: '星耀包材', status: '启用' },
  { id: 'PK-006', name: '烫金外盒', type: '盒', spec: '150*80*50', brand: '琉光', price: '0.7200', stock: '9000.00', supplier: '印象包装', status: '启用' },
  { id: 'PK-007', name: '软管盖', type: '盖', spec: '15mm', brand: '清肌', price: '0.1200', stock: '15000.00', supplier: '新锐包材', status: '禁用' },
  { id: 'PK-008', name: '拉链袋', type: '袋', spec: '200*120', brand: '素颜', price: '0.1800', stock: '11000.00', supplier: '极简包材', status: '启用' },
  { id: 'PK-009', name: '卡盒内托', type: '托', spec: '纸托', brand: '初色', price: '0.2200', stock: '7000.00', supplier: '印象包装', status: '启用' },
  { id: 'PK-010', name: '防伪贴', type: '贴', spec: '25*25', brand: '绮妍', price: '0.0800', stock: '20000.00', supplier: '星耀包材', status: '启用' }
])

const columns = [
  { label: '包材ID', prop: 'id' },
  { label: '包材名称', prop: 'name' },
  { label: '类型', prop: 'type' },
  { label: '规格', prop: 'spec' },
  { label: '品牌', prop: 'brand' },
  { label: '单价(元/个)', prop: 'price' },
  { label: '库存数量', prop: 'stock' },
  { label: '供应商', prop: 'supplier' },
  { label: '状态', prop: 'status' }
]

const filteredData = computed(() => {
  if (!keyword.value) return tableData
  return tableData.filter((item) => item.name.includes(keyword.value) || item.type.includes(keyword.value))
})

const openDialog = () => {
  editingId.value = null
  Object.assign(form, { id: '', name: '', type: '', spec: '', brand: '', price: '', stock: '', supplier: '', status: '启用' })
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
    tableData.unshift({ ...form, id: `PK-${String(tableData.length + 1).padStart(3, '0')}` })
  }
  dialogVisible.value = false
}

const removeRow = (row) => {
  const index = tableData.findIndex((item) => item.id === row.id)
  if (index !== -1) tableData.splice(index, 1)
}
</script>
