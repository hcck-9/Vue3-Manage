<template>
  <el-dialog v-model="dialogFormVisible" title="申请出库" width="600px" align-center draggable>
    <div class="product-name">您申请出库的产品是:&nbsp;&nbsp;{{ formData.product_name }}</div>
    <div class="product-name">
      该产品的库存还有:&nbsp;&nbsp;{{ formData.product_in_warehouse_number }}
    </div>
    <div class="dialog-content">
      <el-form
        ref="applyProductRef"
        :label-position="labelPosition"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="申请出库编号" prop="product_out_id">
          <el-input v-model="formData.product_out_id" />
        </el-form-item>
        <el-form-item label="出库数量" prop="product_out_number">
          <el-input v-model="formData.product_out_number" />
        </el-form-item>
        <el-form-item label="产品单价" prop="product_single_price">
          <el-input v-model="formData.product_single_price" disabled />
        </el-form-item>
        <el-form-item label="出库申请人" prop="product_out_apply_person">
          <el-input v-model="formData.product_out_apply_person" disabled />
        </el-form-item>
        <el-form-item label="出库备注" prop="in_memo">
          <el-input type="textarea" v-model="formData.audit_memo" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="applyProductOption(applyProductRef)"
          :disabled="formData.product_out_number > formData.product_in_warehouse_number"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, toRaw } from 'vue'
const dialogFormVisible = ref(false)

import type { FormInstance, FormRules } from 'element-plus'
import { bus } from '@/utils/mitt.js'
// 右对齐
const labelPosition = ref('right')
// 消息提示
import { ElMessage } from 'element-plus'

import { applyOutProduct } from '@/api/product.js'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

interface productData {
  id: number | null
  product_out_id: number | null
  product_out_number: number | null
  product_out_apply_person: string
  audit_memo: string
  product_in_warehouse_number: number | null
  product_name: string
  product_single_price: number | null
}
// 绑定表单
const applyProductRef = ref<FormInstance>()

const formData = reactive<productData>({
  id: null,
  product_out_id: null,
  product_out_number: null,
  product_out_apply_person: localStorage.getItem('name'),
  audit_memo: '',
  product_in_warehouse_number: null,
  product_name: '',
  product_single_price: null
})

const rules = reactive<FormRules<productData>>({
  product_out_id: [
    {
      required: true,
      message: '请输入产品出库的编号',
      trigger: ['change', 'blur']
    }
  ],
  product_out_number: [
    { required: true, message: '请输入产品出库名称', trigger: ['change', 'blur'] }
  ],
  product_out_apply_person: [
    { required: true, message: '请输入产品出库负责人', trigger: ['change', 'blur'] }
  ],
  product_single_price: [{ required: true }]
})

// 获取产品ID
bus.on('applyRow', (row: any) => {
  row = toRaw(row)
  formData.id = row.id
  formData.product_in_warehouse_number = row.product_in_warehouse_number
  formData.product_name = row.product_name
  formData.product_single_price = row.product_single_price
})

// 定义 emit 成功 触发事件
const emit = defineEmits(['success'])
// 创建产品
const applyProductOption = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const res = await applyOutProduct(formData)
      // console.log(res)
      if (res.data.status === 0) {
        ElMessage({
          message: res.data.message,
          type: 'success'
        })
        emit('success')
        dialogFormVisible.value = false
      } else {
        ElMessage.error(res.data.message)
      }
    }
  })
}

const open = () => {
  dialogFormVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  padding: 0 30px 20px 30px;
}

.product-name {
  display: flex;
  justify-content: center;
  font-size: 16px;
  margin: 10px;
  color: #333;
}

:deep(.el-form-item) {
  margin: 30px;
}
</style>
