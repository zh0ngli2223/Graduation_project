import Mock from 'mockjs'

// 生成学生数据 - 三个班，每个班30人
const classes = ['高一（10）班', '高一（11）班', '高一（12）班']
const studentNames = [
  '郭玉峰', '李明', '王芳', '张伟', '刘洋', '陈静', '杨帆', '赵雷', '孙丽', '周杰',
  '吴迪', '郑华', '冯涛', '褚伟', '卫强', '蒋超', '沈莹', '韩磊', '杨琳', '朱鹏',
  '秦雪', '尤佳', '许辉', '何洁', '吕蒙', '施阳', '张凯', '孔宇', '曹阳', '严冰',
  '华磊', '金鑫', '魏娟', '陶磊', '姜峰', '戚颖', '谢军', '邹鹏', '窦勇', '章伟',
  '方敏', '任静', '余涛', '夏雪', '薛磊', '阎红', '雷阳', '史鹏', '候娟', '谭军',
  '廖磊', '汪明', '文涛', '段颖', '钱阳', '常鹏', '武娟', '贺磊', '龚明', '龙涛',
  '段玉', '江山', '岳峰', '南冰', '卓然', '舒畅', '宁静', '夏天', '田野', '金秋',
  '田野', '白雪', '黎明', '朝阳', '星辰', '海洋', '山峰', '溪流', '森林', '花园'
]

let List = []
let studentCount = 0

classes.forEach((className, classIndex) => {
  for (let i = 0; i < 30; i++) {
    studentCount++
    const studentNo = `${new Date().getFullYear()}${String(classIndex + 10).padStart(2, '0')}${String(i + 1).padStart(2, '0')}`
    const chinese = Mock.Random.integer(85, 135)
    const math = Mock.Random.integer(90, 150)
    const english = Mock.Random.integer(80, 140)
    const total = chinese + math + english

    List.push({
        id: Mock.Random.guid(),
        studentNo,
        name: studentNames[studentCount - 1] || `学生${studentCount}`,
        className,
        chinese,
        math,
        english,
        total,
        rank: 0, // 将在计算时更新
        examDate: Mock.Random.date('yyyy-MM-dd')
    })
  }
})

// 计算排名
const calculateRanks = (students) => {
  students.sort((a, b) => b.total - a.total)
  students.forEach((student, index) => {
    student.rank = index + 1
  })
  return students
}

// 初始计算排名
calculateRanks(List)

export default {
    // 获取学生列表（支持姓名搜索、班级筛选）
    getUserList: config => {
        const { name, className, page = 1, limit = 10 } = JSON.parse(config.body || '{}')
        let mockList = List.filter(item => {
            if (name && item.name.indexOf(name) === -1) return false
            if (className && item.className !== className) return false
            return true
        })

        // 重新计算排名（基于筛选后的结果）
        calculateRanks(mockList)

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

        // 检查学号是否重复
        if (List.some(student => student.studentNo === studentNo)) {
            return { code: 400, message: '学号已存在' }
        }

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
            rank: 0,
            examDate: Mock.Random.date('yyyy-MM-dd')
        })

        // 重新计算排名
        calculateRanks(List)
        return { code: 200, message: '添加成功' }
    },

    // 修改学生
    updateUser: config => {
        const { id, name, studentNo, className, chinese, math, english } = JSON.parse(config.body)

        // 检查学号是否重复（排除自己）
        if (List.some(s => s.id !== id && s.studentNo === studentNo)) {
            return { code: 400, message: '学号已存在' }
        }

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

        // 重新计算排名
        calculateRanks(List)
        return { code: 200, message: '编辑成功' }
    }
}