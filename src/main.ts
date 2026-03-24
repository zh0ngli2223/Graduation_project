import 'reset-css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { ApiInstance } from '@/types/api'

import App from './App.vue'
// @ts-ignore
import router from './router'
import ElementPlus from 'element-plus'
import { zhCn } from 'element-plus/es/locales.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './api/mock.js'
// @ts-ignore
import api from '@/api/api'
import { initGlobalApi } from '@/utils/api'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 初始化全局API实例
initGlobalApi(api as ApiInstance)
app.config.globalProperties.$api = api as ApiInstance

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})

app.mount('#app')
