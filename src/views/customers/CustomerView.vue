<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">客户管理</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="客户管理" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按客户名称/品牌查询" class="w-[240px]" />
        <el-button type="primary" @click="openDialog">新增客户</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="客户ID" width="120" />
        <el-table-column prop="name" label="客户名称" min-width="160" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="type" label="客户类型" width="120" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="level" label="合作等级" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="客户信息" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="客户名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="form.brand" />
        </el-form-item>
        <el-form-item label="客户类型">
          <el-input v-model="form.type" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="合作等级">
          <el-select v-model="form.level">
            <el-option label="A级" value="A级" />
            <el-option label="B级" value="B级" />
            <el-option label="C级" value="C级" />
          </el-select>
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
  brand: '',
  type: '',
  contact: '',
  phone: '',
  level: 'A级',
  status: '启用'
})

const tableData = reactive([
  { id: 'CU-001', name: '澄光生物', brand: '澄光', type: '品牌方', contact: '黄琳', phone: '13500001111', level: 'A级', status: '启用' },
  { id: 'CU-002', name: '初色科技', brand: '初色', type: '新锐品牌', contact: '顾晨', phone: '13500002222', level: 'B级', status: '启用' },
  { id: 'CU-003', name: '植本实验室', brand: '植本', type: '功效品牌', contact: '林雨', phone: '13500003333', level: 'A级', status: '启用' },
  { id: 'CU-004', name: '悦颜集团', brand: '悦颜', type: '渠道客户', contact: '郑敏', phone: '13500004444', level: 'B级', status: '启用' },
  { id: 'CU-005', name: '丝柔美妆', brand: '丝柔', type: '品牌方', contact: '汪琪', phone: '13500005555', level: 'C级', status: '禁用' },
  { id: 'CU-006', name: '琉光生物', brand: '琉光', type: '新锐品牌', contact: '罗安', phone: '13500006666', level: 'B级', status: '启用' },
  { id: 'CU-007', name: '绮妍科技', brand: '绮妍', type: '功效品牌', contact: '姜雅', phone: '13500007777', level: 'A级', status: '启用' },
  { id: 'CU-008', name: '素颜实验室', brand: '素颜', type: '品牌方', contact: '曾琪', phone: '13500008888', level: 'B级', status: '启用' },
  { id: 'CU-009', name: '晨光商贸', brand: '晨光', type: '渠道客户', contact: '齐珂', phone: '13500009999', level: 'C级', status: '启用' },
  { id: 'CU-010', name: '清肌生研', brand: '清肌', type: '功效品牌', contact: '任清', phone: '13500001234', level: 'A级', status: '启用' }
])

const columns = [
  { label: '客户ID', prop: 'id' },
  { label: '客户名称', prop: 'name' },
  { label: '品牌', prop: 'brand' },
  { label: '客户类型', prop: 'type' },
  { label: '联系人', prop: 'contact' },
  { label: '联系电话', prop: 'phone' },
  { label: '合作等级', prop: 'level' },
  { label: '状态', prop: 'status' }
]

const filteredData = computed(() => {
  if (!keyword.value) return tableData
  return tableData.filter((item) => item.name.includes(keyword.value) || item.brand.includes(keyword.value))
})

const openDialog = () => {
  editingId.value = null
  Object.assign(form, { id: '', name: '', brand: '', type: '', contact: '', phone: '', level: 'A级', status: '启用' })
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
    tableData.unshift({ ...form, id: `CU-${String(tableData.length + 1).padStart(3, '0')}` })
  }
  dialogVisible.value = false
}

const removeRow = (row) => {
  const index = tableData.findIndex((item) => item.id === row.id)
  if (index !== -1) tableData.splice(index, 1)
}
</script>
