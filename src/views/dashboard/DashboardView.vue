<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">仪表盘总览</div>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="item in metrics" :key="item.label" class="p-4 rounded-lg bg-gray-50">
          <div class="text-sm text-gray-500">{{ item.label }}</div>
          <div class="text-2xl font-semibold mt-2">{{ item.value }}</div>
          <div class="text-xs mt-1" :class="item.trendClass">{{ item.trend }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div class="app-card">
        <div class="section-title">需求单进度</div>
        <el-progress :percentage="78" status="success" />
        <div class="text-muted mt-2">本月需求单结案率 78%，待推进 12 单。</div>
      </div>
      <div class="app-card">
        <div class="section-title">报价单审核</div>
        <el-progress :percentage="64" status="warning" />
        <div class="text-muted mt-2">待审核报价单 5 份，驳回 2 份。</div>
      </div>
      <div class="app-card">
        <div class="section-title">配方版本动态</div>
        <ul class="text-sm text-gray-600 space-y-2">
          <li>润泽面霜配方升级至 V2.0</li>
          <li>清透粉底液新增色号版本 V1.1</li>
          <li>舒缓面膜配方归档完成</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const metrics = [
  { label: '需求单总量', value: '128', trend: '本周新增 12 单', trendClass: 'text-green-600' },
  { label: '报价单总量', value: '86', trend: '审核通过率 82%', trendClass: 'text-blue-600' },
  { label: '配方版本数', value: '42', trend: '近30天新增 6 版', trendClass: 'text-green-600' },
  { label: '成品档案', value: '64', trend: '启用中 58 条', trendClass: 'text-gray-500' }
]
</script>
