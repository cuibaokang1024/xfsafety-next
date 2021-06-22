import request from '@/utils/request'

/* 字典 */
// 角色下拉
export function getRoleList (params) {
  return request({
    url: 'system/api/user/getRoleList',
    method: 'get',
    params
  })
}

// 字典值
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}

// 获取单位分级信息
export function getOfficeLevelList (params) {
  return request({
    url: 'system/api/office/officeLevelList',
    method: 'get',
    params
  })
}

export function getMaintenanceList (params) {
  return request({
    url: 'system/api/officeinfo/getMaintenanceList',
    method: 'get',
    params
  })
}

// tree
export function handleRecordAreaTree (params) {
  return request({
    url: 'system/admin/division/getOfficeArea',
    method: 'get',
    params
  })
}

export function handleRecordFireTree (params) {
  return request({
    url: 'system/api/office/fireTree',
    method: 'get',
    params
  })
}

// 建筑类型
export function handlePurposeType (params) {
  return request({
    url: 'system/api/highbuilding/purposeTypeList',
    method: 'get',
    params
  })
}

// 楼层类别
export function handleHighLevel (params) {
  return request({
    url: 'system/api/highbuilding/highBuiLdLevelList',
    method: 'get',
    params
  })
}

/* 字典 */

/* 一企一档 */
// 列表
export function handleEnterpriseRecordList (params) {
  return request({
    url: 'system/api/officeinfo/queryList',
    method: 'get',
    params
  })
}

// 保存
export function handleEnterpriseRecordSave (data) {
  return request({
    url: 'system/api/officeinfo/save',
    method: 'post',
    data
  })
}

// 详情
export function handleEnterpriseRecordInfo (data) {
  return request({
    url: `system/api/officeinfo/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 修改
export function handleEnterpriseRecordUpdate (data) {
  return request({
    url: 'system/api/office/archives/update',
    method: 'post',
    data
  })
}

// 删除
export function handleEnterpriseRecordDelete (data) {
  return request({
    url: 'system/api/officeinfo/delete',
    method: 'post',
    data
  })
}
/* 一企一档 */

/* 一楼一档 */
// tree
export function handleBuildingRecordTreeData (params) {
  return request({
    url: 'system/api/highbuilding/treeData',
    method: 'get',
    params
  })
}

// 建筑结构列表
export function handleHighBuildStructureList (params) {
  return request({
    url: 'system/api/highbuilding/highBuildStructureList',
    method: 'get',
    params
  })
}

// 建筑防火等级列表
export function handleHighBuildFireRatingList (params) {
  return request({
    url: 'system/api/highbuilding/highBuildFireRatingList',
    method: 'get',
    params
  })
}

// 燃气类型列表
export function handleHighBuildGasTypeList (params) {
  return request({
    url: 'system/api/highbuilding/highBuildGasTypeList',
    method: 'get',
    params
  })
}

// 列表
export function handleBuildingRecordList (params) {
  return request({
    url: 'system/api/highbuilding/list',
    method: 'get',
    params
  })
}

// 详情
export function handleBuildingRecordInfo (data) {
  return request({
    url: `system/api/highbuilding/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleBuildingRecordSave (data) {
  return request({
    url: 'system/api/highbuilding/save',
    method: 'post',
    data
  })
}

// 修改
export function handleBuildingRecordUpdate (data) {
  return request({
    url: 'system/api/highbuilding/update',
    method: 'post',
    data
  })
}

// 删除
export function handleBuildingRecordDelete (data) {
  return request({
    url: 'system/api/highbuilding/delete',
    method: 'post',
    data
  })
}
/* 一楼一档 */

/* 一人一档 */
// 人员类型列表
export function handleTypeList (params) {
  return request({
    url: 'system/api/person/personTypeList',
    method: 'get',
    params
  })
}

// 人员状态列表
export function handleStatusList (params) {
  return request({
    url: 'system/api/person/personStatusList',
    method: 'get',
    params
  })
}

// 列表
export function handlePersonRecordList (params) {
  return request({
    url: 'system/api/person/list',
    method: 'get',
    params
  })
}

// 保存
export function handlePersonRecordSave (data) {
  return request({
    url: 'system/api/person/save',
    method: 'post',
    data
  })
}

// 修改
export function handlePersonRecordUpdate (data) {
  return request({
    url: 'system/api/person/update',
    method: 'post',
    data
  })
}

// 详情
export function handlePersonRecordInfo (data) {
  return request({
    url: `system/api/person/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 删除
export function handlePersonRecordDelete (data) {
  return request({
    url: 'system/api/person/delete',
    method: 'post',
    data
  })
}
/* 一人一档 */

/* 查看人员 */
// 人员列表
export function handleUserList (params) {
  return request({
    url: 'system/api/highbuilding/getBuildUser',
    method: 'get',
    params
  })
}

// 保存人员
export function handleUserSave (data) {
  return request({
    url: 'system/admin/division/saveAreaUser',
    method: 'post',
    data
  })
}

// 详情人员
export function handleUserInfo (data) {
  return request({
    url: `system/api/user/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 修改人员
export function handleUserUpdate (data) {
  return request({
    url: 'system/api/user/update',
    method: 'post',
    data
  })
}

// 删除人员
export function handleUserDelete (data) {
  return request({
    url: '/system/admin/division/delUser',
    method: 'post',
    data
  })
}

/* 查看人员 */

/* 住宅管理 */

// 分级
export function handleResidenceRecordType (params) {
  return request({
    url: 'system/api/highbuilding/type',
    method: 'get',
    params
  })
}

// 分级
export function handleResidenceTreeData (params) {
  return request({
    url: 'system/api/highbuilding/treeData',
    method: 'get',
    params
  })
}

/* 住宅管理 */
