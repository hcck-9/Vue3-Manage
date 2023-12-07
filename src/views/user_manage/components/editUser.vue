<template>
  <el-dialog v-model="dialogFormVisible" title="编辑用户信息" width="600px">
    <div class="dialog-content">
      <el-form ref="editUserRef" :model="editUserForm" :rules="rules">
        <el-form-item label="账号" prop="name">
          <el-input v-model="editUserForm.account" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editUserForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editUserForm.sex" placeholder="请选择性别">
            <el-option label="男" value="man" />
            <el-option label="女" value="woman" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="editUserForm.department" placeholder="请选择部门">
            <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="editUserUser"> 确定 </el-button>
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
const editUserRef = ref<FormInstance>()

const editUserForm = reactive<adminData>({
  id: null,
  account: null,
  name: '',
  sex: '',
  email: '',
  department: ''
})

const rules = reactive<FormRules<adminData>>({
  name: [{ required: true, message: '请输入用户的姓名', trigger: 'change' }],
  sex: [{ required: true, message: '请输入用户的性别', trigger: 'change' }],
  email: [{ required: true, message: '请输入用户的注册邮箱', trigger: 'change' }],
  department: [{ required: true, message: '请输入用户的部门', trigger: 'change' }]
})

bus.on('editUserID', async (id: number) => {
  //   console.log(id)
  const res = await getUserInfor(id)
  editUserForm.id = res.data.id
  editUserForm.account = res.data.account
  editUserForm.name = res.data.name
  editUserForm.sex = res.data.sex
  editUserForm.email = res.data.email
  editUserForm.department = res.data.department
})

const emit = defineEmits(['success'])
const editUserUser = async () => {
  const res = await editAdmin(editUserForm)
  if (res.data.status === 0) {
    ElMessage({
      message: '编辑用户信息成功',
      type: 'success'
    })
    dialogFormVisible.value = false
    bus.emit('offDialog', 1)
  } else {
    ElMessage.error('编辑用户信息失败')
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
