import request from '@/utils/request'

// 获取正常设备列表
function getNormalGasList (params) {
  const _params = Object.assign({}, params, {
    deviceStatus: 1
  })
  return request({
    url: 'device/api/gas/list',
    method: 'get',
    params: _params
  })
}

// 获取离线设备列表
function getOfflineGasList (params) {
  const _params = Object.assign({}, params, {
    deviceStatus: 2
  })
  return request({
    url: 'device/api/gas/list',
    method: 'get',
    params: _params
  })
}

// 获取报警设备列表
function getAlertGasList (params) {
  const _params = Object.assign({}, params, {
    deviceStatus: 3
  })
  return request({
    url: 'device/api/gas/list',
    method: 'get',
    params: _params
  })
}

// 获取故障设备列表
function getTripGasList (params) {
  const _params = Object.assign({}, params, {
    deviceStatus: 4
  })
  return request({
    url: 'device/api/gas/list',
    method: 'get',
    params: _params
  })
}

// 燃气设备查询接口
export function getGasList (params) {
  return request({
    url: 'device/api/gas/list',
    method: 'get',
    params: params
  })
}

// 初始化获取所有状态设备
export function getAllGasList (params) {
  return new Promise((resolve, reject) => {
    Promise.all([
      getAlertGasList(params),
      getNormalGasList(params),
      getOfflineGasList(params),
      getTripGasList(params)
    ]).then((res) => {
      const devElectricList = {
        alertData: res[0].code === 200 && res[0].data.page.list.length > 0 ? res[0].data.page : { list: [] },
        normalData: res[1].code === 200 && res[1].data.page.list.length > 0 ? res[1].data.page : { list: [] },
        offlineData: res[2].code === 200 && res[2].data.page.list.length > 0 ? res[2].data.page : { list: [] },
        tripData: res[3].code === 200 && res[3].data.page.list.length > 0 ? res[3].data.page : { list: [] }
      }
      resolve(devElectricList)
    }).catch(error => {
      reject(error)
    })
  })
}

// 获取燃气设备报警总数
export function getAlertCount (params) {
  return request({
    url: 'device/api/gas/alertCount',
    method: 'get',
    params
  })
}

// 获取燃气设备状态列表
export function getDevStatusList (params) {
  return request({
    url: 'device/api/gas/pullDownList',
    method: 'get',
    params
  })
}

// 燃气设备报警记录
export function getGasAlarmRecord (params) {
  return request({
    url: 'influxdbread/gas/getAlertRecord',
    method: 'get',
    params
  })
}

// 调节燃气设备音量大小
export function volumeAdjust (params) {
  return request({
    url: 'device/api/gas/volumeAdjust',
    method: 'get',
    params
  })
}

// 调节燃气设备机械手状态
export function maniSwitch (params) {
  return request({
    url: 'device/api/gas/maniSwitch',
    method: 'get',
    params
  })
}

/* 监管单位 */
// 左侧初始化数据
export function getMonitorData (params) {
  return request({
    url: 'device/api/gas/monitor',
    method: 'get',
    params
  })
}
// 报警数据初始化（地图展示）
export function getOfficeAlert (params) {
  return request({
    url: 'influxdbread/gas/getOfficeAlert',
    method: 'get',
    params
  })
}

// 获取单位列表
export function getOfficeList (params) {
  return request({
    url: 'device/api/gas/getOffices',
    method: 'get',
    params
  })
}
/* 监管单位 */

/* 设备注册 */
// 设备类型
export function handleSensorList (params) {
  return request({
    url: 'device/api/sensor/sensorList',
    method: 'get',
    params
  })
}

// 运营商字典
export function handleSensoriInfo (data) {
  return request({
    url: `device/api/sensor/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 列表
export function handleGasRegisterList (params) {
  return request({
    url: 'device/api/gas/devlist',
    method: 'get',
    params
  })
}

// 详情
export function handleGasRegisterInfo (data) {
  return request({
    url: `device/api/gas/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleGasRegisterSave (data) {
  return request({
    url: 'device/api/gas/save',
    method: 'post',
    data
  })
}

// 更新
export function handleGasRegisterUpdate (data) {
  return request({
    url: 'device/api/gas/update',
    method: 'PUT',
    data
  })
}

// 删除
export function handleGasRegisterDelete (data) {
  return request({
    url: 'device/api/gas/delete',
    method: 'DELETE',
    data
  })
}
/* 设备注册 */
