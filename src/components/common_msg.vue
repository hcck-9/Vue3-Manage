<template>
  <el-dialog v-model="dialogVisible" :title="state.title" width="800px" center>
    <el-container>
      <el-main>
        <!-- 主题 -->
        <div class="title">{{ state.message.message_title }}</div>
        <!-- 内容 -->
        <div class="content" v-html="state.message.message_content"></div>
      </el-main>
      <el-aside width="200px">
        <div class="publish-msg" v-if="state.title == '公司公告'">
          发布部门：{{ state.message.message_publish_department }}
        </div>
        <div class="publish-msg">发布人：{{ state.message.message_publish_name }}</div>
        <div class="publish-msg">类别：{{ state.message.message_category }}</div>
        <div class="publish-msg" v-if="state.title == '公司公告'">
          等级：
          <el-tag class="mx-1" round v-if="state.message.message_level == '一般'">{{
            state.message.message_level
          }}</el-tag>
          <el-tag type="warning" class="mx-1" round v-if="state.message.message_level == '重要'">{{
            state.message.message_level
          }}</el-tag>
          <el-tag type="danger" class="mx-1" round v-if="state.message.message_level == '必要'">{{
            state.message.message_level
          }}</el-tag>
        </div>
        <div class="publish-msg">
          发布时间：{{ state.message.message_publish_time?.slice(0, 10) }}
        </div>
      </el-aside>
    </el-container>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, reactive } from 'vue'
import { bus } from '@/utils/mitt.js'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const dialogVisible = ref(false)

const state = reactive({
  title: '',
  message: {
    message_title: '',
    message_content: '',
    message_publish_department: '',
    message_category: '',
    message_level: '',
    message_publish_name: '',
    message_publish_time: ''
  }
})

bus.on('msgCompanyRow', (row: any) => {
  state.title = '公司公告'
  state.message.message_title = row.message_title
  state.message.message_content = row.message_content
  state.message.message_publish_department = row.message_publish_department
  state.message.message_level = row.message_level
  state.message.message_category = row.message_category
  state.message.message_publish_name = row.message_publish_name
  state.message.message_publish_time = row.message_publish_time
})

bus.on('msgSystemRow', (row: any) => {
  state.title = '系统消息'
  state.message.message_title = row.message_title
  state.message.message_content = row.message_content
  state.message.message_publish_department = row.message_publish_department
  state.message.message_level = row.message_level
  state.message.message_category = row.message_category
  state.message.message_publish_name = row.message_publish_name
  state.message.message_publish_time = row.message_publish_time
})

// 暴露open方法
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.el-main {
  min-height: 500px;
  --el-main-padding: 0px;
  border-right: 1px solid #eee;
}

.el-aside {
  padding-right: 8px;
}

.title {
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  margin-bottom: 8px;
  margin-left: 8px;
  border-bottom: 1px solid #eee;
}

.content {
  text-align: center;
}

.publish-msg {
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  margin-bottom: 8px;
  margin-left: 8px;
  border-bottom: 1px solid #eee;
}
</style>
