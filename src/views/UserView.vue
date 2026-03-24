<template>
    <div class="user-container">
        <!-- 查询栏卡片 -->
        <el-card class="search-card" shadow="never">
            <el-row :gutter="20" align="middle">
                <el-col :xs="24" :sm="8" :md="6" :lg="5">
                    <el-input v-model="searchForm.name" placeholder="学生姓名" clearable @clear="handleSearch"
                        @keyup.enter="handleSearch" />
                </el-col>
                <el-col :xs="24" :sm="8" :md="6" :lg="5">
                    <el-select v-model="searchForm.className" placeholder="选择班级" clearable @change="handleSearch"
                        style="width: 100%">
                        <el-option label="高三(1)班" value="高三(1)班" />
                        <el-option label="高三(2)班" value="高三(2)班" />
                        <el-option label="高三(3)班" value="高三(3)班" />
                        <el-option label="高三(4)班" value="高三(4)班" />
                    </el-select>
                </el-col>
                <el-col :xs="24" :sm="8" :md="6" :lg="5">
                    <div class="search-btns">
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="6" :lg="9" class="add-btn-col">
                    <el-button type="primary" @click="addStudent">+ 新增学生</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 学生表格卡片 -->
        <el-card class="table-card" shadow="never">
            <el-table :data="tableData" border style="width: 100%" v-loading="loading" stripe>
                <el-table-column prop="studentNo" label="学号" width="140" align="center" />
                <el-table-column prop="name" label="姓名" width="140" align="center" />
                <el-table-column prop="className" label="班级" width="150" align="center" />
                <el-table-column prop="chinese" label="语文" width="100" align="center" />
                <el-table-column prop="math" label="数学" width="100" align="center" />
                <el-table-column prop="english" label="英语" width="100" align="center" />
                <el-table-column prop="total" label="总分" width="120" align="center" />
                <el-table-column prop="rank" label="排名" width="100" align="center" />
                <el-table-column label="操作" fixed="right" width="250" align="center">
                    <template #default="scope">
                        <div class="action-btns">
                            <el-button size="small" type="primary" plain @click="editStudent(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" plain @click="deleteStudent(scope.row)">删除</el-button>
                            <el-button size="small" @click="viewDetail(scope.row)">详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize"
                    :current-page="currentPage" @current-change="handlePageChange" />
            </div>
        </el-card>

        <!-- 新增/编辑对话框（内容未变，仅作保留） -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="学号" prop="studentNo">
                    <el-input v-model="form.studentNo" />
                </el-form-item>
                <el-form-item label="班级" prop="className">
                    <el-select v-model="form.className" placeholder="请选择" style="width: 100%">
                        <el-option label="高三(1)班" value="高三(1)班" />
                        <el-option label="高三(2)班" value="高三(2)班" />
                        <el-option label="高三(3)班" value="高三(3)班" />
                        <el-option label="高三(4)班" value="高三(4)班" />
                    </el-select>
                </el-form-item>
                <el-form-item label="语文" prop="chinese">
                    <el-input-number v-model="form.chinese" :min="0" :max="150" style="width: 100%" />
                </el-form-item>
                <el-form-item label="数学" prop="math">
                    <el-input-number v-model="form.math" :min="0" :max="150" style="width: 100%" />
                </el-form-item>
                <el-form-item label="英语" prop="english">
                    <el-input-number v-model="form.english" :min="0" :max="150" style="width: 100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'

    const { proxy } = getCurrentInstance()
    const tableData = ref([])
    const total = ref(0)
    const pageSize = ref(10)
    const currentPage = ref(1)
    const loading = ref(false)

    const searchForm = reactive({
        name: '',
        className: ''
    })

    // 获取学生列表
    const fetchData = async () => {
        loading.value = true
        try {
            const params = {
                name: searchForm.name,
                className: searchForm.className,
                page: currentPage.value,
                limit: pageSize.value
            }
            const res = await proxy.$api.getUserList(params)
            tableData.value = res.list.map(item => ({ ...item }))
            total.value = res.total
        } catch (error) {
            ElMessage.error('数据加载失败')
        } finally {
            loading.value = false
        }
    }
    fetchData()

    const handleSearch = () => {
        currentPage.value = 1
        fetchData()
    }
    const resetSearch = () => {
        searchForm.name = ''
        searchForm.className = ''
        handleSearch()
    }
    const handlePageChange = (page) => {
        currentPage.value = page
        fetchData()
    }

    // 对话框相关
    const dialogVisible = ref(false)
    const dialogTitle = ref('新增学生')
    const formRef = ref()
    const form = reactive({
        id: '',
        name: '',
        studentNo: '',
        className: '',
        chinese: 0,
        math: 0,
        english: 0
    })
    const rules = {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        studentNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        className: [{ required: true, message: '请选择班级', trigger: 'change' }],
        chinese: [{ required: true, message: '请输入语文成绩', trigger: 'blur' }],
        math: [{ required: true, message: '请输入数学成绩', trigger: 'blur' }],
        english: [{ required: true, message: '请输入英语成绩', trigger: 'blur' }]
    }

    const addStudent = () => {
        dialogTitle.value = '新增学生'
        form.id = ''
        form.name = ''
        form.studentNo = ''
        form.className = ''
        form.chinese = 0
        form.math = 0
        form.english = 0
        dialogVisible.value = true
        nextTick(() => {
            formRef.value?.clearValidate()
        })
    }

    const editStudent = (row) => {
        dialogTitle.value = '编辑学生'
        Object.assign(form, row)
        dialogVisible.value = true
        nextTick(() => {
            formRef.value?.clearValidate()
        })
    }

    const submitForm = () => {
        formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    if (form.id) {
                        await proxy.$api.editUser(form)
                    } else {
                        await proxy.$api.addUser(form)
                    }
                    ElMessage.success('操作成功')
                    dialogVisible.value = false
                    fetchData()
                } catch (error) {
                    ElMessage.error('操作失败')
                }
            }
        })
    }

    const deleteStudent = (row) => {
        ElMessageBox.confirm('确认删除该学生吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            await proxy.$api.deleteUser({ id: row.id })
            ElMessage.success('删除成功')
            fetchData()
        }).catch(() => { })
    }

    const viewDetail = (row) => {
        ElMessage.info('详情功能待实现')
    }
</script>

<style scoped>
    .user-container {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .search-card {
        margin-bottom: 20px;
        border-radius: 8px;
    }

    .search-card :deep(.el-card__body) {
        padding: 20px;
    }

    .search-btns {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .add-btn-col {
        text-align: right;
    }

    @media (max-width: 768px) {
        .add-btn-col {
            text-align: left;
            margin-top: 10px;
        }
    }

    .table-card {
        border-radius: 8px;
    }

    .table-card :deep(.el-card__body) {
        padding: 20px;
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>