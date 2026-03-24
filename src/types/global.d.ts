// 全局类型声明

// 扩展Element Plus图标类型
declare module '@element-plus/icons-vue' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}

// 扩展全局属性类型
declare global {
  interface Window {
    // 可以根据需要添加全局属性
  }
}

export {}