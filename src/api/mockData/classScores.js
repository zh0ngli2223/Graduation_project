import Mock from 'mockjs'

const classScoresApi = {
    // 获取班级成绩统计
    getClassScoreStats: () => {
        return {
            code: 200,
            data: {
                className: '高三(1)班',
                exam: '期末考试',
                totalStudents: 45,
                stats: [
                    {
                        subject: '语文',
                        average: 115.6,
                        studentCount: 45,
                        distribution: {
                            '不及格': 2,
                            '及格': 8,
                            '优秀': 35
                        }
                    },
                    {
                        subject: '数学',
                        average: 108.3,
                        studentCount: 45,
                        distribution: {
                            '不及格': 5,
                            '及格': 12,
                            '优秀': 28
                        }
                    },
                    {
                        subject: '英语',
                        average: 102.8,
                        studentCount: 45,
                        distribution: {
                            '不及格': 3,
                            '及格': 15,
                            '优秀': 27
                        }
                    },
                    {
                        subject: '物理',
                        average: 78.5,
                        studentCount: 45,
                        distribution: {
                            '不及格': 8,
                            '及格': 20,
                            '优秀': 17
                        }
                    },
                    {
                        subject: '化学',
                        average: 82.1,
                        studentCount: 45,
                        distribution: {
                            '不及格': 6,
                            '及格': 18,
                            '优秀': 21
                        }
                    },
                    {
                        subject: '生物',
                        average: 85.7,
                        studentCount: 45,
                        distribution: {
                            '不及格': 4,
                            '及格': 16,
                            '优秀': 25
                        }
                    }
                ]
            }
        }
    },

    // 获取班级列表
    getClassList: () => {
        return {
            code: 200,
            data: ['高三(1)班', '高三(2)班', '高三(3)班', '高三(4)班', '高三(5)班']
        }
    },

    // 获取考试列表
    getExamList: () => {
        return {
            code: 200,
            data: ['一模', '二模', '三模', '期末考试']
        }
    },

    // 获取学生成绩列表
    getStudentScores: (data) => {
        const { page = 1, limit = 20 } = data || {}
        const students = []

        for (let i = 1; i <= 45; i++) {
            students.push({
                id: `student_${i}`,
                studentNo: `202100${i.toString().padStart(3, '0')}`,
                name: Mock.Random.cname(),
                className: '高三(1)班',
                currentExamScores: {
                    '语文': Mock.Random.integer(85, 145),
                    '数学': Mock.Random.integer(80, 140),
                    '英语': Mock.Random.integer(75, 140),
                    '物理': Mock.Random.integer(60, 100),
                    '化学': Mock.Random.integer(65, 100),
                    '生物': Mock.Random.integer(70, 100)
                },
                totalScore: 0,
                rank: i
            })
        }

        // 计算总分
        students.forEach(student => {
            student.totalScore = Object.values(student.currentExamScores).reduce((sum, score) => sum + score, 0)
        })

        // 按总分排序
        students.sort((a, b) => b.totalScore - a.totalScore)

        // 更新排名
        students.forEach((student, index) => {
            student.rank = index + 1
        })

        const start = (page - 1) * limit
        const end = start + limit

        return {
            code: 200,
            data: {
                list: students.slice(start, end),
                total: students.length
            }
        }
    }
}

export default classScoresApi