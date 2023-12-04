import instance from '../http'

// 获取用户信息
export const getUserInfor = (id) => {
  return instance({
    url: '/user/getUserInfo',
    method: 'POST',
    data: {
      id
    }
  })
}
// 上传头像

// 绑定账号
export const bindAccount = (account, onlyId, url) => {
  return instance({
    url: '/user/bindAccount',
    method: 'POST',
    data: {
      account,
      onlyId,
      url
    }
  })
}

// 修改用户密码
export const changePassword = (id, oldPassword, newPassword) => {
  return instance({
    url: '/user/changePassword',
    method: 'POST',
    data: {
      id,
      oldPassword,
      newPassword
    }
  })
}
// 修改姓名
export const changeName = (id, name) => {
  return instance({
    url: '/user/changeName',
    method: 'POST',
    data: {
      id,
      name
    }
  })
}
// 修改性别
export const changeSex = (id, sex) => {
  return instance({
    url: '/user/changeSex',
    method: 'POST',
    data: {
      id,
      sex
    }
  })
}

// 修改邮箱
export const changeEmail = (id, email) => {
  return instance({
    url: '/user/changeEmail',
    method: 'POST',
    data: {
      id,
      email
    }
  })
}
