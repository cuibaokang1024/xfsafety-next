import request from '@/utils/request'

/* 服务到期客户明细 */
// 列表
export function handleAgentList (params) {
  return request({
    url: 'system/api/agent/index/officeExpireList',
    method: 'get',
    params
  })
}
/* 服务到期客户明细 */

/* 单位设备列表 */
// 字典值
export function handleDeviceTypeList (params) {
  return request({
    url: 'device/api/deviceTypes',
    method: 'get',
    params
  })
}

// 列表
export function handleOfficeDeviceList (params) {
  return request({
    url: 'system/api/agent/index/officeDeviceList',
    method: 'get',
    params
  })
}
/* 单位设备列表 */
// 获取设备统计详情
export function getDeviceStat (params) {
  return request({
    url: 'system/api/agent/index/deviceStat',
    method: 'get',
    params
  })
}
// 获取单位列表
export function getOfficeList (params) {
  return request({
    url: 'system/api/agent/index/officeList',
    method: 'get',
    params
  })
}
export function getOfficeMapList (params) {
  return request({
    url: 'system/api/agent/index/officeMapList',
    method: 'get',
    params
  })
}

// 获取单位设备数
export function getOfficeDeviceState (params) {
  return request({
    url: 'system/api/agent/index/officeDeviceStat',
    method: 'get',
    params
  })
}
