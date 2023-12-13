<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="search-wrapped">
          <el-input
            v-model="productOutId"
            class="w-50 m-2"
            size="large"
            placeholder="输入出库编号进行搜索"
            :prefix-icon="Search"
            @change="searchProductOutId()"
            clearable
            @clear="getFirstPageData"
          />
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="product_out_id" label="出库编号" width="200" />
          <el-table-column prop="product_out_number" label="申请数量" />
          <el-table-column prop="product_out_price" label="申请出库总价" />
          <el-table-column prop="product_out_apply_person" label="出库申请人" />
          <el-table-column prop="product_apply_time" label="申请出库时间" width="180">
            <template #default="{ row }">
              <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="product_out_audit_person" label="审核人" />
          <el-table-column prop="product_audit_time" label="审核时间" width="180">
            <template #default="{ row }">
              <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="audit_memo" label="审核备注" width="200" />
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.currentPage"
        :pager-count="7"
        :total="outProductTotal"
        :page-count="paginationData.pageCount"
        @current-change="currentChange"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import { Search } from '@element-plus/icons-vue'

import {
  searchProductForOutId,
  auditProductList,
  getOutProductLength,
  returnOutProductListData
} from '@/api/product.js'

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '产品管理',
  second: '出库列表'
})

// 出库编号
const productOutId = ref()
// 出库表格
const tableData = ref([])

// 通过出库编号对产品进行搜索
const searchProductOutId = async () => {
  const res = await searchProductForOutId(productOutId.value)
  tableData.value = res.data
}

// 获取出库产品列表
const getAuditProductlist = async () => {
  const res = await auditProductList()
  tableData.value = res.data
}
getAuditProductlist()

// 分页数据
const paginationData = reactive({
  // 总页数
  pageCount: 1,
  // 当前所处页数
  currentPage: 1
})

const outProductTotal = ref<number>(0)

// 获取出库产品总数
const getOutProductListlength = async (num?: number) => {
  const res = await getOutProductLength()
  outProductTotal.value = res.data.length
  paginationData.pageCount = Math.ceil(outProductTotal.value / 9)
  if (num === 1) {
    paginationData.currentPage = paginationData.pageCount
  }
}
getOutProductListlength()

// 获取第一页内容
const getFirstPageData = async () => {
  const res = await returnOutProductListData(1)
  tableData.value = res.data
}
getFirstPageData()

const currentChange = async (value: number) => {
  const res = await returnOutProductListData(value)
  tableData.value = res.data
  paginationData.currentPage = value
}

// 获取出库产品列表
const getOutProductlist = async (num?: number) => {
  await getOutProductListlength(num)
  currentChange(paginationData.currentPage)
}
getOutProductlist()
</script>

<style scoped lang="scss">
.table-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .table-top {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .table-header {
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      background: #fff;
    }

    .table-content {
      min-height: 10px;
      padding: 10px 20px 20px;
      margin-bottom: 8px;
      background: #fff;
    }
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
