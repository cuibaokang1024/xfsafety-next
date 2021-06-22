import request from '@/utils/request'

/* 消防主管单位 */
// tree
export function handleFireOfficeTree (params) {
  return request({
    url: 'system/api/area/treeData',
    method: 'get',
    params
  })
}

// 列表
export function handleFireOfficeList (params) {
  return request({
    url: 'fire/api/pointstype/findList',
    method: 'get',
    params
  })
}

// 保存
export function handleFireOfficeSave (data) {
  return request({
    url: 'fire/api/pointstype/save2',
    method: 'post',
    data
  })
}

// 更新
export function handleFireOfficeUpdate (data) {
  return request({
    url: 'fire/api/pointstype/update2',
    method: 'put',
    data
  })
}

// 详情
export function handleFireOfficeDetail (data) {
  return request({
    url: `fire/api/pointstype/getDetail?id=${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 删除
export function handleFireOfficeDelete (data) {
  return request({
    url: `fire/api/pointstype/delete2?id=${data.id}`,
    method: 'post',
    data
  })
}
/* 消防主管单位 */

/* 行业主管单位 */
// 列表
export function handleIndustryOfficeList (params) {
  return request({
    url: 'fire/api/pointstype/findList',
    method: 'get',
    params
  })
}

// 保存
export function handleIndustryOfficeSave (data) {
  return request({
    url: 'fire/api/pointstype/save2',
    method: 'post',
    data
  })
}

// 更新
export function handleIndustryOfficeUpdate (data) {
  return request({
    url: 'fire/api/pointstype/update2',
    method: 'put',
    data
  })
}

// 详情
export function handleIndustryOfficeDetail (data) {
  return request({
    url: `fire/api/pointstype/getDetail?id=${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 删除
export function handleIndustryOfficeDelete (data) {
  return request({
    url: `fire/api/pointstype/delete2?id=${data.id}`,
    method: 'post',
    data
  })
}
/* 行业主管单位 */
