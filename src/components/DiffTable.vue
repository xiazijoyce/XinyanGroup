<template>
  <el-table :data="rows" class="data-table" border>
    <el-table-column prop="name" label="原料名称" min-width="180" />
    <el-table-column label="版本A" min-width="120">
      <template #default="scope">
        <span>{{ scope.row.oldAmount }} g</span>
      </template>
    </el-table-column>
    <el-table-column label="版本B" min-width="120">
      <template #default="scope">
        <span>{{ scope.row.newAmount }} g</span>
      </template>
    </el-table-column>
    <el-table-column label="变化状态" min-width="160">
      <template #default="scope">
        <el-tag :type="tagType(scope.row)">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="变化比例" min-width="160">
      <template #default="scope">
        <el-tooltip effect="dark" :content="scope.row.detail" placement="top">
          <span :class="scope.row.changeClass">{{ scope.row.changeText }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  }
})

const tagType = (row) => {
  if (row.status === '新增') return 'success'
  if (row.status === '删除') return 'danger'
  if (row.status === '调整') return 'warning'
  return 'info'
}
</script>
