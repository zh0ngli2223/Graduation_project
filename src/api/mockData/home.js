export default {
    // 首页卡片统计数据
    getCountData: (config) => {
        // 可以从请求头或参数中获取用户角色信息
        const isStudent = config.headers?.role === 'student' || config.url.includes('student=true')

        if (isStudent) {
            return {
                code: 200,
                data: [
                    { name: '我的总分', value: 642, icon: 'Trophy', color: '#2ec7c9' },
                    { name: '班级排名', value: '15/45', icon: 'Medal', color: '#ffb980' },
                    { name: '进步幅度', value: '+7分', icon: 'TrendCharts', color: '#5ab1ef' },
                    { name: '目标达成', value: '85%', icon: 'Target', color: '#2ec7c9' },
                ]
            }
        }

        // 教师端统计数据 - 基于三个班级的实际数据计算
        const totalStudents = 135  // 3个班 * 45人
        const class1Avg = 114.9  // 高三(1)班期末平均分
        const class2Avg = 116.3  // 高三(2)班期末平均分
        const class3Avg = 108.7  // 高三(3)班期末平均分
        const overallAvg = ((class1Avg + class2Avg + class3Avg) / 3).toFixed(1)

        // 计算最高分（假设最高分学生各科都很优秀）
        const maxScore = 145 + 140 + 140 + 100 + 100 + 100  // 各科满分相加

        // 计算优秀率（三个班级平均）
        const excellentRate = ((34 + 38 + 34) / 3).toFixed(1) + '%'

        return {
            code: 200,
            data: [
                { name: '参考人数', value: totalStudents, icon: 'UserFilled', color: '#2ec7c9' },
                { name: '平均分', value: parseFloat(overallAvg), icon: 'TrendCharts', color: '#ffb980' },
                { name: '最高分', value: maxScore, icon: 'GoldMedal', color: '#5ab1ef' },
                { name: '优秀率', value: excellentRate, icon: 'DataLine', color: '#2ec7c9' },
            ]
        }
    },

    // 班级成绩表格数据
    getTableData: () => ({
        code: 200,
        data: {
            tableData: [
                {
                    className: '高三(1)班',
                    avgScore: 114.9,
                    passRate: '93.3%',
                    excellentRate: '34.2%',
                    studentCount: 45
                },
                {
                    className: '高三(2)班',
                    avgScore: 116.3,
                    passRate: '95.6%',
                    excellentRate: '38.9%',
                    studentCount: 45
                },
                {
                    className: '高三(3)班',
                    avgScore: 108.7,
                    passRate: '86.7%',
                    excellentRate: '28.9%',
                    studentCount: 45
                },
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

        // 教师端数据 - 基于三个班级的实际统计数据
        const teacherData = {
            // 三个班级在各次考试中的平均分趋势
            personalTrend: {
                exams: ['一模', '二模', '三模', '期末'],
                scores: [112.8, 114.4, 116.1, 116.6],  // 三个班级整体平均分趋势
                subjectScores: [
                    // 一模各科平均分
                    {
                        subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                        scores: [112.8, 106.1, 99.2, 75.4, 78.8, 82.3]
                    },
                    // 二模各科平均分
                    {
                        subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                        scores: [114.4, 107.7, 101.6, 77.4, 80.5, 84.2]
                    },
                    // 三模各科平均分
                    {
                        subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                        scores: [116.0, 109.2, 103.4, 78.9, 82.0, 85.6]
                    },
                    // 期末各科平均分
                    {
                        subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                        scores: [117.3, 110.6, 105.0, 80.3, 83.5, 87.0]
                    }
                ]
            },
            // 期末考试成绩分布（基于实际学生数据）
            classDistribution: {
                segments: ['<90', '90-120', '120-150', '150-180', '>180'],
                counts: [8, 25, 42, 38, 22]  // 基于135名学生的分布
            },
            // 期末考试各科平均分雷达图数据
            subjectRadar: {
                subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
                scores: [117.3, 110.6, 105.0, 80.3, 83.5, 87.0]  // 三个班级期末平均分
            }
        }

        return {
            code: 200,
            data: teacherData
        }
    }
}