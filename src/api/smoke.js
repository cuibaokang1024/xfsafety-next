import request from '@/utils/request'

// 获取烟感设备列表
export function getSmokeList (params) {
  return request({
    url: 'device/api/smoke/smokeList',
    method: 'get',
    params: params
  })
}

// 获取正常设备列表
function getNormalSmokeList (params) {
  const _params = Object.assign({}, params, {
    devSmokeStatus: 1
  })
  return request({
    url: 'device/api/smoke/smokeList',
    method: 'get',
    params: _params
  })
}

// 获取离线设备列表
function getOfflineSmokeList (params) {
  const _params = Object.assign({}, params, {
    devSmokeStatus: 2
  })
  return request({
    url: 'device/api/smoke/smokeList',
    method: 'get',
    params: _params
  })
}

// 获取报警设备列表
function getAlertSmokeList (params) {
  const _params = Object.assign({}, params, {
    devSmokeStatus: 3
  })
  return request({
    url: 'device/api/smoke/smokeList',
    method: 'get',
    params: _params
  })
}

// 初始化获取所有状态设备
export function getAllSmokeList (params) {
  return new Promise((resolve, reject) => {
    Promise.all([
      getAlertSmokeList(params),
      getNormalSmokeList(params),
      getOfflineSmokeList(params)
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

// 获取烟感设备报警总数
export function getAlertCount (params) {
  return request({
    url: 'device/api/smoke/getAlertCount',
    method: 'get',
    params
  })
}

// 获取设备状态列表
export function getDevStatusList (params) {
  return request({
    url: 'device/api/smoke/pullDownList',
    method: 'get',
    params
  })
}

// 报警记录

export function getSmokeAlarmRecord (params) {
  return request({
    url: 'influxdbread/smoke/getAlertRecord',
    method: 'get',
    params
  })
}

// 监管单位
// 左侧初始化数据
export function getMonitorData (params) {
  return request({
    url: 'device/api/smoke/monitor',
    method: 'get',
    params
  })
}
// 报警数据初始化（地图展示）
export function getOfficeAlert (params) {
  return request({
    url: 'influxdbread/smoke/getOfficeAlert',
    method: 'get',
    params
  })
}

// 获取单位列表
export function getOfficeList (params) {
  return request({
    url: 'device/api/smoke/getOffices',
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

// 运营商字典
export function handleSensoriInfo (data) {
  return request({
    url: `device/api/sensor/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 列表
export function handleSmokeRegisterList (params) {
  return request({
    url: 'device/api/smoke/list',
    method: 'get',
    params
  })
}

// 详情
export function handleSmokeRegisterInfo (data) {
  return request({
    url: `device/api/smoke/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存更新 (id存在更新のid不存在新增)
export function handleSmokeRegisterSave (data) {
  return request({
    url: 'device/api/smoke/save',
    method: 'post',
    data
  })
}

// 更新
export function handleSmokeRegisterUpdate (data) {
  return request({
    url: 'device/api/smoke/update',
    method: 'post',
    data
  })
}

// 删除
export function handleSmokeRegisterDelete (data) {
  return request({
    url: 'device/api/smoke/delete',
    method: 'post',
    data
  })
}
/* 设备注册 */
