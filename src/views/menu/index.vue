<template>
  <div class="common-layout">
    <el-header>
      <div class="left">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
          <el-icon v-if="sidebar.collapse"><Expand /></el-icon>
          <el-icon v-else><Fold /></el-icon>
        </div>
        <div class="title">通用后台管理系统</div>
      </div>
      <div class="right">
        <span class="header-left-content">尊敬的 {{ userInfoStore.name }} 欢迎您登录本系统</span>
        <div class="header-right-content">
          <el-badge
            :is-dot="messageStore.read_list.length > 0 ? true : false"
            class="item"
            @click="openMsjDialog"
          >
            <el-icon><Message /></el-icon>
          </el-badge>
          <div class="block">
            <el-avatar :size="24" :src="userInfoStore.imageUrl" />
          </div>
          <el-dropdown>
            <span class="el-dropdown-link item"> 设置 </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>设置账号</el-dropdown-item>
                <el-dropdown-item>更改头像</el-dropdown-item>
                <el-dropdown-item @click="back">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside :class="{ 'content-collapse': sidebar.collapse }">
        <el-scrollbar>
          <el-menu
            :default-active="currentPath"
            unique-opened
            class="el-menu-vertical-demo"
            router
            :collapse="sidebar.collapse"
            collapse-transition
            @select="handleSelect"
          >
            <template v-for="menu in menuStore.menuData">
              <MenuItem :menu="menu" />
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main style="overflow: hidden">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
  <depmsj ref="depMsgRef"></depmsj>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 消息提示
import { ElMessage } from 'element-plus'
// 路由跳转
import { useRouter } from 'vue-router'
// useRouter
const router = useRouter()

import MenuItem from '@/components/MenuItem.vue'

const handleSelect = (index: string) => {
  localStorage.setItem('path', index)
}

const currentPath = ref(localStorage.getItem('path') || '/home')

// 引入store
import { useUserInfoStore } from '@/store/userinfo.js'
const userInfoStore = useUserInfoStore()

import { Message } from '@element-plus/icons-vue'
import depmsj from '@/components/department_msg.vue'

// 引入store
import { useMsg } from '@/store/message.js'
import { useSidebarStore } from '@/store/slider.js'
const messageStore = useMsg()

import { useMenu } from '@/store/menu.js'
const menuStore = useMenu()

// console.log(toRaw(messageStore.read_list))

// 退出登录
const back = () => {
  // 跳转
  router.push('/login')
  ElMessage({
    message: '退出登录成功',
    type: 'success'
  })
  localStorage.clear()
}

// // 是否有未读消息
// const isRead = ref(false)
// const getUserReadList = async () => {
//   const res = await getReadListAndStatus(localStorage.getItem('id'))
//   if (res.data[0].read_list != null && JSON.parse(res.data[0].read_list).length > 0) {
//     isRead.value = true
//   } else {
//     isRead.value = false
//   }
// }
// getUserReadList()

// 消息弹窗
const depMsgRef = ref()
// 获取弹窗
const openMsjDialog = (id?: number) => {
  // 第一个参数是标记，第二个是参数
  // bus.emit('introduce', id)
  depMsgRef.value.open()
}

const sidebar = useSidebarStore()
// 侧边栏折叠
const collapseChage = () => {
  sidebar.handleCollapse()
}
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
// 侧边栏
.el-aside {
  color: #fff;
  height: calc(100vh - 55px);
  background: #2b303b;
  width: 210px;
  overflow: hidden;
  -webkit-transition: width 0.3s ease-in-out;
  transition: width 0.3s ease-in-out;

  // 菜单
  .el-menu {
    background: #2b303b;
    width: 100%;
    height: 100%;
    border-right: 0px;
    overflow-y: auto;
  }

  // 无子菜单的
  .el-menu-item:hover,
  .el-sub-menu__title :hover {
    background: #032552;
  }
}
.content-collapse {
  width: 70px !important;
}
.el-header {
  display: flex;
  height: 55px;
  background: #262f3e;
  color: #c1c6c8;
  align-items: center;
  justify-content: space-between;

  .right {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    // 欢迎语
    .header-left-content {
      font-size: 14px;
    }

    .header-right-content {
      width: 160px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    // 徽章
    .item {
      cursor: pointer;
    }
  }

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 17px;
  }
  // 标题
  .title {
    padding: 0;
    color: #fff;
    background: #2b303b;
  }

  .collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-right: 5px;
    cursor: pointer;
    font-size: 20px;
    color: white;
  }
}

.el-main {
  --el-main-padding: 0;
  background-color: #f3f4fa;
}

:deep(.el-menu--inline) {
  background: #2b303b;
}
:deep(.el-dropdown-link) {
  cursor: pointer;
}
</style>
