<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="table-wrapped">
    <!-- 顶部 -->
    <div class="table-top">
      <!-- 表格顶部 -->
      <div class="table-header">
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
        <div class="button-wrapped">
          <el-button type="primary" @click="openCreate(1)">添加产品管理员</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column property="account" label="账号" />
          <el-table-column property="name" label="姓名" />
          <el-table-column property="department" label="部门" />
          <el-table-column property="email" label="邮箱" />
          <el-table-column property="update_time" label="更新时间">
            <template #default="{ row }">
              <div>{{ row.update_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <div>
                <el-button type="success" @click="openEdit(row.id)">编辑</el-button>
                <el-button type="danger" @click="openDelete(row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer">
      <el-pagination
        :page-size="10"
        :total="userTotal"
        :current-page="paginationData.currentPage"
        :page-count="paginationData.pageCount"
        :pager-count="7"
        layout="prev, pager, next"
        @current-change="paginationChange"
      />
    </div>
  </div>
  <create ref="Create" @success="getAdminlist(1)"></create>
  <edit ref="Edit" @success="getAdminlist"></edit>
  <delete-admin ref="Delete" @success="getAdminlist"></delete-admin>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'

import { Search } from '@element-plus/icons-vue'

import create from '../components/createAdmin.vue'
import edit from '../components/editAdmin.vue'
import deleteAdmin from '../components/deleteAdmin.vue'

import { bus } from '@/utils/mitt.js'
import { searchUser, getAdminListLength, returnListData } from '@/api/userinfo.js'

// 消息提示
import { ElMessage } from 'element-plus'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '用户管理',
  second: '产品管理员'
})

// 表格数据
let tableData = ref([])

// 搜索框内容
const account = ref()
const identity = ref('产品管理员')
const searchAdmin = async () => {
  if (account.value !== '') {
    const res = await searchUser(account.value, identity.value)
    tableData.value = res.data
  } else {
    getFirstPageData()
    paginationData.currentPage = 1
  }
}

// 创建管理员
const Create = ref()
const openCreate = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('createTitle', id)
  Create.value.open()
}
// 编辑管理员
const Edit = ref()
const openEdit = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('editID', id)
  Edit.value.open()
}
// 降级管理员
const Delete = ref()
const openDelete = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('deleteID', id)
  Delete.value.open()
}

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
const getAdminListlength = async (num?: number) => {
  const res = await getAdminListLength(identity.value)
  userTotal.value = res.data.length
  paginationData.pageCount = Math.ceil(userTotal.value / 10)
  if (num === 1) {
    paginationData.currentPage = paginationData.pageCount
  }
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
const getAdminlist = async (num?: number) => {
  await getAdminListlength(num)
  paginationChange(paginationData.currentPage)
}
getAdminlist()
</script>

<style scoped lang="scss">
:deep(.el-table .el-button) {
  margin-right: 12px;
  margin-left: 0;
}
:deep(.el-table .el-table__cell) {
  padding: 7px 0;
}
</style>
