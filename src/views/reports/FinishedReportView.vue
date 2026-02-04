<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">成品关联报表</div>
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">成品总量</div>
          <div class="text-2xl font-semibold">64</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">配方版本变更</div>
          <div class="text-2xl font-semibold">34 次</div>
        </div>
      </div>
      <div class="mt-6">
        <el-table :data="rows" class="data-table" border>
          <el-table-column prop="product" label="成品" min-width="160" />
          <el-table-column prop="formula" label="配方号" width="120" />
          <el-table-column prop="version" label="当前版本" width="120" />
          <el-table-column prop="change" label="变更记录" min-width="200" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
const rows = [
  { product: '润泽补水面霜', formula: 'F-1001', version: 'V2.0', change: '2024-06-18 更新至 V2.0' },
  { product: '清透粉底液', formula: 'F-1002', version: 'V1.1', change: '2024-06-05 更新至 V1.1' },
  { product: '修护精华', formula: 'F-1003', version: 'V1.0', change: '2024-05-28 建档' }
]
</script>
