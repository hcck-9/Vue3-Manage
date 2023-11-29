<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-wrapped">
        <div class="header-content">
          <h3>通用后台管理系统</h3>
          <span class="welcome">欢迎您的登录</span>
        </div>
      </el-header>
      <el-main>
        <div class="login-wrapped">
          <el-card class="box-card">
            <el-tabs v-model="activeName" class="demo-tabs" :stretch="true">
              <el-tab-pane label="登录" name="login">
                <el-form class="login-form">
                  <el-form-item label="账号">
                    <el-input v-model="loginData.account" placeholder="请输入账号" />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="loginData.password" placeholder="请输入密码" />
                  </el-form-item>
                  <div class="footer-wrapped">
                    <div class="forget-password">
                      <span class="forget-password-button" @click="openForget">忘记密码</span>
                    </div>
                    <div class="footer-button">
                      <el-button type="primary">登录</el-button>
                    </div>
                    <div class="footer-go-register">
                      还没有账号？
                      <div class="go-register">马上注册</div>
                    </div>
                  </div>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="注册" name="register">
                <el-form class="login-form">
                  <el-form-item label="账号">
                    <el-input v-model="registerData.account" placeholder="账号长度6-12位" />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input
                      v-model="registerData.password"
                      placeholder="密码需长度6-12位含字母数字"
                    />
                  </el-form-item>
                  <el-form-item label="确认密码">
                    <el-input v-model="registerData.repassword" placeholder="请再次输入密码" />
                  </el-form-item>
                  <div class="footer-wrapped">
                    <div class="footer-button">
                      <el-button type="primary">注册</el-button>
                    </div>
                  </div>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </el-main>
      <el-footer class="footer-wrapped">
        <div class="footer-content">
          <div class="title">
            <span>阿里云博客专家</span>&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>阿里云博客专家</span>&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>阿里云博客专家</span>&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>阿里云博客专家</span>&nbsp;&nbsp;|&nbsp;&nbsp;
            <span>阿里云博客专家</span>
          </div>
          <div class="contact">Copyright @ 前端小王hs 版权所有</div>
        </div>
      </el-footer>
    </el-container>
  </div>
  <forget-password ref="forgetPasswordDialog"></forget-password>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import forgetPassword from './components/forget_password.vue'
const activeName = ref('login')

interface formData {
  account: number | null
  password: string
  repassword?: string
}
const loginData: formData = reactive({
  account: null,
  password: ''
})

const registerData: formData = reactive({
  account: null,
  password: '',
  repassword: ''
})

// 忘记密码对话框
const forgetPasswordDialog = ref()
const openForget = () => {
  forgetPasswordDialog.value.open()
}
</script>

<style lang="scss" scoped>
// 头部外壳
.header-wrapped {
  // 头部内容
  .header-content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    // 欢迎语
    .welcome {
      font-size: 13px;
    }
  }
}
.el-main {
  background-image: url('@/assets/code.jpg');
  overflow: hidden;
  height: 600px;
  .login-wrapped {
    width: 1200px;
    height: 600px;
    margin: 0 auto;
    .box-card {
      width: 350px;
      height: 375px;
      float: right;
      position: relative;
      top: 14%;
    }
  }
}
.el-form {
  margin-top: 30px;
  .footer-wrapped {
    display: flex;
    flex-direction: column;
    .forget-password {
      display: flex;
      justify-content: flex-end;
      margin: 10px 0;
      .forget-password-button {
        font-size: 12px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .footer-button {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .footer-go-register {
      font-size: 12px;
      margin: 12px 0;
      width: 100%;
      display: flex;
      justify-content: center;
      .go-register {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
.footer-wrapped {
  margin-top: 10px;
  .footer-content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 12px;
    color: #666;
  }
  .contact {
    margin-top: 8px;
    color: #666;
    font-size: 12px;
  }
}
// 标签
:deep(.el-tabs__item) {
  color: #333;
  font-size: 18px;
  font-weight: 500;
}
// 输入框高度
:deep(.el-input__inner) {
  height: 40px;
}
:deep(.el-form-item__label) {
  height: 40px;
  line-height: 40px;
}
// 登录按钮
:deep(.el-button) {
  width: 300px;
  height: 45px;
  font-size: 16px;
}
</style>
