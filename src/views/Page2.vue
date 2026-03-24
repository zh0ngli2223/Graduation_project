<template>
  <div>
    <el-table :data="appealList" border>
      <el-table-column prop="studentName" label="学生姓名" />
      <el-table-column prop="examName" label="考试名称" />
      <el-table-column prop="subject" label="科目" />
      <el-table-column prop="originalScore" label="原成绩" />
      <el-table-column prop="appealReason" label="申诉理由" show-overflow-tooltip />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === '已处理' ? 'success' : 'warning'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button v-if="scope.row.status === '待处理'" size="small" type="success"
            @click="handleApprove(scope.row)">通过</el-button>
          <el-button v-if="scope.row.status === '待处理'" size="small" type="danger"
            @click="handleReject(scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { Appeal } from '@/types'

  const appealList = ref<Appeal[]>([
    {
      id: '1',
      studentId: '001',
      subject: '数学',
      originalScore: 85,
      appealedScore: 90,
      reason: '感觉分数计算有误',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ])

  const handleApprove = (row: Appeal) => {
    row.status = 'approved'
    ElMessage.success('申诉已通过')
  }

  const handleReject = (row: Appeal) => {
    row.status = 'rejected'
    ElMessage.warning('申诉已驳回')
  }
</script>