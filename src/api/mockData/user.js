import Mock from 'mockjs'

let List = []
const count = 200
const classes = ['高三(1)班', '高三(2)班', '高三(3)班', '高三(4)班']

for (let i = 0; i < count; i++) {
    const chinese = Mock.Random.integer(60, 150)
    const math = Mock.Random.integer(60, 150)
    const english = Mock.Random.integer(60, 150)
    const total = chinese + math + english
    List.push({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        studentNo: '2024' + String(i + 1).padStart(4, '0'),
        className: classes[Math.floor(Math.random() * classes.length)],
        chinese,
        math,
        english,
        total,
        rank: Mock.Random.integer(1, count),
        examDate: Mock.Random.date('yyyy-MM-dd')
    })
}

export default {
    // 获取学生列表（支持姓名搜索、班级筛选）
    getUserList: config => {
        const { name, className, page = 1, limit = 10 } = JSON.parse(config.body || '{}')
        let mockList = List.filter(item => {
            if (name && item.name.indexOf(name) === -1) return false
            if (className && item.className !== className) return false
            return true
        })
        const total = mockList.length
        const start = (page - 1) * limit
        const end = start + limit
        const pageList = mockList.slice(start, end)
        return {
            code: 200,
            data: {
                list: pageList,
                total
            }
        }
    },

    // 删除学生
    deleteUser: config => {
        const { id } = JSON.parse(config.body)
        List = List.filter(u => u.id !== id)
        return { code: 200, message: '删除成功' }
    },

    // 添加学生
    createUser: config => {
        const { name, studentNo, className, chinese, math, english } = JSON.parse(config.body)
        const total = chinese + math + english
        List.unshift({
            id: Mock.Random.guid(),
            name,
            studentNo,
            className,
            chinese,
            math,
            english,
            total,
            rank: Mock.Random.integer(1, List.length + 1),
            examDate: Mock.Random.date('yyyy-MM-dd')
        })
        return { code: 200, message: '添加成功' }
    },

    // 修改学生
    updateUser: config => {
        const { id, name, studentNo, className, chinese, math, english } = JSON.parse(config.body)
        const total = chinese + math + english
        List.some(u => {
            if (u.id === id) {
                u.name = name
                u.studentNo = studentNo
                u.className = className
                u.chinese = chinese
                u.math = math
                u.english = english
                u.total = total
                return true
            }
        })
        return { code: 200, message: '编辑成功' }
    }
}