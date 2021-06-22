import request from '@/utils/request'

// 获取正常设备列表
function getNormalWaterList (params) {
  const _params = Object.assign({}, params, {
    devWaterStatus: 1
  })
  return request({
    url: 'device/api/water/waterList',
    method: 'get',
    params: _params
  })
}

// 获取离线设备列表
function getOfflineWaterList (params) {
  const _params = Object.assign({}, params, {
    devWaterStatus: 2
  })
  return request({
    url: 'device/api/water/waterList',
    method: 'get',
    params: _params
  })
}

// 获取报警设备列表
function getAlertWaterList (params) {
  const _params = Object.assign({}, params, {
    devWaterStatus: 3
  })
  return request({
    url: 'device/api/water/waterList',
    method: 'get',
    params: _params
  })
}

// 水设备查询接口
export function getWaterList (params) {
  return request({
    url: 'device/api/water/waterList',
    method: 'get',
    params: params
  })
}

// 初始化获取所有状态设备
export function getAllWaterList (params) {
  return new Promise((resolve, reject) => {
    Promise.all([
      getAlertWaterList(params),
      getNormalWaterList(params),
      getOfflineWaterList(params)
    ]).then((res) => {
      const devElectricList = {
        alertData: res[0].code === 200 && res[0].data.page.list.length > 0 ? res[0].data.page : { list: [] },
        normalData: res[1].code === 200 && res[1].data.page.list.length > 0 ? res[1].data.page : { list: [] },
        offlineData: res[2].code === 200 && res[2].data.page.list.length > 0 ? res[2].data.page : { list: [] }
      }
      resolve(devElectricList)
    }).catch(error => {
      reject(error)
    })
  })
}
// 水压数据
export function getHydraulic (params) {
  return request({
    url: 'influxdbread/water/queryHydraulic',
    method: 'get',
    params
  })
}

// 水位数据
export function getWaterLevel (params) {
  return request({
    url: 'influxdbread/water/queryWaterLevel',
    method: 'get',
    params
  })
}

// 报警记录
export function getWaterAlarmRecord (params) {
  return request({
    url: 'influxdbread/water/getAlertRecord',
    method: 'get',
    params
  })
}

// 获取水设备报警总数
export function getAlertCount (params) {
  return request({
    url: 'device/api/water/alertCount',
    method: 'get',
    params
  })
}

// 获取水设备状态列表
export function getDevStatusList (params) {
  return request({
    url: 'device/api/water/pullDownList',
    method: 'get',
    params
  })
}

// 监管单位
// 左侧初始化数据
export function getMonitorData (params) {
  return request({
    url: 'device/api/water/monitor',
    method: 'get',
    params
  })
}

// 报警数据初始化
export function getOfficeAlert (params) {
  return request({
    url: 'influxdbread/water/getOfficeAlert',
    method: 'get',
    params
  })
}

// 获取单位列表
export function getOfficeList (params) {
  return request({
    url: 'device/api/water/getOffices',
    method: 'get',
    params
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

// 获取水设备注册列表
export function getWaterRegisterList (params) {
  return request({
    url: 'device/api/water/list',
    method: 'get',
    params
  })
}

export function geWaterRegisterInfo (data) {
  return request({
    url: `device/api/water/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存水设备注册列表(id存在更新、id不存在新增)
export function saveWaterRegister (data) {
  return request({
    url: 'device/api/water/save',
    method: 'post',
    data
  })
}

// 更新
export function updateWaterRegister (data) {
  return request({
    url: 'device/api/water/update',
    method: 'post',
    data
  })
}

// 删除水设备注册列表
export function deleteWaterRegister (data) {
  return request({
    url: 'device/api/water/delete',
    method: 'post',
    data
  })
}
