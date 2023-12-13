<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="table-wrapped">
    <!-- 顶部 -->
    <div class="table-top">
      <!-- 表格顶部 -->
      <div class="table-header">
        <div class="left-wrapped">
          <!-- 搜索框 -->
          <div class="search-wrapped">
            <el-input
              v-model="account"
              class="w-50 m-2"
              placeholder="输入账号进行搜索"
              :prefix-icon="Search"
              @change="searchAdmin"
            />
          </div>
          <div class="select-wrapped">
            <el-select
              v-model="department"
              placeholder="请选择部门"
              clearable
              @change="searchForDepartment"
              @clear="clearOperation"
            >
              <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <div class="button-wrapped">
          <el-button type="primary" plain @click="getBanlist">筛选冻结用户</el-button>
          <el-button type="primary" plain @click="getAdminlist">显示全部用户</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table
          ref="singleTableRef"
          :data="tableData"
          highlight-current-row
          style="width: 100%"
          @row-dblclick="openEditUserInfo"
        >
          <el-table-column type="index" width="50" />
          <el-table-column property="account" label="账号" />
          <el-table-column property="name" label="姓名" width="90px" />
          <el-table-column property="department" label="部门" width="90px" />
          <el-table-column property="email" label="邮箱" />
          <el-table-column property="status" label="状态" width="90px">
            <template #default="{ row }">
              <div>
                <el-tag class="ml-2" type="success" v-if="row.status == 0">正常</el-tag>
                <el-tag class="ml-2" type="danger" v-else>冻结</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="create_time" label="创建时间">
            <template #default="{ row }">
              <div>{{ row.create_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column property="update_time" label="更新时间">
            <template #default="{ row }">
              <div>{{ row.update_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <div>
                <el-button type="primary" @click="banuser(row.id)" :disabled="row.status == 1"
                  >冻结</el-button
                >
                <el-button type="success" @click="hotuser(row.id)" :disabled="row.status == 0"
                  >解冻</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :total="userTotal"
        :current-page="paginationData.currentPage"
        :page-count="paginationData.pageCount"
        :pager-count="7"
        layout="prev, pager, next"
        @current-change="paginationChange"
      />
    </div>
  </div>
  <userinfo ref="EditUserInfo"></userinfo>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'

import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  searchUser,
  getAdminListLength,
  returnListData,
  searchUserByDepartment,
  getBanList,
  hotUser,
  banUser
} from '@/api/userinfo.js'
import { getDepartment } from '@/api/setting.js'
import { bus } from '@/utils/mitt.js'
import userinfo from '../components/userInfo.vue'
// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '用户管理',
  second: '用户列表'
})

// 部门
const department = ref()
// 部门信息
const departmentData = ref([])
// 获取部门信息
const getDepartmentData = async () => {
  const res = await getDepartment()
  departmentData.value = res.data
}
getDepartmentData()

// 表格数据
let tableData = ref([])

// 搜索框内容
const account = ref()
const identity = ref('用户')
const searchAdmin = async () => {
  if (account.value !== '') {
    const res = await searchUser(account.value, identity.value)
    tableData.value = res.data
  } else {
    getAdminlist()
  }
}

// 用户信息框
const EditUserInfo = ref()
const openEditUserInfo = (row: any) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('userID', row)
  EditUserInfo.value.open()
}

// 通过部门对用户搜索
const searchForDepartment = async () => {
  const res = await searchUserByDepartment(department.value, identity.value)
  tableData.value = res.data
}
// 清空部门选择框
const clearOperation = () => {
  getFirstPageData()
}

// 获取冻结用户列表
const getBanlist = async () => {
  const res = await getBanList()
  tableData.value = res.data
}
// 冻结用户
const banuser = async (id) => {
  const res = await banUser(id)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    const result = await returnListData(paginationData.currentPage, identity.value)
    tableData.value = result.data
  }
}
// 解冻用户
const hotuser = async (id) => {
  const res = await hotUser(id)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    const result = await returnListData(paginationData.currentPage, identity.value)
    tableData.value = result.data
  }
}

// 赋权成功后操作
bus.on('getUserList', async (num: number) => {
  if (num === 1) {
    const res = await returnListData(paginationData.currentPage, identity.value)
    tableData.value = res.data
    if (tableData.value.length === 0) {
      paginationData.currentPage -= paginationData.currentPage - 1
      getAdminListlength()
    }
  }
})

// 用户总数
const userTotal = ref<number>()
// 分页
const paginationData = reactive({
  // 总页数
  pageCount: 1,
  // 当前所处页数
  currentPage: 1
})

// 获取用户总数
const getAdminListlength = async () => {
  const res = await getAdminListLength(identity.value)
  userTotal.value = res.data.length
  paginationData.pageCount = Math.ceil(userTotal.value / 9)
}
getAdminListlength()
// 获取第一页内容
const getFirstPageData = async () => {
  const res = await returnListData(1, identity.value)
  tableData.value = res.data
}
getFirstPageData()

const paginationChange = async (value: number) => {
  const res = await returnListData(value, identity.value)
  tableData.value = res.data
  paginationData.currentPage = value
}

// 获取管理员列表
const getAdminlist = () => {
  getAdminListlength()
  paginationChange(paginationData.currentPage)
}
getAdminlist()
</script>

<style scoped lang="scss">
:deep(.el-table .el-button) {
  margin-right: 12px;
  margin-left: 0;
}
</style>
