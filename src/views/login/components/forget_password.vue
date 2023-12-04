<template>
  <!--  忘记密码  -->
  <el-dialog v-model="state.forgetPasswordDialog" title="忘记密码" width="400px">
    <el-form
      ref="forgetPasswordRuleFormRef"
      :model="forgetPasswordForm"
      :rules="rules"
      class="login-form"
      label-position="top"
    >
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
        <el-button type="primary" @click="verifyAccountAndEmail(forgetPasswordRuleFormRef)">
          下一步
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!--  修改密码  -->
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form
      class="login-form"
      label-position="top"
      :rules="rules"
      ref="resetPasswordRuleFormRef"
      :model="forgetPasswordForm"
    >
      <el-form-item label="请输入你的新密码" prop="password">
        <el-input v-model="forgetPasswordForm.password" show-password type="password" />
      </el-form-item>
      <el-form-item label="请再次输入密码" prop="repassword">
        <el-input v-model="forgetPasswordForm.repassword" show-password type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePasswordInLogin(resetPasswordRuleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { veryfy, resetPassword } from '../../../api/login'
// 消息提示
import { ElMessage } from 'element-plus'

import type { FormInstance, FormRules } from 'element-plus'

interface forgetData {
  account: number | null
  email: string
  password: string
  repassword: string
}
// 绑定表单
const forgetPasswordRuleFormRef = ref<FormInstance>()
const resetPasswordRuleFormRef = ref<FormInstance>()

const forgetPasswordForm = reactive<forgetData>({
  account: 123456,
  email: '123123@qq.com',
  password: '',
  repassword: ''
})

const rules = reactive<FormRules<forgetData>>({
  account: [{ required: true, message: '请输入你的注册账号', trigger: 'change' }],
  email: [{ required: true, message: '请输入你的注册邮箱', trigger: 'change' }],
  password: [{ required: true, message: '请输入你的新密码', trigger: 'change' }],
  repassword: [{ required: true, message: '请再次输入密码', trigger: 'change' }]
})

// 是否打开对话框
const state = reactive({
  forgetPasswordDialog: false,
  changePasswordDialog: false
})

// 下一步
const verifyAccountAndEmail = async (formEl: FormInstance | undefined) => {
  // console.log(formEl)

  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const res = await veryfy(forgetPasswordForm)
      // console.log(res)
      if (res.data.status === 0) {
        ElMessage({
          message: res.data.message,
          type: 'success'
        })
        // 设置user ID
        localStorage.setItem('user_id', res.data.id)
        state.forgetPasswordDialog = false
        state.changePasswordDialog = true
      } else {
        ElMessage.error('输入数据出错，请重新输入！')
      }
    }
  })
}
// 修改密码
const changePasswordInLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (forgetPasswordForm.password === forgetPasswordForm.repassword) {
        const user_id = localStorage.getItem('user_id')
        const res = await resetPassword(user_id, forgetPasswordForm.password)
        console.log(res)
        if (res.data.status === 0) {
          ElMessage({
            message: res.data.message,
            type: 'success'
          })
          state.changePasswordDialog = false
        } else {
          ElMessage.error(res.data.message)
        }
      } else {
        ElMessage.error('两次密码输入不一致')
      }
    }
  })
}

const open = () => {
  state.forgetPasswordDialog = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
