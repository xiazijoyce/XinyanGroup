<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">配方录入</div>
      <el-form :model="form" label-width="100px">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="配方号">
            <el-input v-model="form.code" placeholder="唯一配方号" />
          </el-form-item>
          <el-form-item label="配方名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="品类">
            <el-input v-model="form.category" />
          </el-form-item>
          <el-form-item label="适配成品">
            <el-input v-model="form.product" />
          </el-form-item>
          <el-form-item label="灌装量">
            <el-input v-model="form.fill" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.creator" />
          </el-form-item>
        </div>
        <div class="mt-4">
          <div class="text-sm font-semibold mb-2">原料关联</div>
          <el-table :data="form.materials" border>
            <el-table-column prop="name" label="原料选择" min-width="180">
              <template #default="scope">
                <el-select v-model="scope.row.name" placeholder="选择原料" @change="syncPrice(scope.row)">
                  <el-option v-for="item in materialOptions" :key="item.name" :label="item.name" :value="item.name" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="添加量(g)" width="140">
              <template #default="scope">
                <el-input v-model="scope.row.amount" />
              </template>
            </el-table-column>
            <el-table-column label="单原料成本" width="140" align="right">
              <template #default="scope">
                {{ calcMaterialCost(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" type="danger" @click="removeMaterial(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-2">
            <el-button type="primary" plain @click="addMaterial">新增原料行</el-button>
          </div>
        </div>
        <div class="mt-4 text-right text-sm text-gray-600">
          配方总成本：{{ totalCost }} 元 ｜ 配方单价：{{ unitCost }} 元/kg
        </div>
        <div class="mt-4">
          <el-button type="primary">保存配方</el-button>
          <el-button>重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import Big from 'big.js'

const form = reactive({
  code: 'F-1004',
  name: '柔润唇膏配方',
  category: '口红',
  product: '柔润丝滑口红',
  fill: '4',
  creator: '配方师陈静',
  materials: [
    { name: '角鲨烷', amount: '120' },
    { name: '神经酰胺', amount: '30' },
    { name: '微囊香精', amount: '2' }
  ]
})

const materialOptions = [
  { name: '透明质酸钠', price: '380.0000' },
  { name: '烟酰胺', price: '520.0000' },
  { name: '角鲨烷', price: '610.5000' },
  { name: '积雪草提取物', price: '780.0000' },
  { name: '神经酰胺', price: '1200.0000' },
  { name: '微囊香精', price: '1500.0000' }
]

const syncPrice = (row) => {
  const matched = materialOptions.find((item) => item.name === row.name)
  if (matched) row.price = matched.price
}

const calcMaterialCost = (row) => {
  try {
    const price = row.price || materialOptions.find((item) => item.name === row.name)?.price || 0
    return Big(price).times(row.amount || 0).div(1000).toFixed(2)
  } catch (error) {
    return '0.00'
  }
}

const totalCost = computed(() => {
  try {
    return form.materials.reduce((acc, item) => acc.plus(calcMaterialCost(item)), Big(0)).toFixed(2)
  } catch (error) {
    return '0.00'
  }
})

const unitCost = computed(() => {
  try {
    const totalAmount = form.materials.reduce((acc, item) => acc.plus(item.amount || 0), Big(0))
    if (totalAmount.eq(0)) return '0.00'
    return Big(totalCost.value).div(totalAmount).times(1000).toFixed(4)
  } catch (error) {
    return '0.00'
  }
})

const addMaterial = () => {
  form.materials.push({ name: '', amount: '0' })
}

const removeMaterial = (index) => {
  form.materials.splice(index, 1)
}
</script>
