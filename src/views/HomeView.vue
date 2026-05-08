<template>
  <div class="home">
    <!-- 班级成绩分析 (仅老师和管理员可见) -->
    <div v-if="!isStudent" class="class-score-analysis">
      <!-- 班级成绩分析控制面板 -->
      <el-card class="selection-card modern-card">
        <div class="selection-header">
          <div class="header-left">
            <h3 class="analysis-title">📊 班级成绩分析</h3>
            <p class="analysis-subtitle">查看班级各科目平均分情况</p>
          </div>
          <div class="selection-controls">
            <el-select v-model="selectedClass" placeholder="选择班级" style="width: 160px" @change="loadAnalysisData" class="modern-select">
              <el-option label="全部班级" value="" />
              <el-option v-for="className in classList" :key="className" :label="className" :value="className" />
            </el-select>
            <el-select v-model="selectedExam" placeholder="选择考试" style="width: 130px" @change="loadAnalysisData" class="modern-select">
              <el-option v-for="(exam, index) in examList" :key="exam" :label="exam" :value="index" />
            </el-select>
          </div>
        </div>

        <!-- 当前选择信息 -->
        <div class="current-selection" v-if="statsData">
          <div class="selection-info modern-info">
            <span class="info-badge">班级分析</span>
            <span class="info-value">{{ statsData.className }} - {{ statsData.exam }}</span>
            <span class="info-count">{{ statsData.totalStudents }}名学生</span>
          </div>
        </div>
      </el-card>


      <!-- 统计卡片 -->
      <div v-if="statsData" class="stats-overview modern-stats">
        <h4 class="section-title">📈 各科成绩概览</h4>
        <el-row :gutter="16">
          <el-col :span="4" v-for="stat in statsData.stats" :key="stat.subject">
            <el-card class="subject-stat-card modern-stat-card">
              <div class="stat-header">
                <h4 class="subject-name">{{ stat.subject }}</h4>
                <div class="avg-score modern-avg-score">{{ stat.average }}<span class="score-unit">分</span></div>
              </div>
              <div class="distribution-chart modern-distribution">
                <div class="distribution-bar modern-bar">
                  <div
                    v-if="stat.distribution['不及格'] > 0"
                    class="distribution-segment modern-segment fail"
                    :style="{ width: `${(stat.distribution['不及格'] / stat.studentCount) * 100}%` }"
                    title="不及格"
                  ></div>
                  <div
                    v-if="stat.distribution['及格'] > 0"
                    class="distribution-segment modern-segment pass"
                    :style="{ width: `${(stat.distribution['及格'] / stat.studentCount) * 100}%` }"
                    title="及格"
                  ></div>
                  <div
                    v-if="stat.distribution['优秀'] > 0"
                    class="distribution-segment modern-segment excellent"
                    :style="{ width: `${(stat.distribution['优秀'] / stat.studentCount) * 100}%` }"
                    title="优秀"
                  ></div>
                </div>
                <div class="distribution-labels modern-labels">
                  <div class="grade-summary">
                    <span class="excellent-count">优秀 {{ stat.distribution['优秀'] }}人</span>
                    <span class="pass-count">及格 {{ stat.distribution['及格'] }}人</span>
                    <span class="fail-count" v-if="stat.distribution['不及格'] > 0">不及格 {{ stat.distribution['不及格'] }}人</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row" v-if="isStudent">
      <!-- 语数英图表 -->
      <el-col :span="12">
        <el-card class="chart-card student-chart chinese-math-english">
          <div class="chart-title-section">
            <h4 class="chart-title">📚 语数英成绩</h4>
            <p class="chart-subtitle">满分150分</p>
          </div>
          <div class="grade-legend-small">
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #ff6b6b, #f56c6c);"></div>
                <span class="legend-text">&lt;90</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #ffb347, #e6a23c);"></div>
                <span class="legend-text">90-109</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #4facfe, #409eff);"></div>
                <span class="legend-text">110-129</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #56ffa4, #67c23a);"></div>
                <span class="legend-text">≥130</span>
              </div>
            </div>
          </div>
          <div ref="chineseMathEnglishChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 理化生图表 -->
      <el-col :span="12">
        <el-card class="chart-card student-chart science">
          <div class="chart-title-section">
            <h4 class="chart-title">🔬 理化生成绩</h4>
            <p class="chart-subtitle">满分100分</p>
          </div>
          <div class="grade-legend-small">
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #ff6b6b, #f56c6c);"></div>
                <span class="legend-text">&lt;60</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #ffb347, #e6a23c);"></div>
                <span class="legend-text">60-79</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #4facfe, #409eff);"></div>
                <span class="legend-text">80-89</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: linear-gradient(135deg, #56ffa4, #67c23a);"></div>
                <span class="legend-text">≥90</span>
              </div>
            </div>
          </div>
          <div ref="scienceChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

      <!-- 学生排名分析控制面板 -->
      <el-card class="selection-card modern-card ranking-control-panel">
        <div class="selection-header">
          <div class="header-left">
            <h3 class="analysis-title">🏆 学生排名分析</h3>
            <p class="analysis-subtitle">查看学生各科成绩排名情况</p>
          </div>
          <div class="selection-controls">
            <el-select v-model="rankingClass" placeholder="选择班级" style="width: 160px" @change="loadRankingData" class="modern-select">
              <el-option label="全部班级" value="" />
              <el-option v-for="className in classList" :key="className" :label="className" :value="className" />
            </el-select>
            <el-select v-model="rankingExam" placeholder="选择考试" style="width: 130px" @change="loadRankingData" class="modern-select">
              <el-option v-for="exam in examList" :key="exam" :label="exam" :value="exam" />
            </el-select>
            <el-select v-model="selectedSubject" placeholder="选择科目" style="width: 140px" @change="updateChartsOnSubjectChange" class="modern-select">
              <el-option label="总分排名" value="" />
              <el-option v-for="subject in subjectList" :key="subject" :label="subject" :value="subject" />
            </el-select>
          </div>
        </div>

        <!-- 当前排名分析信息 -->
        <div class="current-selection" v-if="rankingStatsData">
          <div class="selection-info modern-info ranking-info">
            <span class="info-badge ranking-badge">排名分析</span>
            <span class="info-value">{{ rankingStatsData.className }} - {{ rankingStatsData.exam }}</span>
            <span class="info-subject" v-if="selectedSubject">- {{ selectedSubject }}</span>
            <span class="info-count">{{ rankingStatsData.totalStudents }}名学生</span>
          </div>
        </div>
      </el-card>

    <!-- 非学生端的图表 -->
    <el-row :gutter="20" class="chart-row modern-charts" v-if="!isStudent">
      <el-col :span="12">
        <el-card class="chart-card modern-chart-card highest-chart">
          <div class="chart-header">
            <h4 class="chart-title">🏆 最高分学生</h4>
            <p class="chart-subtitle">排名前5的学生</p>
          </div>
          <div ref="highestChart" class="chart-container modern-chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card modern-chart-card lowest-chart">
          <div class="chart-header">
            <h4 class="chart-title">📉 最低分学生</h4>
            <p class="chart-subtitle">排名后5的学生</p>
          </div>
          <div ref="lowestChart" class="chart-container modern-chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick, watch } from 'vue'
  import * as echarts from 'echarts'
  import type { StatCard, ClassScore, ChartData, ClassScoreStatsResponse, StudentScore, ClassScoreStats } from '@/types'
  import { useApi, safeApiCall } from '@/utils/api'
  import { useAllDataStore } from '@/stores'

  const api = useApi()
  const store = useAllDataStore()
  const countData = ref<StatCard[]>([])
  const tableData = ref<ClassScore[]>([])
  const trendChart = ref<HTMLElement | null>(null)
  const distChart = ref<HTMLElement | null>(null)
  const chineseMathEnglishChart = ref<HTMLElement | null>(null)
  const scienceChart = ref<HTMLElement | null>(null)

  const isStudent = store.state.role === 'student'
  const selectedExam = ref(3) // 默认选择最近一次考试（期末）索引
  const chartResponse = ref<ChartData | null>(null) // 存储图表响应数据

  // 班级成绩分析相关变量
  const selectedClass = ref('高三(1)班')  // 默认选择第一个班级
  const selectedSubject = ref('')
  const classList = ref<string[]>([])
  const examList = ref<string[]>([])
  const subjectList = ref<string[]>(['语文', '数学', '英语', '物理', '化学', '生物'])
  const statsData = ref<ClassScoreStats | null>(null)
  const studentScores = ref<StudentScore[]>([])
  const classAvgChart = ref<HTMLElement | null>(null)
  const highLowChart = ref<HTMLElement | null>(null)
  const highestChart = ref<HTMLElement | null>(null)
  const lowestChart = ref<HTMLElement | null>(null)

  // 学生排名分析相关变量
  const rankingClass = ref('高三(1)班')  // 默认选择第一个班级
  const rankingExam = ref('期末')  // 默认选择期末考试
  const rankingStatsData = ref<ClassScoreStats | null>(null)
  const rankingStudentScores = ref<StudentScore[]>([])

  // 处理考试选择变化
  const handleExamChange = () => {
    console.log('考试切换:', selectedExam.value)
    if (chartResponse.value && chartResponse.value.data) {
      const { personalTrend, subjectRadar } = chartResponse.value.data
      console.log('当前考试数据:', personalTrend?.subjectScores?.[Number(selectedExam.value)])
      updateCharts(personalTrend, subjectRadar)
    }
  }

  // 加载班级分析数据
  const loadAnalysisData = async () => {
    try {
      // 获取班级列表
      const classRes = await safeApiCall(api.getClassList())
      if (classRes && classRes.code === 200) {
        classList.value = classRes.data
      }

      // 获取考试列表
      const examRes = await safeApiCall(api.getExamList())
      if (examRes && examRes.code === 200) {
        examList.value = examRes.data
        if (examList.value.length > 0 && selectedExam.value === 3) {
          selectedExam.value = examList.value.length - 1 // 默认选择最后一次考试的索引
        }
      }

      // 如果没有选择考试，使用默认值
      const currentExam = examList.value.length > 0 && selectedExam.value < examList.value.length
        ? examList.value[selectedExam.value]
        : (examList.value.length > 0 ? examList.value[examList.value.length - 1] : '期末')

      // 如果没有选择班级，使用默认值
      const currentClass = selectedClass.value || (classList.value.length > 0 ? classList.value[0] : '高三(1)班')

      // 获取班级统计信息
      const statsRes = await safeApiCall(api.getClassScoreStats({
        className: currentClass,
        exam: currentExam
      }))

      if (statsRes && statsRes.code === 200) {
        statsData.value = statsRes.data
      }

      // 获取学生详细成绩
      const scoresRes = await safeApiCall(api.getStudentScores({
        className: currentClass,
        exam: currentExam
      }))

      if (scoresRes && scoresRes.code === 200) {
        studentScores.value = scoresRes.data.list
      }


    } catch (error) {
      console.error('加载班级分析数据失败:', error)
    }
  }

  // 加载排名分析数据
  const loadRankingData = async () => {
    try {
      // 如果没有选择考试，使用默认值
      const currentExam = rankingExam.value || (examList.value.length > 0 ? examList.value[examList.value.length - 1] : '期末')

      // 如果没有选择班级，使用默认值
      const currentRankingClass = rankingClass.value || (classList.value.length > 0 ? classList.value[0] : '高三(1)班')

      // 获取班级统计信息
      const statsRes = await safeApiCall(api.getClassScoreStats({
        className: currentRankingClass,
        exam: currentExam
      }))

      if (statsRes && statsRes.code === 200) {
        rankingStatsData.value = statsRes.data
      }

      // 获取学生详细成绩
      const scoresRes = await safeApiCall(api.getStudentScores({
        className: currentRankingClass,
        exam: currentExam
      }))

      if (scoresRes && scoresRes.code === 200) {
        rankingStudentScores.value = scoresRes.data.list
      }

      // 更新学生排名图表
      updateHighestChart()
      updateLowestChart()

    } catch (error) {
      console.error('加载排名分析数据失败:', error)
    }
  }

  // 更新图表数据
  const updateCharts = (personalTrend: any, subjectRadar: any) => {
    console.log('updateCharts - selectedExam.value:', selectedExam.value, 'type:', typeof selectedExam.value)
    console.log('updateCharts called with selectedExam:', selectedExam.value)
    console.log('personalTrend data:', personalTrend)

    // 获取当前选择的考试数据
    let currentScores, currentSubjects

    if (personalTrend && personalTrend.subjectScores && personalTrend.subjectScores.length > 0) {
      // 使用新的多考试数据格式
      console.log('Using subjectScores array, length:', personalTrend.subjectScores.length)
      const examData = personalTrend.subjectScores[Number(selectedExam.value)]
      console.log('Selected exam data for index', selectedExam.value, ':', examData)
      if (examData) {
        currentScores = examData.scores
        currentSubjects = examData.subjects
      } else {
        console.log('Exam data not found, using fallback')
        currentScores = subjectRadar.scores
        currentSubjects = subjectRadar.subjects
      }
    } else {
      console.log('Using fallback data - no subjectScores array')
      // 降级到旧数据格式
      currentScores = subjectRadar.scores
      currentSubjects = subjectRadar.subjects
    }

    console.log('Final scores:', currentScores, 'subjects:', currentSubjects)
    const examName = examList.value[selectedExam.value] || '未知考试'

    // 分割数据为语数英和理化生
    const { chineseMathEnglish, science } = splitSubjectsData(currentScores, currentSubjects)

    // 更新学生端专用图表
    updateChineseMathEnglishChart(chineseMathEnglish.scores, chineseMathEnglish.subjects, examName)
    updateScienceChart(science.scores, science.subjects, examName)

    // 为了兼容性，也更新原来的图表（用于非学生端）
    updateRecentScoresChart(currentScores, currentSubjects, examName)
    updateSubjectScoresChart(currentScores, currentSubjects, examName)
  }

  // 分割科目数据为语数英和理化生
  const splitSubjectsData = (scores: number[], subjects: string[]) => {
    const chineseMathEnglishSubjects = ['语文', '数学', '英语']
    const scienceSubjects = ['物理', '化学', '生物']

    const chineseMathEnglish = {
      subjects: subjects.filter(subject => chineseMathEnglishSubjects.includes(subject)),
      scores: subjects.map((subject, index) =>
        chineseMathEnglishSubjects.includes(subject) ? scores[index] : null
      ).filter(score => score !== null) as number[]
    }

    const science = {
      subjects: subjects.filter(subject => scienceSubjects.includes(subject)),
      scores: subjects.map((subject, index) =>
        scienceSubjects.includes(subject) ? scores[index] : null
      ).filter(score => score !== null) as number[]
    }

    return { chineseMathEnglish, science }
  }

  // 更新语数英成绩图表
  const updateChineseMathEnglishChart = (scores: number[], subjects: string[], examName: string) => {
    if (!chineseMathEnglishChart.value) return

    // 销毁现有图表实例
    const existingInstance = echarts.getInstanceByDom(chineseMathEnglishChart.value)
    if (existingInstance) {
      existingInstance.dispose()
    }

    const chart = echarts.init(chineseMathEnglishChart.value)
    chart.setOption({
      backgroundColor: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(255, 255, 255, 1)' },
          { offset: 1, color: 'rgba(248, 249, 250, 0.3)' }
        ]
      },
      title: {
        text: `${examName}`,
        left: 'center',
        top: '2%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      grid: {
        left: '8%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(44, 62, 80, 0.95)',
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 8,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: function (params: any) {
          const subject = params[0].name
          const score = params[0].value
          const percentage = ((score / 150) * 100).toFixed(1)
          return `📚 ${subject}<br/>💯 分数: ${score}/150分<br/>📊 百分比: ${percentage}%`
        }
      },
      xAxis: {
        type: 'category',
        data: subjects,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: '#34495e',
          fontWeight: '500',
          margin: 12
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        axisTick: {
          show: true,
          length: 6,
          lineStyle: {
            color: '#95a5a6'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '分数',
        min: 0,
        max: 150,
        interval: 30,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50',
          padding: [0, 0, 10, 0]
        },
        axisLabel: {
          fontSize: 11,
          color: '#34495e',
          fontWeight: '500',
          lineHeight: 14,
          formatter: function (value: number) {
            if (value === 0) return '0'
            if (value === 90) return '及格 90'
            if (value === 130) return '优秀 130'
            if (value === 150) return '满分 150'
            return ''
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#ecf0f1',
            width: 1
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.8)', 'rgba(248, 249, 250, 0.5)']
          }
        }
      },
      series: [{
        name: '成绩',
        type: 'bar',
        data: scores,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: function (params: any) {
            const score = params.value
            if (score >= 130) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#56ffa4' },
                { offset: 1, color: '#67c23a' }
              ]
            }
            if (score >= 110) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#409eff' }
              ]
            }
            if (score >= 90) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ffb347' },
                { offset: 1, color: '#e6a23c' }
              ]
            }
            return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff6b6b' },
                { offset: 1, color: '#f56c6c' }
              ]
            }
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#2c3e50',
          formatter: function (params: any) {
            const score = params.value
            const percentage = ((score / 150) * 100).toFixed(0)
            return `${score}\n${percentage}%`
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }]
    })
  }

  // 更新理化生成绩图表
  const updateScienceChart = (scores: number[], subjects: string[], examName: string) => {
    if (!scienceChart.value) return

    // 销毁现有图表实例
    const existingInstance = echarts.getInstanceByDom(scienceChart.value)
    if (existingInstance) {
      existingInstance.dispose()
    }

    const chart = echarts.init(scienceChart.value)
    chart.setOption({
      backgroundColor: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(255, 255, 255, 1)' },
          { offset: 1, color: 'rgba(248, 249, 250, 0.3)' }
        ]
      },
      title: {
        text: `${examName}`,
        left: 'center',
        top: '2%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      grid: {
        left: '8%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(44, 62, 80, 0.95)',
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 8,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: function (params: any) {
          const subject = params[0].name
          const score = params[0].value
          const percentage = ((score / 100) * 100).toFixed(1)
          return `🔬 ${subject}<br/>💯 分数: ${score}/100分<br/>📊 百分比: ${percentage}%`
        }
      },
      xAxis: {
        type: 'category',
        data: subjects,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: '#34495e',
          fontWeight: '500',
          margin: 12
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        axisTick: {
          show: true,
          length: 6,
          lineStyle: {
            color: '#95a5a6'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '分数',
        min: 0,
        max: 100,
        interval: 20,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50',
          padding: [0, 0, 10, 0]
        },
        axisLabel: {
          fontSize: 11,
          color: '#34495e',
          fontWeight: '500',
          lineHeight: 14,
          formatter: function (value: number) {
            if (value === 0) return '0'
            if (value === 60) return '及格 60'
            if (value === 80) return '良好 80'
            if (value === 90) return '优秀 90'
            if (value === 100) return '满分 100'
            return ''
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#ecf0f1',
            width: 1
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.8)', 'rgba(248, 249, 250, 0.5)']
          }
        }
      },
      series: [{
        name: '成绩',
        type: 'bar',
        data: scores,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: function (params: any) {
            const score = params.value
            if (score >= 90) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#56ffa4' },
                { offset: 1, color: '#67c23a' }
              ]
            }
            if (score >= 80) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#409eff' }
              ]
            }
            if (score >= 60) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ffb347' },
                { offset: 1, color: '#e6a23c' }
              ]
            }
            return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff6b6b' },
                { offset: 1, color: '#f56c6c' }
              ]
            }
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#2c3e50',
          formatter: function (params: any) {
            const score = params.value
            const percentage = ((score / 100) * 100).toFixed(0)
            return `${score}\n${percentage}%`
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }]
    })
  }

  // 更新最近成绩图表
  const updateRecentScoresChart = (scores: number[], subjects: string[], examName: string) => {
    if (!trendChart.value) return

    // 销毁现有图表实例
    const existingInstance = echarts.getInstanceByDom(trendChart.value)
    if (existingInstance) {
      existingInstance.dispose()
    }

    const recentScores = echarts.init(trendChart.value)
    recentScores.setOption({
      backgroundColor: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(255, 255, 255, 1)' },
          { offset: 1, color: 'rgba(248, 249, 250, 0.3)' }
        ]
      },
      title: {
        text: `${examName}各科成绩`,
        left: 'center',
        top: '2%',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        subtextStyle: {
          fontSize: 14,
          color: '#7f8c8d'
        }
      },
      grid: {
        left: '8%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(44, 62, 80, 0.95)',
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 8,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: function (params: any) {
          const subject = params[0].name
          const score = params[0].value
          const fullMark = ['物理', '化学', '生物'].includes(subject) ? 100 : 150
          const percentage = ((score / fullMark) * 100).toFixed(1)
          return `📚 ${subject}<br/>💯 分数: ${score}/${fullMark}分<br/>📊 百分比: ${percentage}%`
        }
      },
      xAxis: {
        type: 'category',
        data: subjects,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: '#34495e',
          fontWeight: '500',
          margin: 12
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        axisTick: {
          show: true,
          length: 6,
          lineStyle: {
            color: '#95a5a6'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '分数',
        min: 0,
        max: 150,
        interval: 30,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50',
          padding: [0, 0, 10, 0]
        },
        axisLabel: {
          fontSize: 11,
          color: '#34495e',
          fontWeight: '500',
          lineHeight: 14,
          formatter: function (value: number) {
            // 检查是否有理化生科目，决定使用哪个评分标准
            const hasScienceSubjects = subjects.some((s: string) => ['物理', '化学', '生物'].includes(s))

            if (hasScienceSubjects) {
              // 如果包含理化生，显示双标准
              if (value === 0) return '0'
              if (value === 60) return '理\n60'
              if (value === 90) return '语\n90'
              if (value === 100) return '理\n100'
              if (value === 130) return '语\n130'
              if (value === 150) return '语\n150'
            } else {
              // 只有语数英，显示150分制
              if (value === 0) return '0'
              if (value === 90) return '及格 90'
              if (value === 130) return '优秀 130'
              if (value === 150) return '满分 150'
            }
            return ''
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#ecf0f1',
            width: 1
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.8)', 'rgba(248, 249, 250, 0.5)']
          }
        }
      },
      series: [{
        name: '成绩',
        type: 'bar',
        data: scores,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: function (params: any) {
            const score = params.value
            const subject = subjects[params.dataIndex]

            // 理化生科目使用100分制评分标准
            if (['物理', '化学', '生物'].includes(subject)) {
              if (score >= 90) return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#56ffa4' },
                  { offset: 1, color: '#67c23a' }
                ]
              }
              if (score >= 80) return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#4facfe' },
                  { offset: 1, color: '#409eff' }
                ]
              }
              if (score >= 60) return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ffb347' },
                  { offset: 1, color: '#e6a23c' }
                ]
              }
              return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ff6b6b' },
                  { offset: 1, color: '#f56c6c' }
                ]
              }
            } else {
              // 语数英科目使用150分制评分标准
              if (score >= 130) return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#56ffa4' },
                  { offset: 1, color: '#67c23a' }
                ]
              }
              if (score >= 110) return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#4facfe' },
                  { offset: 1, color: '#409eff' }
                ]
              }
              if (score >= 90) return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ffb347' },
                  { offset: 1, color: '#e6a23c' }
                ]
              }
              return {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ff6b6b' },
                  { offset: 1, color: '#f56c6c' }
                ]
              }
            }
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#2c3e50',
          formatter: function (params: any) {
            const score = params.value
            const subject = subjects[params.dataIndex]
            const fullMark = ['物理', '化学', '生物'].includes(subject) ? 100 : 150
            const percentage = ((score / fullMark) * 100).toFixed(0)
            return `${score}\n${percentage}%`
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }]
    })
  }

  // 更新各科成绩对比图表
  const updateSubjectScoresChart = (scores: number[], subjects: string[], examName: string) => {
    if (!distChart.value) return

    // 销毁现有图表实例
    const existingInstance = echarts.getInstanceByDom(distChart.value)
    if (existingInstance) {
      existingInstance.dispose()
    }

    const subjectScores = echarts.init(distChart.value)
    subjectScores.setOption({
      title: {
        text: `${examName}各科成绩对比`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const subject = params[0].name
          const score = params[0].value
          const percentage = ((score / 150) * 100).toFixed(1)
          return `${subject}: ${score}分 (${percentage}%)`
        }
      },
      xAxis: {
        type: 'category',
        data: subjects,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: '#34495e',
          fontWeight: '500',
          margin: 12
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a5a6',
            width: 2
          }
        },
        axisTick: {
          show: true,
          length: 6,
          lineStyle: {
            color: '#95a5a6'
          }
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 150,
        axisLabel: {
          formatter: function (value: number) {
            if (value === 0) return '0'
            if (value === 90) return '及格 90'
            if (value === 130) return '优秀 130'
            if (value === 150) return '满分 150'
            return ''
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#ddd'
          }
        }
      },
      series: [{
        name: '成绩',
        type: 'bar',
        data: scores,
        itemStyle: {
          color: function (params: any) {
            const score = params.value
            if (score >= 130) return '#67c23a'
            if (score >= 110) return '#409eff'
            if (score >= 90) return '#e6a23c'
            return '#f56c6c'
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: function (params: any) {
            const score = params.value
            const percentage = ((score / 150) * 100).toFixed(0)
            return `${score}分\n${percentage}%`
          }
        }
      }]
    })
  }

  onMounted(async () => {
    try {
      // 获取图表数据
      console.log('Calling API getChartData...')
      const response = await safeApiCall(api.getChartData())
      console.log('API response received:', response)
      chartResponse.value = response

      if (response && response.code === 200) {
        const { personalTrend, classDistribution, subjectRadar } = response.data
        console.log('API Response:', response.data)
        console.log('personalTrend:', personalTrend)
        console.log('subjectRadar:', subjectRadar)

        if (isStudent) {
          // 学生只看到个人数据，初始化图表
          updateCharts(personalTrend, subjectRadar)
        } else {
          // 老师和管理员看到统计数据
          const countRes = await safeApiCall(api.getCountData())
          if (countRes && countRes.code === 200) {
            countData.value = countRes.data
          }

          const tableRes = await safeApiCall(api.getTableData())
          if (tableRes && tableRes.code === 200) {
            tableData.value = tableRes.data.tableData
          }

          // 班级成绩分析图表会在 loadAnalysisData 中初始化
          // 同时也需要初始化教师端的图表
          updateCharts(personalTrend, subjectRadar)
        }
      }
    } catch (error) {
      console.error('数据加载失败:', error)
    }

    // 加载班级分析数据
    loadAnalysisData()

    // 加载排名分析数据
    loadRankingData()
  })

  // 监听考试选择变化（仅学生端）
  watch(selectedExam, (newValue, oldValue) => {
    if (newValue !== oldValue && isStudent) {
      handleExamChange()
    }
  })

  // 更新班级平均分图表
  const updateClassAvgChart = () => {
    if (!classAvgChart.value || !statsData.value) {
      return
    }

    // 确保DOM已经渲染完成
    nextTick(() => {
      // 销毁现有图表实例
      const existingInstance = echarts.getInstanceByDom(classAvgChart.value!)
      if (existingInstance) {
        existingInstance.dispose()
      }

      const chart = echarts.init(classAvgChart.value!)

      const subjects = statsData.value!.stats.map((stat: any) => stat.subject)
      const averages = statsData.value!.stats.map((stat: any) => stat.average)

      chart.setOption({
      title: {
        text: `${statsData.value!.className} - ${statsData.value!.exam} 各科平均分`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(44, 62, 80, 0.95)',
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 8,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: function (params: any) {
          const subject = params[0].name
          const avgScore = params[0].value
          const maxScore = ['语文', '数学', '英语'].includes(subject) ? 150 : 100
          const percentage = ((avgScore / maxScore) * 100).toFixed(1)
          return `📊 ${subject}<br/>📈 平均分: ${avgScore}/${maxScore}<br/>📊 百分比: ${percentage}%`
        }
      },
      grid: {
        left: '8%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: subjects,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: '#34495e',
          fontWeight: '500'
        }
      },
      yAxis: {
        type: 'value',
        name: '平均分',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        axisLabel: {
          fontSize: 12,
          color: '#34495e',
          fontWeight: '500'
        }
      },
      series: [{
        name: '平均分',
        type: 'bar',
        data: averages,
        barWidth: '60%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: function (params: any) {
            const subject = params.name
            const score = params.value
            const maxScore = ['语文', '数学', '英语'].includes(subject) ? 150 : 100
            const percentage = score / maxScore

            if (percentage >= 0.8) return '#67c23a'
            if (percentage >= 0.6) return '#e6a23c'
            return '#f56c6c'
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      }]
    })
    })
  }

  // 更新最高分学生图表
  const updateHighestChart = () => {
    if (!highestChart.value || !rankingStatsData.value || rankingStudentScores.value.length === 0) return

    nextTick(() => {
      // 销毁现有图表实例
      const existingInstance = echarts.getInstanceByDom(highestChart.value!)
      if (existingInstance) {
        existingInstance.dispose()
      }

      const chart = echarts.init(highestChart.value!)

      // 获取当前选择的科目或默认显示总分
      const currentSubject = selectedSubject.value || 'totalScore'

      let chartTitle = `${rankingStatsData.value!.className} - ${rankingStatsData.value!.exam}`
      let highestData: { name: string; score: number; studentName: string }[] = []

      if (currentSubject === 'totalScore') {
        chartTitle += ' 总分最高分学生'
        // 按总分排序
        const sortedByTotal = [...rankingStudentScores.value].sort((a, b) => b.totalScore - a.totalScore)
        const highest = sortedByTotal.slice(0, 5)

        highestData = highest.map(student => ({
          name: student.name,
          score: student.totalScore,
          studentName: student.name
        }))
      } else {
        chartTitle += ` ${currentSubject}最高分学生`
        // 按特定科目排序
        const sortedBySubject = [...rankingStudentScores.value].sort((a, b) => {
          const scoreA = a.currentExamScores[currentSubject] || 0
          const scoreB = b.currentExamScores[currentSubject] || 0
          return scoreB - scoreA
        })

        const highest = sortedBySubject.slice(0, 5)

        highestData = highest.map(student => ({
          name: student.name,
          score: student.currentExamScores[currentSubject] || 0,
          studentName: student.name
        }))
      }

      const names = highestData.map(item => item.name)
      const scores = highestData.map(item => item.score)

      chart.setOption({
        title: {
          text: chartTitle,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(44, 62, 80, 0.95)',
          borderColor: '#3498db',
          borderWidth: 2,
          borderRadius: 8,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: function (params: any) {
            const studentName = params[0].name
            const score = params[0].value
            return `👤 ${studentName}<br/>💯 分数: ${score}分`
          }
        },
        grid: {
          left: '8%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: 45,
            fontSize: 11,
            color: '#34495e',
            fontWeight: '500',
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '分数',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          axisLabel: {
            fontSize: 12,
            color: '#34495e',
            fontWeight: '500'
          },
          // Set consistent scale for both charts
          min: function(value: any) {
            const currentSubject = selectedSubject.value || 'totalScore'
            return currentSubject === 'totalScore' ? 0 : 0
          },
          max: function(value: any) {
            const currentSubject = selectedSubject.value || 'totalScore'
            return currentSubject === 'totalScore' ? 900 : 150
          }
        },
        series: [{
          name: '分数',
          type: 'bar',
          data: scores,
          barWidth: '60%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#56ffa4' },
                { offset: 1, color: '#67c23a' }
              ]
            }
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        }]
      })
    })
  }

  // 当科目选择变化时更新图表
  const updateChartsOnSubjectChange = () => {
    // 如果已经有排名数据，直接更新图表而不重新加载数据
    if (rankingStatsData.value && rankingStudentScores.value.length > 0) {
      updateHighestChart()
      updateLowestChart()
    } else {
      // 如果没有数据，则加载数据
      loadRankingData()
    }
  }

  // 更新最低分学生图表
  const updateLowestChart = () => {
    if (!lowestChart.value || !rankingStatsData.value || rankingStudentScores.value.length === 0) return

    nextTick(() => {
      // 销毁现有图表实例
      const existingInstance = echarts.getInstanceByDom(lowestChart.value!)
      if (existingInstance) {
        existingInstance.dispose()
      }

      const chart = echarts.init(lowestChart.value!)

      // 获取当前选择的科目或默认显示总分
      const currentSubject = selectedSubject.value || 'totalScore'

      let chartTitle = `${rankingStatsData.value!.className} - ${rankingStatsData.value!.exam}`
      let lowestData: { name: string; score: number; studentName: string }[] = []

      if (currentSubject === 'totalScore') {
        chartTitle += ' 总分最低分学生'
        // 按总分排序
        const sortedByTotal = [...rankingStudentScores.value].sort((a, b) => b.totalScore - a.totalScore)
        const lowest = sortedByTotal.slice(-5).reverse()

        lowestData = lowest.map(student => ({
          name: student.name,
          score: student.totalScore,
          studentName: student.name
        }))
      } else {
        chartTitle += ` ${currentSubject}最低分学生`
        // 按特定科目排序
        const sortedBySubject = [...rankingStudentScores.value].sort((a, b) => {
          const scoreA = a.currentExamScores[currentSubject] || 0
          const scoreB = b.currentExamScores[currentSubject] || 0
          return scoreB - scoreA
        })

        const lowest = sortedBySubject.slice(-5).reverse()

        lowestData = lowest.map(student => ({
          name: student.name,
          score: student.currentExamScores[currentSubject] || 0,
          studentName: student.name
        }))
      }

      const names = lowestData.map(item => item.name)
      const scores = lowestData.map(item => item.score)

      chart.setOption({
        title: {
          text: chartTitle,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(44, 62, 80, 0.95)',
          borderColor: '#3498db',
          borderWidth: 2,
          borderRadius: 8,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: function (params: any) {
            const studentName = params[0].name
            const score = params[0].value
            return `👤 ${studentName}<br/>💯 分数: ${score}分`
          }
        },
        grid: {
          left: '8%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: 45,
            fontSize: 11,
            color: '#34495e',
            fontWeight: '500',
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '分数',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          axisLabel: {
            fontSize: 12,
            color: '#34495e',
            fontWeight: '500'
          },
          // Set consistent scale for both charts
          min: function(value: any) {
            const currentSubject = selectedSubject.value || 'totalScore'
            return currentSubject === 'totalScore' ? 0 : 0
          },
          max: function(value: any) {
            const currentSubject = selectedSubject.value || 'totalScore'
            return currentSubject === 'totalScore' ? 900 : 150
          }
        },
        series: [{
          name: '分数',
          type: 'bar',
          data: scores,
          barWidth: '60%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff9a9e' },
                { offset: 1, color: '#fecfef' }
              ]
            }
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        }]
      })
    })
  }
</script>

<style scoped>
  .card-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #fff;
    margin-right: 15px;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-value {
    font-size: 26px;
    font-weight: bold;
  }

  .card-label {
    font-size: 14px;
    color: #999;
  }

  .table-card {
    margin-top: 20px;
  }

  .chart-row {
    margin-top: 20px;
  }

  /* 学生端专属样式优化 */
  .exam-selector-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }

  .exam-selector-content {
    display: flex;
    align-items: center;
    gap: 20px;
    color: white;
    padding: 10px 0;
  }

  .exam-selector-label {
    font-weight: bold;
    font-size: 16px;
    min-width: 100px;
  }

  :deep(.exam-radio-group) {
    .el-radio-button__inner {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .el-radio-button__original-radio:checked+.el-radio-button__inner {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      font-weight: bold;
    }

    .el-radio-button__inner:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }

  /* 图表卡片样式 */
  .chart-card {
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background: white;
    overflow: hidden;

    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }

  .student-chart {
    border-top: 4px solid #667eea;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
      background-size: 200% 100%;
      animation: gradientShift 3s ease-in-out infinite;
    }
  }

  @keyframes gradientShift {

    0%,
    100% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }
  }

  /* 成绩图例样式 */
  .grade-legend {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .legend-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .legend-header {
    font-weight: bold;
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 8px;
    text-align: center;
  }

  .legend-items {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .legend-color {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .legend-text {
    font-size: 12px;
    font-weight: 500;
    color: #34495e;
  }

  /* 图表容器 */
  .chart-container {
    height: 300px;
    position: relative;
  }

  /* 学生端双图表样式 */
  .chart-title-section {
    text-align: center;
    margin-bottom: 16px;
    padding: 12px 0;
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  }

  .chart-title {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: bold;
    color: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .chart-subtitle {
    margin: 0;
    font-size: 12px;
    color: #7f8c8d;
    font-weight: 500;
  }

  /* 小图例样式 */
  .grade-legend-small {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    padding: 12px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
  }

  .grade-legend-small .legend-items {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .grade-legend-small .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .grade-legend-small .legend-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* 图表卡片主题 */
  .chinese-math-english {
    border-top: 4px solid #667eea;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
      background-size: 200% 100%;
      animation: gradientShift 3s ease-in-out infinite;
    }
  }

  .science {
    border-top: 4px solid #43e97b;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #43e97b, #38f9d7, #43e97b);
      background-size: 200% 100%;
      animation: gradientShift 3s ease-in-out infinite;
    }
  }

  /* 响应式优化 */
  @media (max-width: 768px) {
    .exam-selector-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .grade-legend {
      gap: 20px;
      padding: 15px;
    }

    .legend-items {
      gap: 8px;
    }

    .chart-container {
      height: 280px;
    }
  }

  /* 现代化UI样式 */
  .modern-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .modern-card .el-card__body {
    padding: 24px;
  }

  .selection-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .header-left {
    flex: 1;
  }

  .analysis-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .analysis-subtitle {
    margin: 0;
    font-size: 14px;
    color: #718096;
    font-weight: 500;
  }

  .selection-controls {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .modern-select {
    .el-input__wrapper {
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }

  .modern-info {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
  }

  .info-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .modern-info .info-value {
    font-size: 18px;
    font-weight: 600;
  }

  .modern-info .info-count {
    font-size: 14px;
    opacity: 0.9;
  }

  .section-title {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modern-stats {
    margin-bottom: 32px;
  }

  .modern-stat-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    height: 100%;
  }

  .modern-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .modern-stat-card .el-card__body {
    padding: 20px;
  }

  .subject-name {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #4a5568;
    text-align: center;
  }

  .modern-avg-score {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
    text-align: center;
    margin-bottom: 16px;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
  }

  .score-unit {
    font-size: 14px;
    font-weight: 500;
    color: #718096;
  }

  .modern-distribution {
    margin-top: 12px;
  }

  .modern-bar {
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: #f7fafc;
    margin-bottom: 12px;
  }

  .modern-segment.fail {
    background: linear-gradient(90deg, #fc8181, #f56565);
  }

  .modern-segment.pass {
    background: linear-gradient(90deg, #f6ad55, #ed8936);
  }

  .modern-segment.excellent {
    background: linear-gradient(90deg, #68d391, #38a169);
  }

  .modern-labels {
    font-size: 11px;
  }

  .grade-summary {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .excellent-count {
    color: #38a169;
    font-weight: 600;
  }

  .pass-count {
    color: #ed8936;
    font-weight: 500;
  }

  .fail-count {
    color: #f56565;
    font-weight: 500;
  }

  .modern-charts {
    margin-top: 8px;
  }

  .chart-controls {
    margin-bottom: 20px;
  }

  .modern-control-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .modern-subject-selector {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 8px;
  }

  .modern-selector-label {
    font-weight: 600;
    color: #2d3748;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modern-chart-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    height: 100%;
    transition: all 0.3s ease;
  }

  .modern-chart-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .avg-chart {
    border-top: 4px solid #4299e1;
  }

  .highest-chart {
    border-top: 4px solid #48bb78;
  }

  .lowest-chart {
    border-top: 4px solid #ed8936;
  }

  .chart-header {
    padding: 20px 24px 0;
    text-align: center;
  }

  .chart-title {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .chart-subtitle {
    margin: 0;
    font-size: 13px;
    color: #718096;
    font-weight: 500;
  }

  .modern-chart-container {
    height: 350px;
    padding: 16px;
  }

  /* 响应式优化 */
  @media (max-width: 1200px) {
    .modern-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .selection-header {
      flex-direction: column;
      gap: 16px;
    }

    .selection-controls {
      width: 100%;
      justify-content: flex-end;
    }
  }

  @media (max-width: 768px) {
    .modern-card .el-card__body {
      padding: 16px;
    }

    .analysis-title {
      font-size: 20px;
    }

    .selection-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .modern-select {
      width: 100% !important;
    }

    .modern-chart-container {
      height: 300px;
    }

    .modern-subject-selector {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
  }

  /* 排名控制面板样式 */
  .ranking-control-panel {
    border-left: 4px solid #ed8936;
  }

  .ranking-info {
    background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  }

  .ranking-badge {
    background: rgba(255, 255, 255, 0.25);
  }

  .info-subject {
    color: #fed7d7;
    font-weight: 600;
    font-size: 16px;
  }
</style>