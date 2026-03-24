<template>
  <div class="home">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in countData" :key="item.name">
        <el-card shadow="hover" :body-style="{ padding: '20px', display: 'flex' }">
          <component :is="item.icon" class="card-icon" :style="{ background: item.color }" />
          <div class="card-info">
            <div class="card-value">{{ item.value }}</div>
            <div class="card-label">{{ item.name }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 班级成绩表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="className" label="班级" />
        <el-table-column prop="avgScore" label="平均分" />
        <el-table-column prop="passRate" label="及格率" />
        <el-table-column prop="excellentRate" label="优秀率" />
      </el-table>
    </el-card>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="distChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import * as echarts from 'echarts'

  const { proxy } = getCurrentInstance()
  const countData = ref([])
  const tableData = ref([])
  const trendChart = ref(null)
  const distChart = ref(null)

  onMounted(async () => {
    // 获取卡片数据
    const countRes = await proxy.$api.getCountData()
    countData.value = countRes

    // 获取表格数据
    const tableRes = await proxy.$api.getTableData()
    tableData.value = tableRes.tableData

    // 获取图表数据
    const chartRes = await proxy.$api.getChartData()
    const { personalTrend, classDistribution } = chartRes

    // 渲染个人趋势图（这里模拟一个班级平均趋势）
    const trend = echarts.init(trendChart.value)
    trend.setOption({
      title: { text: '班级平均分趋势', left: 'center' },
      xAxis: { data: personalTrend.exams },
      yAxis: { name: '分数' },
      series: [{ data: personalTrend.scores, type: 'line', smooth: true, name: '平均分' }]
    })

    // 渲染分数段分布
    const dist = echarts.init(distChart.value)
    dist.setOption({
      title: { text: '分数段分布', left: 'center' },
      xAxis: { data: classDistribution.segments },
      yAxis: { name: '人数' },
      series: [{ data: classDistribution.counts, type: 'bar', name: '人数' }]
    })
  })
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
</style>