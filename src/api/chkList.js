import request from '@/utils/request'
// 列表
export function saveChkList (data) {
  return request({
    url: 'fire/api/chklist/save',
    method: 'post',
    data
  })
}
export function getChkList (params) {
  return request({
    url: 'fire/api/chklist/list',
    method: 'get',
    params
  })
}
export function geChktListinfo (data) {
  return request({
    url: `fire/api/chklist/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}
export function deleteChkList (data) {
  return request({
    url: 'fire/api/chklist/delete',
    method: 'post',
    data
  })
}
// 预览检查表
export function getChkPreview (params) {
  return request({
    url: 'fire/api/appChkSupervision/chkPreview',
    method: 'get',
    params
  })
}

export function getChkListPlan (params) {
  return request({
    url: 'fire/api/chklistPlan/list',
    method: 'get',
    params
  })
}
// 删除检查记录列表
export function deleteChkListPlan (data) {
  return request({
    url: 'fire/api/chklistPlan/delete',
    method: 'post',
    data
  })
}

// 获取隐患查询列表
export function getchkListDanger (params) {
  return request({
    url: 'fire/api/chklistDanger/list',
    method: 'get',
    params
  })
}
// 获取隐患详情
export function gechkListDangerInfo (data) {
  return request({
    url: `fire/api/chklistDanger/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

export function deleteChkListDanger (data) {
  return request({
    url: 'fire/api/chklistDanger/delete',
    method: 'post',
    data
  })
}
