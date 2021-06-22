import request from '@/utils/request'

// 获取隐患改进的柱状图的数据
export function hiddenInfo (params) {
  return request({
    url: '/fire/api/dangerStatistics/areaDanger',
    method: 'get',
    params
  })
}

// 获取隐患改进的饼状图的数据
export function hiddenCircleInfo (params) {
  return request({
    url: 'fire/api/dangerStatistics/areaDangerCake',
    method: 'get',
    params
  })
}

// 养老机构数量
export function handlebeadhouseCount (params) {
  return request({
    url: 'system/api/office/stat/getRegAreaInsur',
    method: 'get',
    params
  })
}

/* 按行政区划统计报警信息 */
// 列表
export function handleAlarmArea (params) {
  return request({
    url: 'system/api/area/getAdminArea',
    method: 'get',
    params
  })
}

// 饼图
export function handleDevByArea (params) {
  return request({
    url: 'device/api/status/getDevByArea',
    method: 'get',
    params
  })
}

// 柱图
export function handleDevNumArea (params) {
  return request({
    url: 'system/api/area/getDevNumArea',
    method: 'get',
    params
  })
}

/* 按行政区划统计报警信息 */

/* 设备报警统计 */
export function handleDeviceCount (params) {
  return request({
    url: 'device/api/status/deviceCount',
    method: 'get',
    params
  })
}

/* 设备报警统计 */

// 查询单位
export function handleCompany (params) {
  return request({
    url: 'system/api/office/stat/officeAreaType',
    method: 'get',
    params
  })
}
