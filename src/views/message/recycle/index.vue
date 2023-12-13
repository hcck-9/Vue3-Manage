<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <div class="pane-content">
        <div class="pane-top">
          <div class="module-common-header"></div>
          <!-- 表格部分 -->
          <div class="module-common-table">
            <el-table :data="recycleMessageData" border style="width: 100%">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="message_title" label="信息主题" />
              <el-table-column prop="message_category" label="所属类别" />
              <el-table-column prop="message_publish_department" label="发布部门">
                <template #default="{ row }">
                  <div>
                    {{
                      row.message_publish_department === '' ? '无' : row.message_publish_department
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="message_receipt_object" label="接收对象">
                <template #default="{ row }">
                  <div>
                    {{ row.message_receipt_object === '' ? '无' : row.message_receipt_object }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="message_delete_time" label="删除时间" width="150">
                <template #default="{ row }">
                  <div>
                    {{ row.message_delete_time?.slice(0, 10) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <div>
                    <el-button type="success" @click="openDelete(row, 1)">还原</el-button>
                    <el-button type="danger" @click="openDelete(row, 2)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="table-footer">
          <el-pagination
            :page-size="1"
            :current-page="paginationData.recycleCurrentPage"
            :pager-count="7"
            :total="paginationData.recycleTotal"
            :page-count="paginationData.recyclePageCount"
            @current-change="recycleCurrentChange"
            layout="prev, pager, next"
          />
        </div>
      </div>
    </div>
  </div>
  <deletemessage ref="deleteMessageRef" @success="getCompanyMessageFirstPageList"></deletemessage>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import createmessage from '../components/createMessage.vue'
import deletemessage from '../components/deleteMessage.vue'
import { bus } from '@/utils/mitt.js'
// 消息提示
import { ElMessage } from 'element-plus'
import { recycleList, getRecycleMessageLength, returnRecycleListData } from '@/api/message.js'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '消息管理',
  second: '回收站'
})

const recycleMessageData = ref()

// 获取删除信息列表
const getMessagelist = async () => {
  const res = await recycleList()
  //   console.log(res)
  recycleMessageData.value = res.data
}
// getMessagelist()

const deleteMessageRef = ref()
const openDelete = (row: any, num: number) => {
  // 第一个参数是标记，第二个是参数
  if (num === 1) {
    bus.emit('renewID', row)
  } else if (num === 2) {
    bus.emit('realDelete', row)
  }
  deleteMessageRef.value.open()
}

// 分页数据
const paginationData = reactive({
  // 回收站总数
  recycleTotal: 1,
  // 回收站列表总页数
  recyclePageCount: 1,
  // 回收站列表当前所处页数
  recycleCurrentPage: 1
})

// 获取回收站的列表总数
const getRecycleListLength = async (num?: number) => {
  const res = await getRecycleMessageLength()
  paginationData.recycleTotal = res.data.length
  paginationData.recyclePageCount = Math.ceil(paginationData.recycleTotal / 10)
  if (num === 1) {
    paginationData.recycleCurrentPage = paginationData.recycleCurrentPage
  }
}
getRecycleListLength()

// 获取公司公告第一页内容
const getCompanyMessageFirstPageList = async () => {
  const res = await returnRecycleListData(1)
  recycleMessageData.value = res.data
}
getCompanyMessageFirstPageList()

const recycleCurrentChange = async (value: number) => {
  const res = await returnRecycleListData(value)
  recycleMessageData.value = res.data
  paginationData.recycleCurrentPage = value
}
</script>

<style scoped lang="scss">
:deep(.pane-content) {
  height: calc(100vh - 101px) !important;
}
</style>
