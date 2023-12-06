<template>
  <el-dialog v-model="dialogFormVisible" title="编辑管理员信息" width="600px">
    <div class="dialog-content">
      <el-form ref="editAdminRef" :model="editAdminForm" :rules="rules">
        <el-form-item label="账号" prop="name">
          <el-input v-model="editAdminForm.account" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editAdminForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editAdminForm.sex" placeholder="请选择性别">
            <el-option label="男" value="man" />
            <el-option label="女" value="woman" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editAdminForm.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="editAdminForm.department" placeholder="请选择部门">
            <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="editAdminUser"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'
const dialogFormVisible = ref(false)

import type { FormInstance, FormRules } from 'element-plus'
import { bus } from '@/utils/mitt.js'

import { getUserInfor, editAdmin } from '@/api/userinfo.js'
// 消息提示
import { ElMessage } from 'element-plus'
import { getDepartment } from '@/api/setting.js'
// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 部门数据
const departmentData = ref([])
const returnDepartment = async () => {
  // departmentData.value = await getDepartment()
  const res = await getDepartment()
  departmentData.value = res.data
}
returnDepartment()

interface adminData {
  id: number
  account: number | null
  name: string
  sex: string
  email: string
  department: string
}
// 绑定表单
const editAdminRef = ref<FormInstance>()

const editAdminForm = reactive<adminData>({
  id: null,
  account: null,
  name: '',
  sex: '',
  email: '',
  department: ''
})

const rules = reactive<FormRules<adminData>>({
  name: [{ required: true, message: '请输入管理员的姓名', trigger: 'change' }],
  sex: [{ required: true, message: '请输入管理员的性别', trigger: 'change' }],
  email: [{ required: true, message: '请输入管理员的注册邮箱', trigger: 'change' }],
  department: [{ required: true, message: '请输入管理员的部门', trigger: 'change' }]
})

bus.on('editID', async (id: number) => {
  // console.log(id)
  const res = await getUserInfor(id)
  editAdminForm.id = res.data.id
  editAdminForm.account = res.data.account
  editAdminForm.name = res.data.name
  editAdminForm.sex = res.data.sex
  editAdminForm.email = res.data.email
  editAdminForm.department = res.data.department
})

const emit = defineEmits(['success'])
const editAdminUser = async () => {
  const res = await editAdmin(editAdminForm)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    dialogFormVisible.value = false
    emit('success')
  } else {
    ElMessage.error(res.data.message)
  }
}

const open = () => {
  dialogFormVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  padding: 20px 30px;
  justify-content: center;
}
:deep(.el-form-item) {
  margin: 20px;
}
</style>
