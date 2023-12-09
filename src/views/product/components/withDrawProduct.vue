<template>
  <el-dialog v-model="centerDialogVisible" title="删除产品" width="400px" center align-center>
    <span>确定取消此产品的出库申请吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="withDrawProductOption"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { withdrawApplyProduct } from '@/api/product.js'
// 消息提示
import { ElMessage } from 'element-plus'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const productID = ref()

bus.on('withDrawProductID', (id: number) => {
  console.log(id)
  productID.value = id
})

const emit = defineEmits(['success'])
const withDrawProductOption = async () => {
  const res = await withdrawApplyProduct(productID.value)
  //   console.log(res)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    centerDialogVisible.value = false
    emit('success')
  } else {
    ElMessage.error('申请撤回产品失败！')
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
:deep(.el-dialog--center .el-dialog__body span) {
  text-align: center;
}
</style>
