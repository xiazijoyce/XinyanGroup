<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">供应商管理</div>
        <ExportPrintActions :columns="columns" :data="tableData" filename="供应商管理" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按供应商名称/品类查询" class="w-[240px]" />
        <el-button type="primary" @click="openDialog">新增供应商</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="供应商ID" width="120" />
        <el-table-column prop="name" label="供应商名称" min-width="160" />
        <el-table-column prop="category" label="所属品类" width="120" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="address" label="地址" min-width="180" />
        <el-table-column prop="status" label="合作状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '合作中' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
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

    <el-dialog v-model="dialogVisible" title="供应商信息" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="供应商名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属品类">
          <el-input v-model="form.category" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="合作状态">
          <el-select v-model="form.status">
            <el-option label="合作中" value="合作中" />
            <el-option label="终止合作" value="终止合作" />
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
  contact: '',
  phone: '',
  address: '',
  status: '合作中'
})

const tableData = reactive([
  { id: 'SP-001', name: '安信原料', category: '原料', contact: '张凯', phone: '13800001111', address: '广州天河区', status: '合作中' },
  { id: 'SP-002', name: '嘉澜原料', category: '原料', contact: '李雪', phone: '13800002222', address: '上海浦东新区', status: '合作中' },
  { id: 'SP-003', name: '清澈包材', category: '包材', contact: '陈琳', phone: '13800003333', address: '苏州工业园', status: '合作中' },
  { id: 'SP-004', name: '印象包装', category: '包材', contact: '王蓉', phone: '13800004444', address: '东莞厚街镇', status: '合作中' },
  { id: 'SP-005', name: '星耀包材', category: '包材', contact: '赵启', phone: '13800005555', address: '宁波鄞州区', status: '终止合作' },
  { id: 'SP-006', name: '久蓝化工', category: '原料', contact: '周航', phone: '13800006666', address: '天津滨海新区', status: '合作中' },
  { id: 'SP-007', name: '植萃科技', category: '原料', contact: '许晴', phone: '13800007777', address: '昆明高新区', status: '合作中' },
  { id: 'SP-008', name: '新锐包材', category: '包材', contact: '梁凯', phone: '13800008888', address: '深圳龙岗区', status: '合作中' },
  { id: 'SP-009', name: '极简包材', category: '包材', contact: '马迪', phone: '13800009999', address: '嘉兴南湖区', status: '合作中' },
  { id: 'SP-010', name: '香韵供应', category: '原料', contact: '韩若', phone: '13800001234', address: '杭州余杭区', status: '合作中' }
])

const columns = [
  { label: '供应商ID', prop: 'id' },
  { label: '供应商名称', prop: 'name' },
  { label: '所属品类', prop: 'category' },
  { label: '联系人', prop: 'contact' },
  { label: '电话', prop: 'phone' },
  { label: '地址', prop: 'address' },
  { label: '合作状态', prop: 'status' }
]

const filteredData = computed(() => {
  if (!keyword.value) return tableData
  return tableData.filter((item) => item.name.includes(keyword.value) || item.category.includes(keyword.value))
})

const openDialog = () => {
  editingId.value = null
  Object.assign(form, { id: '', name: '', category: '', contact: '', phone: '', address: '', status: '合作中' })
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
    tableData.unshift({ ...form, id: `SP-${String(tableData.length + 1).padStart(3, '0')}` })
  }
  dialogVisible.value = false
}

const removeRow = (row) => {
  const index = tableData.findIndex((item) => item.id === row.id)
  if (index !== -1) tableData.splice(index, 1)
}
</script>
