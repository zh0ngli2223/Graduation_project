<script setup>

    import { reactive, getCurrentInstance } from 'vue'
    import { useRouter } from 'vue-router';
    import { useAllDataStore } from '@/stores'
    import { ElMessage } from 'element-plus'


    const store = useAllDataStore()
    const { proxy } = getCurrentInstance();
    const router = useRouter()
    const loginForm = reactive({
        username: 'admin',
        password: 'admin',
    });

    const login = async () => {
        try {
            const res = await proxy.$api.getMenu(loginForm);
            if (res) {
                store.updateMenuList(res.menuList)
                store.setToken(res.token)
                store.setRole(res.role)
                localStorage.setItem('token', res.token)
                localStorage.setItem('menuList', JSON.stringify(res.menuList))
                localStorage.setItem('role', res.role)
                router.push("/home")
            }
        } catch (error) {
            ElMessage.error(error || '登录失败，请检查用户名或密码')
        }
    }
</script>

<template>
    <div class="body_login">
        <el-form :model="loginForm" class="login-container">
            <h3>系统登录</h3>

            <el-form-item>
                <el-input type="input" placeholder="请输入账号" v-model="loginForm.username">
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password">
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login"> 登录 </el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<style lang="less" scoped>
    .body_login {
        width: 100%;
        height: 100vh;
        background-image: url('../assets/background.png');
        background-size: 100% 100%;
        overflow: hidden;
    }

    .login-container {
        width: 350px;
        background-color: #fff;
        border: 1px solid #eaeaea;
        border-radius: 15px;
        padding: 35px 35px 15px 35px;
        box-shadow: 0 0 25px #cacaca;
        margin: 180px auto;

        h3 {
            text-align: center;
            margin-bottom: 20px;
            color: #505450;
        }

        :deep(.el-form-item__content) {
            justify-content: center;
        }
    }
</style>