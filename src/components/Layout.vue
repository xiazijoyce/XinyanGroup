<template>
  <div class="min-h-screen flex">
    <aside v-if="showSidebar" class="sidebar w-[240px] flex flex-col py-6">
      <div class="px-6 mb-6">
        <div class="text-xl font-semibold text-white">美妆造ERP系统</div>
        <div class="text-xs text-gray-300 mt-1">需求-配方-成品-报价闭环</div>
      </div>
      <nav class="flex-1 overflow-y-auto">
        <div v-for="menu in menus" :key="menu.label" class="mb-2">
          <div
            class="sidebar-item"
            :class="{ active: isActive(menu) }"
            @click="handleMenu(menu)"
          >
            <component :is="menu.icon" class="w-4 h-4" />
            <span class="text-sm">{{ menu.label }}</span>
            <span v-if="menu.children" class="ml-auto text-xs">{{ menu.open ? '−' : '+' }}</span>
          </div>
          <div v-if="menu.children && menu.open" class="sidebar-submenu">
            <div
              v-for="child in menu.children"
              :key="child.label"
              class="sidebar-item"
              :class="{ active: route.path === child.path }"
              @click="go(child.path)"
            >
              <component :is="child.icon" class="w-4 h-4" />
              <span class="text-sm">{{ child.label }}</span>
            </div>
          </div>
        </div>
      </nav>
      <div class="px-6">
        <el-button type="primary" class="w-full" @click="logout">退出登录</el-button>
      </div>
    </aside>
    <main class="flex-1 bg-gray-100 min-h-screen p-6 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  FlaskConical,
  Users,
  Archive,
  Settings,
  BarChart3,
  BookOpen,
  PackageSearch,
  Boxes,
  Building2,
  UserCog,
  ShieldCheck,
  ScrollText,
  SlidersHorizontal
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const menus = reactive([
  {
    label: '仪表盘',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    label: '需求管理',
    icon: ClipboardList,
    open: true,
    children: [
      { label: '需求单新建', icon: FileText, path: '/requirements/new' },
      { label: '需求单列表', icon: FileText, path: '/requirements/list' },
      { label: '已结案需求', icon: FileText, path: '/requirements/closed' }
    ]
  },
  {
    label: '销售报价',
    icon: FileText,
    open: true,
    children: [
      { label: '报价单新建', icon: FileText, path: '/quotes/new' },
      { label: '报价单列表', icon: FileText, path: '/quotes/list' },
      { label: '已归档报价', icon: FileText, path: '/quotes/archived' }
    ]
  },
  {
    label: '配方管理',
    icon: FlaskConical,
    open: false,
    children: [
      { label: '配方录入', icon: BookOpen, path: '/formulas/entry' },
      { label: '配方版本管理', icon: BookOpen, path: '/formulas/versions' },
      { label: '版本差异比对', icon: BookOpen, path: '/formulas/compare' }
    ]
  },
  {
    label: '客户管理',
    icon: Users,
    path: '/customers'
  },
      {
        label: '资料管理',
        icon: Archive,
        open: false,
        children: [
          { label: '品牌资料', icon: PackageSearch, path: '/materials/brands' },
          { label: '成品档案', icon: PackageSearch, path: '/materials/finished' },
          { label: '原料数据', icon: Boxes, path: '/materials/raw' },
          { label: '包材数据', icon: Boxes, path: '/materials/packaging' },
          { label: '供应商管理', icon: Building2, path: '/materials/suppliers' }
        ]
  },
  {
    label: '系统管理',
    icon: Settings,
    open: false,
    children: [
      { label: '用户管理', icon: UserCog, path: '/system/users' },
      { label: '角色权限', icon: ShieldCheck, path: '/system/roles' },
      { label: '操作审计', icon: ScrollText, path: '/system/audit' },
      { label: '系统参数', icon: SlidersHorizontal, path: '/system/params' }
    ]
  },
  {
    label: '报表中心',
    icon: BarChart3,
    open: false,
    children: [
      { label: '需求流程报表', icon: BarChart3, path: '/reports/requirement' },
      { label: '销售报价报表', icon: BarChart3, path: '/reports/quote' },
      { label: '配方版本报表', icon: BarChart3, path: '/reports/formula' },
      { label: '成品关联报表', icon: BarChart3, path: '/reports/finished' }
    ]
  }
])

const showSidebar = computed(() => route.path !== '/login')

const go = (path) => {
  router.push(path)
}

const isActive = (menu) => {
  if (menu.path) return route.path === menu.path
  if (menu.children) return menu.children.some((child) => child.path === route.path)
  return false
}

const handleMenu = (menu) => {
  if (menu.children) {
    menu.open = !menu.open
    return
  }
  if (menu.path) {
    go(menu.path)
  }
}

const logout = () => {
  localStorage.removeItem('xinyan-token')
  router.push('/login')
}
</script>
