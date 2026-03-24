<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="radarChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col>
        <el-button type="primary" @click="showAppealDialog">成绩申诉</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'

  const trendChart = ref(null)
  const radarChart = ref(null)

  onMounted(() => {
    // 模拟数据，实际可从接口获取
    const trend = echarts.init(trendChart.value)
    trend.setOption({
      title: { text: '历次考试成绩趋势' },
      xAxis: { data: ['一模', '二模', '三模', '期末'] },
      series: [{ data: [128, 135, 142, 138], type: 'line' }]
    })

    const radar = echarts.init(radarChart.value)
    radar.setOption({
      title: { text: '学科能力雷达图' },
      radar: {
        indicator: ['语文', '数学', '英语', '物理', '化学', '生物'].map(sub => ({ name: sub, max: 150 }))
      },
      series: [{
        type: 'radar',
        data: [{ value: [115, 142, 128, 88, 92, 85] }]
      }]
    })
  })

  const showAppealDialog = () => {
    // 弹出申诉表单
  }
</script>