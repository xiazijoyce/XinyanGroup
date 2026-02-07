<template>
  <div class="space-y-6">
    <div class="app-card">
      <div class="section-title">配方版本报表</div>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">配方总数</div>
          <div class="text-2xl font-semibold">42</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">版本更新次数</div>
          <div class="text-2xl font-semibold">96</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500">主流品类</div>
          <div class="text-2xl font-semibold">面霜/精华</div>
        </div>
      </div>
      <div class="mt-6">
        <el-table :data="rows" class="data-table" border>
          <el-table-column prop="category" label="品类" />
          <el-table-column prop="count" label="配方数量" />
          <el-table-column prop="versions" label="版本更新次数" />
          <el-table-column prop="usage" label="使用次数" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
const rows = [
  { category: '面霜', count: 12, versions: 28, usage: 46 },
  { category: '精华', count: 10, versions: 22, usage: 38 },
  { category: '粉底液', count: 8, versions: 16, usage: 22 },
  { category: '面膜', count: 6, versions: 12, usage: 18 }
]
</script>
