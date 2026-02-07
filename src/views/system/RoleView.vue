<template>
  <div class="app-card space-y-4">
    <div class="section-title">角色权限</div>
    <el-table :data="roles" class="data-table" border>
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="scope" label="权限范围" />
      <el-table-column label="操作">
        <template #default>
          <el-button size="small">配置权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const roles = [
  { name: '系统管理员', scope: '全模块增删改查/审核/导出' },
  { name: '市场专员', scope: '需求管理/客户管理' },
  { name: '配方主管', scope: '配方管理/资料管理' },
  { name: '财务审核', scope: '报价审核/报表中心' }
]
</script>
