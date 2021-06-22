import request from '@/utils/request'
// 网格化绘制
// 保存
export function savePolygonInfo (data) {
  return request({
    url: 'system/api/bdmap/save',
    method: 'post',
    data
  })
}
// 网格详情
export function getPolygonList (params) {
  return request({
    url: 'system/api/bdmap/getPoints',
    method: 'get',
    params
  })
}
// 网格区域重复校验
export function isExistence (params) {
  return request({
    url: 'system/api/bdmap/isExistence',
    method: 'get',
    params
  })
}
// 网格更新
export function updatePolygonInfo (data) {
  return request({
    url: 'system/api/bdmap/update',
    method: 'post',
    data
  })
}
// 删除网格
export function deletePolygonInfo (data) {
  return request({
    url: 'system/api/bdmap/delete',
    method: 'post',
    data
  })
}

// 网格化管理
// /api/bdmap/getOffice  查询单位
// 参数 areaId（行政区划用）  level（单位分级用）
// /api/bdmap/indexOfficeLevel  单位分级
// /api/bdmap/indexArea         行政区划单位
// /api/bdmap/getSubclass       根据areaId获取下一级子类

// 单位分级
export function getOfficeList (params) {
  return request({
    url: 'system/api/bdmap/getOffice',
    method: 'get',
    params
  })
}
export function getOfficeLevel (params) {
  return request({
    url: 'system/api/bdmap/indexOfficeLevel',
    method: 'get',
    params
  })
}
export function getArea (params) {
  return request({
    url: 'system/api/bdmap/indexArea',
    method: 'get',
    params
  })
}
