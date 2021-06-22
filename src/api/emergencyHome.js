import request from '@/utils/request'
// 获取单位分级统计信息
export function getAreaLevelinfo (params) {
  return request({
    url: 'fire/api/officemanagement/arealevel',
    method: 'get',
    params
  })
}
// 单位分级分类查询
export function getAreaLevelofficelist (params) {
  return request({
    url: 'fire/api/officemanagement/levelAreaList',
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

export function getAreaLevelbuildinginfo (params) {
  return request({
    url: 'fire/api/officemanagement/levelbuildingarea',
    method: 'get',
    params
  })
}

// 高层建筑分级统计 - 建筑列表查询
export function getAreaLevelbuildinglist (params) {
  return request({
    url: 'fire/api/officemanagement/arealevelbuilding',
    method: 'get',
    params
  })
}
// （首页按区域统计单位和建筑）
export function getDirectAreaCount (params) {
  return request({
    url: 'fire/api/officArea/areaList2',
    method: 'get',
    params
  })
}
export function getAreaDevicecount (params) {
  return request({
    url: 'fire/api/officemanagement/deviceAreaCount',
    method: 'get',
    params
  })
}
