<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>手动录入成绩</span>
          </template>
          <el-form :model="form" label-width="80px">
            <el-form-item label="学生姓名">
              <el-select v-model="form.studentId" filterable placeholder="请选择">
                <el-option v-for="item in studentOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="考试名称">
              <el-input v-model="form.examName" />
            </el-form-item>
            <el-form-item label="语文">
              <el-input-number v-model="form.chinese" :min="0" :max="150" />
            </el-form-item>
            <el-form-item label="数学">
              <el-input-number v-model="form.math" :min="0" :max="150" />
            </el-form-item>
            <el-form-item label="英语">
              <el-input-number v-model="form.english" :min="0" :max="150" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitScore">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>批量导入成绩</span>
          </template>
          <el-upload class="upload-demo" drag action="#" :before-upload="handleUpload" accept=".xlsx,.xls">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传 Excel 文件，包含学生学号、姓名、语文、数学、英语等字段
              </div>
            </template>
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import * as XLSX from 'xlsx'  // 需要安装 xlsx

  const form = ref({
    studentId: '',
    examName: '',
    chinese: 0,
    math: 0,
    english: 0
  })
  const studentOptions = ref([])

  onMounted(async () => {
    // 获取学生列表用于选择
    // 这里可以调用接口获取简化的学生列表
  })

  const submitScore = () => {
    // 调用成绩录入接口
    ElMessage.success('成绩录入成功')
  }

  const handleUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)
      console.log('导入数据', json)
      // 调用批量导入接口
      ElMessage.success(`成功导入 ${json.length} 条数据`)
    }
    reader.readAsArrayBuffer(file)
    return false // 阻止自动上传
  }
</script>