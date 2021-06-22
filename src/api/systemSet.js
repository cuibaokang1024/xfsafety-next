import request from '@/utils/request'

export function getOfficeLevelList (params) {
  return request({
    url: 'system/api/office/officeLevelList',
    method: 'get',
    params
  })
}

/*
* 监管单位 SOCIAL 1 消防主管单位 FIRE 2 行业主管单位 INDUSTRY 3 下级政府 GOV 4 合作商 AGENCY 5 子账号 CHILDREN  6
*/
// 获取
export function handleTreeAreaList (data) {
  let url = ''
  const para = {}
  const { userType } = data
  switch (userType) {
    case 2:
      url = 'system/api/office/fireTree'
      para.officeId = data.params
      break
    case 3:
      url = 'system/api/office/directTree'
      para.officeId = data.params
      break
    case 4:
      url = 'system/api/office/governmentTree'
      para.officeId = data.params
      break
    case 5:
      url = 'system/api/area/getAreaList'
      para.areaId = data.params
      break
    default:
      break
  }
  return request({
    url,
    method: 'get',
    params: para
  })
}

/* 消防主管部门 */
// 列表
export function getFireTree (params) {
  return request({
    url: 'system/api/office/fireTree',
    method: 'get',
    params
  })
}

// 详情
export function getFireOfficeInfo (data) {
  return request({
    url: `system/api/fireOffice/office/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function saveFireOffice (data) {
  return request({
    url: 'system/api/fireOffice/save',
    method: 'post',
    data
  })
}

// 修改
export function updateFireOffice (data) {
  return request({
    url: 'system/api/fireOffice/update',
    method: 'post',
    data
  })
}

// 删除
export function deleteFireOffice (data) {
  return request({
    url: 'system/api/fireOffice/delete',
    method: 'post',
    data
  })
}
/* 消防主管部门 */

/* 行业主管部门 */
// 列表
export function handleIndustryList (params) {
  return request({
    url: 'system/api/office/directTree',
    method: 'get',
    params
  })
}

// 详情
export function handleIndustryInfo (data) {
  return request({
    url: `system/api/industryOffice/office/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleIndustrySave (data) {
  return request({
    url: 'system/api/industryOffice/save',
    method: 'post',
    data
  })
}

// 修改
export function handleIndustryUpdate (data) {
  return request({
    url: 'system/api/industryOffice/update',
    method: 'post',
    data
  })
}

// 删除
export function handleIndustryDelete (data) {
  return request({
    url: 'system/api/industryOffice/delete',
    method: 'post',
    data
  })
}
/* 行业主管部门 */

/* 下级政府 */
// 列表
export function handleGovOfficeList (params) {
  return request({
    url: 'system/api/office/governmentTree',
    method: 'get',
    params
  })
}

// 详情
export function handleGovOfficeInfo (data) {
  return request({
    url: `system/api/govOffice/office/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleGovOfficeSave (data) {
  return request({
    url: 'system/api/govOffice/save',
    method: 'post',
    data
  })
}

// 修改
export function handleGovOfficeUpdate (data) {
  return request({
    url: 'system/api/govOffice/update',
    method: 'post',
    data
  })
}

// 删除
export function handleGovOfficeDelete (data) {
  return request({
    url: 'system/api/govOffice/delete',
    method: 'post',
    data
  })
}
/* 下级政府 */

/* 代理商区域管理 */
// 列表
export function handleAreaList (params) {
  return request({
    url: 'system/api/area/getAreaList',
    method: 'get',
    params
  })
}

// 详情
export function handleAreaInfo (data) {
  return request({
    url: `system/api/area/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleAreaSave (data) {
  return request({
    url: 'system/api/area/save',
    method: 'post',
    data
  })
}

// 修改
export function handleAreaUpdate (data) {
  return request({
    url: 'system/api/area/update',
    method: 'put',
    data
  })
}

// 删除
export function handleAreaDelete (data) {
  return request({
    url: 'system/api/area/delete',
    method: 'delete',
    data
  })
}
/* 代理商区域管理 */

// 消防主管部门，行业主管部门，政府部门右侧列表
export function handleRightTable (params) {
  return request({
    url: 'system/api/office/queryTypeList',
    method: 'get',
    params
  })
}
