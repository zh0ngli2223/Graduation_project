import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'
import appealApi from './mockData/appeal'
import classScoresApi from './mockData/classScores'

Mock.mock(/api\/home\/getTableData/, 'get', homeApi.getTableData)
Mock.mock(/api\/home\/getCountData/, 'get', homeApi.getCountData)
Mock.mock(/api\/home\/getChartData/, 'get', homeApi.getChartData)

Mock.mock(/api\/user\/getUserList/, 'post', userApi.getUserList)
Mock.mock(/user\/deleteUser/, 'post', userApi.deleteUser)
Mock.mock(/user\/addUser/, 'post', userApi.createUser)
Mock.mock(/user\/editUser/, 'post', userApi.updateUser)

Mock.mock(/permission\/getMenu/, 'post', menuApi.getMenu)

// 申诉相关API
Mock.mock(/\/appeal\/list/, 'post', appealApi.getAppealList)
Mock.mock(/\/appeal\/submit/, 'post', appealApi.submitAppeal)
Mock.mock(/\/appeal\/process/, 'post', appealApi.processAppeal)
Mock.mock(/\/appeal\/my/, 'post', appealApi.getMyAppeals)

// 班级成绩统计相关API
Mock.mock(/\/class-scores\/stats/, 'post', classScoresApi.getClassScoreStats)
Mock.mock(/\/class-scores\/classes/, 'get', classScoresApi.getClassList)
Mock.mock(/\/class-scores\/exams/, 'get', classScoresApi.getExamList)
Mock.mock(/\/class-scores\/students/, 'post', classScoresApi.getStudentScores)