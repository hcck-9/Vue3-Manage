<template>
  <el-dialog v-model="dialogUserVisible" title="用户信息" width="500px" center draggable>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px">
          <el-avatar shape="square" :size="120" :src="userData.imageUrl" />
        </el-aside>
        <el-main>
          <div>账号：{{ userData.account }}</div>
          <div>姓名：{{ userData.name }}</div>
          <div>性别：{{ userData.sex === 'man' ? '男' : '女' }}</div>
          <div>部门：{{ userData.department }}</div>
          <div>邮箱：{{ userData.email }}</div>
          <div>
            状态：
            <span v-if="userData.status == 0">正常</span>
            <span v-else>冻结</span>
          </div>
        </el-main>
      </el-container>
      <el-footer>
        <span @click="openEdit(userData.id)">编辑</span>
        <span @click="openPromote(userData.id)">赋权</span>
        <span @click="openDelete(userData.id)">删除用户</span>
      </el-footer>
    </div>
  </el-dialog>
  <edit ref="editUser"></edit>
  <promote ref="promoteUser"></promote>
  <deleteu ref="deleteUser"></deleteu>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, toRaw } from 'vue'
import { bus } from '@/utils/mitt.js'

import promote from './promote.vue'
import edit from './editUser.vue'
import deleteu from './deleteAdmin.vue'

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear()
})

const dialogUserVisible = ref(false)

const userData = reactive({
  id: null,
  account: null,
  name: '',
  sex: '',
  department: '',
  email: '',
  status: 0,
  imageUrl: ''
})

// 获取信息
bus.on('userID', (row: any) => {
  // console.log(toRaw(row))
  row = toRaw(row)
  userData.id = row.id
  userData.account = row.account
  userData.name = row.name
  userData.sex = row.sex
  userData.department = row.department
  userData.email = row.email
  userData.status = row.status
  userData.imageUrl = row.image_url
})

// 打开编辑按钮
const editUser = ref()
const openEdit = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('editUserID', id)
  editUser.value.open()
}

// 打开赋权按钮
const promoteUser = ref()
const openPromote = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('promoteUserID', id)
  promoteUser.value.open()
}

// 赋权成功后操作
bus.on('offDialog', (num: number) => {
  if (num === 1) {
    dialogUserVisible.value = false
    bus.emit('getUserList', 1)
  }
})

// 打开删除按钮
const deleteUser = ref()
const openDelete = (id: number) => {
  // 第一个参数是标记，第二个是参数
  let userInfor = {
    id: id,
    account: userData.account
  }
  bus.emit('deleteUserID', userInfor)
  deleteUser.value.open()
}

const open = () => {
  dialogUserVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss">
.el-main > div {
  margin-bottom: 8px;
}

.el-main {
  --el-main-padding: 0px;
}

.el-footer {
  display: flex;
  justify-content: flex-end;
  --el-footer-height: 8px;

  span {
    margin-left: 8px;
    color: #409eff;
    cursor: pointer;
  }
}
</style>
