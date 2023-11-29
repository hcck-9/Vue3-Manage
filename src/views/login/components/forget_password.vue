<template>
  <!--  忘记密码  -->
  <el-dialog v-model="state.forgetPasswordDialog" title="忘记密码" width="400px">
    <el-form class="login-form" label-position="top" :rules="rules">
      <el-form-item label="输入您的注册账号" prop="account">
        <el-input v-model="forgetPasswordForm.account" />
      </el-form-item>
      <el-form-item label="输入您的个人邮箱" prop="email">
        <el-input v-model="forgetPasswordForm.email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.forgetPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="openChangeDialog"> 下一步 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--  修改密码  -->
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form class="login-form" label-position="top" :rules="rules">
      <el-form-item label="请输入你的新密码" prop="password">
        <el-input v-model="forgetPasswordForm.account" />
      </el-form-item>
      <el-form-item label="请再次输入密码" prop="repassword">
        <el-input v-model="forgetPasswordForm.email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="state.changePasswordDialog = false"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface forgetData {
  account: number | null
  email: string
  password: string
  repassword: string
}

const forgetPasswordForm: forgetData = reactive({
  account: null,
  email: '',
  password: '',
  repassword: ''
})
const rules = reactive({
  account: [{ required: true, message: '请输入你的注册账号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入你的注册邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入你的新密码', trigger: 'blur' }],
  repassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
})

// 是否打开对话框
const state = reactive({
  forgetPasswordDialog: false,
  changePasswordDialog: false
})

const openChangeDialog = () => {
  state.forgetPasswordDialog = false
  state.changePasswordDialog = true
}

const open = () => {
  state.forgetPasswordDialog = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
