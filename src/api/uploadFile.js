import request from '@/utils/request'

// 上传文件
export function uploadFile (data) {
  return request({
    url: 'system/api/file/upload',
    method: 'post',
    data
  })
}

// 删除文件
export function deletedFile (data) {
  if (data.length > 1) {
    return request({
      url: 'system/api/file/delete',
      method: 'post',
      data
    })
  } else {
    return request({
      url: `system/api/file/delete/${data[0]}`,
      method: 'post'
    })
  }
}
