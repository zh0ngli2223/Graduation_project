import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAllDataStore = defineStore('index', () => {
  const state = ref({
    isShow: false,
    tags: [{
      path: '/home',
      name: 'home',
      label: '首页',
      icon: 'home'
    }],
    currentMenu: null,
    menuList: localStorage.getItem('menuList') ? JSON.parse(localStorage.getItem('menuList')!) : [],
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || ''  // 新增角色字段
  })

  function selectMenu(val: any) {
    if (val.name == 'home') {
      state.value.currentMenu = null
    } else {
      state.value.currentMenu = val
      const index = state.value.tags.findIndex(item => item.name === val.name)
      index === -1 ? state.value.tags.push(val) : ""
    }
  }

  function updateTags(tag: any) {
    const index = state.value.tags.findIndex(item => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }

  function updateMenuList(val: any) {
    state.value.menuList = val
  }

  function setToken(token: string) {
    state.value.token = token
  }

  function setRole(role: string) {
    state.value.role = role
    localStorage.setItem('role', role)
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    setToken,
    setRole
  }
})