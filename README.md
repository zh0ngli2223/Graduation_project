# 成绩分析与追踪平台 (Graduation Project)

使用Claude辅助优化的Vue 3后台管理系统 - 学生成绩分析平台

基于Vue 3 + TypeScript + Element Plus + Vite构建的现代化成绩管理系统，支持多角色权限管理（管理员、教师、学生）。

## 项目特性

- 🔐 基于角色的权限控制系统
- 📊 丰富的数据可视化图表（ECharts）
- 🎨 现代化的UI设计（Element Plus）
- 📱 响应式布局设计
- 🔄 实时数据更新
- 📈 成绩趋势分析与追踪

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **数据可视化**: ECharts
- **HTTP请求**: Axios
- **模拟数据**: Mock.js

## 推荐开发环境

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用Vetur)。

## TypeScript 支持

TypeScript默认无法处理`.vue`导入的类型信息，因此我们用`vue-tsc`替换`tsc`进行类型检查。在编辑器中，我们需要[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)让TypeScript语言服务识别`.vue`类型。

## 项目设置

```sh
npm install
```

### 开发环境编译和热重载

```sh
npm run dev
```

### 生产环境类型检查、编译和压缩

```sh
npm run build
```

### 项目结构

```
src/
├── api/           # API接口和模拟数据
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
├── stores/        # 状态管理
└── views/         # 页面组件
```

## 用户角色

1. **管理员(admin)** - 完整权限，可管理所有功能
2. **教师(teacher)** - 可查看成绩、班级分析、处理申诉
3. **学生(student)** - 仅可查看个人分析和提交申诉

## 主要功能模块

- 用户认证与权限管理
- 仪表板数据展示
- 学生信息管理
- 成绩分析与可视化
- 申诉处理系统
- 报告生成功能
