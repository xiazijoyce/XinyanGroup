<template>
  <div class="app-card space-y-4">
    <div class="section-title">系统参数</div>
    <el-form label-width="140px">
      <el-form-item label="默认利润系数">
        <el-input v-model="params.profit" />
      </el-form-item>
      <el-form-item label="默认税率">
        <el-input v-model="params.tax" />
      </el-form-item>
      <el-form-item label="流程节点可自定义">
        <el-switch v-model="params.customFlow" />
      </el-form-item>
      <el-form-item label="报价导出模板">
        <el-select v-model="params.template">
          <el-option label="标准模板" value="标准模板" />
          <el-option label="简洁模板" value="简洁模板" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存参数</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const params = reactive({
  profit: '0.2',
  tax: '0.13',
  customFlow: false,
  template: '标准模板'
})
</script>
