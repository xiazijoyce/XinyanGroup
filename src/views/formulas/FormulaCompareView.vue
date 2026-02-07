<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">配方版本差异比对</div>
      <div class="flex gap-3 mb-4">
        <el-select v-model="versionA" placeholder="选择版本A" class="w-[240px]">
          <el-option v-for="item in versions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="versionB" placeholder="选择版本B" class="w-[240px]">
          <el-option v-for="item in versions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" @click="compare">开始比对</el-button>
      </div>
      <DiffTable :rows="diffRows" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DiffTable from '../../components/DiffTable.vue'

const versions = ['F-1001 V1.0', 'F-1001 V2.0']
const versionA = ref('F-1001 V1.0')
const versionB = ref('F-1001 V2.0')

const diffRows = ref([
  {
    name: '透明质酸钠',
    oldAmount: '150',
    newAmount: '160',
    status: '调整',
    changeText: '+6.67%',
    changeClass: 'text-green-600',
    detail: '原数值 150g，新数值 160g，增加 10g'
  },
  {
    name: '角鲨烷',
    oldAmount: '50',
    newAmount: '60',
    status: '调整',
    changeText: '+20.00%',
    changeClass: 'text-green-600',
    detail: '原数值 50g，新数值 60g，增加 10g'
  },
  {
    name: '神经酰胺',
    oldAmount: '0',
    newAmount: '30',
    status: '新增',
    changeText: '+30g',
    changeClass: 'text-green-600',
    detail: '新增原料 30g'
  }
])

const compare = () => {
  diffRows.value = [...diffRows.value]
}
</script>
