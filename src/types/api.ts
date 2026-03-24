import type {
  LoginForm,
  LoginResponse,
  ApiResponse,
  Student,
  StudentQueryParams,
  StudentListResponse,
  ChartData,
  StatCard,
  ClassScore,
  TableResponse,
  StudentForm
} from './index'

// API实例类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiInstance
  }
}

// API方法定义
export interface ApiInstance {
  getTableData(): Promise<TableResponse>
  getCountData(): Promise<ApiResponse<StatCard[]>>
  getChartData(): Promise<ChartData>
  getUserList(data: StudentQueryParams): Promise<StudentListResponse>
  deleteUser(data: { id: string }): Promise<ApiResponse>
  addUser(data: StudentForm): Promise<ApiResponse>
  editUser(data: StudentForm): Promise<ApiResponse>
  getMenu(data: LoginForm): Promise<LoginResponse>
}

// 请求配置类型
export interface RequestConfig {
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  data?: any
  headers?: Record<string, string>
}

// 响应数据类型
export interface ResponseData<T = any> {
  code: number
  data: T
  message?: string
}