import request from '@/utils/request'

// 列表
export function handleCarNumList (params) {
  return request({
    url: 'device/api/carnum/list',
    method: 'get',
    params
  })
}

// 详情
export function handleCarNumInfo (data) {
  return request({
    url: `device/api/carnum/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleCarNumSave (data) {
  return request({
    url: 'device/api/carnum/save',
    method: 'post',
    data
  })
}

// 更新
export function handleCarNumUpdate (data) {
  return request({
    url: 'device/api/carnum/update',
    method: 'POST',
    data
  })
}

// 删除
export function handleCarNumDelete (data) {
  return request({
    url: 'device/api/carnum/delete',
    method: 'POST',
    data
  })
}
