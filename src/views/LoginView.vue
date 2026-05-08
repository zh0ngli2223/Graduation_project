<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router';
    import { useAllDataStore } from '@/stores'
    import { ElMessage } from 'element-plus'
    import { User, Lock } from '@element-plus/icons-vue'
    import type { LoginForm } from '@/types'
    import { useApi, safeApiCall } from '@/utils/api'

    const store = useAllDataStore()
    const router = useRouter()
    const api = useApi()

    const loading = ref(false)

    const loginForm = reactive<LoginForm>({
        username: 'admin',
        password: 'admin',
    });

    const fillDemoAccount = (type: string) => {
        switch (type) {
            case 'admin':
                loginForm.username = 'admin'
                loginForm.password = 'admin'
                break
            case 'teacher':
                loginForm.username = 'teacher'
                loginForm.password = 'teacher'
                break
            case 'student':
                loginForm.username = 'student'
                loginForm.password = 'student'
                break
        }
        ElMessage.info(`已填充${type === 'admin' ? '管理员' : type === 'teacher' ? '教师' : '学生'}账号`)
    }

    const login = async () => {
        if (!loginForm.username || !loginForm.password) {
            ElMessage.warning('请输入账号和密码')
            return
        }

        loading.value = true
        try {
            const res = await safeApiCall(
                api.getMenu(loginForm),
                '登录失败'
            )

            if (res && res.code === 200) {
                store.updateMenuList(res.data.menuList)
                store.setToken(res.data.token)
                store.setRole(res.data.role)
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('menuList', JSON.stringify(res.data.menuList))
                localStorage.setItem('role', res.data.role)

                ElMessage.success('登录成功')
                router.push("/home")
            } else {
                ElMessage.error(res?.data?.message || '登录失败')
            }
        } catch (error) {
            ElMessage.error('登录失败，请检查用户名或密码')
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <div class="body_login">
        <div class="login-wrapper">
            <el-form :model="loginForm" class="login-container" @submit.prevent="login">
                <div class="login-header">
                    <h2>成绩分析与追踪平台</h2>
                    <p>欢迎登录系统</p>
                </div>

                <el-form-item>
                    <el-input
                        type="text"
                        placeholder="请输入账号"
                        v-model="loginForm.username"
                        prefix-icon="User"
                        size="large"
                        autocomplete="username"
                    />
                </el-form-item>

                <el-form-item>
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="loginForm.password"
                        prefix-icon="Lock"
                        size="large"
                        show-password
                        autocomplete="current-password"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        @click="login"
                        size="large"
                        class="login-button"
                        :loading="loading"
                    >
                        登录
                    </el-button>
                </el-form-item>

                <div class="demo-accounts">
                    <p class="demo-title">演示账号快速登录：</p>
                    <div class="demo-buttons">
                        <el-button size="small" @click="fillDemoAccount('admin')" type="primary">管理员</el-button>
                        <el-button size="small" @click="fillDemoAccount('teacher')" type="success">教师</el-button>
                        <el-button size="small" @click="fillDemoAccount('student')" type="warning">学生</el-button>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .body_login {
        width: 100%;
        height: 100vh;
        background-image: url('../assets/background.png');
        background-size: 100% 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-wrapper {
        width: 100%;
        max-width: 420px;
        padding: 0 20px;
    }

    .login-container {
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 40px 35px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);

        .login-header {
            text-align: center;
            margin-bottom: 35px;

            h2 {
                font-size: 28px;
                font-weight: 600;
                color: #1890ff;
                margin-bottom: 8px;
                background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            p {
                color: #666;
                font-size: 14px;
                margin: 0;
            }
        }

        :deep(.el-form-item) {
            margin-bottom: 20px;
        }

        :deep(.el-form-item__content) {
            justify-content: center;
        }

        :deep(.el-input) {
            .el-input__wrapper {
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                transition: all 0.3s;

                &:hover {
                    box-shadow: 0 2px 12px rgba(24, 144, 255, 0.15);
                }

                &.is-focus {
                    box-shadow: 0 2px 12px rgba(24, 144, 255, 0.2);
                }
            }
        }

        .login-button {
            width: 100%;
            height: 44px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
            border: none;
            transition: all 0.3s;
            margin-top: 10px;

            &:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3);
            }

            &:active {
                transform: translateY(0);
            }
        }

        .demo-accounts {
            text-align: center;
            margin-top: 20px;

            .demo-title {
                color: #666;
                font-size: 13px;
                margin-bottom: 12px;
            }

            .demo-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap;

                :deep(.el-button) {
                    min-width: 80px;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.2s;

                    &:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                }
            }
        }
    }

    @media screen and (max-width: 480px) {
        .login-wrapper {
            padding: 0 15px;
        }

        .login-container {
            padding: 30px 25px;

            .login-header {
                h2 {
                    font-size: 24px;
                }
            }
        }
    }
</style>