<template>
  <!-- 修改密码 -->
  <el-dialog v-model="state.changePasswordDialog" title="忘记密码" width="400px">
    <el-form
      ref="changePasswordRuleFormRef"
      :model="changePasswordForm"
      :rules="rules"
      class="login-form"
      label-position="top"
    >
      <el-form-item label="输入您的旧密码" prop="oldPassword">
        <el-input v-model="changePasswordForm.oldPassword" />
      </el-form-item>
      <el-form-item label="输入您的新密码" prop="newPassword">
        <el-input v-model="changePasswordForm.newPassword" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePasswordBtn(changePasswordRuleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// 消息提示
import { ElMessage } from 'element-plus'

import type { FormInstance, FormRules } from 'element-plus'

import { changePassword } from '@/api/userinfo.js'

import { useRouter } from 'vue-router'
// useRouter
const router = useRouter()

interface changeData {
  oldPassword: string
  newPassword: string
}
// 绑定表单
const changePasswordRuleFormRef = ref<FormInstance>()

const changePasswordForm = reactive<changeData>({
  oldPassword: '',
  newPassword: ''
})

const rules = reactive<FormRules<changeData>>({
  oldPassword: [{ required: true, message: '请输入你的旧密码', trigger: 'change' }],
  newPassword: [{ required: true, message: '请输入你的新密码', trigger: 'change' }]
})

// 是否打开对话框
const state = reactive({
  changePasswordDialog: false
})

// 修改密码
const changePasswordBtn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const id = localStorage.getItem('id')
      const res = await changePassword(
        id,
        changePasswordForm.oldPassword,
        changePasswordForm.newPassword
      )
      // console.log(res)
      if (res.data.status === 0) {
        ElMessage({
          message: res.data.message,
          type: 'success'
        })
        // 设置user ID
        localStorage.setItem('id', res.data.id)
        state.changePasswordDialog = false
        router.push('/login')
      } else {
        ElMessage.error(res.data.message)
      }
    }
  })
}
const open = () => {
  state.changePasswordDialog = true
}

defineExpose({
  open
})
</script>

<style scoped lang="less"></style>
