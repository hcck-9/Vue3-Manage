<template>
  <el-dialog v-model="centerDialogVisible" :title="title" width="400px" center>
    <span v-html="tips"></span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operationFiles"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, toRaw } from 'vue'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { deleteFile } from '@/api/file.js'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const fileId = ref()
const file_name = ref()
const title = ref()
const tips = ref()

bus.on('deleteFileID', (row: any) => {
  row = toRaw(row)
  title.value = '删除文件'
  tips.value = '您确定要删除这个文件吗？'
  fileId.value = row.id
  file_name.value = row.file_name
})

const emit = defineEmits(['success'])
const operationFiles = async () => {
  if (title.value === '删除文件') {
    const res = await deleteFile(fileId.value, file_name.value)
    // console.log(res)
    if (res.data.status === 0) {
      centerDialogVisible.value = false
      emit('success')
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
