<script setup lang="ts">
    import { computed } from 'vue';
    import { useAllDataStore } from '@/stores/index';
    import { useRouter, useRoute } from 'vue-router';
    import type { MenuItem } from '@/types'

    const stores = useAllDataStore()

    const list = computed(() => stores.state.menuList)
    const isShow = computed(() => stores.state.isShow)
    const width = computed(() => isShow.value ? '64px' : '180px')

    const handleOpen = () => {
        // 菜单展开事件
    }

    const handleClose = () => {
        // 菜单收起事件
    }

    const router = useRouter()
    const route = useRoute()
    const activeMenu = computed(() => route.path)

    const handleMenu = (val: MenuItem) => {
        router.push(val.path)
        stores.selectMenu(val)
    }

    const list_noChildren = computed(() => list.value.filter((item: MenuItem) => !item.children))
    const list_hasChildren = computed(() => list.value.filter((item: MenuItem) => item.children))

    // console.log('111', isShow.value)
    // console.log(list_noChildren.value, list_hasChildren.value)
</script>

<template>
    <div :width=width class="sidebar-container">
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
            :default-active="activeMenu" text-color="#fff" :collapse="isShow" :collapse-transition="false"
            @open="handleOpen" @close="handleClose">
            <div class="sidebar-header">
                <h3 v-show="isShow" class="tit collapsed">→</h3>
                <h3 v-show="!isShow" class="tit expanded">成绩通</h3>
            </div>

            <el-menu-item v-for="value in list_noChildren" :index="value.path" :key="value.name"
                @click="handleMenu(value)" class="menu-item">
                <el-icon class="icons">
                    <component :is="value.icon" class="icons"></component>
                </el-icon>
                <span>{{ value.label }}</span>
            </el-menu-item>

            <el-sub-menu v-for="value in list_hasChildren" :index="value.path" :key="value.name" class="sub-menu">
                <template #title>
                    <el-icon class="icons">
                        <component :is="value.icon" class="icons"></component>
                    </el-icon>
                    <span>{{ value.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(item, index) in value.children" :index="item.path" :key="index"
                        @click="handleMenu(item)" class="sub-menu-item">
                        <el-icon class="icons">
                            <component :is="item.icon" class="icons"></component>
                        </el-icon>
                        <span>{{ item.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<style scoped>
    .sidebar-container {
        transition: all 0.3s ease;
    }

    .sidebar-header {
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 8px;
    }

    .tit {
        color: #ffd04b;
        text-align: center;
        font-weight: 700;
        margin: 0;
        transition: all 0.3s ease;

        &.collapsed {
            font-size: 20px;
            line-height: 32px;
        }

        &.expanded {
            font-size: 20px;
            line-height: 32px;
            letter-spacing: 1px;
        }
    }

    .icons {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        transition: all 0.2s ease;
    }

    .el-menu-vertical-demo {
        min-height: 100vh;
        border: 0;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

        :deep(.el-menu-item) {
            border-radius: 0 24px 24px 0;
            margin: 2px 8px 2px 0;
            height: 48px;
            line-height: 48px;
            transition: all 0.2s ease;

            &:hover {
                background-color: rgba(255, 208, 75, 0.1);
                color: #ffd04b;

                .icons {
                    transform: scale(1.1);
                }
            }

            &.is-active {
                background-color: rgba(255, 208, 75, 0.15);
                color: #ffd04b;
                font-weight: 500;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 20px;
                    background-color: #ffd04b;
                    border-radius: 0 2px 2px 0;
                }
            }
        }

        :deep(.el-sub-menu) {
            .el-sub-menu__title {
                border-radius: 0 24px 24px 0;
                margin: 2px 8px 2px 0;
                height: 48px;
                line-height: 48px;
                transition: all 0.2s ease;

                &:hover {
                    background-color: rgba(255, 208, 75, 0.1);
                    color: #ffd04b;
                }
            }

            .el-menu-item-group__title {
                padding: 0;
                margin: 0 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.4);
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .el-menu-item {
                padding-left: 24px !important;
                font-size: 14px;
                opacity: 0.9;

                &:hover {
                    opacity: 1;
                }

                &.is-active {
                    opacity: 1;
                }
            }
        }

        :deep(.el-sub-menu__icon-arrow) {
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.2s ease;
        }

        :deep(.el-sub-menu.is-opened) {
            .el-sub-menu__icon-arrow {
                color: #ffd04b;
            }
        }
    }

    /* 收起状态下的特殊样式 */
    .el-menu-vertical-demo.is-collapse {
        :deep(.el-menu-item),
        :deep(.el-sub-menu__title) {
            border-radius: 8px;
            margin: 4px 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;

            .icons {
                margin-right: 0;
                font-size: 18px;
            }
        }

        .sidebar-header {
            padding: 12px 0;
        }

        .tit.collapsed {
            font-size: 18px;
        }
    }
</style>
