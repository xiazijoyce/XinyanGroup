import { createRouter, createWebHistory } from 'vue-router'

const Dashboard = () => import('../views/dashboard/DashboardView.vue')
const Login = () => import('../views/LoginView.vue')

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/requirements/new', component: () => import('../views/requirements/RequirementCreateView.vue'), meta: { requiresAuth: true } },
  { path: '/requirements/list', component: () => import('../views/requirements/RequirementListView.vue'), meta: { requiresAuth: true } },
  { path: '/requirements/closed', component: () => import('../views/requirements/RequirementClosedView.vue'), meta: { requiresAuth: true } },
  { path: '/quotes/new', component: () => import('../views/quotes/QuoteCreateView.vue'), meta: { requiresAuth: true } },
  { path: '/quotes/list', component: () => import('../views/quotes/QuoteListView.vue'), meta: { requiresAuth: true } },
  { path: '/quotes/archived', component: () => import('../views/quotes/QuoteArchivedView.vue'), meta: { requiresAuth: true } },
  { path: '/formulas/entry', component: () => import('../views/formulas/FormulaEntryView.vue'), meta: { requiresAuth: true } },
  { path: '/formulas/versions', component: () => import('../views/formulas/FormulaVersionView.vue'), meta: { requiresAuth: true } },
  { path: '/formulas/compare', component: () => import('../views/formulas/FormulaCompareView.vue'), meta: { requiresAuth: true } },
  { path: '/customers', component: () => import('../views/customers/CustomerView.vue'), meta: { requiresAuth: true } },
  { path: '/materials/finished', component: () => import('../views/materials/FinishedProductView.vue'), meta: { requiresAuth: true } },
  { path: '/materials/raw', component: () => import('../views/materials/RawMaterialView.vue'), meta: { requiresAuth: true } },
  { path: '/materials/packaging', component: () => import('../views/materials/PackagingView.vue'), meta: { requiresAuth: true } },
  { path: '/materials/suppliers', component: () => import('../views/materials/SupplierView.vue'), meta: { requiresAuth: true } },
  { path: '/system/users', component: () => import('../views/system/UserView.vue'), meta: { requiresAuth: true } },
  { path: '/system/roles', component: () => import('../views/system/RoleView.vue'), meta: { requiresAuth: true } },
  { path: '/system/audit', component: () => import('../views/system/AuditView.vue'), meta: { requiresAuth: true } },
  { path: '/system/params', component: () => import('../views/system/ParamsView.vue'), meta: { requiresAuth: true } },
  { path: '/reports/requirement', component: () => import('../views/reports/RequirementReportView.vue'), meta: { requiresAuth: true } },
  { path: '/reports/quote', component: () => import('../views/reports/QuoteReportView.vue'), meta: { requiresAuth: true } },
  { path: '/reports/formula', component: () => import('../views/reports/FormulaReportView.vue'), meta: { requiresAuth: true } },
  { path: '/reports/finished', component: () => import('../views/reports/FinishedReportView.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('xinyan-token')
    if (!token) {
      next('/login')
      return
    }
  }
  next()
})

export default router
