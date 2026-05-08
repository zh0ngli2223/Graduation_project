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
  StudentForm,
  Appeal,
  AppealForm,
  ClassScoreStats,
  StudentScore
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
  // 申诉相关API
  getAppealList(data: any): Promise<ApiResponse<{ list: Appeal[], total: number }>>
  getMyAppeals(data: any): Promise<ApiResponse<{ list: Appeal[], total: number }>>
  submitAppeal(data: AppealForm): Promise<ApiResponse>
  processAppeal(data: { id: string, status: string, processNote?: string }): Promise<ApiResponse>
  // 班级成绩统计相关API
  getClassScoreStats(data: { className?: string, exam: string }): Promise<ApiResponse<ClassScoreStats>>
  getClassList(): Promise<ApiResponse<string[]>>
  getExamList(): Promise<ApiResponse<string[]>>
  getStudentScores(data: { className?: string, exam: string, page?: number, limit?: number }): Promise<ApiResponse<{ list: StudentScore[], total: number }>>
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