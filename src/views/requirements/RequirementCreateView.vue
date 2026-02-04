<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">需求单新建</div>
      <el-form :model="form" label-width="110px">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="需求单号">
            <el-input v-model="form.id" disabled />
          </el-form-item>
          <el-form-item label="客户选择">
            <el-select v-model="form.customer" placeholder="选择客户">
              <el-option v-for="item in customers" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="成品选择">
            <el-select v-model="form.product" placeholder="选择成品" @change="syncProduct">
              <el-option v-for="item in products" :key="item.name" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="form.brand" disabled />
          </el-form-item>
          <el-form-item label="需求数量">
            <el-input v-model="form.quantity" />
          </el-form-item>
          <el-form-item label="交付时间">
            <el-date-picker v-model="form.delivery" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="配方号">
            <el-input v-model="form.formula" disabled />
          </el-form-item>
          <el-form-item label="配方版本">
            <el-select v-model="form.version" placeholder="选择版本">
              <el-option v-for="ver in versionOptions" :key="ver" :label="ver" :value="ver" />
            </el-select>
          </el-form-item>
          <el-form-item label="参考售价">
            <el-input v-model="form.referencePrice" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.creator" disabled />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="app-card">
      <div class="section-title">包材信息（自动带入可编辑）</div>
      <el-table :data="form.packaging" border>
        <el-table-column prop="name" label="包材名称" min-width="160" />
        <el-table-column prop="spec" label="规格" width="140" />
        <el-table-column prop="usage" label="用量" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.usage" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="app-card">
      <div class="section-title">流程节点管控</div>
      <FlowNodes :nodes="form.nodes" />
      <div class="mt-4">
        <el-table :data="form.nodes" border>
          <el-table-column prop="name" label="节点名称" width="140" />
          <el-table-column prop="owner" label="处理人" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.owner" placeholder="填写处理人" />
            </template>
          </el-table-column>
          <el-table-column prop="time" label="处理时间" width="200">
            <template #default="scope">
              <el-date-picker v-model="scope.row.time" type="datetime" placeholder="选择时间" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="140">
            <template #default="scope">
              <el-select v-model="scope.row.status" @change="updateNodeStatus(scope.row)">
                <el-option label="待办" value="pending" />
                <el-option label="已办" value="done" />
                <el-option label="驳回" value="reject" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="驳回原因" min-width="180">
            <template #default="scope">
              <el-input v-model="scope.row.reason" placeholder="驳回需填写" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="app-card">
      <div class="section-title">备注与附件</div>
      <el-input v-model="form.remark" type="textarea" rows="4" placeholder="填写需求备注" />
      <div class="mt-3">
        <el-upload action="#" list-type="text" multiple>
          <el-button type="primary">上传附件</el-button>
        </el-upload>
      </div>
      <div class="mt-4 flex gap-3">
        <el-button type="primary" @click="saveRequirement">保存需求单</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import FlowNodes from '../../components/FlowNodes.vue'
import { addRequirement } from '../../utils/dataStore'

const customers = ['澄光生物', '初色科技', '植本实验室', '悦颜集团']
const products = [
  {
    name: '润泽补水面霜',
    brand: '澄光',
    formula: 'F-1001',
    versions: ['V1.0', 'V1.1', 'V2.0'],
    referencePrice: '128.00',
    packaging: [
      { name: '水润玻璃瓶', spec: '100ml', usage: '1' },
      { name: '磨砂泵头', spec: '28/410', usage: '1' },
      { name: '亮面纸盒', spec: '120*60*40', usage: '1' }
    ]
  },
  {
    name: '清透粉底液',
    brand: '初色',
    formula: 'F-1002',
    versions: ['V1.0', 'V1.1'],
    referencePrice: '168.00',
    packaging: [
      { name: '真空瓶', spec: '30ml', usage: '1' },
      { name: '亮面纸盒', spec: '120*60*40', usage: '1' }
    ]
  }
]

const form = reactive({
  id: `REQ-${Date.now().toString().slice(-6)}`,
  customer: '',
  product: '',
  brand: '',
  quantity: '10000',
  delivery: '',
  formula: '',
  version: '',
  referencePrice: '',
  creator: '市场专员周晴',
  packaging: [],
  remark: '',
  nodes: [
    { name: '文案', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '打样彩盒', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '备案送检', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '检测报告', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '备案上传', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' }
  ]
})

const versionOptions = computed(() => {
  const matched = products.find((item) => item.name === form.product)
  return matched ? matched.versions : []
})

const syncProduct = (value) => {
  const matched = products.find((item) => item.name === value)
  if (!matched) return
  form.brand = matched.brand
  form.formula = matched.formula
  form.version = matched.versions[0]
  form.referencePrice = matched.referencePrice
  form.packaging = matched.packaging.map((item) => ({ ...item }))
}

const updateNodeStatus = (node) => {
  if (node.status === 'done') node.statusLabel = '已办'
  if (node.status === 'reject') node.statusLabel = '驳回'
  if (node.status === 'pending') node.statusLabel = '待办'
}

const saveRequirement = () => {
  addRequirement({ ...form, status: '进行中', createdAt: new Date().toLocaleString() })
}

const resetForm = () => {
  form.customer = ''
  form.product = ''
  form.brand = ''
  form.quantity = '10000'
  form.delivery = ''
  form.formula = ''
  form.version = ''
  form.referencePrice = ''
  form.packaging = []
  form.remark = ''
  form.nodes.forEach((node) => {
    node.owner = ''
    node.time = ''
    node.status = 'pending'
    node.statusLabel = '待办'
    node.reason = ''
  })
}
</script>
