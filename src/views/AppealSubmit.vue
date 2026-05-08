<template>
  <div class="appeal-submit">
    <el-card class="appeal-card">
      <template #header>
        <div class="card-header">
          <span>成绩申诉申请</span>
        </div>
      </template>

      <el-form :model="appealForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="考试名称" prop="examName">
          <el-select v-model="appealForm.examName" placeholder="请选择考试" style="width: 100%">
            <el-option label="一模" value="一模" />
            <el-option label="二模" value="二模" />
            <el-option label="三模" value="三模" />
            <el-option label="期末" value="期末" />
          </el-select>
        </el-form-item>

        <el-form-item label="科目" prop="subject">
          <el-select v-model="appealForm.subject" placeholder="请选择科目" style="width: 100%">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="物理" value="物理" />
            <el-option label="化学" value="化学" />
            <el-option label="生物" value="生物" />
          </el-select>
        </el-form-item>

        <el-form-item label="原成绩" prop="originalScore">
          <el-input-number v-model="appealForm.originalScore" :min="0" :max="150" :disabled="true"
            style="width: 100%" />
          <span class="score-tip">系统自动获取您的考试成绩</span>
        </el-form-item>

        <el-form-item label="申诉成绩" prop="appealedScore">
          <el-input-number v-model="appealForm.appealedScore" :min="0" :max="150" style="width: 100%" />
        </el-form-item>

        <el-form-item label="申诉理由" prop="reason">
          <el-input v-model="appealForm.reason" type="textarea" :rows="4"
            placeholder="请详细说明申诉理由，如：答题卡填涂错误、分数计算错误、漏批题目等" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAppeal" :loading="submitting">
            提交申诉
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 申诉说明 -->
    <el-card class="notice-card">
      <template #header>
        <div class="card-header">
          <span>申诉说明</span>
        </div>
      </template>
      <div class="notice-content">
        <h4>申诉流程：</h4>
        <ol>
          <li>填写申诉申请表单，详细说明申诉理由</li>
          <li>提交后，教师将在3个工作日内处理</li>
          <li>处理结果将通过系统通知告知</li>
          <li>如对处理结果有异议，可联系教务处</li>
        </ol>

        <h4>注意事项：</h4>
        <ul>

          <li>请提供充分的申诉理由和相关证据</li>
          <li>恶意申诉将影响个人诚信记录</li>

        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import type { AppealForm } from '@/types'
  import { useApi, safeApiCall } from '@/utils/api'

  const api = useApi()
  const router = useRouter()

  // 学生成绩数据
  const studentScores = ref<any[]>([])
  const loading = ref(false)
  const formRef = ref()
  const submitting = ref(false)

  const appealForm = reactive<AppealForm>({
    examName: '',
    subject: '',
    originalScore: 0,
    appealedScore: 0,
    reason: ''
  })

  // 根据选择的考试和科目，自动获取原成绩（这里模拟）
  watch([() => appealForm.examName, () => appealForm.subject], ([exam, subject]) => {
    if (exam && subject) {
      // 模拟获取原成绩
      appealForm.originalScore = Math.floor(Math.random() * 50) + 70 // 70-120分
      appealForm.appealedScore = appealForm.originalScore + 5 // 默认申诉成绩比原成绩高5分
    }
  })

  const rules = {
    examName: [{ required: true, message: '请选择考试', trigger: 'change' }],
    subject: [{ required: true, message: '请选择科目', trigger: 'change' }],
    appealedScore: [
      { required: true, message: '请输入申诉成绩', trigger: 'blur' },
      { type: 'number', min: 0, max: 150, message: '成绩范围0-150分', trigger: 'blur' }
    ],
    reason: [
      { required: true, message: '请输入申诉理由', trigger: 'blur' },
      { min: 10, max: 500, message: '申诉理由至少10个字符，最多500个字符', trigger: 'blur' }
    ]
  }

  const submitAppeal = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        submitting.value = true
        try {
          const res = await safeApiCall(
            api.submitAppeal(appealForm),
            '申诉提交失败'
          )

          if (res && res.code === 200) {
            ElMessage.success(res.message || '申诉提交成功，请耐心等待处理结果')
            resetForm()
            // 延迟跳转到我的申诉页面
            setTimeout(() => {
              router.push('/myAppeals')
            }, 1500)
          } else {
            ElMessage.error(res?.message || '申诉提交失败')
          }
        } catch (error) {
          ElMessage.error('申诉提交失败，请稍后重试')
        } finally {
          submitting.value = false
        }
      }
    })
  }

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  // 获取学生成绩数据
  const loadStudentScores = async () => {
    loading.value = true
    try {
      const res = await safeApiCall(api.getChartData())
      if (res?.code === 200 && res.data.personalTrend) {
        studentScores.value = res.data.personalTrend.subjectScores || []
      }
    } catch (error) {
      console.error('获取成绩数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 根据选择的考试和科目自动填充原成绩
  const updateOriginalScore = () => {
    if (appealForm.examName && appealForm.subject) {
      const examIndex = ['一模', '二模', '三模', '期末'].indexOf(appealForm.examName)
      if (examIndex !== -1 && studentScores.value[examIndex]) {
        const subjectIndex = studentScores.value[examIndex].subjects.indexOf(appealForm.subject)
        if (subjectIndex !== -1) {
          appealForm.originalScore = studentScores.value[examIndex].scores[subjectIndex]
        }
      }
    }
  }

  // 监听考试和科目变化
  watch([() => appealForm.examName, () => appealForm.subject], updateOriginalScore)

  // 初始化
  onMounted(() => {
    loadStudentScores()
  })
</script>

<style scoped>
  .appeal-submit {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .appeal-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .score-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
  }

  .notice-card {
    background-color: #f8f9fa;
  }

  .notice-content {
    line-height: 1.8;
  }

  .notice-content h4 {
    color: #409EFF;
    margin: 15px 0 10px 0;
  }

  .notice-content ol,
  .notice-content ul {
    padding-left: 20px;
    margin: 10px 0;
  }

  .notice-content li {
    margin: 8px 0;
    color: #606266;
  }

  @media (max-width: 768px) {
    .appeal-submit {
      padding: 10px;
    }
  }
</style>