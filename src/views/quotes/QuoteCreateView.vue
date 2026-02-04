<template>
  <div class="grid grid-cols-10 gap-6">
    <div class="col-span-7 space-y-6">
      <div class="app-card">
        <div class="section-title">报价单基础信息</div>
        <el-form :model="form" label-width="110px">
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="报价单号">
              <el-input v-model="form.id" disabled />
            </el-form-item>
            <el-form-item label="报价日期">
              <el-date-picker v-model="form.date" type="date" />
            </el-form-item>
            <el-form-item label="客户">
              <el-select v-model="form.customer" placeholder="选择客户">
                <el-option v-for="item in customers" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-input v-model="form.brand" />
            </el-form-item>
            <el-form-item label="成品名称">
              <el-select v-model="form.product" placeholder="选择成品" @change="syncProduct">
                <el-option v-for="item in products" :key="item.name" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="需求单号">
              <el-input v-model="form.requirementId" disabled />
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="app-card">
        <div class="section-title">配方信息</div>
        <el-form :model="form" label-width="110px">
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="配方号">
              <el-select v-model="form.formula" placeholder="选择配方" @change="syncFormula">
                <el-option v-for="item in formulaOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="配方版本">
              <el-select v-model="form.version">
                <el-option v-for="ver in versionOptions" :key="ver" :label="ver" :value="ver" />
              </el-select>
            </el-form-item>
            <el-form-item label="灌装量(ml)">
              <el-input v-model="form.fill" />
            </el-form-item>
            <el-form-item label="配方单价">
              <el-input v-model="form.formulaPrice" />
            </el-form-item>
            <el-form-item label="配方基础成本">
              <el-input v-model="formulaBaseCost" disabled />
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="app-card">
        <div class="section-title">包材信息</div>
        <el-table :data="form.packaging" border>
          <el-table-column prop="name" label="包材名称" min-width="160">
            <template #default="scope">
              <el-select v-model="scope.row.name" placeholder="选择包材">
                <el-option v-for="item in packagingOptions" :key="item.name" :label="item.name" :value="item.name" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.spec" />
            </template>
          </el-table-column>
          <el-table-column prop="usage" label="用量" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.usage" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单包材成本" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.price" />
            </template>
          </el-table-column>
          <el-table-column label="包材总成本" width="140" align="right">
            <template #default="scope">
              {{ calcPackagingCost(scope.row) }}
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

      <div class="app-card">
        <div class="section-title">数量与售价</div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="报价数量">
            <el-input v-model="form.quantity" />
          </el-form-item>
          <el-form-item label="成品参考售价">
            <el-input v-model="form.referencePrice" />
          </el-form-item>
        </div>
      </div>
    </div>

    <div class="col-span-3">
      <div class="app-card right-sticky space-y-4">
        <div class="section-title">核算卡片</div>
        <div>
          <div class="text-sm font-semibold mb-2">参数设置</div>
          <div class="space-y-3">
            <div>
              <div class="text-xs text-gray-500 mb-1">利润系数：{{ form.profit }} </div>
              <el-slider v-model="form.profit" :min="0" :max="1" :step="0.01" />
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">税率</div>
              <el-input v-model="form.tax" />
            </div>
          </div>
        </div>
        <div>
          <div class="text-sm font-semibold mb-2">成本明细</div>
          <div class="text-sm text-gray-600 space-y-1">
            <div class="flex justify-between"><span>配方基础成本</span><span>{{ formulaBaseCost }}</span></div>
            <div class="flex justify-between"><span>包材总成本</span><span>{{ packagingTotal }}</span></div>
            <div class="flex justify-between"><span>单位成本</span><span>{{ unitCost }}</span></div>
            <div class="flex justify-between"><span>总成本</span><span>{{ totalCost }}</span></div>
          </div>
        </div>
        <div>
          <div class="text-sm font-semibold mb-2">报价明细</div>
          <div class="text-sm text-gray-600 space-y-1">
            <div class="flex justify-between"><span>单位报价</span><span>{{ unitQuote }}</span></div>
            <div class="flex justify-between"><span>总报价</span><span>{{ totalQuote }}</span></div>
            <div class="flex justify-between"><span>利润额</span><span>{{ profitAmount }}</span></div>
            <div class="flex justify-between"><span>税额</span><span>{{ taxAmount }}</span></div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <el-button type="primary" @click="saveQuote">保存草稿</el-button>
          <el-button type="success" @click="submitQuote">提交审核</el-button>
          <el-button @click="resetParams">重置参数</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Big from 'big.js'
import { addQuote, getStore } from '../../utils/dataStore'

const route = useRoute()

const customers = ['澄光生物', '初色科技', '植本实验室', '悦颜集团']
const products = [
  {
    name: '润泽补水面霜',
    brand: '澄光',
    formula: 'F-1001',
    version: 'V2.0',
    formulaPrice: '14.8800',
    fill: '50',
    referencePrice: '128.00',
    packaging: [
      { name: '水润玻璃瓶', spec: '100ml', usage: '1', price: '1.2000' },
      { name: '磨砂泵头', spec: '28/410', usage: '1', price: '0.6800' },
      { name: '亮面纸盒', spec: '120*60*40', usage: '1', price: '0.4500' }
    ]
  },
  {
    name: '清透粉底液',
    brand: '初色',
    formula: 'F-1002',
    version: 'V1.1',
    formulaPrice: '18.4200',
    fill: '30',
    referencePrice: '168.00',
    packaging: [
      { name: '真空瓶', spec: '30ml', usage: '1', price: '2.4000' },
      { name: '亮面纸盒', spec: '120*60*40', usage: '1', price: '0.4500' }
    ]
  }
]

const formulaOptions = [
  { code: 'F-1001', name: 'F-1001 润泽面霜配方', versions: ['V1.0', 'V1.1', 'V2.0'], price: '14.8800' },
  { code: 'F-1002', name: 'F-1002 清透粉底液配方', versions: ['V1.0', 'V1.1'], price: '18.4200' }
]

const packagingOptions = [
  { name: '水润玻璃瓶' },
  { name: '磨砂泵头' },
  { name: '亮面纸盒' },
  { name: '真空瓶' }
]

const form = reactive({
  id: `QT-${Date.now().toString().slice(-6)}`,
  date: new Date(),
  customer: '',
  brand: '',
  product: '',
  requirementId: '',
  formula: '',
  version: '',
  fill: '0',
  formulaPrice: '0.0000',
  packaging: [],
  quantity: '0',
  referencePrice: '',
  profit: 0.2,
  tax: '0.13'
})

const versionOptions = computed(() => {
  const matched = formulaOptions.find((item) => item.code === form.formula)
  return matched ? matched.versions : []
})

const formulaBaseCost = computed(() => {
  try {
    return Big(form.formulaPrice || 0).times(form.fill || 0).div(1000).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const calcPackagingCost = (row) => {
  try {
    return Big(row.usage || 0).times(row.price || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
}

const packagingTotal = computed(() => {
  try {
    return form.packaging.reduce((acc, item) => acc.plus(calcPackagingCost(item)), Big(0)).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const unitCost = computed(() => {
  try {
    const total = Big(formulaBaseCost.value).plus(packagingTotal.value)
    return Big(form.quantity || 1).eq(0) ? '0.00' : total.div(form.quantity || 1).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const totalCost = computed(() => {
  try {
    return Big(unitCost.value).times(form.quantity || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const unitQuote = computed(() => {
  try {
    const base = Big(formulaBaseCost.value)
      .plus(Big(packagingTotal.value).div(form.quantity || 1))
      .times(Big(1).plus(form.profit))
      .times(Big(1).plus(form.tax || 0))
    return base.toFixed(4)
  } catch (error) {
    return '0.0000'
  }
})

const totalQuote = computed(() => {
  try {
    return Big(unitQuote.value).times(form.quantity || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const profitAmount = computed(() => {
  try {
    const base = Big(formulaBaseCost.value).plus(Big(packagingTotal.value).div(form.quantity || 1))
    return base.times(form.profit).times(form.quantity || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const taxAmount = computed(() => {
  try {
    return Big(unitQuote.value).times(form.quantity || 0).times(form.tax || 0).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const syncProduct = (value) => {
  const matched = products.find((item) => item.name === value)
  if (!matched) return
  form.brand = matched.brand
  form.formula = matched.formula
  form.version = matched.version
  form.formulaPrice = matched.formulaPrice
  form.fill = matched.fill
  form.referencePrice = matched.referencePrice
  form.packaging = matched.packaging.map((item) => ({ ...item }))
}

const syncFormula = (value) => {
  const matched = formulaOptions.find((item) => item.code === value)
  if (matched) {
    form.version = matched.versions[0]
    form.formulaPrice = matched.price
  }
}

const addPackaging = () => {
  form.packaging.push({ name: '', spec: '', usage: '1', price: '0.0000' })
}

const removePackaging = (index) => {
  form.packaging.splice(index, 1)
}

const saveQuote = () => {
  addQuote({ ...form, status: '草稿', totalQuote: totalQuote.value })
}

const submitQuote = () => {
  addQuote({ ...form, status: '待审核', totalQuote: totalQuote.value })
}

const resetParams = () => {
  form.profit = 0.2
  form.tax = '0.13'
}

onMounted(() => {
  const reqId = route.query.req
  if (!reqId) return
  const store = getStore()
  const req = store.requirements.find((item) => item.id === reqId)
  if (req) {
    form.requirementId = req.id
    form.customer = req.customer
    form.brand = req.brand
    form.product = req.product
    form.quantity = req.quantity
    form.formula = req.formula
    form.version = req.version
    form.referencePrice = req.referencePrice
    form.packaging = req.packaging.map((item) => ({ ...item, price: item.price || '0.0000' }))
  }
})
</script>
