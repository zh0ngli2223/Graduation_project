import Mock from 'mockjs'

// 预设学生姓名库
const studentNames = [
    '张明', '李华', '王强', '刘洋', '陈晨', '杨帆', '赵磊', '孙鹏', '周杰', '吴超',
    '郑凯', '冯飞', '黄勇', '林峰', '何亮', '许东', '韩冰', '曹阳', '潘宇', '蒋涛',
    '范明', '彭辉', '罗军', '宋健', '谢峰', '董浩', '苏斌', '曾磊', '鲁伟', '昌国',
    '丁波', '邓超', '田磊', '任超', '段飞', '龙强', '万东', '易明', '武军', '雷鸣',
    '白冰', '谭阳', '黎健', '侯峰', '吕浩'
]

// 生成学生成绩数据
const generateStudentScores = (examType, baseScore = 120) => {
    const students = []

    for (let i = 0; i < 45; i++) {
        const studentNo = `202100${(i + 1).toString().padStart(3, '0')}`
        const name = studentNames[i] || `学生${i + 1}`

        // 根据考试类型调整基础分数
        let examModifier = 0
        switch (examType) {
            case '一模': examModifier = -10; break
            case '二模': examModifier = -5; break
            case '三模': examModifier = 0; break
            case '期末': examModifier = 5; break
            default: examModifier = 0
        }

        // 生成各科成绩
        const scores = {
            '语文': Mock.Random.integer(85 + examModifier, 145 + examModifier),
            '数学': Mock.Random.integer(80 + examModifier, 140 + examModifier),
            '英语': Mock.Random.integer(75 + examModifier, 140 + examModifier),
            '物理': Mock.Random.integer(60 + examModifier, 100 + examModifier),
            '化学': Mock.Random.integer(65 + examModifier, 100 + examModifier),
            '生物': Mock.Random.integer(70 + examModifier, 100 + examModifier)
        }

        // 计算总分
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

        students.push({
            id: `student_${i + 1}`,
            studentNo,
            name,
            className: '高三(1)班',
            scores,
            totalScore
        })
    }

    // 按总分排序
    students.sort((a, b) => b.totalScore - a.totalScore)

    // 添加排名
    students.forEach((student, index) => {
        student.rank = index + 1
    })

    return students
}

// 班级统计数据
const classData = {
    '高三(1)班': {
        students: {},
        stats: {
            '一模': {
                '语文': { average: 112.5, distribution: { '不及格': 3, '及格': 10, '优秀': 32 } },
                '数学': { average: 105.8, distribution: { '不及格': 6, '及格': 15, '优秀': 24 } },
                '英语': { average: 98.3, distribution: { '不及格': 4, '及格': 18, '优秀': 23 } },
                '物理': { average: 75.2, distribution: { '不及格': 10, '及格': 22, '优秀': 13 } },
                '化学': { average: 78.6, distribution: { '不及格': 8, '及格': 20, '优秀': 17 } },
                '生物': { average: 82.1, distribution: { '不及格': 5, '及格': 18, '优秀': 22 } }
            },
            '二模': {
                '语文': { average: 114.2, distribution: { '不及格': 2, '及格': 9, '优秀': 34 } },
                '数学': { average: 107.5, distribution: { '不及格': 5, '及格': 13, '优秀': 27 } },
                '英语': { average: 101.1, distribution: { '不及格': 3, '及格': 16, '优秀': 26 } },
                '物理': { average: 77.8, distribution: { '不及格': 8, '及格': 21, '优秀': 16 } },
                '化学': { average: 80.3, distribution: { '不及格': 7, '及格': 19, '优秀': 19 } },
                '生物': { average: 84.2, distribution: { '不及格': 4, '及格': 17, '优秀': 24 } }
            },
            '三模': {
                '语文': { average: 115.8, distribution: { '不及格': 2, '及格': 8, '优秀': 35 } },
                '数学': { average: 109.1, distribution: { '不及格': 4, '及格': 12, '优秀': 29 } },
                '英语': { average: 103.5, distribution: { '不及格': 3, '及格': 14, '优秀': 28 } },
                '物理': { average: 79.2, distribution: { '不及格': 7, '及格': 19, '优秀': 19 } },
                '化学': { average: 81.8, distribution: { '不及格': 6, '及格': 17, '优秀': 22 } },
                '生物': { average: 85.4, distribution: { '不及格': 4, '及格': 15, '优秀': 26 } }
            },
            '期末': {
                '语文': { average: 117.3, distribution: { '不及格': 1, '及格': 7, '优秀': 37 } },
                '数学': { average: 110.6, distribution: { '不及格': 3, '及格': 11, '优秀': 31 } },
                '英语': { average: 105.2, distribution: { '不及格': 2, '及格': 13, '优秀': 30 } },
                '物理': { average: 80.7, distribution: { '不及格': 6, '及格': 18, '优秀': 21 } },
                '化学': { average: 83.4, distribution: { '不及格': 5, '及格': 16, '优秀': 24 } },
                '生物': { average: 86.9, distribution: { '不及格': 3, '及格': 14, '优秀': 28 } }
            }
        }
    },
    '高三(2)班': {
        students: {},
        stats: {
            '一模': {
                '语文': { average: 115.8, distribution: { '不及格': 2, '及格': 9, '优秀': 34 } },
                '数学': { average: 108.9, distribution: { '不及格': 5, '及格': 13, '优秀': 27 } },
                '英语': { average: 102.4, distribution: { '不及格': 3, '及格': 15, '优秀': 27 } },
                '物理': { average: 77.6, distribution: { '不及格': 8, '及格': 20, '优秀': 17 } },
                '化学': { average: 80.8, distribution: { '不及格': 7, '及格': 18, '优秀': 20 } },
                '生物': { average: 84.3, distribution: { '不及格': 5, '及格': 16, '优秀': 24 } }
            },
            '二模': {
                '语文': { average: 117.2, distribution: { '不及格': 1, '及格': 8, '优秀': 36 } },
                '数学': { average: 110.3, distribution: { '不及格': 4, '及格': 11, '优秀': 30 } },
                '英语': { average: 104.8, distribution: { '不及格': 2, '及格': 13, '优秀': 30 } },
                '物理': { average: 79.4, distribution: { '不及格': 6, '及格': 19, '优秀': 19 } },
                '化学': { average: 82.5, distribution: { '不及格': 5, '及格': 17, '优秀': 23 } },
                '生物': { average: 86.1, distribution: { '不及格': 4, '及格': 15, '优秀': 26 } }
            },
            '三模': {
                '语文': { average: 118.6, distribution: { '不及格': 1, '及格': 7, '优秀': 37 } },
                '数学': { average: 111.7, distribution: { '不及格': 3, '及格': 10, '优秀': 32 } },
                '英语': { average: 106.2, distribution: { '不及格': 2, '及格': 12, '优秀': 31 } },
                '物理': { average: 80.8, distribution: { '不及格': 5, '及格': 18, '优秀': 22 } },
                '化学': { average: 84.1, distribution: { '不及格': 4, '及格': 16, '优秀': 25 } },
                '生物': { average: 87.5, distribution: { '不及格': 3, '及格': 14, '优秀': 28 } }
            },
            '期末': {
                '语文': { average: 119.8, distribution: { '不及格': 1, '及格': 6, '优秀': 38 } },
                '数学': { average: 112.9, distribution: { '不及格': 2, '及格': 9, '优秀': 34 } },
                '英语': { average: 107.6, distribution: { '不及格': 1, '及格': 11, '优秀': 33 } },
                '物理': { average: 82.1, distribution: { '不及格': 4, '及格': 17, '优秀': 24 } },
                '化学': { average: 85.3, distribution: { '不及格': 3, '及格': 15, '优秀': 27 } },
                '生物': { average: 88.7, distribution: { '不及格': 2, '及格': 13, '优秀': 30 } }
            }
        }
    },
    '高三(3)班': {
        students: {},
        stats: {
            '一模': {
                '语文': { average: 110.2, distribution: { '不及格': 4, '及格': 12, '优秀': 29 } },
                '数学': { average: 103.5, distribution: { '不及格': 8, '及格': 17, '优秀': 20 } },
                '英语': { average: 96.8, distribution: { '不及格': 5, '及格': 20, '优秀': 20 } },
                '物理': { average: 73.4, distribution: { '不及格': 12, '及格': 24, '优秀': 9 } },
                '化学': { average: 76.9, distribution: { '不及格': 10, '及格': 22, '优秀': 13 } },
                '生物': { average: 80.6, distribution: { '不及格': 7, '及格': 20, '优秀': 18 } }
            },
            '二模': {
                '语文': { average: 111.8, distribution: { '不及格': 3, '及格': 11, '优秀': 31 } },
                '数学': { average: 105.2, distribution: { '不及格': 7, '及格': 15, '优秀': 23 } },
                '英语': { average: 98.9, distribution: { '不及格': 4, '及格': 18, '优秀': 23 } },
                '物理': { average: 75.1, distribution: { '不及格': 10, '及格': 22, '优秀': 13 } },
                '化学': { average: 78.6, distribution: { '不及格': 8, '及格': 20, '优秀': 17 } },
                '生物': { average: 82.3, distribution: { '不及格': 6, '及格': 18, '优秀': 21 } }
            },
            '三模': {
                '语文': { average: 113.4, distribution: { '不及格': 3, '及格': 10, '优秀': 32 } },
                '数学': { average: 106.8, distribution: { '不及格': 6, '及格': 14, '优秀': 25 } },
                '英语': { average: 100.5, distribution: { '不及格': 3, '及格': 16, '优秀': 26 } },
                '物理': { average: 76.7, distribution: { '不及格': 9, '及格': 21, '优秀': 15 } },
                '化学': { average: 80.2, distribution: { '不及格': 7, '及格': 19, '优秀': 19 } },
                '生物': { average: 83.9, distribution: { '不及格': 5, '及格': 17, '优秀': 23 } }
            },
            '期末': {
                '语文': { average: 114.9, distribution: { '不及格': 2, '及格': 9, '优秀': 34 } },
                '数学': { average: 108.3, distribution: { '不及格': 5, '及格': 13, '优秀': 27 } },
                '英语': { average: 102.1, distribution: { '不及格': 2, '及格': 15, '优秀': 28 } },
                '物理': { average: 78.2, distribution: { '不及格': 8, '及格': 19, '优秀': 18 } },
                '化学': { average: 81.7, distribution: { '不及格': 6, '及格': 17, '优秀': 22 } },
                '生物': { average: 85.4, distribution: { '不及格': 4, '及格': 16, '优秀': 25 } }
            }
        }
    }
}

// 为每个班级生成学生数据
Object.keys(classData).forEach(className => {
    ['一模', '二模', '三模', '期末'].forEach(exam => {
        classData[className].students[exam] = generateStudentScores(exam)
        classData[className].students[exam].forEach(student => {
            student.className = className
        })
    })
})

const classScoresApi = {
    // 获取班级成绩统计
    getClassScoreStats: (data) => {
        const { className = '高三(1)班', exam = '期末' } = data || {}

        if (!classData[className]) {
            return {
                code: 404,
                message: '班级不存在',
                data: null
            }
        }

        const stats = classData[className].stats[exam]
        if (!stats) {
            return {
                code: 404,
                message: '考试数据不存在',
                data: null
            }
        }

        const statsArray = Object.keys(stats).map(subject => ({
            subject,
            average: stats[subject].average,
            studentCount: 45,
            distribution: stats[subject].distribution
        }))

        return {
            code: 200,
            data: {
                className,
                exam,
                totalStudents: 45,
                stats: statsArray
            }
        }
    },

    // 获取班级列表
    getClassList: () => {
        return {
            code: 200,
            data: ['高三(1)班', '高三(2)班', '高三(3)班']
        }
    },

    // 获取考试列表
    getExamList: () => {
        return {
            code: 200,
            data: ['一模', '二模', '三模', '期末']
        }
    },

    // 获取学生成绩列表
    getStudentScores: (data) => {
        const { page = 1, limit = 20, className = '高三(1)班', exam = '期末' } = data || {}

        if (!classData[className] || !classData[className].students[exam]) {
            return {
                code: 404,
                message: '数据不存在',
                data: {
                    list: [],
                    total: 0
                }
            }
        }

        const students = classData[className].students[exam].map(student => ({
            id: student.id,
            studentNo: student.studentNo,
            name: student.name,
            className: student.className,
            currentExamScores: student.scores,
            totalScore: student.totalScore,
            rank: student.rank
        }))

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