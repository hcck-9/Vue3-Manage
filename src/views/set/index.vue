<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <!-- 外壳 -->
  <div class="common-wrapped">
    <!-- 内容 -->
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="账号详情" name="first">
          <div class="account-info-wrapped">
            <span>用户头像：</span>
            <div class="account-info-content">
              <!-- action 上传头像接口 -->
              <el-upload
                class="avatar-uploader"
                action="https://127.0.0.1:3007/user/uploadAvatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户账号：</span>
            <div class="account-info-content">
              <el-input v-model="accountDetailData.account" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户密码：</span>
            <div class="account-info-content">
              <el-button type="primary">修改密码</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户姓名：</span>
            <div class="account-info-content">
              <el-input v-model="accountDetailData.name" />
              <el-button type="primary" class="btn">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户性别：</span>
            <div class="account-info-content">
              <el-select v-model="accountDetailData.sex">
                <el-option label="男" value="man" />
                <el-option label="女" value="woman" />
              </el-select>
              <el-button type="primary" class="btn">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户身份：</span>
            <div class="account-info-content">
              <el-input v-model="accountDetailData.identity" disabled placeholder="用户账号" />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户部门：</span>
            <div class="account-info-content">
              <el-input v-model="accountDetailData.department" disabled placeholder="用户账号" />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户邮箱：</span>
            <div class="account-info-content">
              <el-input v-model="accountDetailData.email" placeholder="用户账号" />
              <el-button type="primary" class="btn">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">公司信息</el-tab-pane>
        <el-tab-pane label="首页管理" name="third">首页管理</el-tab-pane>
        <el-tab-pane label="其他设置" name="fourth">其他设置</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import breadCrumb from '../../components/bread-crumb.vue'

// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '系统设置',
  second: null
})
// 选项卡--默认打开的标签页
const activeName = ref('first')
// 账号详情
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像必须为 JPG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像必须小于2MB!')
    return false
  }
  return true
}

const accountDetailData = reactive({
  account: null,
  password: '',
  name: '',
  sex: '',
  identity: '',
  department: '',
  email: ''
})
</script>

<style scoped lang="scss">
// 外壳
.common-wrapped {
  padding: 8px;
  background: #f5f5f5;
  height: calc(100vh - 101px);
  .common-content {
    padding: 0 10px;
    height: 100%;
    background: #fff;
    // 账号详情
    .account-info-wrapped {
      display: flex;
      padding-left: 50px;
      margin-bottom: 15px;
      align-items: center;
      font-size: 14px;
      .account-info-content {
        margin: 0 30px;
        display: flex;
        .btn {
          margin-left: 20px;
        }
      }
    }
  }
}
// :deep(.el-tabs__content) {
//   padding: 32px;
//   color: #6b778c;
//   font-size: 32px;
//   font-weight: 600;
// }
// 输入框长度
:deep(.el-input) {
  width: 240px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
