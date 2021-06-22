import request from '@/utils/request'
import axios from 'axios'
// axios.defaults.withCredentials = true
// 获取可视化设备列表
export function getCameraList (params) {
  return request({
    url: 'device/api/cam/cameraList',
    method: 'get',
    params: params
  })
}

// 获取可视化设备报警总数
export function getAlertCount (params) {
  return request({
    url: 'device/api/cam/alertCount',
    method: 'get',
    params
  })
}
// 获取设备状态列表
export function getDevStatusList (params) {
  return request({
    url: 'device/api/cam/pullDownList',
    method: 'get',
    params
  })
}
// 获取报警记录
export function getCameraAlarmRecord (params) {
  return request({
    url: 'influxdbread/cam/devDataInfo/getAlertRecord',
    method: 'get',
    params: params
  })
}

/* 设备注册 */
// 设备类型
export function handleSensorList (params) {
  return request({
    url: 'device/api/sensor/sensorList',
    method: 'get',
    params
  })
}

// 列表
export function handleCameraRegisterList (params) {
  return request({
    url: 'device/api/cam/cameraAgentList',
    method: 'get',
    params
  })
}

// 详情
export function handleCameraRegisterInfo (data) {
  return request({
    url: `device/api/cam/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleCameraRegisterSave (data) {
  return request({
    url: 'device/api/cam/save',
    method: 'post',
    data
  })
}

// 更新
export function handleCameraRegisterUpdate (data) {
  return request({
    url: 'device/api/cam/update',
    method: 'POST',
    data
  })
}

// 删除
export function handleCameraRegisterDelete (data) {
  return request({
    url: 'device/api/cam/delete',
    method: 'POST',
    data
  })
}
// 报警信息
export function findAlertAll (params) {
  return request({
    url: '/device/api/cam/findAlertAll',
    method: 'get',
    params
  })
}
/* 设备注册 */

/* 摄像机选择弹窗 */
// 摄像机型号传感器字典值

export function handleCamSelectDict (params) {
  return request({
    url: 'device/api/sensor/typeList/5',
    method: 'get',
    params
  })
}

// 设备供应商类型
export function handleSupplierDict (params) {
  return request({
    url: 'device/api/cam/supplier',
    method: 'get',
    params
  })
}

// 通道类型
export function handleChannelTypeDict (params) {
  return request({
    url: 'device/api/cam/channelType',
    method: 'get',
    params
  })
}

// 列表
export function handleCamSelectList (params) {
  return request({
    url: 'device/api/cam/nearCamList',
    method: 'get',
    params
  })
}

/* 摄像机选择弹窗 */

/* GB28181流媒体 */
// 创建一个axios实例
const service = axios.create({
  withCredentials: true, // 必须要设置该属性携带cookie
  timeout: 10000
})
// 登陆
export function GBSLogin (params, baseUrl) {
  const url = `${baseUrl}api/v1/login`
  return service.get(url, { params }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 开始直播
export function streamStart (params, baseUrl) {
  const url = `${baseUrl}api/v1/stream/start`
  return service.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 直播流保活
export function streamTouch (params, baseUrl) {
  const url = `${baseUrl}api/v1/stream/touch`
  return service.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
