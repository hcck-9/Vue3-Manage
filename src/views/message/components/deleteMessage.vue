<template>
  <el-dialog v-model="centerDialogVisible" title="删除操作" width="400px" center>
    <span>是确定要删除这个公告吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="deleteMessage"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { firstDelete } from '@/api/message.js'
// 消息提示
import { ElMessage } from 'element-plus'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const messageId = ref()

bus.on('deleteMessage', (id: number) => {
  // console.log(id)
  messageId.value = id
})

const emit = defineEmits(['success'])
const deleteMessage = async () => {
  const res = await firstDelete(messageId.value)
  // console.log(res)
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
