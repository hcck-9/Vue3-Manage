import instance from '../http'

// 绑定上传者
export const bindFileAndUser = (name, url) => {
  return instance({
    url: '/file/bindFileAndUser',
    method: 'POST',
    data: {
      name,
      url
    }
  })
}

// 更新下载量
export const updateDownload = (download_number, id) => {
  return instance({
    url: '/file/updateDownload',
    method: 'POST',
    data: {
      download_number,
      id
    }
  })
}

// 下载文件
export const downloadFile = (id) => {
  return instance({
    url: '/file/downloadFile',
    method: 'POST',
    data: {
      id
    }
  })
}

// 获取文件列表
export const fileList = (id) => {
  return instance({
    url: '/file/downloadFile',
    method: 'POST',
    data: {
      id
    }
  })
}

// 搜索文件 模糊搜索
export const searchFile = (file_name) => {
  return instance({
    url: '/file/searchFile',
    method: 'POST',
    data: {
      file_name
    }
  })
}

// 删除文件
export const deleteFile = (id, file_name) => {
  return instance({
    url: '/file/deleteFile',
    method: 'POST',
    data: {
      id,
      file_name
    }
  })
}

// 获取文件列表总数
export const fileListLength = (id) => {
  return instance({
    url: '/file/fileListLength',
    method: 'POST',
    data: {
      id
    }
  })
}

// 监听换页返回数据
export const returnFilesListData = (pager) => {
  return instance({
    url: '/file/returnFilesListData',
    method: 'POST',
    data: {
      pager
    }
  })
}
