import request from '@/utils/request'

// 获取区域树
export function getAreaList (params) {
  return request({
    url: 'system/api/area/getAreaList',
    method: 'get',
    params
  })
}

// 获取区域列表
export function getOfficeArea (params) {
  return request({
    url: 'system/api/area/getAreaList',
    method: 'get',
    params
  })
}

// 获取区域列表
export function getOfficeAreaSub (params) {
  return request({
    url: 'system/api/area/getAreaList',
    method: 'get',
    params
  })
}

// 新增区域
export function saveArea (data) {
  return request({
    url: 'system/api/area/save',
    method: 'post',
    data
  })
}

// 修改区域
export function updateArea (data) {
  return request({
    url: 'system/api/area/update',
    method: 'put',
    data
  })
}

// 删除区域
export function delArea (data) {
  return request({
    url: 'system/api/area/delete',
    method: 'delete',
    data
  })
}

//  获取区域详情
export function getAreaDetail (data) {
  return request({
    url: `system/api/area/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}
