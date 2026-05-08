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
                    <span class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <span class="user-role">{{ stores.state.role }}</span>
                    </span>
                    <el-icon class="dropdown-icon">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu class="user-dropdown-menu">
                        <div class="user-dropdown-header">
                            <img src="@/assets/冰菓1.jpg" class="dropdown-avatar" />
                            <div class="dropdown-user-info">
                                <div class="dropdown-user-name">{{ userName }}</div>
                                <div class="dropdown-user-role">{{ stores.state.role }}</div>
                            </div>
                        </div>
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

<script setup lang="ts">
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
        switch (role) {
            case 'admin': return '高级管理员'
            case 'teacher': return '教师'
            case 'student': return '郭玉峰'  // 显示具体学生姓名
            default: return '管理员'
        }
    })

    const handleCommand = (command: string) => {
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
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .collapse-btn:hover {
        background: rgba(255, 208, 75, 0.2);
        color: #ffd04b;
        transform: scale(1.05);
    }

    .collapse-btn:active {
        transform: scale(0.95);
    }

    .collapse-btn .el-icon {
        font-size: 18px;
    }

    .platform-name {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        padding-right: 16px;
        line-height: 30px;
        color: #ffd04b;
        white-space: nowrap;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

    .tags-wrapper::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
    }

    .tags-wrapper::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }

    .tags-wrapper::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 208, 75, 0.3);
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
        font-size: 13px;
        font-weight: 500;

        &:hover {
            background: rgba(255, 208, 75, 0.2);
            color: #ffd04b;
            transform: translateY(-1px);
        }
    }

    :deep(.el-tag.el-tag--dark) {
        background: linear-gradient(135deg, #ffd04b 0%, #ffab00 100%);
        color: #333;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(255, 208, 75, 0.3);
    }

    :deep(.el-tag .el-tag__close) {
        color: #e0e0e0;
        transition: all 0.2s;
    }

    :deep(.el-tag .el-tag__close:hover) {
        background-color: rgba(255, 255, 255, 0.2);
        color: #ffd04b;
        transform: scale(1.1);
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
        padding: 4px 12px 4px 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 30px;
        transition: all 0.2s;
        cursor: pointer;
    }

    .user-link:hover {
        background: rgba(255, 208, 75, 0.15);
        transform: translateY(-1px);
    }

    .user-link:active {
        transform: translateY(0);
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #ffd04b;
        object-fit: cover;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    .user-name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .user-role {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .dropdown-icon {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.2s;
    }

    .user-link:hover .dropdown-icon {
        color: #ffd04b;
    }

    /* 下拉菜单样式 */
    :deep(.el-dropdown-menu) {
        border-radius: 12px;
        border: none;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        padding: 8px;
    }

    .user-dropdown-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 8px;
    }

    .dropdown-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #ffd04b;
        object-fit: cover;
    }

    .dropdown-user-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .dropdown-user-name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }

    .dropdown-user-role {
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    :deep(.el-dropdown-menu__item) {
        border-radius: 8px;
        margin: 2px 0;
        transition: all 0.2s;

        &:hover {
            background-color: rgba(24, 144, 255, 0.1);
        }

        &:not(.is-disabled):hover {
            color: #1890ff;
        }
    }

    :deep(.el-dropdown-menu__item--divided) {
        border-top-color: #f0f0f0;
        margin-top: 8px;
        padding-top: 8px;
    }
</style>