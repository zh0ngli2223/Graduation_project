<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div ref="radarChart" style="height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="barChart" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import * as echarts from 'echarts'
  import type { ChartData } from '@/types'

  const { proxy } = getCurrentInstance()
  const radarChart = ref<HTMLElement | null>(null)
  const barChart = ref<HTMLElement | null>(null)

  onMounted(async () => {
    try {
      const chartRes = await proxy!.$api.getChartData()
      if (chartRes && chartRes.code === 200) {
        const { subjectRadar, classDistribution } = chartRes.data

        // 学科雷达图
        if (radarChart.value) {
          const radar = echarts.init(radarChart.value)
          radar.setOption({
            title: { text: '学科能力雷达图', left: 'center' },
            radar: {
              indicator: subjectRadar.subjects.map(sub => ({ name: sub, max: 150 }))
            },
            series: [{
              type: 'radar',
              data: [{ value: subjectRadar.scores, name: '当前学生' }]
            }]
          })
        }

        // 分数段分布柱状图
        if (barChart.value) {
          const bar = echarts.init(barChart.value)
          bar.setOption({
            title: { text: '班级分数段分布', left: 'center' },
            xAxis: { data: classDistribution.segments },
            yAxis: { name: '人数' },
            series: [{ type: 'bar', data: classDistribution.counts }]
          })
        }
      }
    } catch (error) {
      console.error('图表数据加载失败:', error)
    }
  })
</script>