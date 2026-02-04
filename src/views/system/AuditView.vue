<template>
  <div class="app-card space-y-4">
    <div class="section-title">操作审计</div>
    <el-table :data="logs" class="data-table" border>
      <el-table-column prop="user" label="操作人" width="120" />
      <el-table-column prop="module" label="模块" width="140" />
      <el-table-column prop="action" label="内容" min-width="240" />
      <el-table-column prop="time" label="操作时间" width="180" />
    </el-table>
  </div>
</template>

<script setup>
const logs = [
  { user: '张敏', module: '配方管理', action: '更新配方 F-1001 生成 V2.0', time: '2024-06-18 15:10' },
  { user: '周晴', module: '需求管理', action: '创建需求单 REQ-240501', time: '2024-05-01 10:20' },
  { user: '王珂', module: '销售报价', action: '审核报价单 QT-240501 通过', time: '2024-05-03 16:30' }
]
</script>
