import Mock from 'mockjs'

// 生成模拟申诉数据
let appealList = []
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物']
const exams = ['一模', '二模', '三模', '期末']
const students = [
    { id: '001', name: '郭玉峰', className: '高一（13）班' },
    { id: '002', name: '李四', className: '高一（10）班' },
    { id: '003', name: '王五', className: '高一（8）班' },
    { id: '004', name: '赵六', className: '高一（12）班' },
    { id: '005', name: '钱七', className: '高一（15）班' }
]

// 生成初始申诉数据
// 为了演示，学生001默认没有申诉数据，其他学生有申诉数据
for (let i = 0; i < 20; i++) {
    let student
    do {
        student = students[Math.floor(Math.random() * students.length)]
    } while (student.id === '001') // 跳过学生001，让他们默认没有申诉
    const subject = subjects[Math.floor(Math.random() * subjects.length)]
    const exam = exams[Math.floor(Math.random() * exams.length)]
    const originalScore = Mock.Random.integer(60, 120)
    const appealedScore = originalScore + Mock.Random.integer(1, 15)

    appealList.push({
        id: Mock.Random.guid(),
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        examName: exam,
        subject,
        originalScore,
        appealedScore,
        reason: Mock.Random.pick([
            '答题卡填涂有误',
            '分数计算错误',
            '漏批题目',
            '标准答案有争议',
            '考试过程有特殊情况'
        ]),
        status: Mock.Random.pick(['pending', 'approved', 'rejected']),
        createdAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        processedBy: Mock.Random.pick(['张老师', '李老师', '王老师']),
        processNote: Mock.Random.pick([
            '经核实，分数计算无误',
            '确实存在批改错误，已更正',
            '证据不足，维持原判',
            '特殊情况，酌情处理'
        ])
    })
}

export default {
    // 获取申诉列表（管理员/教师）
    getAppealList: config => {
        const { studentName, studentId, status, subject, examName, page = 1, limit = 10 } = JSON.parse(config.body || '{}')

        let filteredList = appealList.filter(appeal => {
            if (studentId && appeal.studentId !== studentId) return false
            if (studentName && !appeal.studentName.includes(studentName)) return false
            if (status && appeal.status !== status) return false
            if (subject && appeal.subject !== subject) return false
            if (examName && !appeal.examName.includes(examName)) return false
            return true
        })

        const total = filteredList.length
        const start = (page - 1) * limit
        const end = start + limit
        const pageList = filteredList.slice(start, end)

        return {
            code: 200,
            data: {
                list: pageList,
                total
            }
        }
    },

    // 提交申诉（学生）
    submitAppeal: config => {
        const { examName, subject, originalScore, appealedScore, reason } = JSON.parse(config.body)

        const newAppeal = {
            id: Mock.Random.guid(),
            studentId: '001', // 当前登录学生ID，这里模拟为001
            studentName: '郭玉峰', // 学生001的姓名
            className: '高一（13）班', // 郭玉峰的班级
            examName,
            subject,
            originalScore,
            appealedScore,
            reason,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        appealList.unshift(newAppeal)

        return {
            code: 200,
            message: '申诉提交成功，请耐心等待处理结果'
        }
    },

    // 处理申诉（教师/管理员）
    processAppeal: config => {
        const { id, status, processNote } = JSON.parse(config.body)

        const appeal = appealList.find(a => a.id === id)
        if (appeal) {
            appeal.status = status
            appeal.processNote = processNote
            appeal.processedBy = '当前处理人' // 实际应该是当前登录用户
            appeal.updatedAt = new Date().toISOString()
        }

        return {
            code: 200,
            message: status === 'approved' ? '申诉已通过' : '申诉已驳回'
        }
    },

    // 获取我的申诉（学生）
    getMyAppeals: config => {
        const { status, subject, examName, page = 1, limit = 10 } = JSON.parse(config.body || '{}')

        // 模拟当前学生ID为001
        let myAppeals = appealList.filter(appeal => appeal.studentId === '001')

        // 应用筛选条件
        if (status) {
            myAppeals = myAppeals.filter(appeal => appeal.status === status)
        }
        if (subject) {
            myAppeals = myAppeals.filter(appeal => appeal.subject === subject)
        }
        if (examName) {
            myAppeals = myAppeals.filter(appeal => appeal.examName.includes(examName))
        }
        const total = myAppeals.length
        const start = (page - 1) * limit
        const end = start + limit
        const pageList = myAppeals.slice(start, end)

        return {
            code: 200,
            data: {
                list: pageList,
                total
            }
        }
    }
}