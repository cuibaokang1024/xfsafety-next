import request from '@/utils/request'
// 获取单位分级统计信息
export function getLevelinfo (params) {
  return request({
    url: 'fire/api/officemanagement/levelinfo',
    method: 'get',
    params
  })
}
// 单位分级分类查询
export function getLevelofficelist (params) {
  return request({
    url: 'fire/api/officemanagement/levelofficelist',
    method: 'get',
    params
  })
}
// 按单位名称查询

export function searchOffice (params) {
  return request({
    url: 'fire/api/officemanagement/levelofficequery',
    method: 'get',
    params
  })
}

// 高层建筑分级统计-总查询

export function getLevelbuildinginfo (params) {
  return request({
    url: 'fire/api/officemanagement/levelbuildinginfo',
    method: 'get',
    params
  })
}

// 高层建筑分级统计 - 建筑列表查询
export function getLevelbuildinglist (params) {
  return request({
    url: 'fire/api/officemanagement/levelbuildinglist',
    method: 'get',
    params
  })
}
// （首页按区域统计单位和建筑）
export function getAreaList (params) {
  return request({
    url: 'fire/api/officArea/areaList',
    method: 'get',
    params
  })
}

// （首页按区域统计单位）
export function getAreaLeveloffice (params) {
  return request({
    url: 'fire/api/officemanagement/officeLevelList',
    method: 'get',
    params
  })
}

// （首页按区域统计建筑）
export function getAreaBuildingOffice (params) {
  return request({
    url: 'fire/api/officArea/buildingLevelList',
    method: 'get',
    params
  })
}

// 履职情况，统计数据

export function getPerformancecount (params) {
  return request({
    url: 'fire/api/officemanagement/performancecount',
    method: 'get',
    params
  })
}
// 履职情况，区域类型统计及列表查询

export function getPerformanceareacount (params) {
  return request({
    url: 'fire/api/officemanagement/performanceareacount',
    method: 'get',
    params
  })
}

// 监管单位绩效综合排名

export function getDirectchkcount (params) {
  return request({
    url: 'fire/api/officemanagement/directchkcount',
    method: 'get',
    params
  })
}

// 风险评估 - 汇总

export function getAssessmentcount (params) {
  return request({
    url: 'fire/api/officemanagement/assessmentcount',
    method: 'get',
    params
  })
}

// 风险评估-按区域

export function getAssessmentareacount (params) {
  return request({
    url: 'fire/api/officemanagement/assessmentareacount',
    method: 'get',
    params
  })
}
export function getDevicecount (params) {
  return request({
    url: 'fire/api/officemanagement/devicecount',
    method: 'get',
    params
  })
}

// 隐患统计

export function getDangerList (params) {
  return request({
    url: 'fire/api/officeDanger/dangerList',
    method: 'get',
    params
  })
}
// 隐患统计-按类别
export function getDangerTypeList (params) {
  return request({
    url: 'fire/api/officeDanger/levelofficelist',
    method: 'get',
    params
  })
}

// 隐患统计-按类别
export function getAlertRecord (params) {
  return request({
    url: 'device/api/status/alertRecord',
    method: 'get',
    params
  })
}
