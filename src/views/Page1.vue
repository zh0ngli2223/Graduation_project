<template>
  <div class="class-analysis">
    <el-card class="analysis-card">
      <div class="card-header">
        <h3>班级分析报告</h3>
        <p>详细的班级成绩分析与统计</p>
      </div>

      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <h4>班级整体表现</h4>
              <div class="chart-placeholder">
                <el-icon><DataAnalysis /></el-icon>
                <p>班级整体成绩分析图表</p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="chart-card">
              <h4>学科对比分析</h4>
              <div class="chart-placeholder">
                <el-icon><TrendCharts /></el-icon>
                <p>各学科成绩对比图表</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card class="table-card">
              <h4>学生成绩详情</h4>
              <el-table :data="studentData" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="100" />
                <el-table-column prop="chinese" label="语文" width="80" />
                <el-table-column prop="math" label="数学" width="80" />
                <el-table-column prop="english" label="英语" width="80" />
                <el-table-column prop="physics" label="物理" width="80" />
                <el-table-column prop="chemistry" label="化学" width="80" />
                <el-table-column prop="biology" label="生物" width="80" />
                <el-table-column prop="total" label="总分" width="80" />
                <el-table-column prop="rank" label="排名" width="80" />
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataAnalysis, TrendCharts } from '@element-plus/icons-vue'

const studentData = ref([
  {
    name: '张三',
    chinese: 125,
    math: 138,
    english: 122,
    physics: 85,
    chemistry: 88,
    biology: 92,
    total: 650,
    rank: 1
  },
  {
    name: '李四',
    chinese: 118,
    math: 135,
    english: 119,
    physics: 82,
    chemistry: 85,
    biology: 89,
    total: 628,
    rank: 2
  },
  {
    name: '王五',
    chinese: 115,
    math: 128,
    english: 116,
    physics: 78,
    chemistry: 82,
    biology: 86,
    total: 605,
    rank: 3
  }
])

onMounted(() => {
  // 这里可以添加数据加载逻辑
  console.log('班级分析页面已加载')
})
</script>

<style scoped lang="less">
.class-analysis {
  padding: 20px;

  .analysis-card {
    min-height: calc(100vh - 40px);

    .card-header {
      text-align: center;
      margin-bottom: 30px;

      h3 {
        font-size: 24px;
        color: #409EFF;
        margin-bottom: 10px;
      }

      p {
        color: #666;
        font-size: 14px;
      }
    }

    .analysis-content {
      .chart-card {
        height: 300px;

        h4 {
          margin-bottom: 20px;
          color: #333;
        }

        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #909399;

          .el-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }

          p {
            font-size: 14px;
          }
        }
      }

      .table-card {
        h4 {
          margin-bottom: 20px;
          color: #333;
        }
      }
    }
  }
}
</style>