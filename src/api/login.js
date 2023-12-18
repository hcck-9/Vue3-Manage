import instance from '../http'

// 登录
export const login = (data) => {
  const { account, password } = data
  return instance({
    url: '/api/login',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

// 注册
export const register = (data) => {
  const { account, password } = data
  return instance({
    url: '/api/register',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

// 忘记密码验证
export const veryfy = (data) => {
  const { account, email } = data
  return instance({
    url: '/user/verifyAccountAndEmail',
    method: 'POST',
    data: {
      account,
      email
    }
  })
}

// 密码重置
export const resetPassword = (id, newPassword) => {
  return instance({
    url: '/user/changePasswordInLogin',
    method: 'POST',
    data: {
      id,
      newPassword
    }
  })
}

// 返回用户的路由列表，参数ID
export const returnMenuList = (id) => {
  return instance({
    url: '/api/returnMenuList',
    method: 'POST',
    data: {
      id
    }
  })
}
