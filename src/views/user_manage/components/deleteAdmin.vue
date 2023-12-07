<template>
  <el-dialog v-model="centerDialogVisible" title="删除操作" width="600px" center>
    <span v-if="adminId">是否去掉此用户的管理员职位？删除后此用户将重新展现在用户列表中</span>
    <span v-else>请慎重操作，删除后此用户将永久失去登录资格</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="deleteADminUser"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { changeIdentityToUser, deleteUser } from '@/api/userinfo.js'
// 消息提示
import { ElMessage } from 'element-plus'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const adminId = ref()
const userId = ref()
const userAccount = ref()

bus.on('deleteID', (id: number) => {
  //   console.log(id)
  adminId.value = id
})

bus.on('deleteUserID', (userInfor: any) => {
  // console.log(userInfor)
  userId.value = userInfor.id
  userAccount.value = userInfor.account
})

const emit = defineEmits(['success'])
const deleteADminUser = async () => {
  if (adminId.value) {
    const res = await changeIdentityToUser(adminId.value)
    //   console.log(res)
    if (res.data.status === 0) {
      ElMessage({
        message: res.data.message,
        type: 'success'
      })
      centerDialogVisible.value = false
      emit('success')
    } else {
      ElMessage.error(res.data.message)
    }
  }
  if (userId.value) {
    const res = await deleteUser(userId.value, userAccount.value)
    //   console.log(res)
    if (res.data.status === 0) {
      ElMessage({
        message: res.data.message,
        type: 'success'
      })
      centerDialogVisible.value = false
      bus.emit('offDialog', 1)
    } else {
      ElMessage.error(res.data.message)
    }
  }
}
const open = () => {
  centerDialogVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
:deep(.el-dialog--center .el-dialog__body) {
  text-align: center;
}
</style>
