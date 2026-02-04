<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">销售报价报表</div>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">报价单总量</div>
          <div class="text-2xl font-semibold">86</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">审核通过率</div>
          <div class="text-2xl font-semibold">82%</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">成交率</div>
          <div class="text-2xl font-semibold">64%</div>
        </div>
      </div>
      <div class="mt-6">
        <el-table :data="rows" class="data-table" border>
          <el-table-column prop="month" label="月份" />
          <el-table-column prop="count" label="报价数量" />
          <el-table-column prop="amount" label="报价总额" />
          <el-table-column prop="rate" label="通过率" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
const rows = [
  { month: '2024-04', count: 18, amount: '1280000', rate: '80%' },
  { month: '2024-05', count: 22, amount: '1460000', rate: '83%' },
  { month: '2024-06', count: 26, amount: '1680000', rate: '82%' }
]
</script>
