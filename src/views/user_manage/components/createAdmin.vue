<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="600px">
    <div class="dialog-content">
      <el-form ref="createAdminRef" :model="createAdminForm" :rules="rules">
        <el-form-item label="账号" prop="name">
          <el-input v-model="createAdminForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createAdminForm.password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="createAdminForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="createAdminForm.sex" placeholder="请选择性别">
            <el-option label="男" value="man" />
            <el-option label="女" value="woman" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createAdminForm.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="createAdminForm.department" placeholder="请选择部门">
            <el-option label="1" value="1" />
            <el-option label="12" value="12" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const dialogFormVisible = ref(false)

import type { FormInstance, FormRules } from 'element-plus'
import { bus } from '@/utils/mitt.js'

interface adminData {
  account: number | null
  password: string
  name: string
  sex: string
  email: string
  department: string
}
// 绑定表单
const createAdminRef = ref<FormInstance>()

const createAdminForm = reactive<adminData>({
  account: null,
  password: '',
  name: '',
  sex: '',
  email: '',
  department: ''
})

const rules = reactive<FormRules<adminData>>({
  account: [{ required: true, message: '请输入管理员的注册账号', trigger: 'change' }],
  password: [{ required: true, message: '请输入管理员的密码', trigger: 'change' }],
  name: [{ required: true, message: '请输入管理员的姓名', trigger: 'change' }],
  sex: [{ required: true, message: '请输入管理员的性别', trigger: 'change' }],
  email: [{ required: true, message: '请输入管理员的注册邮箱', trigger: 'change' }],
  department: [{ required: true, message: '请输入管理员的部门', trigger: 'change' }]
})

const title = ref()
bus.on('createTitle', (id: number) => {
  if (id == 1) {
    title.value = '新建产品管理员'
  }
  if (id == 2) {
    title.value = '新建用户管理员'
  }
  if (id == 3) {
    title.value = '新建消息管理员'
  }
})

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
