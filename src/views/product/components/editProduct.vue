<template>
  <el-dialog v-model="dialogFormVisible" title="编辑产品" width="600px">
    <div class="dialog-content">
      <el-form
        ref="editProductRef"
        :label-position="labelPosition"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="入库编号" prop="product_id">
          <el-input v-model="formData.product_id" disabled />
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="formData.product_name" />
        </el-form-item>
        <el-form-item label="产品类别" prop="product_category">
          <el-select v-model="formData.product_category" placeholder="请选择产品类别">
            <el-option v-for="item in productData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品单位" prop="product_unit">
          <el-select v-model="formData.product_unit" placeholder="请选择产品单位">
            <el-option label="个" value="个" />
            <el-option label="件" value="件" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="product_in_warehouse_number">
          <el-input v-model="formData.product_in_warehouse_number" />
        </el-form-item>
        <el-form-item label="产品单价(单位)" prop="product_single_price">
          <el-input v-model="formData.product_single_price" />
        </el-form-item>
        <el-form-item label="入库负责人" prop="product_create_person">
          <el-input v-model="formData.product_create_person" disabled />
        </el-form-item>
        <el-form-item label="入库备注" prop="in_memo">
          <el-input type="textarea" v-model="formData.in_memo" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="editProductOption(editProductRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, toRaw } from 'vue'
const dialogFormVisible = ref(false)

import { getProduct } from '@/api/setting.js'
import type { FormInstance, FormRules } from 'element-plus'
import { bus } from '@/utils/mitt.js'
// 右对齐
const labelPosition = ref('right')
// 消息提示
import { ElMessage } from 'element-plus'

import { editProduct } from '@/api/product.js'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 产品数据
const productData = ref([])
const returnProduct = async () => {
  const res = await getProduct()
  // console.log(res)
  productData.value = res.data
}
returnProduct()

interface productData {
  id: number | null
  product_id: number | null
  product_name: string
  product_category: string
  product_unit: string
  product_in_warehouse_number: number | null
  product_single_price: number | null
  product_create_person: string
  in_memo: string
}
// 绑定表单
const editProductRef = ref<FormInstance>()

const formData = reactive<productData>({
  id: null,
  product_id: null,
  product_name: '',
  product_category: '',
  product_unit: '',
  product_in_warehouse_number: null,
  product_single_price: null,
  product_create_person: '',
  in_memo: ''
})

const rules = reactive<FormRules<productData>>({
  product_id: [
    {
      required: true,
      message: '请输入产品入库的编号',
      trigger: ['change', 'blur']
    }
  ],
  product_name: [{ required: true, message: '请输入产品入库名称', trigger: ['change', 'blur'] }],
  product_category: [{ required: true, message: '请选择产品类别', trigger: ['change', 'blur'] }],
  product_unit: [{ required: true, message: '请选择产品单位', trigger: ['change', 'blur'] }],
  product_in_warehouse_number: [
    { required: true, message: '请输入产品库存数量', trigger: ['change', 'blur'] }
  ],
  product_single_price: [
    { required: true, message: '请输入产品单价', trigger: ['change', 'blur'] }
  ],
  product_create_person: [
    { required: true, message: '请输入产品入库负责人', trigger: ['change', 'blur'] }
  ]
})

// 获取产品ID
bus.on('editProductRow', (row: any) => {
  row = toRaw(row)
  formData.id = row.id
  formData.product_id = row.product_id
  formData.product_name = row.product_name
  formData.product_category = row.product_category
  formData.product_unit = row.product_unit
  formData.product_in_warehouse_number = row.product_in_warehouse_number
  formData.product_single_price = row.product_single_price
  formData.product_create_person = row.product_create_person
  formData.in_memo = row.in_memo
})

const emit = defineEmits(['success'])
// 创建产品
const editProductOption = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const res = await editProduct(formData)
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
  padding: 20px 30px;
}
:deep(.el-form-item) {
  margin: 30px;
}
</style>
