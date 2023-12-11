<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="公告管理" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-select
                    v-model="department"
                    placeholder="根据选择部门进行筛选"
                    @change="getListByDepartment"
                  >
                    <el-option
                      v-for="item in departmentData"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                  <el-radio-group v-model="level" @change="getMessageListByLevel">
                    <el-radio label="一般" />
                    <el-radio label="重要" />
                    <el-radio label="必要" />
                  </el-radio-group>
                </div>
                <div class="button-wrapped">
                  <el-button type="primary" plain @click="getCompanyMessagelist"
                    >全部公告</el-button
                  >
                  <el-button type="primary" @click="openCreate(1)">发布公告</el-button>
                </div>
              </div>
              <div class="module-common-table">
                <el-table :data="companyTableData" style="width: 100%" border>
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="message_title" label="公告主题" width="300" />
                  <el-table-column prop="message_category" label="类别" width="100" />
                  <el-table-column prop="message_publish_department" label="发布部门" width="100" />
                  <el-table-column prop="message_publish_name" label="发布人" width="100" />
                  <el-table-column prop="message_receipt_object" label="接受对象" width="100" />
                  <el-table-column prop="message_level" label="公告等级" width="100">
                    <template #default="{ row }">
                      <el-tag class="ml-2" v-if="row.message_level === '一般'">一般</el-tag>
                      <el-tag class="ml-2" type="success" v-else-if="row.message_level === '重要'"
                        >重要</el-tag
                      >
                      <el-tag class="ml-2" type="warning" v-else-if="row.message_level === '必要'"
                        >必要</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_publish_time" label="发布时间" width="150">
                    <template #default="{ row }">
                      <div>
                        {{ row.message_publish_time?.slice(0, 10) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_update_time" label="最新编辑时间" width="150">
                    <template #default="{ row }">
                      <div>
                        {{ row.message_update_time?.slice(0, 10) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_click_number" label="阅读人数" width="100" />
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button type="success" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" @click="openDelete(row.id)">删除</el-button>
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
        <el-tab-pane label="系统消息" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped"></div>
                <div class="button-wrapped">
                  <el-button type="primary" @click="openCreate(2)">发布系统消息</el-button>
                </div>
              </div>
              <!-- 表格部分 -->
              <div class="module-common-table">
                <el-table :data="systemMessageData" border style="width: 100%">
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="message_title" label="消息主题" />
                  <el-table-column prop="message_publish_name" label="发布者" />
                  <el-table-column prop="message_click_number" label="阅读人数" />

                  <el-table-column prop="message_publish_time" label="发布时间">
                    <template #default="{ row }">
                      <div>
                        <el-button type="success" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" @click="openDelete(row.id)">删除</el-button>
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
  <createmessage ref="createMessageRef" @success="getTwoPageList"></createmessage>
  <deletemessage ref="deleteMessageRef" @success="getTwoPageList"></deletemessage>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import { Search } from '@element-plus/icons-vue'
import createmessage from '../components/createMessage.vue'
import deletemessage from '../components/deleteMessage.vue'
import { bus } from '@/utils/mitt.js'
// 消息提示
import { ElMessage } from 'element-plus'
import {
  companyMessageList,
  systemMessageList,
  searchMessageBydepartment,
  searchMessageByLevel
} from '@/api/message.js'
import { getDepartment } from '@/api/setting.js'
import type { TabsPaneContext } from 'element-plus'
// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '消息管理',
  second: '消息列表'
})

const activeName = ref('first')

// 部门数据
const department = ref()
const departmentData = ref([])
const returnDepartment = async () => {
  // departmentData.value = await getDepartment()
  const res = await getDepartment()
  departmentData.value = res.data
}
returnDepartment()

const handleClick = (tab: TabsPaneContext) => {
  // console.log(tab.props.label)
  const label = tab.props.label
  if (label === '产品列表') {
    // getProductFirstPageList()
  }
  if (label === '审核列表') {
    // getApplyProductFirstPageList()
  }
}

// 发布公告弹窗
const createMessageRef = ref()
const openCreate = (id: number) => {
  if (id === 1) {
    bus.emit('createMessageName', '发布公司公告')
  } else if (id === 2) {
    bus.emit('createMessageName', '发布系统消息')
  }
  createMessageRef.value.open()
}
// 编辑公告 --- 系统消息
const openEdit = (row: any) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('editMessage', row)
  createMessageRef.value.open()
}

// 删除公告
const deleteMessageRef = ref()
const openDelete = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('deleteMessage', id)
  deleteMessageRef.value.open()
}

const companyTableData = ref([])
const systemMessageData = ref([])

// 获取公司公告列表
const getCompanyMessagelist = async () => {
  const res = await companyMessageList()
  companyTableData.value = res.data
}

// 获取系统消息列表
const getSystemMessagelist = async () => {
  const res = await systemMessageList()
  systemMessageData.value = res.data
}

const getTwoPageList = () => {
  getCompanyMessagelist()
  getSystemMessagelist()
}
getTwoPageList()

// 根据发布部门进行获取消息
const getListByDepartment = async () => {
  const res = await searchMessageBydepartment(department.value)
  companyTableData.value = res.data
}

const level = ref()
// 根据发布等级进行获取消息
const getMessageListByLevel = async () => {
  const res = await searchMessageByLevel(level.value)
  console.log(res.data)

  companyTableData.value = res.data
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

// // 获取产品列表总数
// const getProductListlength = async (num?: number) => {
//   const res = await getProductLength()
//   paginationData.productTotal = res.data.length
//   paginationData.productPageCount = Math.ceil(paginationData.productTotal / 10)
//   if (num === 1) {
//     paginationData.productCurrentPage = paginationData.productCurrentPage
//   }
// }
// getProductListlength()

// // 获取产品列表第一页内容
// // getProductFirstPageList
// const getProductFirstPageList = async () => {
//   const res = await returnProductListData(1)
//   companyTableData.value = res.data
// }
// getProductFirstPageList()

// const ProductCurrentChange = async (value: number) => {
//   const res = await returnProductListData(value)
//   companyTableData.value = res.data
//   paginationData.productCurrentPage = value
// }

// // 获取出库产品列表
// const getOutProductlist = async (num?: number) => {
//   await getProductListlength(num)
//   ProductCurrentChange(paginationData.productCurrentPage)
// }
// getOutProductlist()

// // 更新产品列表和申请出库列表第一页数据
// const changeTwoFirstPageData = () => {
//   getProductFirstPageList()
//   getApplyProductFirstPageList()
// }
</script>

<style scoped lang="scss">
:deep(.el-select) {
  margin-right: 35px;
}
</style>
