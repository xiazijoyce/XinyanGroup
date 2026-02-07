<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">需求流程报表</div>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">需求单总量</div>
          <div class="text-2xl font-semibold">128</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">流程结案率</div>
          <div class="text-2xl font-semibold">78%</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">平均耗时</div>
          <div class="text-2xl font-semibold">7.6 天</div>
        </div>
      </div>
      <div class="mt-6">
        <el-table :data="nodes" class="data-table" border>
          <el-table-column prop="name" label="流程节点" />
          <el-table-column prop="rate" label="完成率" />
          <el-table-column prop="avg" label="平均耗时" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
const nodes = [
  { name: '文案', rate: '88%', avg: '1.2 天' },
  { name: '打样彩盒', rate: '82%', avg: '2.1 天' },
  { name: '备案送检', rate: '76%', avg: '2.6 天' },
  { name: '检测报告', rate: '70%', avg: '1.4 天' },
  { name: '备案上传', rate: '68%', avg: '0.3 天' }
]
</script>
