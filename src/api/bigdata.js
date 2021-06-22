import request from '@/utils/request'

// 字典值
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}

// 详情
export function handleOfficeViewInfo (data) {
  return request({
    url: data.url,
    method: 'post',
    params: data.listQuery
  })
}

// 按类别统计单位
export function handleOfficeTypeData (params) {
  return request({
    url: 'device/api/formAnalyse/officeType ',
    method: 'get',
    params
  })
}

// 按固定设施统计
export function handleSensorAreaData (params) {
  return request({
    url: 'device/api/formAnalyse/sensorArea',
    method: 'get',
    params
  })
}

// 按行政区域统计隐患
export function handleDangerAreaData (params) {
  return request({
    url: 'device/api/formAnalyse/dangerArea',
    method: 'get',
    params
  })
}

// 按主管部门统计隐患
export function handleDangerDirectData (params) {
  return request({
    url: 'device/api/formAnalyse/dangerDirect',
    method: 'get',
    params
  })
}

// 按月统计火灾隐患
export function handleDangerTrendData (params) {
  return request({
    url: 'device/api/formAnalyse/dangerTrend',
    method: 'get',
    params
  })
}

// 单位按月统计火灾隐患
export function handleComyDangerTrendData (params) {
  return request({
    url: 'device/api/formAnalyse/comyDangerTrend',
    method: 'get',
    params
  })
}

// 固定消防设施报警分析
export function handleFixedFireTrendData (params) {
  return request({
    url: 'device/api/formAnalyse/fixedFireTrend',
    method: 'get',
    params
  })
}

// 超时未检查单位分析
export function handleDangerOvertimeData (params) {
  return request({
    url: 'device/api/formAnalyse/dangerOvertime',
    method: 'get',
    params
  })
}

// 智慧用电安装统计
export function handleElectricAreaData (params) {
  return request({
    url: 'device/api/formAnalyse/electricArea',
    method: 'get',
    params
  })
}

// 智慧用水安装统计
export function handleWaterAreaData (params) {
  return request({
    url: 'device/api/formAnalyse/waterArea',
    method: 'get',
    params
  })
}

// 按行业主管统计单位
export function handleIndustryDirectorsData (params) {
  return request({
    url: 'device/api/formAnalyse/officeDirect',
    method: 'get',
    params
  })
}

// 按行政区划统计单位
export function handleAdministrativeDivisionData (params) {
  return request({
    url: 'device/api/formAnalyse/officeArea',
    method: 'get',
    params
  })
}
