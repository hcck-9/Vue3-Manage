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
            v-model="input2"
            class="w-50 m-2"
            placeholder="输入账号进行搜索"
            :prefix-icon="Search"
          />
        </div>
        <div class="button-wrapped">
          <el-button type="primary">添加产品管理员</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column property="账号" label="Date" />
          <el-table-column property="姓名" label="Name" />
          <el-table-column property="部门" label="Address" />
          <el-table-column property="邮箱" label="Address" />
          <el-table-column label="操作"> </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import breadCrumb from '../../../components/bread-crumb.vue'
import breadCrumb from '@/components/bread-crumb.vue'

import { Search } from '@element-plus/icons-vue'
// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '用户管理',
  second: '产品管理员'
})
// 搜索框内容
const input2 = ref('')

const tableData = [
  {
    id: 1
  }
]
</script>

<style scoped lang="scss"></style>
