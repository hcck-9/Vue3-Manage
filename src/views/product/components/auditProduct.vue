<template>
  <el-dialog v-model="centerDialogVisible" title="审核产品" width="400px" center align-center>
    <div>确定审核此产品的出库吗</div>
    <el-radio-group v-model="formData.product_out_status" class="ml-4">
      <el-radio label="同意">同意</el-radio>
      <el-radio label="否决">否决</el-radio>
    </el-radio-group>
    <el-input
      v-model="formData.audit_memo"
      :rows="2"
      type="textarea"
      placeholder="请输入审核备注"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="auditProductOption"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, toRaw } from 'vue'
const centerDialogVisible = ref(false)

import { bus } from '@/utils/mitt.js'

import { auditProduct } from '@/api/product.js'
// 消息提示
import { ElMessage } from 'element-plus'
// 引入store
import { useUserInfoStore } from '@/store/userinfo.js'
const userInfoStore = useUserInfoStore()

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

interface productData {
  id: number | null
  product_out_id: number | null
  product_out_status: string
  audit_memo: string
  product_out_price: number | null
  product_out_audit_person: string
  product_out_apply_person: string
  product_in_warehouse_number: number | null
  product_single_price: number | null
  product_out_number: number | null
  product_apply_time: string
}

const formData = reactive<productData>({
  id: null,
  product_out_id: null,
  product_out_status: '',
  audit_memo: '',
  product_out_price: null,
  product_out_audit_person: '',
  product_out_apply_person: '',
  product_in_warehouse_number: null,
  product_single_price: null,
  product_out_number: null,
  product_apply_time: ''
})

bus.on('auditProductID', (row: any) => {
  row = toRaw(row)
  console.log(row)

  formData.id = row.id
  formData.product_out_id = row.product_out_id
  formData.product_out_price = row.product_out_price
  formData.product_out_audit_person = userInfoStore.name
  formData.product_in_warehouse_number = row.product_in_warehouse_number
  formData.product_single_price = row.product_single_price
  formData.product_out_number = row.product_out_number
  formData.product_apply_time = row.product_apply_time
  formData.product_out_apply_person = row.product_out_apply_person
})

// 审核产品状态
const emit = defineEmits(['success'])
const auditProductOption = async () => {
  const res = await auditProduct(formData)
  //   console.log(res)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    centerDialogVisible.value = false
    emit('success')
  } else {
    ElMessage.error('审核产品失败！')
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
