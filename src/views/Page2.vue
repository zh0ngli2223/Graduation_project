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

<script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const appealList = ref([
    {
      id: 1,
      studentName: '张三',
      examName: '一模',
      subject: '数学',
      originalScore: 85,
      appealReason: '感觉分数计算有误',
      status: '待处理'
    },
    // 更多模拟数据...
  ])

  const handleApprove = (row) => {
    row.status = '已处理'
    ElMessage.success('申诉已通过')
  }
  const handleReject = (row) => {
    row.status = '已驳回'
    ElMessage.warning('申诉已驳回')
  }
</script>