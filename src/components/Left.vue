<script setup>
    import { computed, ref } from 'vue';
    import { useAllDataStore } from '@/stores/index';
    import { useRouter, useRoute } from 'vue-router';

    const list = computed(() => stores.state.menuList)

    const handleOpen = () => {

    }
    const handleClose = () => { }

    const router = useRouter()
    const route = useRoute()
    const activeMenu = computed(() => route.path)
    const handleMenu = (val) => {
        router.push(val.path)
        stores.selectMenu(val)
    }

    const list_noChildren = computed(() => list.value.filter(item => !item.children))
    const list_hasChildren = computed(() => list.value.filter(item => item.children))
    const stores = useAllDataStore()
    const isShow = computed(() => stores.state.isShow)
    const width = computed(() => isShow.value ? '64px' : '180px')

    // console.log('111', isShow.value)
    // console.log(list_noChildren.value, list_hasChildren.value)
</script>

<template>
    <div :width=width>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
            :default-active="activeMenu" text-color="#fff" :collapse="isShow" :collapse-transition="false"
            @open="handleOpen" @close="handleClose">
            <h3 v-show="isShow" class="tit">→</h3>
            <h3 v-show="!isShow" class="tit">成绩通</h3>
            <el-menu-item v-for="value in list_noChildren" :index="value.path" :key="value.name"
                @click="handleMenu(value)">
                <el-icon class="icons">
                    <component :is="value.icon" class="icons"></component>
                </el-icon>
                <span>{{ value.label }}</span>
            </el-menu-item>

            <el-sub-menu v-for="value in list_hasChildren" :index="value.path" :key="value.name">
                <template #title>
                    <component :is="value.icon" class="icons"></component>
                    <span>{{ value.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(item, index) in value.children" :index="item.path" :key="index"
                        @click="handleMenu(item)">
                        <component :is="item.icon" class="icons"></component>
                        <span>{{ item.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>


        </el-menu>
    </div>
</template>

<style scoped>
    h3 {
        color: white;
        text-align: center;
        line-height: 48px;
    }

    .icons {
        width: 20px;
        height: 20px;
        margin-right: 5px;
    }


    .el-menu-vertical-demo {
        min-height: 100vh;
        border: 0px;
    }

    .tit {
        font-size: larger;
        font-weight: 800;
        color: #ffd04b;
    }

</style>
