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

<script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import * as echarts from 'echarts'

  const { proxy } = getCurrentInstance()
  const radarChart = ref(null)
  const barChart = ref(null)

  onMounted(async () => {
    const chartRes = await proxy.$api.getChartData()
    const { subjectRadar, classDistribution } = chartRes

    // 学科雷达图
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

    // 分数段分布柱状图
    const bar = echarts.init(barChart.value)
    bar.setOption({
      title: { text: '班级分数段分布', left: 'center' },
      xAxis: { data: classDistribution.segments },
      yAxis: { name: '人数' },
      series: [{ type: 'bar', data: classDistribution.counts }]
    })
  })
</script>