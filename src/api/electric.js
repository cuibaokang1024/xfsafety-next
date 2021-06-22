import request from '@/utils/request'

export function getElectricFormList (params) {
  return request({
    url: 'http://192.168.3.31:8301/api/public/permission/officeList',
    method: 'get',
    params
  })
}

export function getElectricInfo (id, params) {
  const basUrl = 'http://114.116.109.144:8301/api/api/electric/list'
  return request({
    url: `${basUrl}/${id}`,
    method: 'get',
    params
  })
}

// 获取正常设备列表
function getNormalElectricList (params) {
  const _params = Object.assign({}, params, {
    devElectricStatus: 1
  })
  return request({
    url: 'device/api/electric/electricList',
    method: 'get',
    params: _params
  })
}

// 获取离线设备列表
function getOfflineElectricList (params) {
  const _params = Object.assign({}, params, {
    devElectricStatus: 2
  })
  return request({
    url: 'device/api/electric/electricList',
    method: 'get',
    params: _params
  })
}

// 获取报警设备列表
function getAlertElectricList (params) {
  const _params = Object.assign({}, params, {
    devElectricStatus: 3
  })
  return request({
    url: 'device/api/electric/electricList',
    method: 'get',
    params: _params
  })
}

// 获取脱扣设备列表
function getTripElectricList (params) {
  const _params = Object.assign({}, params, {
    devElectricStatus: 4
  })
  return request({
    url: 'device/api/electric/electricList',
    method: 'get',
    params: _params
  })
}

// 电设备查询接口
export function getElectricList (params) {
  return request({
    url: 'device/api/electric/electricList',
    method: 'get',
    params: params
  })
}

// 初始化获取所有状态设备
export function getAllElectricList (params) {
  return new Promise((resolve, reject) => {
    const request = [getAlertElectricList(params), getNormalElectricList(params), getOfflineElectricList(params), getTripElectricList(params)]
    Promise.all(request).then((res) => {
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

// 获取电设备报警总数
export function getAlertCount (params) {
  return request({
    url: 'device/api/electric/alertCount',
    method: 'get',
    params
  })
}

// 获取设备状态列表
export function getDevStatusList (params) {
  return request({
    url: 'device/api/electric/pullDownList',
    method: 'get',
    params
  })
}

/* 电设备详情接口 */

// 设备报警分析
export function getAlertNum (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/getAlertNum',
    method: 'get',
    params
  })
}

// 电压
export function getVoltage (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/voltageLine',
    method: 'get',
    params
  })
}

// 电流
export function getElectricCurrent (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/electricCurrentLine',
    method: 'get',
    params
  })
}

// 温度
export function getTemperature (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/temperatureLine',
    method: 'get',
    params
  })
}

// 剩余电流
export function getResidualCurrent (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/residualCurrentLine',
    method: 'get',
    params
  })
}

// 电能
export function getElecEnergy (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/elecEnergy',
    method: 'get',
    params
  })
}

// 其他参数
export function getOtherParam (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/otherEnergy',
    method: 'get',
    params
  })
}

//  其他参数类型
export function getOtherType (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/getOtherType',
    method: 'get',
    params
  })
}

// 报警记录
export function getElectricAlarmRecord (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/getAlertRecord',
    method: 'get',
    params
  })
}

// 监管单位
// 左侧初始化数据
export function getMonitorData (params) {
  return request({
    url: 'device/api/electric/monitor',
    method: 'get',
    params
  })
}
// 报警数据初始化（地图展示）
export function getOfficeAlert (params) {
  return request({
    url: 'influxdbread/electric/devDataInfo/getOfficeAlert',
    method: 'get',
    params
  })
}

// 获取单位列表
export function getOfficeList (params) {
  return request({
    url: 'device/api/electric/getOffices',
    method: 'get',
    params
  })
}

/* 设备注册 */
// 获取电设备注册列表
export function getElectricRegisterList (params) {
  return request({
    url: 'device/api/electric/list',
    method: 'get',
    params
  })
}

export function geElectricRegisterInfo (data) {
  return request({
    url: `device/api/electric/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存电设备注册列表(id存在更新、id不存在新增)
export function saveElectricRegister (data) {
  return request({
    url: 'device/api/electric/save',
    method: 'post',
    data
  })
}

// 系统设置-消防电系统剩余电流列表
export function handleElectricList (params) {
  return request({
    url: 'device/api/electricconfig/list',
    method: 'get',
    params
  })
}

// 系统设置-消防电系统剩余电流更新
export function handleElectricUpdate (data) {
  return request({
    url: 'device/api/electricdtl/update',
    method: 'post',
    data
  })
}

// 删除电设备注册列表
export function deleteElectricRegister (data) {
  return request({
    url: 'device/api/electric/delete',
    method: 'post',
    data
  })
}
