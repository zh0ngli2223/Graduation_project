export default {
    // 首页卡片统计数据
    getCountData: (config) => {
        // 可以从请求头或参数中获取用户角色信息
        const isStudent = config.headers?.role === 'student' || config.url.includes('student=true')

        if (isStudent) {
            return {
                code: 200,
                data: [
                    { name: '我的总分', value: 138, icon: 'Trophy', color: '#2ec7c9' },
                    { name: '班级排名', value: '15/45', icon: 'Medal', color: '#ffb980' },
                    { name: '进步幅度', value: '+7分', icon: 'TrendCharts', color: '#5ab1ef' },
                    { name: '目标达成', value: '85%', icon: 'Target', color: '#2ec7c9' },
                ]
            }
        }

        return {
            code: 200,
            data: [
                { name: '参考人数', value: 568, icon: 'UserFilled', color: '#2ec7c9' },
                { name: '平均分', value: 129.8, icon: 'TrendCharts', color: '#ffb980' },
                { name: '最高分', value: 298, icon: 'GoldMedal', color: '#5ab1ef' },
                { name: '优秀率', value: '38.2%', icon: 'DataLine', color: '#2ec7c9' },
            ]
        }
    },

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
    getChartData: (config) => {
        console.log('Mock API called with config:', config)
        console.log('Config headers:', config.headers)
        // 更宽松的条件判断，支持多种可能的role值格式
        const role = config.headers?.role
        const isStudent = role === 'student' || role === 'Student' || config.url.includes('student=true')
        console.log('isStudent detected:', isStudent, 'role:', role, 'typeof role:', typeof role)

        // 学生详细的历次考试成绩数据（大幅起伏的模拟数据）
        const studentExamData = {
            exams: ['一模', '二模', '三模', '期末'],
            // 每次考试各科成绩（大幅起伏，更真实）
            subjectScores: [
                // 一模各科成绩
                { subjects: ['语文', '数学', '英语', '物理', '化学', '生物'], scores: [108, 135, 122, 75, 78, 82] },
                // 二模各科成绩（数学大幅提升，语文英语下降，理化波动）
                { subjects: ['语文', '数学', '英语', '物理', '化学', '生物'], scores: [98, 148, 115, 80, 72, 79] },
                // 三模各科成绩（语文英语恢复，数学调整，理化大幅提升）
                { subjects: ['语文', '数学', '英语', '物理', '化学', '生物'], scores: [112, 132, 128, 86, 88, 89] },
                // 期末各科成绩（整体优化，各科趋于平衡）
                { subjects: ['语文', '数学', '英语', '物理', '化学', '生物'], scores: [118, 142, 135, 82, 84, 81] }
            ],
            // 每次考试总分（大幅起伏的总分变化）
            totalScores: [575, 592, 635, 642]
        }

        if (isStudent) {
            return {
                code: 200,
                data: {
                    personalTrend: {
                        exams: studentExamData.exams,
                        scores: studentExamData.totalScores,
                        subjectScores: studentExamData.subjectScores // 新增详细科目成绩
                    },
                    classDistribution: {
                        segments: [],  // 学生不需要这个数据
                        counts: []
                    },
                    subjectRadar: {
                        subjects: studentExamData.subjectScores[3].subjects, // 默认显示期末数据
                        scores: studentExamData.subjectScores[3].scores
                    },
                    // 传递给前端完整的考试数据
                    allExamData: studentExamData
                }
            }
        }

        return {
            code: 200,
            data: {
                personalTrend: {
                    exams: ['一模', '二模', '三模', '期末'],
                    scores: [128, 135, 142, 138],  // 班级平均成绩
                    subjectScores: studentExamData.subjectScores  // 也提供给老师/管理员
                },
                classDistribution: {
                    segments: ['<90', '90-120', '120-150', '>150'],
                    counts: [5, 18, 24, 8]
                },
                subjectRadar: {
                    subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                    scores: [115, 142, 128, 78, 82, 85]  // 班级各科平均分（理化生满分100）
                }
            }
        }
    }
}