<template>
  <el-dialog v-model="centerDialogVisible" title="再次申请出库" width="400px" center align-center>
    <span>请确认，此操作将再次申请产品出库</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="againApplyProductOption"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, toRaw } from 'vue'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { applyOutProduct } from '@/api/product.js'
// 消息提示
import { ElMessage } from 'element-plus'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

interface productData {
  id: number | null
  product_out_id: number | null
  product_single_price: number | null
  product_out_number: string
  product_out_apply_person: string
  audit_memo: string
}

const formData = reactive<productData>({
  id: null,
  product_out_id: null,
  product_single_price: null,
  product_out_number: '',
  product_out_apply_person: '',
  audit_memo: ''
})

bus.on('againApplyProduct', (row: any) => {
  row = toRaw(row)
  //   console.log(row)
  formData.id = row.id
  formData.product_out_id = row.product_out_id
  formData.product_single_price = row.product_single_price
  formData.product_out_number = row.product_out_number
  formData.product_out_apply_person = row.product_out_apply_person
  formData.audit_memo = row.audit_memo
})

const emit = defineEmits(['success'])
const againApplyProductOption = async () => {
  const res = await applyOutProduct(formData)
  //   console.log(res)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    centerDialogVisible.value = false
    emit('success')
  } else {
    ElMessage.error('再次申请产品出库失败！')
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
