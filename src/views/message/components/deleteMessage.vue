<template>
  <el-dialog v-model="centerDialogVisible" :title="title" width="400px" center>
    <span v-if="title.value == '删除信息'" v-html="tips"></span>
    <span v-else-if="title.value == '恢复消息'" v-html="tips"></span>
    <span v-else v-html="tips"></span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operationMessage"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { changeUserReadList, changeUserReadListButDelete } from '@/api/dep_msg.js'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { firstDelete, recover, deleteMessage } from '@/api/message.js'
// 消息提示
import { ElMessage } from 'element-plus'
// 引入store
import { useMsg } from '@/store/message.js'
const messageStore = useMsg()

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const messageId = ref()
const department = ref()
const title = ref()
const tips = ref()

bus.on('deleteMessageId', (row: any) => {
  title.value = '删除信息'
  tips.value = '您确定要删除这个公告吗？'
  messageId.value = row.id
  department.value = row.message_receipt_object
})
bus.on('renewID', (row: any) => {
  title.value = '恢复消息'
  tips.value = '您确定要恢复这个公告吗？'
  messageId.value = row.id
  department.value = row.message_receipt_object
})
bus.on('realDelete', (row: any) => {
  title.value = '真正删除信息'
  tips.value = '请慎重操作！您确定要真正删除这个公告吗？'
  messageId.value = row.id
})

const emit = defineEmits(['success'])
const operationMessage = async () => {
  if (title.value === '删除信息') {
    const res = await firstDelete(messageId.value)
    // console.log(res)
    if (res.data.status === 0) {
      await changeUserReadListButDelete(messageId.value, department.value)
      messageStore.returnReadList(localStorage.getItem('id'))
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
  if (title.value === '恢复消息') {
    const res = await recover(messageId.value)
    // console.log(res)
    if (res.data.status === 0) {
      await changeUserReadList(messageId.value, department.value)
      messageStore.returnReadList(localStorage.getItem('id'))
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
  if (title.value === '真正删除信息') {
    const res = await deleteMessage(messageId.value)
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
