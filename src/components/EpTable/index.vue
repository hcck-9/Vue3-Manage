<template>
  <div class="table-wrapped">
    <!-- 顶部 -->
    <div class="table-top">
      <!-- 表格顶部 -->
      <div class="table-header">
        <!-- 搜索框 -->
        <div class="search-wrapped">
          <slot name="searchHandle"> </slot>
        </div>
        <div class="button-wrapped">
          <slot name="buttonHandle"> </slot>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table
          ref="tableRef"
          :data="tableData"
          v-bind="$attrs"
          v-loading="loading"
          highlight-current-row
          style="width: 100%"
          :rowKey="_tableConfig.rowKey"
          @selection-change="selectionChange"
        >
          <!-- 是否是展开行 -->
          <el-table-column type="expand" v-if="_tableConfig.showExpand">
            <template #default="props">
              <slot name="expand" :props="props" />
            </template>
          </el-table-column>
          <!-- 多选 -->
          <el-table-column
            v-if="_tableConfig.showSeletion"
            type="selection"
            width="60"
            :reserve-selection="_tableConfig.isCheckMemory"
            align="center"
          ></el-table-column>
          <!-- 显示自定义索引 -->
          <el-table-column
            v-if="_tableConfig.showIndexColumn"
            type="index"
            width="60"
            :index="typeIndex"
          >
            <!-- 自定义序列号 -->
            <template v-slot:header>
              <span>{{ _tableConfig.indexLabel }}</span>
            </template>
          </el-table-column>
          <!-- 递归渲染多级表头 -->
          <template v-for="(column, index) in columns">
            <MultistageColumn
              v-if="column.children && column.children.length"
              :key="column.prop"
              :column="column"
            >
            </MultistageColumn>
            <el-table-column v-bind="column" v-else :key="index" show-overflow-tooltip>
              <template v-if="column.slotName" v-slot="scope">
                <slot :name="column.slotName" :scope="scope"></slot>
              </template>
            </el-table-column>
          </template>
          <!-- 操作栏 -->
          <el-table-column v-if="_tableConfig.showHandler" v-bind="_tableConfig.handlerConfig">
            <template v-slot="scope">
              <slot name="handler" :scope="scope"></slot>
            </template>
          </el-table-column>
          <!-- 自定义默认内容 -->
          <el-table-column
            type="append"
            v-if="_tableConfig.showAppend"
            :label="_tableConfig.appendLabel"
          >
            <template #default="props">
              <slot name="append" :props="props" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer" v-if="showPagination">
      <Pagination
        :pageConfig="_paginationConfig"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTable } from 'element-plus'
import { defineProps, computed, defineEmits, reactive, ref } from 'vue'

import MultistageColumn from '@/components/EpTable/components/MultistageColumn.vue'
import Pagination from '@/components/EpTable/components/Pagination.vue' // 分页组件

const props = defineProps({
  // 表格源数据
  tableData: {
    type: Array,
    default: () => []
  },
  //   表格配置项
  tableConfig: {
    type: Object,
    default: () => {}
  },
  //   表格列配置
  columns: {
    type: Object,
    default: () => {}
  },
  //   加载loading
  loading: {
    type: Boolean,
    default: false
  },
  //   是否显示分页
  showPagination: {
    type: Boolean,
    default: true
  },
  // 分页配置
  paginationConfig: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['pageSizeChange', 'currentPageChange', 'multiSelection']) // 声明emit

const state = reactive({
  selection: []
})

const tableRef = ref<InstanceType<typeof ElTable>>() // 表格ref

// 合并表格配置项
const _tableConfig = computed(() => {
  let result: any = {}
  const _tableConfig = { label: '操作', minWidth: 120, fixed: 'right' }

  props.tableConfig.handlerConfig && Object.assign(_tableConfig, props.tableConfig.handlerConfig)

  const config = {
    //   行数据的 Key，用来优化 Table 的渲染
    rowKey: 'name',
    showSeletion: false, // 是否多选
    showIndexColumn: false, // 是否显示自定义索引
    indexLabel: '序号', // 自定义索引名
    isCheckMemory: false, // 是否需要跨页勾选
    showHandler: false, // 是否需要显示操作栏
    showExpand: false, // 是否是展开行
    // 是否需要添加一些内容
    showAppend: false, // 插入至表格最后一行之后的内容， 如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上
    appendLabel: '自定义' // 自定义默认内容
  }
  result = Object.assign(config, props.tableConfig)
  result.handlerConfig = _tableConfig
  return result
})

// 合并分页配置
const _paginationConfig = computed(() => {
  const config = {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 50],
    layout: 'total, sizes, prev, pager, next, jumper'
  }
  return Object.assign(config, props.paginationConfig)
})

const pageSizeChange = (pageSize: number) => {
  emit('pageSizeChange', pageSize)
}

const currentPageChange = (pageSize: number) => {
  emit('currentPageChange', pageSize)
}

// 清空多选项
const clearSelection = () => {
  state.selection = []
  tableRef.value.clearSelection()
}

const selectionChange = (selection: any) => {
  state.selection = selection
  // 暴露选中事件
  emit('multiSelection', selection)
}

// 自定义排序
const typeIndex = (index: number) => {
  const tabIndex =
    index + (_paginationConfig.value.current - 1) * _paginationConfig.value.pageSize + 1
  return tabIndex
}

// 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
const toggleRowSelection = (row: any, selected: boolean) => {
  tableRef.value.toggleRowSelection(row, selected)
}

// 用于多选表格，切换全选和全不选
const toggleAllSelection = () => {
  tableRef.value.toggleAllSelection()
}

// 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠。
const toggleRowExpansion = (row: any, expanded: boolean) => {
  tableRef.value.toggleRowExpansion(row, expanded)
}

// 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态。
const setCurrentRow = (row: any) => {
  tableRef.value.setCurrentRow(row)
}

// 用于清空排序条件，数据会恢复成未排序的状态
const clearSort = () => {
  tableRef.value.clearSort()
}

// 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器
const clearFilter = (columnKeys: Array<any>) => {
  tableRef.value.clearFilter()
}

// 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
const doLayout = () => {
  tableRef.value.doLayout()
}

// 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序。
const sort = (prop: string, order: string) => {
  tableRef.value.sort(prop, order)
}

// 将table组件的全部方法暴露出去
defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort
})
</script>

<style scoped lang="scss"></style>
