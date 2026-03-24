import Mock from 'mockjs'

export default {
    getMenu: config => {
        const { username, password } = JSON.parse(config.body)
        // 模拟三个角色：admin（教务）、teacher（教师）、student（学生）
        if (username === 'admin' && password === 'admin') {
            return {
                code: 200,
                data: {
                    menuList: [
                        { path: '/home', name: 'home', label: '首页', icon: 'House', url: 'Home' },
                        { path: '/score', name: 'score', label: '成绩管理', icon: 'Edit', url: 'ScoreManage' },
                        { path: '/classAnalysis', name: 'classAnalysis', label: '班级分析', icon: 'DataBoard', url: 'ClassAnalysis' },
                        { path: '/student', name: 'student', label: '学生管理', icon: 'User', url: 'StudentManage' },
                        { path: '/appeal', name: 'appeal', label: '申诉处理', icon: 'MessageBox', url: 'AppealManage' },
                        {
                            path: 'report', label: '报告中心', icon: 'Document',
                            children: [
                                { path: '/report/class', name: 'classReport', label: '班级报告', icon: 'DataLine', url: 'ClassReport' },
                                { path: '/report/school', name: 'schoolReport', label: '校级报告', icon: 'DataAnalysis', url: 'SchoolReport' }
                            ]
                        }
                    ],
                    token: Mock.Random.guid(),
                    role: 'admin',
                    message: '获取成功'
                }
            }
        } else if (username === 'teacher' && password === 'teacher') {
            return {
                code: 200,
                data: {
                    menuList: [
                        { path: '/home', name: 'home', label: '首页', icon: 'House', url: 'Home' },
                        { path: '/score', name: 'score', label: '成绩管理', icon: 'Edit', url: 'ScoreManage' },
                        { path: '/classAnalysis', name: 'classAnalysis', label: '班级分析', icon: 'DataBoard', url: 'ClassAnalysis' },
                        { path: '/appeal', name: 'appeal', label: '申诉处理', icon: 'MessageBox', url: 'AppealManage' }
                    ],
                    token: Mock.Random.guid(),
                    role: 'teacher',
                    message: '获取成功'
                }
            }
        } else if (username === 'student' && password === 'student') {
            return {
                code: 200,
                data: {
                    menuList: [
                        { path: '/home', name: 'home', label: '首页', icon: 'House', url: 'Home' },
                        { path: '/myAnalysis', name: 'myAnalysis', label: '我的分析', icon: 'PieChart', url: 'MyAnalysis' },
                        { path: '/appeal', name: 'appeal', label: '我的申诉', icon: 'MessageBox', url: 'MyAppeal' }
                    ],
                    token: Mock.Random.guid(),
                    role: 'student',
                    message: '获取成功'
                }
            }
        } else {
            return { code: -999, data: { message: '账号或密码错误' } }
        }
    }
}