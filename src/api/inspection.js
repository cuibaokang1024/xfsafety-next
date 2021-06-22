import request from '@/utils/request'
// 平面图展示 建筑列表
export function getBuildingTree (params) {
  return request({
    url: 'system/api/building/getBuildingTree',
    method: 'get',
    params
  })
}
export function getFilesByBuildingId (params) {
  return request({
    url: 'system/api/buildingplan/getFilesByBuildingId',
    method: 'get',
    params
  })
}
