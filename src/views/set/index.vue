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
                action="http://127.0.0.1:3007/user/uploadAvatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="userInfoStore.imageUrl" :src="userInfoStore.imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户账号：</span>
            <div class="account-info-content">
              <el-input v-model="userInfoStore.account" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户密码：</span>
            <div class="account-info-content">
              <el-button type="primary" @click="openChange">修改密码</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户姓名：</span>
            <div class="account-info-content">
              <el-input v-model="userInfoStore.name" />
              <el-button type="primary" class="btn" @click="saveName">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户性别：</span>
            <div class="account-info-content">
              <el-select v-model="userInfoStore.sex">
                <el-option label="男" value="man" />
                <el-option label="女" value="woman" />
              </el-select>
              <el-button type="primary" class="btn" @click="saveSex">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户身份：</span>
            <div class="account-info-content">
              <el-input v-model="userInfoStore.identity" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户部门：</span>
            <div class="account-info-content">
              <el-input v-model="userInfoStore.department" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户邮箱：</span>
            <div class="account-info-content">
              <el-input v-model="userInfoStore.email" />
              <el-button type="primary" class="btn" @click="saveEmail">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second" v-if="userInfoStore.identity === '超级管理员'">
          <div class="account-info-wrapped">
            <span>公司名称</span>
            <div class="account-info-content">
              <el-input v-model="companyName" />
              <el-button type="primary" class="btn" @click="changeCompanyname">
                编辑公司名称
              </el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司介绍</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(1)">编辑公司介绍</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司架构</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(2)">编辑公司架构</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司战略</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(3)">编辑公司战略</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司高层</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(4)">编辑公司高层</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="首页管理" name="third" v-if="userInfoStore.identity === '超级管理员'">
          <div class="home-wrapped">
            <!-- 提示 -->
            <div class="tips">
              <span>提示: 点击图片框进行切换首页轮播图</span>
            </div>
            <!-- 轮播图 -->
            <div class="swiper-wrapped" v-for="(item, index) in swiperData" :key="index">
              <div class="swiper-name">轮播图{{ index + 1 }}:&nbsp;&nbsp;</div>
              <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:3007/set/uploadSwiper"
                :show-file-list="false"
                :on-success="handleSwiperSuccess"
                :before-upload="beforeAvatarUpload"
                :data="item"
              >
                <template #trigger>
                  <img v-if="imageUrl[index]" :src="imageUrl[index]" class="swiper" />
                  <img src="@/assets/雪碧图.png" alt="" v-else />
                </template>
              </el-upload>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其他设置" name="fourth">
          <div class="other-set">
            <div
              class="department-set"
              v-if="userInfoStore.identity !== '用户管理员' || userInfoStore.identity === '用户'"
            >
              <span>部门设置</span>
              <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                + 添加部门
              </el-button>
            </div>
            <div
              class="product-set"
              v-if="
                userInfoStore.identity === '超级管理员' || userInfoStore.identity === '产品管理员'
              "
            >
              <span>产品设置</span>
              <el-tag
                v-for="tag in dynamicPTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handlePClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputPVisible"
                ref="InputPRef"
                v-model="inputPValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handlePInputConfirm"
                @blur="handlePInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showPInput">
                + 添加产品类别
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <change-password ref="changePasswordDialog"></change-password>
  <editor ref="editorP"></editor>
</template>

<script setup lang="ts">
import { ref, nextTick, toRaw } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
// tag
import { ElInput } from 'element-plus'
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

// 引入store
import { useUserInfoStore } from '@/store/userinfo.js'
const userInfoStore = useUserInfoStore()

import { bindAccount, changeName, changeSex, changeEmail } from '@/api/userinfo.js'

import {
  getAllSwiper,
  getCompanyName,
  changeCompanyName,
  setDepartment,
  getDepartment,
  setProduct,
  getProduct
} from '@/api/setting.js'

import { bus } from '@/utils/mitt.js'

import changePassword from './components/change_password.vue'

// 导入富文本编辑器
import editor from './components/editor.vue'

// 图像上传成功的函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  // console.log(response, uploadFile)
  if (response.status === 0) {
    userInfoStore.$patch({
      imageUrl: response.url
    })
    ElMessage({
      message: '更新图片成功！',
      type: 'success'
    }),
      (async () => {
        await bindAccount(userInfoStore.account, response.onlyId, response.url)
      })()
  } else {
    ElMessage.error('更新图片失败！请重新上传！')
  }
}
// 头像上传之前的函数
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
// 修改密码对话框
const changePasswordDialog = ref()
const openChange = () => {
  changePasswordDialog.value.open()
}
// 修改姓名
const saveName = async () => {
  const id = localStorage.getItem('id')
  const res = await changeName(id, userInfoStore.name)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
  } else {
    ElMessage.error(res.data.message)
  }
}
// 修改性别
const saveSex = async () => {
  const id = localStorage.getItem('id')
  // console.log(id, userInfoStore.sex)
  const res = await changeSex(id, userInfoStore.sex)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
  } else {
    ElMessage.error(res.data.message)
  }
}
// 修改邮箱
const saveEmail = async () => {
  const id = localStorage.getItem('id')
  // console.log(id, userInfoStore.email)
  const res = await changeEmail(id, userInfoStore.email)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
  } else {
    ElMessage.error(res.data.message)
  }
}
// 富文本编辑器
const editorP = ref()
const openEditor = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('editorTitle', id)
  editorP.value.open()
}
// 获取公司名称
const companyName = ref()
const getCompanyname = async () => {
  // companyName.value = await getCompanyName()
  const res = await getCompanyName()
  companyName.value = res.data
}
getCompanyname()
// 修改公司名称
const changeCompanyname = async () => {
  const res = await changeCompanyName(companyName.value)
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
  } else {
    ElMessage.error('修改失败！')
  }
}
// 首页管理
const swiperData = [
  { name: 'swiper1' },
  { name: 'swiper2' },
  { name: 'swiper3' },
  { name: 'swiper4' },
  { name: 'swiper5' },
  { name: 'swiper6' }
]

// 轮播图
const imageUrl = ref([])
// 获取所有轮播图
const getAllswiper = async () => {
  const res = await getAllSwiper()
  imageUrl.value = res.data
}
getAllswiper()

// 修改轮播图成功
const handleSwiperSuccess: UploadProps['onSuccess'] = (response) => {
  getAllswiper()
}

// 其他设置
// 部门设置
const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

// 删除部门执行的函数
const handleClose = async (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
  }
}
// 点击按钮出现输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
// 输入完成后执行函数
const handleInputConfirm = async () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
    const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
    if (res.data.status === 0) {
      ElMessage({
        message: res.data.message,
        type: 'success'
      })
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 获取部门信息
const getDepartmentData = async () => {
  const res = await getDepartment()
  dynamicTags.value = res.data
}
getDepartmentData()

// 产品设置
const inputPValue = ref('')
const dynamicPTags = ref([])
const inputPVisible = ref(false)
const InputPRef = ref<InstanceType<typeof ElInput>>()

// 删除部门执行的函数
const handlePClose = async (tag: string) => {
  dynamicPTags.value.splice(dynamicPTags.value.indexOf(tag), 1)
  const res = await setProduct(JSON.stringify(toRaw(dynamicPTags.value)))
  if (res.data.status === 0) {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
  }
}
// 点击按钮出现输入框
const showPInput = () => {
  inputPVisible.value = true
  nextTick(() => {
    InputPRef.value!.input!.focus()
  })
}
// 输入完成后执行函数
const handlePInputConfirm = async () => {
  if (inputPValue.value) {
    dynamicPTags.value.push(inputPValue.value)
    const res = await setProduct(JSON.stringify(toRaw(dynamicPTags.value)))
    if (res.data.status === 0) {
      ElMessage({
        message: res.data.message,
        type: 'success'
      })
    }
  }
  inputPVisible.value = false
  inputPValue.value = ''
}

// 获取产品信息
const getProductData = async () => {
  const res = await getProduct()
  dynamicPTags.value = res.data
}
getProductData()
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
  // 首页管理外壳
  .home-wrapped {
    padding-left: 50px;
    display: flex;
    flex-direction: column;

    // 提示
    .tips {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      span {
        font-size: 14px;
        color: silver;
      }
    }

    .swiper-content {
      display: flex;
      flex-wrap: wrap;
    }
    // 轮播图
    .swiper-wrapped {
      display: flex;
      margin-bottom: 10px;
      // 轮播图名字
      .swiper-name {
        font-size: 14px;
        margin-bottom: 24px;
      }

      img {
        width: 256px;
        height: 72px;
      }
    }
  }
  // 其他设置
  .other-set {
    padding-left: 50px;
    font-size: 14px;

    .department-set {
      margin-bottom: 24px;

      span {
        margin-right: 24px;
      }
    }

    .product-set {
      span {
        margin-right: 24px;
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
