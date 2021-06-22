import request from '@/utils/request'

// 获取传感器列表
export function getSensorList (params) {
  return request({
    url: 'device/api/sensor/list',
    method: 'get',
    params: params
  })
}
// 获取传感器详情
export function getSensorInfo (data) {
  return request({
    url: `device/api/sensor/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}
// 保存传感器信息
export function saveSensor (data) {
  return request({
    url: 'device/api/sensor/save',
    method: 'post',
    data
  })
}
// 更新传感器信息
export function updateSensor (data) {
  return request({
    url: 'device/api/sensor/update',
    method: 'put',
    data
  })
}
// 删除传感器
export function deleteSensor (data) {
  return request({
    url: 'device/api/sensor/delete',
    method: 'delete',
    data
  })
}
// 获取设备类型

export function getDeviceType (params) {
  return request({
    url: 'device/api/deviceTypes',
    method: 'get',
    params: params
  })
}
// 获取电设备参数
export function getAllUnitList (params) {
  return request({
    url: '/device/api/sensormapping/allUnitList',
    method: 'get',
    params: params
  })
}

// 获取电设备参数单位
export function getAllList (params) {
  return request({
    url: '/device/api/sensormapping/allList',
    method: 'get',
    params: params
  })
}
// 根据设备类型获取传感器类型
export function getSensorTypeList (params) {
  return request({
    url: `/device/api/sensor/typeList/${params.devType}`,
    method: 'get',
    params: params.data
  })
}
// 根据传感器类型获取传感器详情
export function getSensorDetail (params) {
  return request({
    url: `/device/api/sensor/detail/${params.sensorId}`,
    method: 'get'
  })
}
