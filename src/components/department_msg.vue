<template>
  <el-dialog v-model="dialogVisible" title="部门消息" width="912px" center>
    <el-container>
      <el-aside width="416px">
        <div class="message-list-wrapped">
          <div class="list-table-content">
            <el-table
              :data="messageStore.message_list.length > 0 ? messageStore.message_list : tableData"
              highlight-current-row
              style="width: 100%"
              @row-click="getDetail"
            >
              <el-table-column type="index" width="50" />
              <el-table-column width="5">
                <template #default="{ row }">
                  <div :class="idInList(row.id) ? 'readed' : 'noread'"></div>
                </template>
              </el-table-column>
              <el-table-column label="主题" prop="message_title">
                <template #default="{ row }">
                  <div class="title-wrapped">
                    <div class="title">{{ row.message_title }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="等级" prop="message_level">
                <template #default="{ row }">
                  <el-tag class="mx-1" round v-if="row.message_level == '一般'">{{
                    row.message_level
                  }}</el-tag>
                  <el-tag type="warning" class="mx-1" round v-if="row.message_level == '重要'">{{
                    row.message_level
                  }}</el-tag>
                  <el-tag type="danger" class="mx-1" round v-if="row.message_level == '必要'">{{
                    row.message_level
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="发布日期" prop="message_publish_time">
                <template #default="{ row }">
                  <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="detail-wrapped" v-if="messageInfo.message_title !== ''">
          <div>{{ messageInfo.message_title }}</div>
          <div v-html="messageInfo.message_content"></div>
        </div>
        <div class="detail-wrapped" v-else>请点击列表中的消息进行查看</div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from 'vue'
import {
  getDepartmentMsg,
  getDepartmentMsgList,
  getReadListAndStatus,
  clickDelete
} from '@/api/dep_msg.js'

import { updateClick } from '@/api/message.js'
// 引入store
import { useMsg } from '@/store/message.js'
const messageStore = useMsg()

const dialogVisible = ref(false)

const tableData = ref([])

const messageInfo = reactive({
  message_title: '',
  message_content: ''
})
// 未读信息
const readList = ref([])

const getUserDepMsg = async () => {
  const department = localStorage.getItem('department')
  const id = localStorage.getItem('id')
  if (department !== null) {
    const res = await getReadListAndStatus(id)
    const res2 = await getDepartmentMsgList(department)
    tableData.value = res2.data
    if (res.data && res.data.length > 0) {
      const readStatus = res.data[0].read_status
      const readListData =
        readStatus === 0
          ? (await getDepartmentMsg(id, department)).data.read_list
          : JSON.parse(res.data[0].read_list)
      readList.value = readListData
    }
    messageStore.returnReadList(id)
  }
}

getUserDepMsg()

const getDetail = async (row: any) => {
  row = toRaw(row)
  const id = localStorage.getItem('id')
  await updateClick(row.message_click_number, row.id)
  await clickDelete(id, row.id)
  messageInfo.message_title = row.message_title
  messageInfo.message_content = row.message_content
  getUserDepMsg()
}

const idInList = (id: number) => {
  // console.log(readList.value)
  if (readList.value.indexOf(id) !== -1) return 0
  else return 1
}

// 暴露open方法
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.el-aside {
  padding-left: 8px;
  min-height: 400px;
}

.el-main {
  min-height: 400px;
  --el-main-padding: 0px;
  border-left: 1px solid #eee;
}

.message-list-wrapped {
  height: 400px;
}

.list-table-content {
  min-height: 10px;
  padding: 8px;
}

.el-table {
  height: 100%;

  .title-wrapped {
    display: flex;
    align-items: center;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.readed {
  display: block;
  width: 5px;
  padding: 1px;
  height: 5px;
  border-radius: 50%;
  background: #a9a9a9;
}

.noread {
  display: block;
  width: 5px;
  padding: 1px;
  height: 5px;
  border-radius: 50%;
  background: #ffa500;
}

.detail-wrapped {
  padding: 8px;
}
</style>
