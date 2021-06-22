import request from '@/utils/request'

// 法律法规列表
export function lawList (params) {
  return request({
    url: 'fire/api/checkstandard/list',
    method: 'get',
    params
  })
}

// 法律法规详情
export function lawDetail (data) {
  return request({
    url: `fire/api/checkstandard/info/${data.id}`,
    method: 'get'
  })
}

// 法律法规保存
export function lawSave (data) {
  return request({
    url: 'fire/api/checkstandard/save',
    method: 'post',
    data
  })
}

// 法律法规修改
export function lawUpdate (data) {
  return request({
    url: 'fire/api/checkstandard/update',
    method: 'put',
    data
  })
}

// 法律法规删除
export function lawDelete (data) {
  return request({
    url: 'fire/api/checkstandard/delete',
    method: 'delete',
    data
  })
}
