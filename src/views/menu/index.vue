<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <div class="title">通用后台管理系统</div>
        <el-menu default-active="home" class="el-menu-vertical-demo" router>
          <el-menu-item index="home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="overview">
            <el-icon><Document /></el-icon>
            <span>系统概览</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item-group title="管理员管理">
              <el-menu-item index="user_product_manage">产品管理员</el-menu-item>
              <el-menu-item index="user_message_manage">用户管理员</el-menu-item>
              <el-menu-item index="user_users_manage">消息管理员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="员工管理">
              <el-menu-item index="user_user_list">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><TakeawayBox /></el-icon>
              <span>产品管理</span>
            </template>
            <el-menu-item-group title="入库管理">
              <el-menu-item index="product_product_manage">产品列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="出库管理">
              <el-menu-item index="out_product_list">出库列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <el-icon><ChatSquare /></el-icon>
              <span>消息管理</span>
            </template>
            <el-menu-item-group title="消息管理">
              <el-menu-item index="message_list">消息列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="回收站">
              <el-menu-item index="recycle">回收站</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="file">
            <el-icon><MessageBox /></el-icon>
            <span>文件管理</span>
          </el-menu-item>
          <el-menu-item index="operation_log">
            <el-icon><DocumentCopy /></el-icon>
            <span>操作日志</span>
          </el-menu-item>
          <el-menu-item index="login_log">
            <el-icon><Notebook /></el-icon>
            <span>登录日志</span>
          </el-menu-item>
          <el-menu-item index="set">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="header-left-content">尊敬的 {{ userInfoStore.name }} 欢迎您登录本系统</span>
          <div class="header-right-content">
            <el-icon><Message /></el-icon>
            <div class="block">
              <el-avatar :size="24" :src="userInfoStore.imageUrl" />
            </div>
            <el-dropdown>
              <span class="el-dropdown-link"> 设置 </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>设置账号</el-dropdown-item>
                  <el-dropdown-item>更改头像</el-dropdown-item>
                  <el-dropdown-item @click="back">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// import { reactive } from 'vue'
// 消息提示
import { ElMessage } from 'element-plus'
// 路由跳转
import { useRouter } from 'vue-router'
// useRouter
const router = useRouter()

// 引入store
import { useUserInfoStore } from '../../store/userinfo'
const userInfoStore = useUserInfoStore()

// 退出登录
const back = () => {
  // 跳转
  router.push('/login')
  ElMessage({
    message: '退出登录成功',
    type: 'success'
  })
}
</script>

<style lang="scss" scoped>
// 侧边栏
.el-aside {
  height: 100vh;
  background: #2b303b;
  width: 210px;
  overflow: hidden;

  // 菜单
  .el-menu {
    background: #2b303b;
    width: 210px;
    height: 100vh;
    border-right: 0px;
    overflow-y: auto;
  }

  // 标题
  .title {
    padding: 20px;
    display: flex;
    justify-content: center;
    color: #fff;
    background: #2b303b;
  }

  .el-menu-item {
    color: #fff;
  }

  // .el-sub-menu__title {
  // 	color: #fff;
  // }
}
.el-header {
  display: flex;
  height: 55px;
  background: #262f3e;
  color: #c1c6c8;
  align-items: center;
  justify-content: space-between;

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
}

// 徽章
.item {
  cursor: pointer;
}

.el-main {
  --el-main-padding: 0;
  background-color: #f3f4fa;
}

// 无子菜单的
.el-menu-item:hover {
  background: #006eff;
}

// 有子菜单的
:deep(.el-sub-menu__title:hover) {
  background: #006eff;
}

:deep(.el-sub-menu__title) {
  color: #fff;
}

:deep(.el-menu--inline) {
  background: #2b303b;
}
:deep(.el-dropdown-link) {
  cursor: pointer;
}

:deep(.el-aside) {
  scrollbar-width: thin; /* 定义滚动条的宽度 */
  scrollbar-color: transparent transparent; /* 定义滚动条的颜色 */
}

/* 隐藏滚动条 */
:deep(.el-menu::-webkit-scrollbar) {
  width: 0; /* 定义滚动条宽度 */
  height: 0;
  background-color: transparent; /* 滚动条背景颜色 */
}
</style>
