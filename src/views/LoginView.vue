<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="app-card w-[420px]">
      <div class="text-xl font-semibold mb-4">系统登录</div>
      <el-form :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-button type="primary" class="w-full" @click="login">登录进入系统</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  username: 'admin',
  password: '123456'
})

const login = () => {
  localStorage.setItem('xinyan-token', 'mock-token')
  router.push('/dashboard')
}
</script>
