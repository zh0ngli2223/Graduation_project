export default {
    // 首页卡片统计数据
    getCountData: () => ({
        code: 200,
        data: [
            { name: '参考人数', value: 568, icon: 'UserFilled', color: '#2ec7c9' },
            { name: '平均分', value: 129.8, icon: 'TrendCharts', color: '#ffb980' },
            { name: '最高分', value: 298, icon: 'GoldMedal', color: '#5ab1ef' },
            { name: '优秀率', value: '38.2%', icon: 'DataLine', color: '#2ec7c9' },
        ]
    }),

    // 班级成绩表格数据
    getTableData: () => ({
        code: 200,
        data: {
            tableData: [
                { className: '高三(1)班', avgScore: 128.5, passRate: '92.3%', excellentRate: '34.2%' },
                { className: '高三(2)班', avgScore: 131.2, passRate: '94.1%', excellentRate: '41.7%' },
                { className: '高三(3)班', avgScore: 119.8, passRate: '85.6%', excellentRate: '22.5%' },
                { className: '高三(4)班', avgScore: 135.4, passRate: '96.8%', excellentRate: '48.3%' },
            ]
        }
    }),

    // 图表数据（个人趋势、班级分布、学科雷达）
    getChartData: () => ({
        code: 200,
        data: {
            personalTrend: {
                exams: ['一模', '二模', '三模', '期末'],
                scores: [128, 135, 142, 138]
            },
            classDistribution: {
                segments: ['<90', '90-120', '120-150', '>150'],
                counts: [5, 18, 24, 8]
            },
            subjectRadar: {
                subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                scores: [115, 142, 128, 88, 92, 85]
            }
        }
    })
}