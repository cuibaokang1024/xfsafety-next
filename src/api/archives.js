import request from '@/utils/request'

// 获取企业基本信息
export function getArchivesInfo (params) {
  return request({
    url: 'system/api/office/archives/info',
    method: 'get',
    params
  })
}

// 修改企业基本信息
export function updateArchives (data) {
  return request({
    url: 'system/api/office/archives/update',
    method: 'post',
    data
  })
}
