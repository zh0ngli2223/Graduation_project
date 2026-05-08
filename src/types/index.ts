// 全局类型定义文件

// 用户相关类型
export interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'teacher' | 'student'
  email?: string
  className?: string
  studentNo?: string
  createdAt?: string
}

// 登录表单类型
export interface LoginForm {
  username: string
  password: string
}

// 登录响应类型
export interface LoginResponse {
  code: number
  data: {
    menuList: MenuItem[]
    token: string
    role: string
    message: string
  }
}

// 菜单项类型
export interface MenuItem {
  path: string
  name: string
  label: string
  icon: string
  url?: string
  children?: MenuItem[]
}

// 统计数据卡片类型
export interface StatCard {
  name: string
  value: number | string
  icon: string
  color: string
}

// 班级成绩表格数据类型
export interface ClassScore {
  className: string
  avgScore: number
  passRate: string
  excellentRate: string
}

// 表格响应类型
export interface TableResponse {
  code: number
  data: {
    tableData: ClassScore[]
  }
}

// 图表数据类型
export interface ChartData {
  code: number
  data: {
    personalTrend: {
      exams: string[]
      scores: number[]
      subjectScores?: Array<{
        subjects: string[]
        scores: number[]
      }>
    }
    classDistribution: {
      segments: string[]
      counts: number[]
    }
    subjectRadar: {
      subjects: string[]
      scores: number[]
    }
    allExamData?: any
  }
}

// 学生信息类型
export interface Student {
  id: string
  studentNo: string
  name: string
  className: string
  chinese: number
  math: number
  english: number
  total?: number
  rank?: number
}

// 学生列表查询参数
export interface StudentQueryParams {
  name?: string
  className?: string
  page: number
  limit: number
}

// 学生列表响应数据
export interface StudentListData {
  list: Student[]
  total: number
}

// 学生列表响应
export interface StudentListResponse {
  code: number
  data: StudentListData
  message?: string
}

// 标签页类型
export interface Tag {
  path: string
  name: string
  label: string
  icon: string
}

// 搜索表单类型
export interface SearchForm {
  name: string
  className: string
}

// 学生表单类型
export interface StudentForm {
  id: string
  name: string
  studentNo: string
  className: string
  chinese: number
  math: number
  english: number
}

// API响应基础类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

// 分页参数类型
export interface PaginationParams {
  page: number
  limit: number
}

// 分页响应类型
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  limit: number
}

// 申诉相关类型
export interface Appeal {
  id: string
  studentId: string
  studentName?: string
  className?: string
  examName: string
  subject: string
  originalScore: number
  appealedScore?: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt?: string
  processedBy?: string
  processNote?: string
}

// 申诉表单类型
export interface AppealForm {
  examName: string
  subject: string
  originalScore: number
  appealedScore: number
  reason: string
}

// 申诉处理表单
export interface AppealProcessForm {
  status: 'approved' | 'rejected'
  processNote: string
}

// 申诉查询参数
export interface AppealQueryParams {
  studentId?: string
  status?: string
  subject?: string
  page: number
  limit: number
}

// 申诉列表响应
export interface AppealListResponse {
  code: number
  data: {
    list: Appeal[]
    total: number
  }
  message?: string
}

// 成绩类型
export interface Score {
  id: string
  studentId: string
  subject: string
  score: number
  examType: string
  examDate: string
}

// 班级类型
export interface ClassInfo {
  id: string
  name: string
  teacherId?: string
  description?: string
  studentCount?: number
}

// 班级成绩统计相关类型
export interface ScoreDistribution {
  '不及格': number
  '及格': number
  '优秀': number
}

export interface SubjectStat {
  subject: string
  average: number
  distribution: ScoreDistribution
  studentCount: number
}

export interface ClassScoreStats {
  className: string
  exam: string
  stats: SubjectStat[]
  totalStudents: number
}

export interface ClassScoreStatsResponse {
  code: number
  data: ClassScoreStats
}

// 学生成绩详情类型
export interface StudentScore {
  id: string
  studentNo: string
  name: string
  className: string
  currentExamScores: Record<string, number>
  totalScore: number
  rank: number
}