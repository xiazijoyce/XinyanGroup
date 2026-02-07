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
            <el-select v-model="form.products" multiple collapse-tags placeholder="选择成品" @change="syncProductLines">
              <el-option v-for="item in products" :key="item.name" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input :model-value="brandDisplay" disabled />
          </el-form-item>
          <el-form-item label="需求总量">
            <el-input v-model="form.quantity" />
          </el-form-item>
          <el-form-item label="交付时间">
            <el-date-picker v-model="form.delivery" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.creator" disabled />
          </el-form-item>
          <el-form-item label="需求状态">
            <el-input value="前端模拟暂不保存" disabled />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="app-card">
      <div class="section-title">成品明细（支持多选）</div>
      <el-table :data="form.productLines" border>
        <el-table-column prop="name" label="成品名称" min-width="180" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="formula" label="配方号" width="140" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="quantity" label="成品数量" width="140">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" @change="rebuildDetailRows" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="danger" @click="removeProductLine(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="app-card">
      <div class="section-title">配方/包材关联明细（汇总展示）</div>
      <el-table :data="detailRows" border>
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="spec" label="规格" width="140" />
        <el-table-column prop="usage" label="用量" width="140">
          <template #default="scope">
            <el-input v-model="scope.row.usage" @change="updateAmount(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" width="140">
          <template #default="scope">
            <el-input v-model="scope.row.unitPrice" @change="updateAmount(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="140" align="right" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="danger" @click="removeDetailRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-button type="primary" plain @click="addDetailRow">新增明细行</el-button>
      </div>
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
        <el-button type="primary" disabled>保存需求单（前端模拟不可用）</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Big from 'big.js'
import FlowNodes from '../../components/FlowNodes.vue'

const customers = ['澄光生物', '初色科技', '植本实验室', '悦颜集团']
const products = [
  {
    name: '润泽补水面霜',
    brand: '澄光',
    formula: 'F-1001',
    versions: ['V1.0', 'V1.1', 'V2.0'],
    referencePrice: '128.00',
    formulaMaterials: [
      { name: '透明质酸钠', spec: '25kg/桶', usagePerUnit: '0.03', unitPrice: '380.0000' },
      { name: '角鲨烷', spec: '20kg/桶', usagePerUnit: '0.02', unitPrice: '610.5000' }
    ],
    packaging: [
      { name: '水润玻璃瓶', spec: '100ml', usagePerUnit: '1', unitPrice: '1.2000' },
      { name: '磨砂泵头', spec: '28/410', usagePerUnit: '1', unitPrice: '0.6800' },
      { name: '亮面纸盒', spec: '120*60*40', usagePerUnit: '1', unitPrice: '0.4500' }
    ]
  },
  {
    name: '清透粉底液',
    brand: '初色',
    formula: 'F-1002',
    versions: ['V1.0', 'V1.1'],
    referencePrice: '168.00',
    formulaMaterials: [
      { name: '烟酰胺', spec: '10kg/袋', usagePerUnit: '0.015', unitPrice: '520.0000' },
      { name: '透明油', spec: '25kg/桶', usagePerUnit: '0.025', unitPrice: '260.0000' }
    ],
    packaging: [
      { name: '真空瓶', spec: '30ml', usagePerUnit: '1', unitPrice: '2.4000' },
      { name: '亮面纸盒', spec: '120*60*40', usagePerUnit: '1', unitPrice: '0.4500' }
    ]
  },
  {
    name: '修护舒缓精华',
    brand: '植本',
    formula: 'F-1003',
    versions: ['V1.0'],
    referencePrice: '198.00',
    formulaMaterials: [
      { name: '积雪草提取物', spec: '5kg/袋', usagePerUnit: '0.02', unitPrice: '780.0000' },
      { name: '神经酰胺', spec: '2kg/桶', usagePerUnit: '0.01', unitPrice: '1200.0000' }
    ],
    packaging: [
      { name: '真空瓶', spec: '30ml', usagePerUnit: '1', unitPrice: '2.4000' },
      { name: '亮面纸盒', spec: '120*60*40', usagePerUnit: '1', unitPrice: '0.4500' }
    ]
  }
]

const form = reactive({
  id: `REQ-${Date.now().toString().slice(-6)}`,
  customer: '',
  products: [],
  quantity: '10000',
  delivery: '',
  creator: '市场专员周晴',
  remark: '',
  productLines: [],
  nodes: [
    { name: '文案', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '打样彩盒', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '备案送检', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '检测报告', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' },
    { name: '备案上传', owner: '', time: '', status: 'pending', statusLabel: '待办', reason: '' }
  ]
})

const detailRows = ref([])

const brandDisplay = computed(() => {
  if (!form.productLines.length) return ''
  const brands = [...new Set(form.productLines.map((item) => item.brand))]
  return brands.length > 1 ? '多品牌' : brands[0]
})

const syncProductLines = () => {
  const selected = products.filter((item) => form.products.includes(item.name))
  form.productLines = selected.map((item) => ({
    name: item.name,
    brand: item.brand,
    formula: item.formula,
    version: item.versions[0],
    quantity: form.quantity
  }))
  rebuildDetailRows()
}

const buildAggregatedRows = () => {
  const rows = []
  form.productLines.forEach((line) => {
    const matched = products.find((item) => item.name === line.name)
    if (!matched) return
    const quantity = Big(line.quantity || 0)
    matched.formulaMaterials.forEach((material) => {
      rows.push({
        type: '配方原料',
        name: material.name,
        spec: material.spec,
        usage: quantity.times(material.usagePerUnit).toFixed(2),
        unitPrice: material.unitPrice,
        amount: '0.00'
      })
    })
    matched.packaging.forEach((pack) => {
      rows.push({
        type: '包材',
        name: pack.name,
        spec: pack.spec,
        usage: quantity.times(pack.usagePerUnit).toFixed(2),
        unitPrice: pack.unitPrice,
        amount: '0.00'
      })
    })
  })
  return rows
}

const rebuildDetailRows = () => {
  const merged = {}
  buildAggregatedRows().forEach((row) => {
    const key = `${row.type}-${row.name}-${row.spec}`
    if (!merged[key]) {
      merged[key] = { ...row }
      merged[key].amount = calcAmount(merged[key].usage, merged[key].unitPrice)
      return
    }
    merged[key].usage = Big(merged[key].usage).plus(row.usage).toFixed(2)
    merged[key].amount = calcAmount(merged[key].usage, merged[key].unitPrice)
  })
  detailRows.value = Object.values(merged)
}

const calcAmount = (usage, unitPrice) => {
  try {
    return Big(usage || 0).times(unitPrice || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
}

const updateAmount = (row) => {
  row.amount = calcAmount(row.usage, row.unitPrice)
}

const addDetailRow = () => {
  detailRows.value.push({ type: '包材', name: '', spec: '', usage: '0', unitPrice: '0.0000', amount: '0.00' })
}

const removeDetailRow = (index) => {
  detailRows.value.splice(index, 1)
}

const removeProductLine = (index) => {
  form.productLines.splice(index, 1)
  form.products = form.productLines.map((item) => item.name)
  rebuildDetailRows()
}

const updateNodeStatus = (node) => {
  if (node.status === 'done') node.statusLabel = '已办'
  if (node.status === 'reject') node.statusLabel = '驳回'
  if (node.status === 'pending') node.statusLabel = '待办'
}

const resetForm = () => {
  form.customer = ''
  form.products = []
  form.quantity = '10000'
  form.delivery = ''
  form.remark = ''
  form.productLines = []
  detailRows.value = []
  form.nodes.forEach((node) => {
    node.owner = ''
    node.time = ''
    node.status = 'pending'
    node.statusLabel = '待办'
    node.reason = ''
  })
}
</script>
