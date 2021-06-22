import request from '@/utils/request'

/* 消防和安保设施录入 */
// 设备设施类型
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}

// 生成编号
export function handleSecCreateNo (params) {
  return request({
    url: 'device/api/facilityinput/createNo',
    method: 'get',
    params
  })
}

// 责任部门
export function handleSecDeptList (params) {
  return request({
    url: 'system/api/user/getDeptList',
    method: 'get',
    params
  })
}

// 责任人
export function handleSecDeptUser (params) {
  return request({
    url: 'system/api/user/getListByDept',
    method: 'get',
    params
  })
}

// 设备树
export function handleSecTypeTree (params) {
  return request({
    url: 'device/api/facilityinput/getDeviceType',
    method: 'get',
    params
  })
}

// 查询过期设备设施
export function handleSecExpiredDev (params) {
  return request({
    url: 'device/api/facilityinput/getExpiredDev',
    method: 'get',
    params
  })
}

// 列表
export function handleSecList (params) {
  return request({
    url: 'device/api/facilityinput/queryList',
    method: 'get',
    params
  })
}

// 详情
export function handleSecInfo (data) {
  return request({
    url: `device/api/facilityinput/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleSecSave (data) {
  return request({
    url: 'device/api/facilityinput/save',
    method: 'post',
    data
  })
}

// 更新
export function handleSecUpdate (data) {
  return request({
    url: 'device/api/facilityinput/update',
    method: 'put',
    data
  })
}

// 删除
export function handleSecDelete (data) {
  return request({
    url: 'device/api/facilityinput/delete',
    method: 'delete',
    data
  })
}
/* 消防和安保设施录入 */

/* 危化品类型设置 */
// 列表
export function handleTypeList (params) {
  return request({
    url: 'fire/api/chechemicaltype/list',
    method: 'get',
    params
  })
}

// 详情
export function handleTypeInfo (data) {
  return request({
    url: `fire/api/chechemicaltype/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleTypeSave (data) {
  return request({
    url: 'fire/api/chechemicaltype/save',
    method: 'post',
    data
  })
}

// 修改
export function handleTypeUpdate (data) {
  return request({
    url: 'fire/api/chechemicaltype/update',
    method: 'put',
    data
  })
}

// 删除
export function handleTypeDelete (params) {
  return request({
    url: `fire/api/chechemicaltype/delete/${params.id}`,
    method: 'delete'
  })
}
/* 危化品类型设置 */

/* 危化品出入库管理 */
// 危化品列表
export function handleDangerList (params) {
  return request({
    url: 'fire/api/chechemicalrecord/findAllStorage',
    method: 'get',
    params
  })
}

// 人员
export function handleUserList (params) {
  return request({
    url: 'system/api/user/chemicalUserList',
    method: 'get',
    params
  })
}

// 列表
export function handleWareList (params) {
  return request({
    url: 'fire/api/chechemicalrecord/list',
    method: 'get',
    params
  })
}

// 保存
export function handleWareSave (data) {
  return request({
    url: `fire/api/chechemicalrecord/save/${data.operation}`,
    method: 'post',
    data: data.formData
  })
}

// 查询
export function handleWareInfo (data) {
  return request({
    url: `fire/api/chechemicalrecord/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}
/* 危化品出入库管理 */

// 危化品明细

// 所属部门
export function handleDangerDelList (params) {
  return request({
    url: 'fire/api/chechemical/list',
    method: 'get',
    params
  })
}

// 新增
export function handleDangerDelCreate (data) {
  return request({
    url: 'fire/api/chechemical/save',
    method: 'post',
    data
  })
}

// 修改
export function handleDangerDelUpdate (data) {
  return request({
    url: 'fire/api/chechemical/update',
    method: 'put',
    data
  })
}

// 删除
export function handleDangerDelDelete (data) {
  return request({
    url: 'fire/api/chechemical/delete',
    method: 'delete',
    data
  })
}

// 查询
export function handleDangerDelSearch (params) {
  return request({
    url: `fire/api/chechemical/info/${params.id}`,
    method: 'get'
  })
}

// 危化品处置方法
// 列表
export function handleDangerMethodList (params) {
  return request({
    url: 'fire/api/chechemicaldisposal/list',
    method: 'get',
    params
  })
}

// 详情
export function handleDangerMethodDetail (params) {
  return request({
    url: `fire/api/chechemicaldisposal/info/${params.id}`,
    method: 'get'
  })
}
