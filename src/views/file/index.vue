<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div></div>
        <div class="upload-wrapped">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="http://127.0.0.1:3007/file/uploadFile"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :show-file-list="false"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="file_name" label="文件名" width="400" />
          <el-table-column prop="file_size" label="文件大小">
            <template #default="{ row }">
              <div>{{ getfilesize(row.file_size) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="upload_person" label="上传用户" />
          <el-table-column prop="download_number" label="下载次数" />
          <el-table-column prop="upload_time" label="上传时间" width="150">
            <template #default="{ row }">
              <div>
                {{ row.upload_time?.slice(0, 10) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="{ row }">
              <div>
                <el-button type="success">
                  <template #default>
                    <a :href="row.file_url" @click="changeClick(row.download_number, row.id)"
                      >下载文件</a
                    >
                  </template>
                </el-button>
                <el-button type="danger" @click="openDelete(row)">删除文件</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.fileCurrentPage"
        :pager-count="7"
        :total="paginationData.fileTotal"
        :page-count="paginationData.filePageCount"
        @current-change="fileCurrentChange"
        layout="prev, pager, next"
      />
    </div>
  </div>
  <tips ref="fileRef" @success="getFileFirstPageList"></tips>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import tips from './components/tips.vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { updateDownload, bindFileAndUser, fileListLength, returnFilesListData } from '@/api/file.js'
import { bus } from '@/utils/mitt.js'

const fileList = ref<UploadUserFile[]>([])

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '文件管理',
  second: null
})

const tableData = ref([])

const handleExceed: UploadProps['onExceed'] = (response: any) => {}

//把字节转换成正常文件大小
function getfilesize(size) {
  if (!size) return ''
  var num = 1024.0 //byte
  if (size < num) return size + 'KB'
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + 'MB' //kb
  if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + 'GB' //M
  if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + 'TB' //G
}

// 文件上传成功回调
const handleSuccess = (response: any) => {
  // console.log(response)
  if (response.status == 0) {
    ;(async () => {
      await bindFileAndUser(localStorage.getItem('name'), response.url)
    })()

    getFileFirstPageList()
  }
}

// 下载文件
const changeClick = async (num: number, id: number) => {
  await updateDownload(num, id)
}
// 删除文件
const fileRef = ref()
const openDelete = (row: any) => {
  bus.emit('deleteFileID', row)
  fileRef.value.open()
}

// 分页数据
const paginationData = reactive({
  // 文件总数
  fileTotal: 1,
  // 文件列表总页数
  filePageCount: 1,
  // 文件列表当前所处页数
  fileCurrentPage: 1
})

// 获取文件列表总数
const getFilelength = async (num?: number) => {
  const res = await fileListLength()
  paginationData.fileTotal = res.data.length
  paginationData.filePageCount = Math.ceil(paginationData.fileTotal / 10)
  if (num === 1) {
    paginationData.fileCurrentPage = paginationData.fileCurrentPage
  }
}
getFilelength()

// 获取文件列表第一页内容
const getFileFirstPageList = async () => {
  const res = await returnFilesListData(1)
  tableData.value = res.data
}
getFileFirstPageList()

const fileCurrentChange = async (value: number) => {
  const res = await returnFilesListData(value)
  tableData.value = res.data
  paginationData.fileCurrentPage = value
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
</style>
