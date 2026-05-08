import axios from 'axios'
const service = axios.create()
const NET_ERROR = '网络错误！！！'
// 请求拦截器
service.interceptors.request.use(
    function (config) {
        console.log('拦截的config', config.data)
        // 添加用户角色信息到请求头
        const role = localStorage.getItem('role')
        if (role) {
            config.headers = {
                ...config.headers,
                role: role
            }
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        const response = res.data
        const { code } = response

        if (code === 200) {
            // 成功时返回完整的响应对象
            return response
        } else {
            // 尝试从不同位置获取错误消息
            const errorMsg =
                response.message ||                  // 顶层 message
                (response.data && response.data.message) || // data 内的 message
                NET_ERROR
            return Promise.reject(errorMsg)
        }
    },
    (error) => {
        // 网络错误或请求本身失败
        return Promise.reject(error.message || NET_ERROR)
    }
)
function request(options) {
    options.method = options.method || 'get'
    return service(options)
}
export default request