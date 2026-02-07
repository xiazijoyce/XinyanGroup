<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">品牌资料维护</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="品牌资料" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按品牌名称/状态查询" class="w-[240px]" />
        <el-button type="primary" @click="openDialog">新增品牌</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="品牌ID" width="120" />
        <el-table-column prop="name" label="品牌名称" min-width="160" />
        <el-table-column prop="owner" label="维护部门" width="140" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="品牌资料" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="品牌名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="维护部门">
          <el-input v-model="form.owner" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
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
import { brandTags } from '../../utils/brandData'

const keyword = ref('')
const dialogVisible = ref(false)
const editingId = ref(null)
const form = reactive({
  id: '',
  name: '',
  owner: '',
  status: '启用',
  remark: ''
})

const tableData = reactive(brandTags.map((item) => ({ ...item })))

const columns = [
  { label: '品牌ID', prop: 'id' },
  { label: '品牌名称', prop: 'name' },
  { label: '维护部门', prop: 'owner' },
  { label: '状态', prop: 'status' },
  { label: '备注', prop: 'remark' }
]

const filteredData = computed(() => {
  if (!keyword.value) return tableData
  return tableData.filter((item) => item.name.includes(keyword.value) || item.status.includes(keyword.value))
})

const openDialog = () => {
  editingId.value = null
  Object.assign(form, { id: '', name: '', owner: '', status: '启用', remark: '' })
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
    tableData.unshift({ ...form, id: `BR-${String(tableData.length + 1).padStart(3, '0')}` })
  }
  dialogVisible.value = false
}

const removeRow = (row) => {
  const index = tableData.findIndex((item) => item.id === row.id)
  if (index !== -1) tableData.splice(index, 1)
}
</script>
