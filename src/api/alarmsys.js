import request from '@/utils/request'

// 获取报警主机设备列表
export function getAlarmsysList (params) {
  return request({
    url: 'device/api/alarmsys/alarmsysList',
    method: 'get',
    params: params
  })
}
// 获取报警主机设备列表
export function getAreaInfo (params) {
  return request({
    url: 'device/api/alarmsys/getAreaInfo',
    method: 'get',
    params: params
  })
}

// 获取报警主机报警信息
export function getAlarmHistor (params) {
  return request({
    url: 'influxdbread/alarmsys/getAlarmHistory',
    method: 'get',
    params: params
  })
}

/* 重点部位检测设备 */
// 列表
export function handleKeyPartsList (params) {
  return request({
    url: 'device/api/alarmsys/list',
    method: 'get',
    params
  })
}

// 详情
export function handleKeyPartsInfo (data) {
  return request({
    url: `device/api/alarmsys/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleKeyPartsSave (data) {
  return request({
    url: 'device/api/alarmsys/save',
    method: 'post',
    data
  })
}

// 更新
export function handleKeyPartsUpdate (data) {
  return request({
    url: 'device/api/alarmsys/update',
    method: 'POST',
    data
  })
}

// 删除
export function handleKeyPartsDelete (data) {
  return request({
    url: 'device/api/alarmsys/delete',
    method: 'POST',
    data
  })
}
/* 重点部位检测设备 */
