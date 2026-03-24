<template>
    <div class="top-bar">
        <div class="left-section">
            <el-button class="collapse-btn" size="small" @click="changeShow">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>
            <span class="platform-name">成绩分析与追踪平台</span>
        </div>
        <div class="tags-wrapper">
            <Tap />
        </div>

        <div class="right-section">
            <el-dropdown trigger="click" class="user-dropdown" @command="handleCommand">
                <span class="user-link">
                    <img src="@/assets/冰菓1.jpg" class="user-avatar" />
                    <span class="user-name">{{ userName }}</span>
                    <el-icon class="dropdown-icon">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile">
                            <el-icon>
                                <User />
                            </el-icon>个人信息
                        </el-dropdown-item>
                        <el-dropdown-item command="logout" divided>
                            <el-icon>
                                <SwitchButton />
                            </el-icon>退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
    import { computed, nextTick } from 'vue'
    import { useRouter } from 'vue-router'
    import { ArrowRight, ArrowDown, Menu, User, SwitchButton } from '@element-plus/icons-vue'
    import { useAllDataStore } from '@/stores/index'
    import { ElMessage } from 'element-plus'
    import Tap from './Tap.vue'

    const router = useRouter()
    const stores = useAllDataStore()

    const changeShow = () => {
        stores.state.isShow = !stores.state.isShow
    }

    const userName = computed(() => {
        const role = stores.state.role
        if (role === 'admin') return '高级管理员'
        if (role === 'teacher') return '教师'
        if (role === 'student') return '学生'
        return '管理员'
    })

    const handleCommand = (command) => {
        if (command === 'logout') {
            logout()
        } else if (command === 'profile') {
            ElMessage.info('个人信息功能待实现')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('menuList')
        localStorage.removeItem('role')

        stores.state.menuList = []
        stores.state.token = ''
        stores.state.role = ''
        stores.state.tags = [{
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 'home'
        }]
        stores.state.currentMenu = null

        nextTick(() => {
            router.replace('/login')
        })

        ElMessage.success('已退出登录')
    }
</script>

<style scoped>
    .top-bar {
        width: 100%;
        height: 60px;
        padding: 0 16px 0 24px;
        display: flex;
        align-items: center;
        background: linear-gradient(145deg, #2b2f3a 0%, #1e2128 100%);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        color: #fff;
        box-sizing: border-box;
    }

    .left-section {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
        /* 防止被压缩 */
    }

    .collapse-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 8px;
        color: #fff;
        transition: all 0.2s;
    }

    .collapse-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffd04b;
    }

    .collapse-btn .el-icon {
        font-size: 18px;
    }

    .platform-name {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 1px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        padding-right: 16px;
        line-height: 30px;
        color: #ffd04b;
        white-space: nowrap;
    }

    .breadcrumb {
        color: #e0e0e0;
        font-weight: 400;
        white-space: nowrap;
    }

    :deep(.breadcrumb .el-breadcrumb__inner) {
        color: #e0e0e0 !important;
        font-weight: 400;
    }

    :deep(.breadcrumb .el-breadcrumb__inner:hover) {
        color: #ffd04b !important;
    }

    :deep(.breadcrumb .el-breadcrumb__separator) {
        color: #888;
    }

    /* 标签页包装器：占据剩余空间，横向滚动 */
    .tags-wrapper {
        flex: 1 1 auto;
        min-width: 0;
        /* 允许内容收缩 */
        margin: 0 20px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        height: 40px;
        /* 与标签高度匹配 */
        line-height: 40px;
    }

    /* 隐藏滚动条（可选） */
    .tags-wrapper::-webkit-scrollbar {
        height: 4px;
    }

    .tags-wrapper::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }

    /* 标签页组件内部样式调整，使其更适合顶部栏 */
    :deep(.tags) {
        margin: 0 !important;
        padding: 0 !important;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    :deep(.el-tag) {
        margin-right: 0 !important;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: #e0e0e0;
        border-radius: 16px;
        transition: all 0.2s;
        cursor: pointer;
        height: 32px;
        line-height: 30px;
        padding: 0 12px;
    }

    :deep(.el-tag:hover) {
        background: rgba(255, 255, 255, 0.2);
        color: #ffd04b;
    }

    :deep(.el-tag.el-tag--dark) {
        background: #ffd04b;
        color: #333;
    }

    :deep(.el-tag .el-tag__close) {
        color: #e0e0e0;
    }

    :deep(.el-tag .el-tag__close:hover) {
        background-color: rgba(255, 255, 255, 0.3);
        color: #fff;
    }

    .right-section {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-left: 10px;
    }

    .user-dropdown {
        cursor: pointer;
        outline: none;
    }

    .user-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px 4px 6px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 30px;
        transition: background 0.2s;
    }

    .user-link:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #ffd04b;
        object-fit: cover;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .user-name {
        font-size: 14px;
        color: #fff;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .dropdown-icon {
        font-size: 14px;
        color: #aaa;
    }
</style>