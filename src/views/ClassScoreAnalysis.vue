<template>
  <div class="class-score-analysis">
    <el-card class="analysis-card">
      <div class="card-header">
        <h3>班级成绩分析</h3>
        <p>深入分析班级各科成绩分布与趋势</p>
      </div>

      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select v-model="selectedClass" placeholder="选择班级" style="width: 100%">
              <el-option label="高三(1)班" value="class1" />
              <el-option label="高三(2)班" value="class2" />
              <el-option label="高三(3)班" value="class3" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="selectedExam" placeholder="选择考试" style="width: 100%">
              <el-option label="一模" value="mock1" />
              <el-option label="二模" value="mock2" />
              <el-option label="三模" value="mock3" />
              <el-option label="期末考试" value="final" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="loadData">查询</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :span="4" v-for="(subject, index) in subjects" :key="index">
            <el-card class="subject-card">
              <div class="subject-header">
                <h4>{{ subject.name }}</h4>
                <div class="avg-score">{{ subject.average }}<span class="unit">分</span></div>
              </div>
              <div class="distribution">
                <div class="distribution-bar">
                  <div class="segment excellent" :style="{ width: subject.excellentPercent + '%' }"></div>
                  <div class="segment pass" :style="{ width: subject.passPercent + '%' }"></div>
                  <div class="segment fail" :style="{ width: subject.failPercent + '%' }"></div>
                </div>
                <div class="legend">
                  <span class="excellent">优秀 {{ subject.excellent }}人</span>
                  <span class="pass">及格 {{ subject.pass }}人</span>
                  <span class="fail" v-if="subject.fail > 0">不及格 {{ subject.fail }}人</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="chart-section">
        <el-card class="chart-card">
          <h4>成绩分布图表</h4>
          <div class="chart-placeholder">
            <el-icon><Histogram /></el-icon>
            <p>成绩分布统计图表</p>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Histogram } from '@element-plus/icons-vue'

const selectedClass = ref('class1')
const selectedExam = ref('final')

const subjects = ref([
  {
    name: '语文',
    average: 115.6,
    excellent: 35,
    pass: 8,
    fail: 2,
    excellentPercent: 78,
    passPercent: 18,
    failPercent: 4
  },
  {
    name: '数学',
    average: 108.3,
    excellent: 28,
    pass: 12,
    fail: 5,
    excellentPercent: 62,
    passPercent: 27,
    failPercent: 11
  },
  {
    name: '英语',
    average: 102.8,
    excellent: 27,
    pass: 15,
    fail: 3,
    excellentPercent: 60,
    passPercent: 33,
    failPercent: 7
  },
  {
    name: '物理',
    average: 78.5,
    excellent: 17,
    pass: 20,
    fail: 8,
    excellentPercent: 38,
    passPercent: 44,
    failPercent: 18
  },
  {
    name: '化学',
    average: 82.1,
    excellent: 21,
    pass: 18,
    fail: 6,
    excellentPercent: 47,
    passPercent: 40,
    failPercent: 13
  },
  {
    name: '生物',
    average: 85.7,
    excellent: 25,
    pass: 16,
    fail: 4,
    excellentPercent: 56,
    passPercent: 36,
    failPercent: 9
  }
])

const loadData = () => {
  console.log('加载数据:', selectedClass.value, selectedExam.value)
  // 这里可以添加实际的数据加载逻辑
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="less">
.class-score-analysis {
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

    .filter-section {
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .stats-section {
      margin-bottom: 30px;

      .subject-card {
        height: 180px;

        .subject-header {
          text-align: center;
          margin-bottom: 15px;

          h4 {
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
          }

          .avg-score {
            font-size: 24px;
            font-weight: bold;
            color: #409EFF;

            .unit {
              font-size: 14px;
              color: #666;
              margin-left: 2px;
            }
          }
        }

        .distribution {
          .distribution-bar {
            height: 8px;
            background-color: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            margin-bottom: 10px;

            .segment {
              height: 100%;

              &.excellent {
                background-color: #67c23a;
              }

              &.pass {
                background-color: #e6a23c;
              }

              &.fail {
                background-color: #f56c6c;
              }
            }
          }

          .legend {
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 12px;

            span {
              color: #666;
            }
          }
        }
      }
    }

    .chart-section {
      .chart-card {
        height: 400px;

        h4 {
          margin-bottom: 20px;
          color: #333;
        }

        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #909399;

          .el-icon {
            font-size: 64px;
            margin-bottom: 15px;
          }

          p {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>