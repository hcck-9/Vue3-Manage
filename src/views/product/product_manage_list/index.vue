<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="产品列表" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productId"
                    class="w-50 m-2"
                    placeholder="输入入库编号进行搜索"
                    :prefix-icon="Search"
                    @change="searchProduct()"
                    clearable
                    @clear="getProductFirstPageList"
                  />
                </div>
                <div class="button-wrapped">
                  <el-button type="primary" @click="openCreate">产品入库</el-button>
                </div>
              </div>
              <div class="module-common-table">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="product_id" label="入库编号" width="100" />
                  <el-table-column prop="product_name" label="产品名称" width="160" />
                  <el-table-column prop="product_category" label="产品类别" width="100" />
                  <el-table-column prop="product_unit" label="单位" />
                  <el-table-column
                    prop="product_in_warehouse_number"
                    label="库存数量"
                    width="100"
                  />
                  <el-table-column prop="product_single_price" label="产品单价" width="100" />
                  <el-table-column prop="product_all_price" label="产品总价" width="100" />
                  <el-table-column prop="product_status" label="库存状态" width="100">
                    <template #default="{ row }">
                      <el-tag
                        class="ml-2"
                        type="danger"
                        v-if="row.product_in_warehouse_number < 100"
                        >库存较少</el-tag
                      >
                      <el-tag
                        class="ml-2"
                        v-else-if="
                          row.product_in_warehouse_number >= 100 &&
                          row.product_in_warehouse_number <= 300
                        "
                        >库存正常</el-tag
                      >
                      <el-tag
                        class="ml-2"
                        type="success"
                        v-else-if="row.product_in_warehouse_number > 300"
                        >库存过剩</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_create_person" label="入库负责人" width="100" />
                  <el-table-column prop="product_create_time" label="入库时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.product_create_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_update_time" label="最后修改时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.product_update_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="in_memo" label="入库备注" width="200" />
                  <el-table-column label="操作" width="300" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button
                          type="primary"
                          @click="applyOut(row)"
                          :disabled="
                            row.product_out_status == '申请出库' ||
                            row.product_in_warehouse_number == 0
                          "
                          >申请出库</el-button
                        >
                        <el-button
                          type="success"
                          @click="editProduct(row)"
                          :disabled="row.product_out_status == '申请出库'"
                          >修改</el-button
                        >
                        <el-button
                          type="danger"
                          @click="deleteProduct(row.id)"
                          :disabled="row.product_out_status == '申请出库'"
                          >删除</el-button
                        >
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <el-pagination
                :page-size="1"
                :current-page="paginationData.productCurrentPage"
                :pager-count="7"
                :total="paginationData.productTotal"
                :page-count="paginationData.productPageCount"
                @current-change="ProductCurrentChange"
                layout="prev, pager, next"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审核列表" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productOutId"
                    class="w-50 m-2"
                    clearable
                    placeholder="输入申请出库编号进行搜索"
                    :prefix-icon="Search"
                    @change="searchApplyProduct()"
                    @clear="getApplyProductFirstPageList"
                  />
                </div>
                <div class="button-wrapped"></div>
              </div>
              <!-- 表格部分 -->
              <div class="module-common-table">
                <el-table :data="applyTableData" border style="width: 100%">
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="product_out_id" label="申请出库编号" width="120" />
                  <el-table-column prop="product_name" label="产品名称" width="160" />
                  <el-table-column prop="product_out_number" label="申请出库数量" width="180" />
                  <el-table-column prop="product_out_price" label="申请出库总价" width="180" />
                  <el-table-column prop="product_out_apply_person" label="申请人" width="100" />
                  <el-table-column prop="product_apply_time" label="申请出库时间" width="180">
                    <template #default="{ row }">
                      <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_out_audit_person" label="审核人" width="150" />
                  <el-table-column prop="product_audit_time" label="审核时间" width="180">
                    <template #default="{ row }">
                      <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_out_status" label="审核状态" width="100" />
                  <el-table-column prop="apply_memo" label="申请出库备注" width="200" />
                  <el-table-column prop="audit_memo" label="审核备注" width="200" />
                  <el-table-column label="操作" width="300" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button type="primary" @click="withdrawProduct(row.id)"
                          >撤回申请</el-button
                        >
                        <el-button
                          type="success"
                          :disabled="row.product_out_status == '申请出库'"
                          @click="againApply(row)"
                          >再次申请</el-button
                        >
                        <el-button type="danger" @click="auditProduct(row)">审核</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <el-pagination
                :page-size="1"
                :current-page="paginationData.applyProductCurrentPage"
                :pager-count="7"
                :total="paginationData.applyProductTotal"
                :page-count="paginationData.applyProductCount"
                @current-change="applyProductCurrentChange"
                layout="prev, pager, next"
              />
            </div></div
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <!-- 入库 -->
  <inwarehouse ref="inWareHouseOpen" @success="getProductFirstPageList"></inwarehouse>
  <!-- 申请 -->
  <apply ref="applyRef" @success="changeTwoFirstPageData"></apply>
  <!-- 编辑 -->
  <editproduct ref="editProductRef" @success="changeTwoFirstPageData"></editproduct>
  <!-- 删除 -->
  <deleteproduct ref="deleteProductRef" @success="getProductFirstPageList"></deleteproduct>
  <!-- 审核 -->
  <audit ref="auditProductRef" @success="changeTwoFirstPageData"></audit>
  <!-- 撤回 -->
  <withdraw ref="withDrawProductRef" @success="changeTwoFirstPageData"></withdraw>
  <!-- 再次申请 -->
  <againapply ref="againApplyProductRef" @success="getApplyProductFirstPageList"></againapply>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import { Search } from '@element-plus/icons-vue'

import inwarehouse from '../components/productInWarehouse.vue'
import apply from '../components/applyProduct.vue'
import editproduct from '../components/editProduct.vue'
import deleteproduct from '../components/deleteProduct.vue'
import audit from '../components/auditProduct.vue'
import withdraw from '../components/withDrawProduct.vue'
import againapply from '../components/againApplyProduct.vue'

import { bus } from '@/utils/mitt.js'
// 消息提示
import { ElMessage } from 'element-plus'

import {
  getProductList,
  applyProductList,
  searchProductForId,
  searchProductForApplyId,
  getProductLength,
  getApplyProductLength,
  returnProductListData,
  returnApplyProductListData
} from '@/api/product.js'

import type { TabsPaneContext } from 'element-plus'
// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '产品管理',
  second: '产品列表'
})

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext) => {
  // console.log(tab.props.label)
  const label = tab.props.label
  if (label === '产品列表') {
    getProductFirstPageList()
  }
  if (label === '审核列表') {
    getApplyProductFirstPageList()
  }
}

// 创建产品弹窗
const inWareHouseOpen = ref()
const openCreate = (id?: number) => {
  // 第一个参数是标记，第二个是参数
  // bus.emit('createTitle', id)
  inWareHouseOpen.value.open()
}

// 申请出库弹窗
const applyRef = ref()
const applyOut = (row: any) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('applyRow', row)
  applyRef.value.open()
}

// 修改产品信息弹窗
const editProductRef = ref()
const editProduct = (row: any) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('editProductRow', row)
  editProductRef.value.open()
}

// 删除产品信息弹窗
const deleteProductRef = ref()
const deleteProduct = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('deleteProductID', id)
  deleteProductRef.value.open()
}

// 审核产品信息弹窗
const auditProductRef = ref()
const auditProduct = (row: any) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('auditProductID', row)
  auditProductRef.value.open()
}

// 撤回申请产品信息弹窗
const withDrawProductRef = ref()
const withdrawProduct = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('withDrawProductID', id)
  withDrawProductRef.value.open()
}

// 再次申请产品出库弹窗
const againApplyProductRef = ref()
const againApply = (row: any) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('againApplyProduct', row)
  againApplyProductRef.value.open()
}

// 产品入库编号
const productId = ref<number>()
// 产品申请出库编号
const productOutId = ref<number>()
// 产品表格
const tableData = ref([])
// 产品申请出库表格
const applyTableData = ref([])

// // 获取产品列表
// const getProductlist = async () => {
//   const res = await getProductList()
//   tableData.value = res.data
// }
// getProductlist()

// // 产品审核列表
// const getApplyProductlist = async () => {
//   const res = await applyProductList()
//   applyTableData.value = res.data
// }
// getApplyProductlist()

// 通过产品编号ID搜索产品
const searchProduct = async () => {
  const res = await searchProductForId(productId.value)
  tableData.value = res.data
  paginationData.productPageCount = 1
}

// 通过出库申请编号对产品进行搜索
const searchApplyProduct = async () => {
  const res = await searchProductForApplyId(productOutId.value)
  applyTableData.value = res.data
  paginationData.applyProductCount = 1
}

// 分页数据
const paginationData = reactive({
  // 产品总数
  productTotal: 0,
  // 产品列表总页数
  productPageCount: 0,
  // 产品列表当前所处页数
  productCurrentPage: 1,
  // 申请的总数
  applyProductTotal: 0,
  // 申请列表总页数
  applyProductCount: 0,
  // 申请列表当前所处页数
  applyProductCurrentPage: 1
})

// 获取产品列表总数
const getProductListlength = async (num?: number) => {
  const res = await getProductLength()
  paginationData.productTotal = res.data.length
  paginationData.productPageCount = Math.ceil(paginationData.productTotal / 9)
  if (num === 1) {
    paginationData.productCurrentPage = paginationData.productCurrentPage
  }
}

// 获取产品列表第一页内容
// getProductFirstPageList
const getProductFirstPageList = async () => {
  getProductListlength()
  paginationData.productCurrentPage = 1
  const res = await returnProductListData(1)
  tableData.value = res.data
}
getProductFirstPageList()

const ProductCurrentChange = async (value: number) => {
  const res = await returnProductListData(value)
  tableData.value = res.data
  paginationData.productCurrentPage = value
}

// 获取出库产品列表
const getOutProductlist = async (num?: number) => {
  await getProductListlength(num)
  ProductCurrentChange(paginationData.productCurrentPage)
}
getOutProductlist()

// 获取申请出库产品总数 --- 审核列表
const getApplyProductListlength = async (num?: number) => {
  const res = await getApplyProductLength()
  paginationData.applyProductTotal = res.data.length
  paginationData.applyProductCount = Math.ceil(paginationData.applyProductTotal / 9)
  if (num === 1) {
    paginationData.applyProductCurrentPage = paginationData.applyProductCurrentPage
  }
}
getApplyProductListlength()

// 获取申请出库产品列表第一页内容
// getProductFirstPageList
const getApplyProductFirstPageList = async () => {
  paginationData.applyProductCurrentPage = 1
  const res = await returnApplyProductListData(1)
  applyTableData.value = res.data
}
getApplyProductFirstPageList()

const applyProductCurrentChange = async (value: number) => {
  paginationData.applyProductCurrentPage = value
  const res = await returnApplyProductListData(value)
  applyTableData.value = res.data
}

// 获取申请出库产品列表
const getApplyOutProductlist = async (num?: number) => {
  await getApplyProductListlength(num)
  applyProductCurrentChange(paginationData.applyProductCurrentPage)
}
getApplyOutProductlist()

// 更新产品列表和申请出库列表第一页数据
const changeTwoFirstPageData = () => {
  if (paginationData.productCurrentPage > 1) {
    ProductCurrentChange(paginationData.productCurrentPage)
  } else {
    getProductFirstPageList()
  }
  getApplyOutProductlist()
}
changeTwoFirstPageData()
</script>

<style scoped lang="scss"></style>
