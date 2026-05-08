import request from "./requst";

export default {
    getTableData() {
        return request({ url: '/api/home/getTableData', method: 'get' })
    },
    getCountData() {
        return request({ url: '/api/home/getCountData', method: 'get' })
    },
    getChartData() {
        return request({ url: '/api/home/getChartData', method: 'get' })
    },
    getUserList(data) {
        return request({ url: '/api/user/getUserList', method: 'post', data })
    },
    deleteUser(data) {
        return request({ url: '/user/deleteUser', method: 'post', data })
    },
    addUser(data) {
        return request({ url: '/user/addUser', method: 'post', data })
    },
    editUser(data) {
        return request({ url: '/user/editUser', method: 'post', data })
    },
    getMenu(data) {
        return request({ url: '/permission/getMenu', method: 'post', data })
    },

    // 申诉相关API
    getAppealList(data) {
        return request({ url: '/appeal/list', method: 'post', data })
    },

    submitAppeal(data) {
        return request({ url: '/appeal/submit', method: 'post', data })
    },

    processAppeal(data) {
        return request({ url: '/appeal/process', method: 'post', data })
    },

    getMyAppeals(data) {
        return request({ url: '/appeal/my', method: 'post', data })
    },

    // 班级成绩统计相关API
    getClassScoreStats(data) {
        return request({ url: '/class-scores/stats', method: 'post', data })
    },

    getClassList() {
        return request({ url: '/class-scores/classes', method: 'get' })
    },

    getExamList() {
        return request({ url: '/class-scores/exams', method: 'get' })
    },

    getStudentScores(data) {
        return request({ url: '/class-scores/students', method: 'post', data })
    }
}