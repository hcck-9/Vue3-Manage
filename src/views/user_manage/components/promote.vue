<template>
  <el-dialog v-model="dialogPromoteVisible" title="赋权操作" center align-center>
    <el-radio-group v-model="radio">
      <el-radio label="产品管理员">产品管理员</el-radio>
      <el-radio label="用户管理员">用户管理员</el-radio>
      <el-radio label="消息管理员">消息管理员</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogPromoteVisible = false">取消</el-button>
        <el-button type="primary" @click="changeIdentityToAdminOption"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'
import { bus } from '@/utils/mitt.js'
import { changeIdentityToAdmin } from '@/api/userinfo.js'
import { ElMessage } from 'element-plus'

const dialogPromoteVisible = ref(false)

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 单选框
const radio = ref()

// 获取 promoteUserID
const userID = ref()
bus.on('promoteUserID', (id: number) => {
  userID.value = id
})

// 赋权
const changeIdentityToAdminOption = async () => {
  const res = await changeIdentityToAdmin(userID.value, radio.value)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    bus.emit('offDialog', 1)
    dialogPromoteVisible.value = false
  }
}

const open = () => {
  dialogPromoteVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
.el-radio-group {
  display: flex;
  justify-content: center;
}
</style>
