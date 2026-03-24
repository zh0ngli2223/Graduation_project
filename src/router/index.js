import { createRouter, createWebHistory } from 'vue-router'
import { useAllDataStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
      redirect: '/home',
      children: [
        { path: 'home', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'score', name: 'score', component: () => import('@/views/MallView.vue') },       // 成绩管理
        { path: 'classAnalysis', name: 'classAnalysis', component: () => import('@/views/Page1.vue') }, // 班级分析
        { path: 'student', name: 'student', component: () => import('@/views/UserView.vue') },    // 学生管理
        { path: 'appeal', name: 'appeal', component: () => import('@/views/Page2.vue') },          // 申诉处理
        { path: 'report/class', name: 'classReport', component: () => import('@/views/Page1.vue') }, // 班级报告（可复用分析页）
        { path: 'report/school', name: 'schoolReport', component: () => import('@/views/HomeView.vue') }, // 校级报告（暂用首页）
        { path: 'myAnalysis', name: 'myAnalysis', component: () => import('@/views/MyAnalysis.vue') },    // 个人分析
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    }
  ],
})

// 路由守卫（保持不变）
const whiteList = ['/login']
function getAllowedPaths(menuList) {
  const paths = []
  const flatten = (menus) => {
    menus.forEach(item => {
      if (item.path) paths.push(item.path)
      if (item.children) flatten(item.children)
    })
  }
  flatten(menuList)
  return paths
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const store = useAllDataStore()
  if (token) {
    if (to.path === '/login') {
      next('/home')
    } else {
      if (store.state.menuList.length === 0) {
        const storedMenu = localStorage.getItem('menuList')
        if (storedMenu) store.updateMenuList(JSON.parse(storedMenu))
      }
      const allowedPaths = getAllowedPaths(store.state.menuList)
      if (to.path === '/' || to.path === '/home' || allowedPaths.includes(to.path)) {
        next()
      } else {
        next('/home')
      }
    }
  } else {
    if (whiteList.includes(to.path)) next()
    else next('/login')
  }
})

export default router