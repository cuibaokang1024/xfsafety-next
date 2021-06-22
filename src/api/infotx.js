import request from '@/utils/request'

// 初始化获取所有状态设备
export function handleAllInfotxList (params) {
  return new Promise((resolve, reject) => {
    Promise.all([
      handleAlertInfotxList(params),
      handleNormalInfotxList(params),
      handleOfflineInfotxList(params)
    ]).then(res => {
      const devInfotxList = {
        alertData: res[0].code === 200 && res[0].data.page.list.length > 0 ? res[0].data.page : {
          list: []
        },
        normalData: res[1].code === 200 && res[1].data.page.list.length > 0 ? res[1].data.page : {
          list: []
        },
        offlineData: res[2].code === 200 && res[2].data.page.list.length > 0 ? res[2].data.page : {
          list: []
        }
      }
      resolve(devInfotxList)
    }).catch(error => {
      reject(error)
    })
  })
}

// 列表
export function handleInfotxList (params) {
  return request({
    url: 'device/api/devinfotx/infotxList',
    method: 'get',
    params
  })
}

// 获取正常设备列表
function handleNormalInfotxList (params) {
  const _params = Object.assign({}, params, {
    devInfotxStatus: 1
  })
  return request({
    url: 'device/api/devinfotx/infotxList',
    method: 'get',
    params: _params
  })
}

// 获取离线设备列表
function handleOfflineInfotxList (params) {
  const _params = Object.assign({}, params, {
    devInfotxStatus: 2
  })
  return request({
    url: 'device/api/devinfotx/infotxList',
    method: 'get',
    params: _params
  })
}

// 获取报警设备列表
function handleAlertInfotxList (params) {
  const _params = Object.assign({}, params, {
    devInfotxStatus: 3
  })
  return request({
    url: 'device/api/devinfotx/infotxList',
    method: 'get',
    params: _params
  })
}

// 单位设备报警数
export function handleInfotxAlertCount (params) {
  return request({
    url: 'device/api/devinfotx/alertCount',
    method: 'get',
    params
  })
}

// 状态下拉
export function handleInfotxStatusDownList (params) {
  return request({
    url: 'device/api/devinfotx/pullDownList',
    method: 'get',
    params
  })
}

// 上报来源下拉
export function handleInfotxSourceList (params) {
  return request({
    url: 'device/api/devinfotx/sourceList',
    method: 'get',
    params
  })
}

// 详情
export function handleInfotxDetail (params) {
  return request({
    url: 'device/api/devinfotx/getAlertRecord',
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

// 列表
export function handleInfotxRegisterList (params) {
  return request({
    url: 'device/api/devinfotx/list',
    method: 'get',
    params
  })
}

// 详情
export function handleInfotxRegisterInfo (data) {
  return request({
    url: `device/api/devinfotx/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleInfotxRegisterSave (data) {
  return request({
    url: 'device/api/devinfotx/save',
    method: 'post',
    data
  })
}

// 更新
export function handleInfotxRegisterUpdate (data) {
  return request({
    url: 'device/api/devinfotx/update',
    method: 'POST',
    data
  })
}

// 删除
export function handleInfotxRegisterDelete (data) {
  return request({
    url: 'device/api/devinfotx/delete',
    method: 'POST',
    data
  })
}
/* 设备注册 */
