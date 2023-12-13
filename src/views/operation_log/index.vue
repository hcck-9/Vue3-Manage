<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <!-- 搜索框 -->
        <div class="search-wrapped">
          <el-input
            v-model="account"
            class="w-50 m-2"
            placeholder="输入操作者进行搜索"
            :prefix-icon="Search"
            @change="searchUser"
          />
        </div>
        <div class="button-wrapped">
          <el-button type="primary" @click="openDelete">清空操作日志</el-button>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="operation_person" label="操作者" width="200">
            <template #default="{ row }">
              <div :class="level(row.operation_level)">
                <span class="person">{{ row.operation_person }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operation_content" label="操作内容" width="400" />
          <el-table-column prop="operation_level" label="操作等级" width="300">
            <template #default="{ row }">
              <el-tag class="ml-2" :type="level(row.operation_level)">{{
                row.operation_level
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operation_time" label="操作时间" width="200">
            <template #default="{ row }">
              <div>
                {{ row.operation_time?.slice(0, 16) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.logCurrentPage"
        :pager-count="7"
        :total="paginationData.logTotal"
        :page-count="paginationData.logPageCount"
        @current-change="fileCurrentChange"
        layout="prev, pager, next"
      />
    </div>
  </div>
  <tips ref="deleteRef" @success="getLogFirstPageList"></tips>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import {
  searchOperationLogList,
  operationLogListLength,
  returnOperationListData
} from '@/api/log.js'
import tips from './components/tips.vue'
import { Search } from '@element-plus/icons-vue'

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '操作日志',
  second: null
})

// 搜索框内容
const account = ref()
const searchUser = async () => {
  if (account.value !== '') {
    const res = await searchOperationLogList(account.value)
    tableData.value = res.data
  } else {
    getLogFirstPageList()
    paginationData.logCurrentPage = 1
  }
}
// 清空日志
// 删除文件
const deleteRef = ref()
const openDelete = () => {
  deleteRef.value.open()
}

const tableData = ref([])

// 分页数据
const paginationData = reactive({
  // 文件总数
  logTotal: 1,
  // 文件列表总页数
  logPageCount: 1,
  // 文件列表当前所处页数
  logCurrentPage: 1
})

// 获取文件列表总数
const getLoglength = async (num?: number) => {
  const res = await operationLogListLength()
  paginationData.logTotal = res.data.length
  paginationData.logPageCount = Math.ceil(paginationData.logTotal / 9)
  if (num === 1) {
    paginationData.logCurrentPage = paginationData.logCurrentPage
  }
}
getLoglength()

// 获取文件列表第一页内容
const getLogFirstPageList = async () => {
  const res = await returnOperationListData(1)
  console.log(res)

  tableData.value = res.data
}
getLogFirstPageList()

const fileCurrentChange = async (value: number) => {
  const res = await returnOperationListData(value)
  tableData.value = res.data
  paginationData.logCurrentPage = value
}

const level = (level: string) => {
  if (level == '高级') return 'danger'
  if (level == '中级') return 'warning'
  if (level == '低级') return 'normal'
}
</script>

<style scoped lang="scss">
:deep(.el-table .cell) {
  font-weight: 400;
}

a {
  color: #fff;
  display: block;
  text-decoration: none;
}

.person {
  margin-left: 8px;
}

.danger {
  border-left: 2px solid red;
}

.warning {
  border-left: 2px solid yellow;
}

.normal {
  border-left: 0;
}
</style>
