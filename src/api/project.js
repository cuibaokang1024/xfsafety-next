import request from '@/utils/request'

// 获取单位分级信息
export function handleOfficeLevelList (params) {
  return request({
    url: 'system/api/office/officeLevelList',
    method: 'get',
    params
  })
}

/* 项目列表 */
// 列表
export function handleProjectListList (params) {
  return request({
    url: 'system/api/firerule/fireRuleList',
    method: 'get',
    params
  })
}

// 新增
export function handleProjectListSave (data) {
  return request({
    url: 'system/api/firerule/save',
    method: 'post',
    data
  })
}

// 详情
export function handleProjectListInfo (data) {
  return request({
    url: `system/api/firerule/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleProjectListUpdate (data) {
  return request({
    url: 'system/api/firerule/update',
    method: 'post',
    data
  })
}

// 删除
export function handleProjectListDelete (data) {
  return request({
    url: 'system/api/firerule/delete',
    method: 'POST',
    data
  })
}
/* 项目列表 */

/* 客户列表 */
// 列表
export function handleCustomListList (params) {
  return request({
    url: 'system/api/agent/office/list',
    method: 'get',
    params
  })
}

// 新增
export function handleCustomListSave (data) {
  return request({
    url: 'system/api/firerule/save',
    method: 'post',
    data
  })
}

// 详情
export function handleCustomListInfo (data) {
  return request({
    url: `system/api/agent/office/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleCustomListUpdate (data) {
  return request({
    url: 'system/api/firerule/update',
    method: 'post',
    data
  })
}

// 删除
export function handleCustomListDelete (data) {
  return request({
    url: 'system/api/firerule/delete',
    method: 'POST',
    data
  })
}
/* 项目列表 */

/* 重点客户 */
// 列表
export function handleKeyCustomList (params) {
  return request({
    url: 'system/api/keycustomer/list',
    method: 'get',
    params
  })
}

// 新增
export function handleKeyCustomSave (data) {
  return request({
    url: 'system/api/keycustomer/save',
    method: 'post',
    data
  })
}

// 详情
export function handleKeyCustomInfo (data) {
  return request({
    url: `system/api/keycustomer/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleKeyCustomUpdate (data) {
  return request({
    url: 'system/api/keycustomer/update',
    method: 'PUT',
    data
  })
}

// 删除
export function handleKeyCustomDelete (data) {
  return request({
    url: 'system/api/keycustomer/delete',
    method: 'DELETE',
    data
  })
}

// 安装设备列表
export function handleKeyCustomDevList (params) {
  return request({
    url: 'device/api/water/devStatistic',
    method: 'get',
    params
  })
}

/* 重点客户 */

/* 周报月报推送 */
// 列表
export function handleReportPushList (params) {
  return request({
    url: 'system/api/firerule/fireRuleList',
    method: 'get',
    params
  })
}

// 新增
export function handleReportPushSave (data) {
  return request({
    url: 'system/api/firerule/save',
    method: 'post',
    data
  })
}

// 详情
export function handleReportPushInfo (data) {
  return request({
    url: `system/api/firerule/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleReportPushUpdate (data) {
  return request({
    url: 'system/api/firerule/update',
    method: 'post',
    data
  })
}

// 删除
export function handleReportPushDelete (data) {
  return request({
    url: 'system/api/firerule/delete',
    method: 'POST',
    data
  })
}
/* 周报月报推送 */

/* 值守报警记录 */
// 获取设备类型
export function handleGetDeviceType (params) {
  return request({
    url: 'device/api/deviceTypes',
    method: 'get',
    params: params
  })
}

// 列表
export function handleAlarmRecordList (params) {
  return request({
    url: '/device/api/dutyRecord/list',
    method: 'get',
    params
  })
}

// 删除
export function handleAlarmRecordDelete (data) {
  return request({
    url: 'device/api/dutyRecord/delete',
    method: 'POST',
    data
  })
}
/* 值守报警记录 */
