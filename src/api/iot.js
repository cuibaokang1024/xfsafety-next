import request from '@/utils/request'
// 设备报警督办意见
export function saveSuggest (data) {
  return request({
    url: 'device/api/serviceidea/save',
    method: 'post',
    data
  })
}

export function getAlertDetail (params) {
  switch (params.category) {
    case 0:
      return request({ // 电设备报警信息报警详情
        url: 'device/api/electric/getAlDetail',
        method: 'get',
        params: params.data
      })
    case 1:
      return request({ // 水设备报警信息报警详情
        url: 'device/api/water/getAlDetail',
        method: 'get',
        params: params.data
      })
    case 2:
      return request({ // 烟感设备报警信息报警详情
        url: 'device/api/smoke/getAlDetail',
        method: 'get',
        params: params.data
      })
    case 3:
      return request({ // 烟感设备报警信息报警详情
        url: 'device/api/gas/getAlDetail',
        method: 'get',
        params: params.data
      })
  }
}
// 设备历史报警记录
export function getAlertRecord (params) {
  return request({
    url: 'influxdbread/watchOver/getAlertRecord',
    method: 'get',
    params
  })
}
// 值守平台报警记录
export function getOfficeAlert (params) {
  return request({
    url: 'influxdbread/watchOver/getOfficeAlert',
    method: 'get',
    params
  })
}

// 值守平台左侧设备监测数据
export function getMonitorData (params) {
  const url = `device/api/${params.type}/monitor`
  return request({
    url,
    method: 'get'
  })
}

// 值守平台左侧设备监测数据
export function getDevMonitor (params) {
  return request({
    url: 'device/api/status/getDevMonitor',
    method: 'get',
    params
  })
}

// 值守平台初始化地图报警设备列表
export function getAlertOffices (params) {
  return request({
    url: 'device/api/officeinfo/getAlertOffices',
    method: 'get',
    params
  })
}
// 值守平台按设备类型查询单位
export function getNumOffices (params) {
  return request({
    url: 'device/api/officeinfo/getNumOffices',
    method: 'get',
    params
  })
}
/** 单位设备详情 */

// 单位设备列表
export function getOfficeDevList (params) {
  const str = params.type.slice(0, 1).toUpperCase() + params.type.slice(1)
  const url = `device/api/${params.type}/office${str}List`
  return request({
    url,
    method: 'get',
    params: params.data
  })
}

export function getOfficeDetail (params) {
  const url = `device/api/${params.type}/getOfficeDetail`
  return request({
    url,
    method: 'get',
    params: params.data
  })
}
