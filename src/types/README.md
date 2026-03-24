# TypeScript 类型定义文档

本项目使用TypeScript进行类型检查，提供了完整的类型定义来确保代码质量和开发体验。

## 类型文件结构

```
src/types/
├── index.ts          # 主要的数据类型定义
├── api.ts            # API相关的类型定义
├── global.d.ts       # 全局类型声明
└── README.md         # 本文档
```

## 主要类型定义

### 用户相关类型

```typescript
// 用户信息
interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'teacher' | 'student'
  email?: string
  className?: string
  studentNo?: string
}

// 登录表单
interface LoginForm {
  username: string
  password: string
}

// 登录响应
interface LoginResponse {
  code: number
  data: {
    menuList: MenuItem[]
    token: string
    role: string
    message: string
  }
}
```

### 数据展示类型

```typescript
// 统计数据卡片
interface StatCard {
  name: string
  value: number | string
  icon: string
  color: string
}

// 班级成绩数据
interface ClassScore {
  className: string
  avgScore: number
  passRate: string
  excellentRate: string
}

// 学生信息
interface Student {
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
```

### 组件相关类型

```typescript
// 菜单项
interface MenuItem {
  path: string
  name: string
  label: string
  icon: string
  url?: string
  children?: MenuItem[]
}

// 标签页
interface Tag {
  path: string
  name: string
  label: string
  icon: string
}
```

### API相关类型

```typescript
// API实例接口
interface ApiInstance {
  getTableData(): Promise<TableResponse>
  getCountData(): Promise<ApiResponse<StatCard[]>>
  getChartData(): Promise<ChartData>
  getUserList(data: StudentQueryParams): Promise<StudentListResponse>
  // ... 其他API方法
}
```

## 使用示例

### 在Vue组件中使用

```typescript
<script setup lang="ts">
import type { Student, StudentForm } from '@/types'

const students = ref<Student[]>([])
const form = reactive<StudentForm>({
  id: '',
  name: '',
  studentNo: '',
  className: '',
  chinese: 0,
  math: 0,
  english: 0
})

// API调用
const loadStudents = async () => {
  try {
    const res = await proxy!.$api.getUserList({
      page: 1,
      limit: 10
    })
    students.value = res.list
  } catch (error) {
    console.error('加载学生列表失败:', error)
  }
}
</script>
```

### 在Store中使用

```typescript
import type { MenuItem, Tag } from '@/types'

interface AppState {
  isShow: boolean
  tags: Tag[]
  currentMenu: MenuItem | null
  menuList: MenuItem[]
  token: string
  role: string
}

const state = ref<AppState>({
  // ... 初始状态
})
```

## 类型安全最佳实践

1. **避免使用any类型** - 尽量为所有变量和函数参数指定具体类型
2. **使用联合类型** - 对于有限的选择，使用联合类型而不是string
3. **合理使用可选属性** - 使用`?`标记可选属性
4. **使用类型断言谨慎** - 尽量避免使用`as any`
5. **充分利用接口继承** - 对于相似的类型，使用接口继承减少重复代码

## 常见类型问题解决

### 1. 组件实例类型

```typescript
// ❌ 不推荐
const { proxy } = getCurrentInstance()

// ✅ 推荐
const { proxy } = getCurrentInstance()
if (proxy) {
  const res = await proxy.$api.getUserList(params)
}
```

### 2. Ref类型定义

```typescript
// ❌ 不推荐
const data = ref([])

// ✅ 推荐
const data = ref<Student[]>([])
```

### 3. 事件处理类型

```typescript
// ❌ 不推荐
const handleClick = (event) => {}

// ✅ 推荐
const handleClick = (event: MouseEvent) => {}
```

## 类型检查配置

项目已启用严格的TypeScript检查：
- `strict: true` - 启用所有严格类型检查选项
- `noImplicitAny: true` - 禁止隐式的any类型
- `strictNullChecks: true` - 启用严格的null检查

运行类型检查：
```bash
npm run type-check
```