import request from '@/utils/request'

export function getTreeData (url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}
