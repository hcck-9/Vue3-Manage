<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="50%"
    center
    align-center
    append-to-body
    :destroy-on-close="true"
  >
    <div class="dialog-content">
      <el-form
        ref="messageRef"
        :model="messageForm"
        :rules="rules"
        label-width="100px"
        style="max-width: 700px"
      >
        <el-form-item label="主题" prop="message_title">
          <el-input v-model="messageForm.message_title" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item
          label="发布部门"
          prop="message_publish_department"
          v-if="title === '发布公司公告' || title === '编辑公告'"
        >
          <el-select
            v-model="messageForm.message_publish_department"
            placeholder="请输入发布部门"
            v-if="title === '发布公司公告' || title === '编辑公告'"
          >
            <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布人" prop="message_publish_name">
          <el-input v-model="messageForm.message_publish_name" disabled />
        </el-form-item>
        <el-form-item label="消息类别" prop="message_category">
          <el-select v-model="messageForm.message_category" placeholder="请选择消息类别">
            <el-option :disabled="title != '发布公司公告'" label="公司公告" value="公司公告" />
            <el-option :disabled="title != '发布系统消息'" label="系统消息" value="系统消息" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="接收部门"
          prop="message_receipt_object"
          v-if="title === '发布公司公告' || title === '编辑公司公告'"
        >
          <el-select v-model="messageForm.message_receipt_object" placeholder="请选择接收部门">
            <el-option v-for="item in allDepartmentData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="公告等级"
          prop="message_level"
          v-if="title === '发布公司公告' || title === '编辑公司公告'"
        >
          <el-select v-model="messageForm.message_level" placeholder="请选择公告等级">
            <el-option label="一般" value="一般" />
            <el-option label="重要" value="重要" />
            <el-option label="必要" value="必要" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="message_content">
          <div style="border: 1px solid #ccc">
            <!-- wangEditor结构 -->
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; overflow-y: hidden"
              v-model="messageForm.message_content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="createAndEidtMessage(messageRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, shallowRef, toRaw } from 'vue'

import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import type { FormInstance } from 'element-plus'
import { bus } from '@/utils/mitt.js'

import { publishMessage, editMessage } from '@/api/message.js'
import { getDepartment } from '@/api/setting.js'
import { changeUserReadList } from '@/api/dep_msg.js'

const dialogFormVisible = ref(false)
// 消息提示
import { ElMessage } from 'element-plus'
// 引入store
import { useMsg } from '@/store/message.js'
const messageStore = useMsg()

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 发送部门数据
const departmentData = ref([])
// 接收部门数据
const allDepartmentData = ref([])

const returnDepartment = async () => {
  const res = await getDepartment()
  departmentData.value = res.data
  const data = res.data.slice()
  data.push('全体成员')
  allDepartmentData.value = data
}
returnDepartment()

interface messageData {
  id: number | null
  message_title: string
  message_publish_department: string
  message_publish_name: string
  message_category: string
  message_receipt_object: string
  message_level: string
  message_content: string
}
// 绑定表单
const messageRef = ref<FormInstance>()

const messageForm = reactive<messageData>({
  id: null,
  message_title: '',
  message_publish_department: '',
  message_publish_name: localStorage.getItem('name'),
  message_category: '',
  message_receipt_object: '',
  message_level: '',
  message_content: ''
})

const rules = reactive({
  message_title: [{ required: true, message: '请输入公告标题', trigger: ['change', 'blur'] }],
  message_publish_department: [
    { required: true, message: '请选择发布部门', trigger: ['change', 'blur'] }
  ],
  message_publish_name: [{ required: true, message: '请输入发布人', trigger: ['change', 'blur'] }],
  message_receipt_object: [
    { required: true, message: '请选择的接收对象', trigger: ['change', 'blur'] }
  ],
  message_level: [{ required: true, message: '请选择公告等级', trigger: ['change', 'blur'] }],
  message_content: [{ required: true, message: '请输入公告内容', trigger: ['change', 'blur'] }],
  message_category: [{ required: true, message: '请选择公告类别', trigger: ['change', 'blur'] }]
})

// 标题
const title = ref()
bus.on('createMessageName', (name: string) => {
  title.value = name
  if (title.value === '发布公司公告') {
    messageForm.message_category = '公司公告'
  }
  if (title.value === '发布系统消息') {
    messageForm.message_category = '系统消息'
  }
})

bus.on('editMessage', async (row: any) => {
  row = toRaw(row)
  // console.log(row)
  await nextTick(() => {
    title.value = '编辑' + row.message_category
    messageForm.id = row.id
    messageForm.message_title = row.message_title
    messageForm.message_publish_department = row.message_publish_department
    messageForm.message_publish_name = row.message_publish_name
    messageForm.message_category = row.message_category
    messageForm.message_receipt_object = row.message_receipt_object
    messageForm.message_level = row.message_level
    messageForm.message_content = row.message_content
  })
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// mode
const mode = ref('default')
const toolbarConfig = {
  excludeKeys: []
}
const editorConfig = {
  placeholder: '',
  MENU_CONF: {
    // uploadImage: {
    // 	//上传图片配置
    // 	server: 'http://127.0.0.1:3007/set/uploadCompanyPicture', //上传接口地址
    // 	fieldName: 'file', //上传文件名
    // 	methods: 'post',
    // 	metaWithUrl: true, // 参数拼接到 url 上
    // 	// 单个文件上传成功之后
    // 	// onSuccess(file, res) {
    // 	// },
    // 	// 自定义插入图片
    // 	customInsert(res, insertFn) {
    // 		insertFn(res.url)
    // 	},
    // },
  }
}
// 上传图片，修改 uploadImage 菜单配置
// 需要注意的是，如何去修改参数？
toolbarConfig.excludeKeys = [
  'blockquote',
  'bgColor',
  'color',
  'group-more-style',
  'fontFamily',
  'bulletedList',
  'numberedList',
  'lineHeight',
  'todo',
  'emotion',
  'insertLink',
  'group-video',
  'insertTable',
  'codeBlock',
  'divider',
  'fullScreen',
  'group-image'

  // 排除菜单组，写菜单组 key 的值即可
]

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const emit = defineEmits(['success'])
// 创建/编辑消息
const createAndEidtMessage = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (title.value == '发布公司公告') {
        const res = await publishMessage(messageForm)
        // console.log(res)
        await changeUserReadList(res.data.id, res.data.department)
        messageStore.returnReadList(localStorage.getItem('id'))
        if (res.data.status === 0) {
          ElMessage({
            message: res.data.message,
            type: 'success'
          })
          dialogFormVisible.value = false
          emit('success')
        } else {
          ElMessage.error('发布公司公告失败！')
        }
      }
      if (title.value == '发布系统消息') {
        const res = await publishMessage(messageForm)
        // console.log(res)
        if (res.data.status === 0) {
          ElMessage({
            message: res.data.message,
            type: 'success'
          })
          dialogFormVisible.value = false
          emit('success')
        } else {
          ElMessage.error('发布系统消息失败！')
        }
      }
      if (title.value == '编辑公司公告') {
        const res = await editMessage(messageForm)
        // console.log(res)
        if (res.data.status === 0) {
          ElMessage({
            message: res.data.message,
            type: 'success'
          })
          dialogFormVisible.value = false
          emit('success')
        } else {
          ElMessage.error('编辑公司公告失败！')
        }
      }
      if (title.value == '编辑系统消息') {
        const res = await editMessage(messageForm)
        // console.log(res)
        if (res.data.status === 0) {
          ElMessage({
            message: res.data.message,
            type: 'success'
          })
          dialogFormVisible.value = false
          emit('success')
        } else {
          ElMessage.error('编辑系统消息失败！')
        }
      }
    }
  })
}

const open = () => {
  dialogFormVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin: 20px;
}
.dialog-content {
  display: flex;
  padding: 20px 30px;
  flex: 1;
  max-height: 800px;
  overflow: auto;
}

.el-dialog__body {
  padding: 0;
}

.el-input {
  width: 220px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form-item {
  margin: 16px;
}

:deep(.w-e-text-container p) {
  margin: 0;
}
</style>
