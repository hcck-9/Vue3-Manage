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

// ---------------用户管理
// 添加管理员
export const createAdmin = (data) => {
  const { account, password, name, sex, department, email, identity } = data
  return instance({
    url: '/user/createAdmin',
    method: 'POST',
    data: {
      account,
      password,
      name,
      sex,
      department,
      email,
      identity
    }
  })
}

// 获取管理员列表
export const getAdminList = (identity) => {
  return instance({
    url: '/user/getAdminList',
    method: 'POST',
    data: {
      identity
    }
  })
}

// 编辑管理员账号信息
export const editAdmin = (data) => {
  const { id, name, sex, email, department } = data
  return instance({
    url: '/user/editAdmin',
    method: 'POST',
    data: {
      id,
      name,
      sex,
      email,
      department
    }
  })
}

// 对管理员取消赋权
export const changeIdentityToUser = (id) => {
  return instance({
    url: '/user/changeIdentityToUser',
    method: 'POST',
    data: {
      id
    }
  })
}

// 对用户进行赋权
export const 对用户进行赋权 = (id, identity) => {
  return instance({
    url: '/user/changeIdentityToUser',
    method: 'POST',
    data: {
      id,
      identity
    }
  })
}

// 通过账号对用户搜索
export const searchUser = (account, identity) => {
  return instance({
    url: '/user/searchUser',
    method: 'POST',
    data: {
      account,
      identity
    }
  })
}

// 冻结用户
export const banUser = (id) => {
  return instance({
    url: '/user/banUser',
    method: 'POST',
    data: {
      id
    }
  })
}

// 获取冻结用户列表
export const getBanList = () => {
  return instance({
    url: '/user/getBanList',
    method: 'POST',
    data: {}
  })
}

// 解冻用户
export const hotUser = (id) => {
  return instance({
    url: '/user/hotUser',
    method: 'POST',
    data: { id }
  })
}

// 删除用户
export const deleteUser = (id, account) => {
  return instance({
    url: '/user/deleteUser',
    method: 'POST',
    data: { id, account }
  })
}
