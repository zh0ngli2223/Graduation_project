<template>
  <div class="analysis-container">
    <!-- 成绩趋势与进步分析 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="analysis-card progress-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon">📈</div>
              <div>
                <h3>成绩进步趋势</h3>
                <p class="chart-subtitle">追踪你的学习进步轨迹</p>
              </div>
            </div>
          </div>
          <div ref="progressChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="analysis-card improvement-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon">⚖️</div>
              <div>
                <h3>各科进退步分析</h3>
                <p class="chart-subtitle">对比分析各科成绩变化</p>
              </div>
            </div>
          </div>
          <div ref="improvementChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 学科分析与偏科诊断 -->
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :span="12">
        <el-card class="analysis-card radar-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon">🎯</div>
              <div>
                <h3>学科能力分析</h3>
                <p class="chart-subtitle">全方位评估学科能力</p>
              </div>
            </div>
          </div>
          <div ref="radarChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="analysis-card trend-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon">📊</div>
              <div>
                <h3>各科成绩趋势对比</h3>
                <p class="chart-subtitle">多科目发展趋势对比</p>
              </div>
            </div>
          </div>
          <div ref="subjectTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 学习建议 -->
    <el-row style="margin-top: 40px">
      <el-col>
        <el-card class="suggestion-card">
          <div class="suggestion-section">
            <div class="suggestion-header">
              <div class="suggestion-icon">💡</div>
              <h3>个性化学习建议</h3>
            </div>
            <div v-if="suggestions.length > 0" class="suggestion-list">
              <transition-group name="suggestion-fade" tag="div">
                <el-alert
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  :title="suggestion.title"
                  :description="suggestion.content"
                  :type="suggestion.type"
                  show-icon
                  class="suggestion-alert"
                />
              </transition-group>
            </div>
            <div v-else class="no-suggestions">
              <div class="empty-state">
                <div class="empty-icon">📚</div>
                <p>暂无学习建议，继续努力！</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col class="action-section">
        <el-button type="primary" class="appeal-button" @click="showAppealDialog">
          <span class="button-icon">📝</span>
          成绩申诉
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import * as echarts from 'echarts'
  import { useApi, safeApiCall } from '@/utils/api'

  const router = useRouter()
  const api = useApi()
  const progressChart = ref<HTMLElement | null>(null)
  const improvementChart = ref<HTMLElement | null>(null)
  const radarChart = ref<HTMLElement | null>(null)
  const subjectTrendChart = ref<HTMLElement | null>(null)

  // 学习建议数据
  const suggestions = ref<Array<{title: string, content: string, type: 'success' | 'warning' | 'info'}>>([])

  // 计算进步趋势
  const calculateImprovement = (scores: number[]) => {
    if (scores.length < 2) return 0
    const recent = scores.slice(-3) // 最近3次
    const earlier = scores.slice(-6, -3) // 前3次
    if (earlier.length === 0) return 0

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length
    return recentAvg - earlierAvg
  }

  // 分析偏科情况
  const analyzeSubjectBias = (scores: number[]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    const diff = maxScore - minScore

    return {
      isBiased: diff > 30, // 分差超过30分认为偏科
      strongest: maxScore,
      weakest: minScore,
      difference: diff
    }
  }

  onMounted(async () => {
    try {
      const chartRes = await safeApiCall(api.getChartData())
      if (chartRes && chartRes.code === 200) {
        const { personalTrend, subjectRadar } = chartRes.data

        // 1. 成绩进步趋势图 - 使用一二三模和期末的总分对比
        if (progressChart.value && personalTrend.subjectScores) {
          const progress = echarts.init(progressChart.value)

          // 计算每次考试的总分
          const totalScores = personalTrend.subjectScores.map(examData =>
            examData.scores.reduce((sum, score) => sum + score, 0)
          )

          const improvement = calculateImprovement(totalScores)

          progress.setOption({
            title: {
              text: improvement > 0 ? `总分进步了${improvement.toFixed(1)}分` : `总分下降了${Math.abs(improvement).toFixed(1)}分`,
              left: 'center',
              top: '2%',
              textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#5c6bc0'
              }
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(92, 107, 192, 0.95)',
              borderColor: '#5c6bc0',
              borderWidth: 2,
              borderRadius: 8,
              textStyle: {
                color: '#fff',
                fontSize: 14
              },
              formatter: function(params: any) {
                return `${params[0].name}: ${params[0].value}分`
              }
            },
            xAxis: {
              data: ['一模', '二模', '三模', '期末'],
              axisLabel: {
                rotate: 30,
                fontSize: 12,
                color: '#34495e'
              },
              axisLine: {
                lineStyle: {
                  color: '#bdc3c7'
                }
              }
            },
            yAxis: {
              name: '总分',
              nameTextStyle: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#2c3e50'
              },
              axisLabel: {
                fontSize: 12,
                color: '#34495e'
              },
              axisLine: {
                lineStyle: {
                  color: '#bdc3c7'
                }
              }
            },
            series: [{
              data: totalScores,
              type: 'line',
              smooth: true,
              name: '总分',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: improvement > 0 ? '#67c23a' : '#f56c6c' },
                    { offset: 1, color: improvement > 0 ? 'rgba(103, 194, 58, 0.1)' : 'rgba(245, 108, 108, 0.1)' }
                  ]
                }
              },
              lineStyle: {
                width: 3,
                color: improvement > 0 ? '#67c23a' : '#f56c6c'
              }
            }]
          })
        }

        // 2. 各科进退步分析 - 使用三模和期末的对比
        if (improvementChart.value && personalTrend.subjectScores && personalTrend.subjectScores.length >= 4) {
          const improvement = echarts.init(improvementChart.value)

          // 获取三模(索引2)和期末(索引3)的数据
          const thirdMockData = personalTrend.subjectScores[2]
          const finalData = personalTrend.subjectScores[3]

          if (thirdMockData && finalData) {
            const subjectChanges = finalData.subjects.map((subject, index) => {
              const finalScore = finalData.scores[index]
              const thirdMockScore = thirdMockData.scores[index]
              return {
                subject,
                change: finalScore - thirdMockScore,
                finalScore,
                thirdMockScore
              }
            }).sort((a, b) => b.change - a.change)

            improvement.setOption({
              title: {
                text: '三模 vs 期末进退步',
                left: 'center',
                top: '2%',
                textStyle: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#8e24aa'
                }
              },
              tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(142, 36, 170, 0.95)',
                borderColor: '#8e24aa',
                borderWidth: 2,
                borderRadius: 8,
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                },
                formatter: function(params: any) {
                  const subject = params[0].name
                  const change = params[0].value
                  const data = subjectChanges.find(item => item.subject === subject)
                  return `${subject}<br/>三模: ${data?.thirdMockScore}分<br/>期末: ${data?.finalScore}分<br/>变化: ${change > 0 ? '+' : ''}${change.toFixed(1)}分`
                }
              },
              xAxis: {
                type: 'category',
                data: subjectChanges.map(item => item.subject),
                axisLabel: {
                  rotate: 30,
                  fontSize: 12,
                  color: '#34495e'
                },
                axisLine: {
                  lineStyle: {
                    color: '#bdc3c7'
                  }
                }
              },
              yAxis: {
                type: 'value',
                name: '进退步分数',
                nameTextStyle: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#2c3e50'
                },
                axisLabel: {
                  fontSize: 12,
                  color: '#34495e',
                  formatter: '{value}分'
                },
                axisLine: {
                  lineStyle: {
                    color: '#bdc3c7'
                  }
                }
              },
              series: [{
                name: '进退步',
                type: 'bar',
                data: subjectChanges.map(item => item.change),
                itemStyle: {
                  color: function(params: any) {
                    const change = params.value
                    if (change > 5) return {
                      type: 'linear',
                      x: 0, y: 0, x2: 0, y2: 1,
                      colorStops: [
                        { offset: 0, color: '#56ffa4' },
                        { offset: 1, color: '#67c23a' }
                      ]
                    }
                    if (change > 0) return {
                      type: 'linear',
                      x: 0, y: 0, x2: 0, y2: 1,
                      colorStops: [
                        { offset: 0, color: '#4facfe' },
                        { offset: 1, color: '#409eff' }
                      ]
                    }
                    if (change > -5) return {
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
                  formatter: function(params: any) {
                    const change = params.value
                    if (change > 0) return `+${change.toFixed(1)}`
                    return change.toFixed(1)
                  }
                }
              }]
            })
          }
        }

        // 3. 学科能力雷达图 - 使用期末数据
        if (radarChart.value && personalTrend.subjectScores && personalTrend.subjectScores.length >= 4) {
          const radar = echarts.init(radarChart.value)

          // 使用期末数据(索引3)
          const finalData = personalTrend.subjectScores[3]
          if (finalData) {
            const biasAnalysis = analyzeSubjectBias(finalData.scores)

            radar.setOption({
              title: {
                text: biasAnalysis.isBiased ? `偏科现象（分差${biasAnalysis.difference}分）` : '各科发展均衡',
                left: 'center',
                top: '2%',
                textStyle: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#1e88e5'
                }
              },
              radar: {
                indicator: finalData.subjects.map((sub, index) => ({
                  name: sub,
                  max: ['物理', '化学', '生物'].includes(sub) ? 100 : 150,
                  color: finalData.scores[index] < (['物理', '化学', '生物'].includes(sub) ? 60 : 90) ? '#f56c6c' : '#67c23a'
                })),
                axisLine: {
                  lineStyle: {
                    color: 'rgba(30, 136, 229, 0.3)'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: 'rgba(30, 136, 229, 0.2)'
                  }
                },
                splitArea: {
                  areaStyle: {
                    color: ['rgba(66, 165, 245, 0.1)', 'rgba(66, 165, 245, 0.05)']
                  }
                }
              },
              series: [{
                type: 'radar',
                data: [{
                  value: finalData.scores,
                  name: '期末成绩',
                  areaStyle: {
                    color: {
                      type: 'radial',
                      x: 0.5, y: 0.5, r: 0.8,
                      colorStops: [
                        { offset: 0, color: 'rgba(66, 165, 245, 0.3)' },
                        { offset: 1, color: 'rgba(66, 165, 245, 0.1)' }
                      ]
                    }
                  },
                  lineStyle: {
                    width: 3,
                    color: '#42a5f5'
                  },
                  symbol: 'circle',
                  symbolSize: 6
                }]
              }]
            })
          }
        }

        // 4. 各科成绩趋势对比 - 使用一二三模和期末的数据
        if (subjectTrendChart.value && personalTrend.subjectScores && personalTrend.subjectScores.length >= 4) {
          const subjectTrend = echarts.init(subjectTrendChart.value)

          // 获取所有考试的科目数据
          const examNames = ['一模', '二模', '三模', '期末']

          // 为每个科目创建趋势数据
          const subjectHistory = personalTrend.subjectScores![0].subjects.map((subject, subjectIndex) => {
            const subjectScores = personalTrend.subjectScores!.map(examData =>
              examData.scores[subjectIndex]
            )

            return {
              name: subject,
              type: 'line',
              smooth: true,
              data: subjectScores,
              lineStyle: {
                width: 3
              },
              symbol: 'circle',
              symbolSize: 8
            }
          })

          subjectTrend.setOption({
            title: {
              text: '各科成绩趋势对比',
              left: 'center',
              top: '2%',
              textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#43a047'
              }
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(67, 160, 71, 0.95)',
              borderColor: '#43a047',
              borderWidth: 2,
              borderRadius: 8,
              textStyle: {
                color: '#fff',
                fontSize: 14
              },
              formatter: function(params: any) {
                let result = `${params[0].axisValue}<br/>`
                params.forEach((param: any) => {
                  result += `${param.seriesName}: ${param.value}分<br/>`
                })
                return result
              }
            },
            legend: {
              data: personalTrend.subjectScores[0].subjects,
              top: 30,
              textStyle: {
                fontSize: 12,
                color: '#34495e'
              }
            },
            grid: {
              left: '12%',
              right: '4%',
              bottom: '15%',
              top: '20%',
              containLabel: true
            },
            xAxis: {
              data: examNames,
              axisLabel: {
                rotate: 30,
                fontSize: 12,
                color: '#34495e'
              },
              axisLine: {
                lineStyle: {
                  color: '#bdc3c7'
                }
              }
            },
            yAxis: {
              name: '',
              nameTextStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#2c3e50'
              },
              min: 0,
              max: 150,
              interval: 20,
              axisLabel: {
                fontSize: 12,
                color: '#34495e',
                formatter: function(value: number) {
                  return value.toString()
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#bdc3c7'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: '#ecf0f1'
                }
              }
            },
            series: subjectHistory
          })
        }

        // 生成学习建议
        const improvement2 = calculateImprovement(personalTrend.scores)
        const biasAnalysis = analyzeSubjectBias(subjectRadar.scores)
        const suggestionsList = []

        if (improvement2 > 5) {
          suggestionsList.push({
            title: '学习进步显著',
            content: `最近几次考试进步了${improvement2.toFixed(1)}分，继续保持良好的学习状态！`,
            type: 'success' as const
          })
        } else if (improvement2 < -5) {
          suggestionsList.push({
            title: '成绩有所下降',
            content: `最近成绩下降了${Math.abs(improvement2).toFixed(1)}分，建议调整学习方法，加强薄弱科目复习。`,
            type: 'warning' as const
          })
        }

        if (biasAnalysis.isBiased) {
          const weakestSubject = subjectRadar.subjects[subjectRadar.scores.indexOf(biasAnalysis.weakest)]
          suggestionsList.push({
            title: '注意学科均衡发展',
            content: `存在偏科现象，${weakestSubject}成绩相对较低，建议加强该科目学习时间投入。`,
            type: 'warning' as const
          })
        }

        const strongestSubject = subjectRadar.subjects[subjectRadar.scores.indexOf(biasAnalysis.strongest)]
        suggestionsList.push({
          title: '优势学科保持',
          content: `${strongestSubject}是你的优势科目，可以总结学习方法应用到其他科目。`,
          type: 'info' as const
        })

        suggestions.value = suggestionsList
      }
    } catch (error) {
      console.error('个人分析数据加载失败:', error)
    }
  })

  const showAppealDialog = () => {
    router.push('/appeal-submit')
  }
</script>

<style scoped>
.analysis-container {
  padding: 24px;
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  min-height: 100vh;
}

/* 图表卡片样式 */
.analysis-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

/* 卡片主题色彩 */
.progress-card {
  background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
  color: white;
}

.improvement-card {
  background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%);
  color: white;
}

.radar-card {
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  color: white;
}

.trend-card {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
  color: white;
}

/* 图表头部 */
.chart-header {
  padding: 20px 24px 0;
  margin-bottom: 16px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.chart-title h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.chart-subtitle {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.9);
}

/* 图表容器 */
.chart-container {
  height: 320px;
  padding: 20px;
  background: white;
  margin: 0 20px 20px;
  border-radius: 12px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 学习建议卡片 */
.suggestion-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
  overflow: hidden;
}

.suggestion-section {
  padding: 32px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.suggestion-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.suggestion-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 建议列表 */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-alert {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
}

/* 空状态 */
.no-suggestions {
  text-align: center;
  padding: 40px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.6;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* 操作按钮 */
.action-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.appeal-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px;
  background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
  border: none;
  box-shadow: 0 8px 24px rgba(92, 107, 192, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(92, 107, 192, 0.4);
  }
}

.button-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 动画效果 */
.suggestion-fade-enter-active,
.suggestion-fade-leave-active {
  transition: all 0.5s ease;
}

.suggestion-fade-enter-from,
.suggestion-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .analysis-container {
    padding: 16px;
  }

  .chart-header {
    padding: 16px 20px 0;
  }

  .chart-title {
    gap: 10px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .chart-title h3 {
    font-size: 16px;
  }

  .chart-container {
    height: 280px;
    padding: 16px;
    margin: 0 16px 16px;
  }

  .suggestion-section {
    padding: 24px;
  }

  .suggestion-header {
    gap: 12px;
  }

  .suggestion-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .suggestion-header h3 {
    font-size: 20px;
  }
}
</style>