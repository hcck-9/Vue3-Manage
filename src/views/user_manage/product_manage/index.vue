<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <EpTable
    :columns="userColumns"
    :tableData="state.tableData"
    :tableConfig="tableConfig"
    :loading="state.loading"
    :paginationConfig="pageConfig"
    @current-page-change="currentPageChange"
    stripe
    ref="tableRef"
  >
    <template #searchHandle>
      <el-input
        v-model="account"
        class="w-50 m-2"
        placeholder="输入账号进行搜索"
        :prefix-icon="Search"
        @change="searchAdmin"
        clearable
        @clear="clearInput"
      />
    </template>
    <template #buttonHandle>
      <el-button type="primary" @click="openCreate(1)">添加产品管理员</el-button>
    </template>
    <template #expand="{ props }">
      {{ props.row }}
    </template>
    <template #createTime="{ scope }">
      {{ scope.row.create_time?.slice(0, 10) }}
    </template>
    <template #updateTime="{ scope }">
      {{ scope.row.update_time?.slice(0, 10) }}
    </template>
    <template #handler="{ scope }">
      <div>
        <el-button type="success" @click="openEdit(scope.row.id)">编辑</el-button>
        <el-button type="danger" @click="openDelete(scope.row.id)">删除</el-button>
      </div>
    </template>
  </EpTable>
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

import EpTable from '@/components/EpTable/index.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { userColumns } from '../user'

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

const state = reactive({
  tableData: [],
  loading: false,
  locale: zhCn
})

const tableRef = ref<HTMLElement | null>(null) // 表格ref

// 表格配置项
const tableConfig = reactive({
  showSeletion: true,
  showHandler: true,
  showIndexColumn: false,
  isCheckMemory: true,
  showExpand: true,
  showAppend: false,
  handlerConfig: {
    align: 'center'
  }
})

// 分页
const pageConfig = reactive({
  // 总页数
  pageCount: 1,
  // 当前所处页数
  currentPage: 1,
  pageSize: 10,
  total: 0,
  layout: 'total, prev, pager, next, jumper',
  small: true,
  background: true
})

// 搜索框内容
const account = ref()
const identity = ref('产品管理员')
const searchAdmin = async () => {
  if (account.value !== '') {
    const res = await searchUser(account.value, identity.value)
    state.tableData = res.data
  } else {
    getFirstPageData()
    pageConfig.currentPage = 1
  }
}

const clearInput = () => {
  currentPageChange(pageConfig.currentPage)
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

// 获取用户总数
const getAdminListlength = async (num?: number) => {
  const res = await getAdminListLength(identity.value)
  pageConfig.total = res.data.length
  pageConfig.pageCount = Math.ceil(pageConfig.total / 9)
  if (num === 1) {
    pageConfig.currentPage = pageConfig.pageCount
  }
}
getAdminListlength()

// 获取第一页内容
const getFirstPageData = async () => {
  state.loading = true
  try {
    const res = await returnListData(1, identity.value)
    state.tableData = res.data
    console.log(state.tableData)

    state.loading = false
  } catch (err) {}
}
getFirstPageData()

const currentPageChange = async (value: number) => {
  state.loading = true
  try {
    const res = await returnListData(value, identity.value)
    state.tableData = res.data
    pageConfig.currentPage = value
    state.loading = false
  } catch (err) {}
}

// 获取管理员列表
const getAdminlist = async (num?: number) => {
  await getAdminListlength(num)
  currentPageChange(pageConfig.currentPage)
}
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
