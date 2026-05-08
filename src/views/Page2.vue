<template>
  <div class="appeal-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>申诉处理管理</span>
          <div class="header-stats">
            <el-tag type="info" effect="plain">总计: {{ total }}</el-tag>
            <el-tag type="warning" effect="plain">待处理: {{ pendingCount }}</el-tag>
            <el-tag type="success" effect="plain">已通过: {{ approvedCount }}</el-tag>
            <el-tag type="danger" effect="plain">已驳回: {{ rejectedCount }}</el-tag>
          </div>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="6" :md="4">
            <el-input v-model="searchForm.studentName" placeholder="学生姓名" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
          </el-col>
          <el-col :xs="24" :sm="6" :md="4">
            <el-select v-model="searchForm.status" placeholder="申诉状态" clearable style="width: 100%" @change="handleSearch">
              <el-option label="全部状态" value="" />
              <el-option label="待处理" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="6" :md="4">
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
          <el-col :xs="24" :sm="6" :md="4">
            <el-input v-model="searchForm.examName" placeholder="考试名称" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" class="search-btn-col">
            <div class="search-btns">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
              <el-button type="success" @click="batchApprove" :disabled="!hasSelection">批量通过</el-button>
              <el-button type="danger" @click="batchReject" :disabled="!hasSelection">批量驳回</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 申诉列表表格 -->
      <el-table
        :data="appealList"
        border
        style="width: 100%"
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="(row: Appeal) => row.status === 'pending'" />
        <el-table-column prop="studentName" label="学生姓名" width="100" align="center" />
        <el-table-column prop="className" label="班级" width="120" align="center" />
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
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                v-if="scope.row.status === 'pending'"
                size="small"
                type="success"
                @click="handleAppeal(scope.row, 'approve')"
              >
                通过
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending'"
                size="small"
                type="danger"
                @click="handleAppeal(scope.row, 'reject')"
              >
                驳回
              </el-button>
              <el-button
                size="small"
                @click="viewDetail(scope.row)"
              >
                详情
              </el-button>
            </div>
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
      <el-dialog title="申诉详情" v-model="detailDialogVisible" width="600px">
        <div v-if="selectedAppeal" class="appeal-detail">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="学生姓名">{{ selectedAppeal.studentName }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{ selectedAppeal.className }}</el-descriptions-item>
            <el-descriptions-item label="考试名称">{{ selectedAppeal.examName }}</el-descriptions-item>
            <el-descriptions-item label="科目">{{ selectedAppeal.subject }}</el-descriptions-item>
            <el-descriptions-item label="原成绩">{{ selectedAppeal.originalScore }}分</el-descriptions-item>
            <el-descriptions-item label="申诉成绩">{{ selectedAppeal.appealedScore }}分</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(selectedAppeal.status)" effect="plain">
                {{ getStatusText(selectedAppeal.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ formatDate(selectedAppeal.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="处理时间">{{ selectedAppeal.updatedAt ? formatDate(selectedAppeal.updatedAt) : '-' }}</el-descriptions-item>
          </el-descriptions>
          <div class="reason-section">
            <h4>申诉理由：</h4>
            <p class="reason-text">{{ selectedAppeal.reason }}</p>
          </div>
          <div v-if="selectedAppeal.processNote" class="note-section">
            <h4>处理备注：</h4>
            <p class="note-text">{{ selectedAppeal.processNote }}</p>
          </div>

          <!-- 快速处理按钮 -->
          <div v-if="selectedAppeal.status === 'pending'" class="quick-actions">
            <el-button type="success" @click="quickProcess('approve')">快速通过</el-button>
            <el-button type="danger" @click="quickProcess('reject')">快速驳回</el-button>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Appeal } from '@/types'
import { useApi, safeApiCall } from '@/utils/api'

const api = useApi()

// 数据状态
const appealList = ref<Appeal[]>([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const selectedRows = ref<Appeal[]>([])

// 搜索表单
const searchForm = reactive({
  studentName: '',
  status: '',
  subject: '',
  examName: ''
})

// 详情对话框
const detailDialogVisible = ref(false)
const selectedAppeal = ref<Appeal | null>(null)

// 计算属性 - 统计数据
const pendingCount = computed(() => appealList.value.filter(item => item.status === 'pending').length)
const approvedCount = computed(() => appealList.value.filter(item => item.status === 'approved').length)
const rejectedCount = computed(() => appealList.value.filter(item => item.status === 'rejected').length)
const hasSelection = computed(() => selectedRows.value.length > 0)

// 加载申诉列表
const loadAppeals = async () => {
  loading.value = true
  try {
    const params = {
      studentName: searchForm.studentName,
      status: searchForm.status,
      subject: searchForm.subject,
      examName: searchForm.examName,
      page: currentPage.value,
      limit: pageSize.value
    }

    const res = await safeApiCall(api.getAppealList(params))
    if (res?.code === 200) {
      appealList.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      appealList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载申诉列表失败:', error)
    ElMessage.error('加载申诉列表失败')
    appealList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理申诉
const handleAppeal = async (appeal: Appeal, action: 'approve' | 'reject') => {
  const actionText = action === 'approve' ? '通过' : '驳回'

  ElMessageBox.confirm(
    `确认要${actionText}该申诉吗？`,
    '确认操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await safeApiCall(api.processAppeal({
        id: appeal.id,
        status: action === 'approve' ? 'approved' : 'rejected',
        processNote: `${actionText}申诉 - 管理员处理`
      }))

      if (res?.code === 200) {
        ElMessage.success(`申诉已${actionText}`)
        // 更新本地状态
        appeal.status = action === 'approve' ? 'approved' : 'rejected'
        appeal.updatedAt = new Date().toISOString()
      } else {
        ElMessage.error(`${actionText}失败`)
      }
    } catch (error) {
      console.error(`${actionText}申诉失败:`, error)
      ElMessage.error(`${actionText}失败，请稍后重试`)
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量处理
const batchApprove = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要处理的申诉')
    return
  }

  ElMessageBox.confirm(
    `确认要批量通过选中的 ${selectedRows.value.length} 条申诉吗？`,
    '确认操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      for (const appeal of selectedRows.value) {
        if (appeal.status === 'pending') {
          await safeApiCall(api.processAppeal({
            id: appeal.id,
            status: 'approved',
            processNote: '批量通过申诉 - 管理员处理'
          }))
          appeal.status = 'approved'
          appeal.updatedAt = new Date().toISOString()
        }
      }
      ElMessage.success('批量通过成功')
      selectedRows.value = []
    } catch (error) {
      ElMessage.error('批量处理失败')
    }
  })
}

const batchReject = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要处理的申诉')
    return
  }

  ElMessageBox.confirm(
    `确认要批量驳回选中的 ${selectedRows.value.length} 条申诉吗？`,
    '确认操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      for (const appeal of selectedRows.value) {
        if (appeal.status === 'pending') {
          await safeApiCall(api.processAppeal({
            id: appeal.id,
            status: 'rejected',
            processNote: '批量驳回申诉 - 管理员处理'
          }))
          appeal.status = 'rejected'
          appeal.updatedAt = new Date().toISOString()
        }
      }
      ElMessage.success('批量驳回成功')
      selectedRows.value = []
    } catch (error) {
      ElMessage.error('批量处理失败')
    }
  })
}

// 快速处理（在详情对话框中）
const quickProcess = async (action: 'approve' | 'reject') => {
  if (!selectedAppeal.value) return

  const actionText = action === 'approve' ? '通过' : '驳回'

  try {
    const res = await safeApiCall(api.processAppeal({
      id: selectedAppeal.value.id,
      status: action === 'approve' ? 'approved' : 'rejected',
      processNote: `${actionText}申诉 - 快速处理`
    }))

    if (res?.code === 200) {
      ElMessage.success(`申诉已${actionText}`)
      selectedAppeal.value.status = action === 'approve' ? 'approved' : 'rejected'
      selectedAppeal.value.updatedAt = new Date().toISOString()

      // 更新列表中的数据
      const listItem = appealList.value.find(item => item.id === selectedAppeal.value?.id)
      if (listItem) {
        listItem.status = selectedAppeal.value.status
        listItem.updatedAt = selectedAppeal.value.updatedAt
      }

      detailDialogVisible.value = false
    }
  } catch (error) {
    ElMessage.error(`${actionText}失败`)
  }
}

// 选择变化
const handleSelectionChange = (val: Appeal[]) => {
  selectedRows.value = val
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadAppeals()
}

// 重置搜索
const resetSearch = () => {
  searchForm.studentName = ''
  searchForm.status = ''
  searchForm.subject = ''
  searchForm.examName = ''
  currentPage.value = 1
  loadAppeals()
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadAppeals()
}

// 查看详情
const viewDetail = (appeal: Appeal) => {
  selectedAppeal.value = { ...appeal }
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
  loadAppeals()
  // 设置自动刷新，每30秒刷新一次数据
  const refreshInterval = setInterval(() => {
    loadAppeals()
  }, 30000)

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
})
</script>

<style scoped>
.appeal-management {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.management-card {
  border-radius: 8px;
}

.management-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.header-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.header-stats .el-tag {
  font-weight: 500;
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

  .header-stats {
    margin-top: 10px;
  }
}

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.appeal-detail {
  padding: 10px;
}

.reason-section, .note-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.reason-section h4, .note-section h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
}

.reason-text, .note-text {
  margin: 0;
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
}

.quick-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 表格样式优化 */
:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}

:deep(.el-table__row .el-table__cell) {
  padding: 12px 0;
}
</style>