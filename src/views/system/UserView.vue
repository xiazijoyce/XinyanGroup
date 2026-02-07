<template>
  <div class="app-card space-y-4">
    <div class="section-title">用户管理</div>
    <el-table :data="users" class="data-table" border>
      <el-table-column prop="name" label="用户名称" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default>
          <el-button size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const users = [
  { name: '管理员', role: '系统管理员', status: '启用' },
  { name: '张敏', role: '配方主管', status: '启用' },
  { name: '周晴', role: '市场专员', status: '启用' }
]
</script>
