import type { ApiInstance } from '@/types/api'
// @ts-ignore
import api from '@/api/api'

// 创建一个全局的API实例引用
let globalApi: ApiInstance | null = null

// 初始化全局API实例
export const initGlobalApi = (apiInstance: ApiInstance) => {
  globalApi = apiInstance
}

// 获取API实例的安全方法
export const useApi = (): ApiInstance => {
  if (!globalApi) {
    throw new Error('API实例未初始化，请确保在应用启动时调用initGlobalApi')
  }
  return globalApi
}

// 安全的API调用包装器
export const safeApiCall = async <T>(
  apiCall: Promise<T>,
  errorMessage = '操作失败'
): Promise<T | null> => {
  try {
    return await apiCall
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return null
  }
}