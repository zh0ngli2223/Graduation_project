<template>
  <div class="my-appeals">
    <el-card class="appeals-card">
      <template #header>
        <div class="card-header">
          <span>我的申诉记录</span>
          <el-button type="primary" @click="goToSubmit">+ 新建申诉</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8" :md="6">
            <el-select v-model="searchForm.status" placeholder="申诉状态" clearable style="width: 100%" @change="handleSearch">
              <el-option label="全部状态" value="" />
              <el-option label="待处理" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6">
            <el-select v-model="searchForm.subject" placeholder="选择科目" clearable style="width: 100%" @change="handleSearch">
              <el-option label="全部科目" value="" />
              <el-option label="语文" value="语文" />
              <el-option label="数学" value="数学" />
              <el-option label="英语" value="英语" />
              <el-option label="物理" value="物理" />
              <el-option label="化学" value="化学" />
              <el-option label="生物" value="生物" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6">
            <el-input v-model="searchForm.examName" placeholder="考试名称" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" class="search-btn-col">
            <div class="search-btns">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 申诉列表表格 -->
      <el-table :data="appeals" border style="width: 100%" v-loading="loading" stripe>
        <el-table-column prop="examName" label="考试名称" width="120" align="center" />
        <el-table-column prop="subject" label="科目" width="100" align="center" />
        <el-table-column prop="originalScore" label="原成绩" width="100" align="center" />
        <el-table-column prop="appealedScore" label="申诉成绩" width="100" align="center" />
        <el-table-column prop="reason" label="申诉理由" show-overflow-tooltip min-width="200" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" effect="plain">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="180" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="处理时间" width="180" align="center">
          <template #default="scope">
            {{ scope.row.updatedAt ? formatDate(scope.row.updatedAt) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 申诉详情对话框 -->
      <el-dialog title="申诉详情" v-model="detailDialogVisible" width="500px">
        <div v-if="selectedAppeal" class="appeal-detail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="考试名称">{{ selectedAppeal.examName }}</el-descriptions-item>
            <el-descriptions-item label="科目">{{ selectedAppeal.subject }}</el-descriptions-item>
            <el-descriptions-item label="原成绩">{{ selectedAppeal.originalScore }}分</el-descriptions-item>
            <el-descriptions-item label="申诉成绩">{{ selectedAppeal.appealedScore }}分</el-descriptions-item>
            <el-descriptions-item label="申诉理由">{{ selectedAppeal.reason }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(selectedAppeal.status)" effect="plain">
                {{ getStatusText(selectedAppeal.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ formatDate(selectedAppeal.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="处理时间">{{ selectedAppeal.updatedAt ? formatDate(selectedAppeal.updatedAt) : '-' }}</el-descriptions-item>
            <el-descriptions-item label="处理备注">{{ selectedAppeal.processNote || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { Appeal } from '@/types'
import { useApi, safeApiCall } from '@/utils/api'

const router = useRouter()
const api = useApi()

// 数据状态
const appeals = ref<Appeal[]>([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  status: '',
  subject: '',
  examName: ''
})

// 详情对话框
const detailDialogVisible = ref(false)
const selectedAppeal = ref<Appeal | null>(null)

// 加载申诉列表
const loadMyAppeals = async () => {
  loading.value = true
  try {
    const params = {
      status: searchForm.status,
      subject: searchForm.subject,
      examName: searchForm.examName,
      page: currentPage.value,
      limit: pageSize.value
    }

    const res = await safeApiCall(api.getMyAppeals(params))
    if (res?.code === 200) {
      appeals.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      appeals.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载申诉列表失败:', error)
    ElMessage.error('加载申诉列表失败')
    appeals.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 跳转到申诉提交页面
const goToSubmit = () => {
  router.push('/appeal-submit')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadMyAppeals()
}

// 重置搜索
const resetSearch = () => {
  searchForm.status = ''
  searchForm.subject = ''
  searchForm.examName = ''
  currentPage.value = 1
  loadMyAppeals()
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadMyAppeals()
}

// 查看详情
const viewDetail = (appeal: Appeal) => {
  selectedAppeal.value = appeal
  detailDialogVisible.value = true
}

// 状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    case 'pending': return 'warning'
    default: return 'info'
  }
}

// 状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'approved': return '已通过'
    case 'rejected': return '已驳回'
    case 'pending': return '待处理'
    default: return '未知状态'
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(() => {
  loadMyAppeals()
  // 设置自动刷新，每30秒刷新一次数据
  const refreshInterval = setInterval(() => {
    loadMyAppeals()
  }, 30000)

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
})
</script>

<style scoped>
.my-appeals {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.appeals-card {
  border-radius: 8px;
}

.appeals-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.search-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-btn-col {
  display: flex;
  align-items: flex-end;
}

@media (max-width: 768px) {
  .search-btn-col {
    margin-top: 10px;
  }

  .search-btns {
    justify-content: flex-start;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.appeal-detail {
  padding: 10px;
}

/* 表格样式优化 */
:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}
</style>