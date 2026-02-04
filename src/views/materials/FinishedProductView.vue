<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="flex justify-between items-center mb-4">
        <div class="section-title">成品档案</div>
        <ExportPrintActions :columns="columns" :data="finishedProducts" filename="成品档案" />
      </div>
      <div class="flex gap-3 mb-4">
        <el-input v-model="keyword" placeholder="按名称/品牌/配方号查询" class="w-[260px]" />
        <el-button type="primary" @click="openDialog">新增成品</el-button>
      </div>
      <el-table :data="filteredData" class="data-table" border>
        <el-table-column prop="id" label="成品ID" width="100" />
        <el-table-column prop="name" label="成品名称" min-width="160" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="category" label="品类" width="120" />
        <el-table-column prop="spec" label="规格" width="100" />
        <el-table-column prop="formula" label="配方号" width="120" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="referencePrice" label="参考售价" width="120" align="right" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="包材成本" width="120" align="right">
          <template #default="scope">
            {{ calcPackagingTotal(scope.row.packaging) }}
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

    <el-dialog v-model="dialogVisible" title="成品档案" width="880px">
      <el-form :model="form" label-width="100px">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="成品名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="form.brand" />
          </el-form-item>
          <el-form-item label="品类">
            <el-select v-model="form.category">
              <el-option label="面霜" value="面霜" />
              <el-option label="口红" value="口红" />
              <el-option label="面膜" value="面膜" />
              <el-option label="粉底液" value="粉底液" />
              <el-option label="精华" value="精华" />
            </el-select>
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="form.spec" />
          </el-form-item>
          <el-form-item label="配方">
            <el-select v-model="form.formula" @change="syncFormula">
              <el-option v-for="item in formulaOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="配方版本">
            <el-select v-model="form.version">
              <el-option v-for="ver in versionOptions" :key="ver" :label="ver" :value="ver" />
            </el-select>
          </el-form-item>
          <el-form-item label="参考售价">
            <el-input v-model="form.referencePrice" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status">
              <el-option label="启用" value="启用" />
              <el-option label="禁用" value="禁用" />
            </el-select>
          </el-form-item>
        </div>
        <div class="mt-4">
          <div class="text-sm font-semibold mb-2">包材关联（支持多条记录）</div>
          <el-table :data="form.packaging" border>
            <el-table-column prop="name" label="包材名称" min-width="160">
              <template #default="scope">
                <el-select v-model="scope.row.name" placeholder="选择包材">
                  <el-option v-for="item in packagingOptions" :key="item.name" :label="item.name" :value="item.name" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="usage" label="使用量" width="120">
              <template #default="scope">
                <el-input v-model="scope.row.usage" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单包材成本" width="140">
              <template #default="scope">
                <el-input v-model="scope.row.price" />
              </template>
            </el-table-column>
            <el-table-column label="总成本" width="140" align="right">
              <template #default="scope">
                {{ calcCost(scope.row.usage, scope.row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="danger" @click="removePackaging(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-2">
            <el-button type="primary" plain @click="addPackaging">新增包材行</el-button>
          </div>
        </div>
        <div class="mt-4 text-right text-sm text-gray-600">
          包材总成本：{{ calcPackagingTotal(form.packaging) }} 元
        </div>
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
import Big from 'big.js'
import ExportPrintActions from '../../components/ExportPrintActions.vue'

const keyword = ref('')
const dialogVisible = ref(false)
const editingId = ref(null)

const formulaOptions = [
  { code: 'F-1001', name: 'F-1001 润泽面霜配方' },
  { code: 'F-1002', name: 'F-1002 清透粉底液配方' },
  { code: 'F-1003', name: 'F-1003 修护精华配方' }
]

const formulaVersions = {
  'F-1001': ['V1.0', 'V1.1', 'V2.0'],
  'F-1002': ['V1.0', 'V1.1'],
  'F-1003': ['V1.0']
}

const packagingOptions = [
  { name: '水润玻璃瓶', price: '1.2000' },
  { name: '磨砂泵头', price: '0.6800' },
  { name: '亮面纸盒', price: '0.4500' },
  { name: '真空瓶', price: '2.4000' }
]

const finishedProducts = reactive([
  {
    id: 'FP-001',
    name: '润泽补水面霜',
    brand: '澄光',
    category: '面霜',
    spec: '50ml',
    formula: 'F-1001',
    version: 'V2.0',
    referencePrice: '128.00',
    status: '启用',
    packaging: [
      { name: '水润玻璃瓶', usage: '1', price: '1.2000' },
      { name: '磨砂泵头', usage: '1', price: '0.6800' },
      { name: '亮面纸盒', usage: '1', price: '0.4500' }
    ]
  },
  {
    id: 'FP-002',
    name: '清透粉底液',
    brand: '初色',
    category: '粉底液',
    spec: '30ml',
    formula: 'F-1002',
    version: 'V1.1',
    referencePrice: '168.00',
    status: '启用',
    packaging: [
      { name: '真空瓶', usage: '1', price: '2.4000' },
      { name: '亮面纸盒', usage: '1', price: '0.4500' }
    ]
  }
])

const form = reactive({
  id: '',
  name: '',
  brand: '',
  category: '',
  spec: '',
  formula: '',
  version: '',
  referencePrice: '',
  status: '启用',
  packaging: []
})

const columns = [
  { label: '成品ID', prop: 'id' },
  { label: '成品名称', prop: 'name' },
  { label: '品牌', prop: 'brand' },
  { label: '品类', prop: 'category' },
  { label: '规格', prop: 'spec' },
  { label: '配方号', prop: 'formula' },
  { label: '版本', prop: 'version' },
  { label: '参考售价', prop: 'referencePrice' },
  { label: '状态', prop: 'status' }
]

const versionOptions = computed(() => formulaVersions[form.formula] || [])

const filteredData = computed(() => {
  if (!keyword.value) return finishedProducts
  return finishedProducts.filter(
    (item) => item.name.includes(keyword.value) || item.brand.includes(keyword.value) || item.formula.includes(keyword.value)
  )
})

const calcCost = (usage, price) => {
  try {
    return Big(usage || 0).times(price || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
}

const calcPackagingTotal = (packaging) => {
  try {
    return packaging.reduce((acc, item) => acc.plus(Big(item.usage || 0).times(item.price || 0)), Big(0)).toFixed(2)
  } catch (error) {
    return '0.00'
  }
}

const openDialog = () => {
  editingId.value = null
  Object.assign(form, {
    id: '',
    name: '',
    brand: '',
    category: '',
    spec: '',
    formula: '',
    version: '',
    referencePrice: '',
    status: '启用',
    packaging: []
  })
  dialogVisible.value = true
}

const editRow = (row) => {
  editingId.value = row.id
  Object.assign(form, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

const saveRow = () => {
  if (editingId.value) {
    const index = finishedProducts.findIndex((item) => item.id === editingId.value)
    if (index !== -1) finishedProducts[index] = JSON.parse(JSON.stringify(form))
  } else {
    finishedProducts.unshift({ ...JSON.parse(JSON.stringify(form)), id: `FP-${String(finishedProducts.length + 1).padStart(3, '0')}` })
  }
  dialogVisible.value = false
}

const removeRow = (row) => {
  const index = finishedProducts.findIndex((item) => item.id === row.id)
  if (index !== -1) finishedProducts.splice(index, 1)
}

const addPackaging = () => {
  form.packaging.push({ name: '', usage: '1', price: '0.0000' })
}

const removePackaging = (index) => {
  form.packaging.splice(index, 1)
}

const syncFormula = (value) => {
  const versions = formulaVersions[value] || []
  form.version = versions[0] || ''
}
</script>
