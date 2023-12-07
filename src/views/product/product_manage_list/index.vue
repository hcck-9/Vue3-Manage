<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="产品列表" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productID"
                    class="w-50 m-2"
                    placeholder="输入入库编号进行搜索"
                    :prefix-icon="Search"
                  />
                </div>
                <div class="button-wrapped">
                  <el-button type="primary">产品入库</el-button>
                </div>
              </div>
              <div class="module-common-table">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column type="index" />
                  <el-table-column prop="date" label="Date" />
                </el-table>
              </div>
            </div>
          </div>
          <div class="table-footer"></div>
        </el-tab-pane>
        <el-tab-pane label="审核列表" name="second">审核列表</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import { Search } from '@element-plus/icons-vue'
// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '产品管理',
  second: '产品列表'
})

const activeName = ref('first')

// 产品入库编号
const productID = ref('')

// 表格数据
const tableData = [{ id: 1 }]
</script>

<style scoped lang="scss"></style>
