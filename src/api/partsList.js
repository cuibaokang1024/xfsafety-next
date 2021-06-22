
import request from '@/utils/request'
// 获取采集部位（一次拿到所有数据，前台控制级联）
// export function getPartsList(params) {
//   return request({
//     url: 'device/api/parts/list',
//     method: 'get',
//     params
//   })
// }
export function getPartsList (params) {
  return request({
    url: 'system/api/parts/getPartsList',
    method: 'get',
    params
  })
}
export function getPartsAddrList (params) {
  return request({
    url: 'system/api/parts/getPartsAddrList',
    method: 'get',
    params
  })
}
export function getListByPartAddr (params) {
  return request({
    url: 'fire/api/points/getListByPartAddr',
    method: 'get',
    params
  })
}

// 根据检查任务检查时间获取对应楼座

export function getfloorPlanPart (params) {
  return request({
    url: 'fire/api/plan/floorPlanPart',
    method: 'get',
    params
  })
}
// 获取楼座下面的楼层
export function getfloorPlanPartsAddr (params) {
  return request({
    url: 'fire/api/plan/floorPlanPartsAddr',
    method: 'get',
    params
  })
}
// 获取楼层的平面图
export function getfloorPlanInfo (params) {
  return request({
    url: 'fire/api/plan/floorPlanInfo',
    method: 'get',
    params
  })
}
