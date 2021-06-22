import request from '@/utils/request'

// 获取设备注册列表
export function getDevRegisterList (params) {
  return request({
    url: 'device/api/reg/list',
    method: 'get',
    params: params
  })
}

// 获取设备注册详情
export function getDevRegisterInfo (data) {
  return request({
    url: `device/api/reg/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存设备注册信息
export function saveDevRegister (data) {
  return request({
    url: 'device/api/reg/save',
    method: 'post',
    data
  })
}

// 更新设备注册信息
export function updateDevRegister (data) {
  return request({
    url: 'device/api/reg/update',
    method: 'put',
    data
  })
}

// 删除设备注册
export function deleteDevRegister (data) {
  return request({
    url: 'device/api/reg/delete',
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

// 获取代理商设备注册列表
export function getAgentDevRegList (params) {
  return request({
    url: 'device/api/reg/agentDevRegList',
    method: 'get',
    params: params
  })
}

/* 文件导入 */
export function handleImport (data) {
  return request({
    url: `device/api/reg/import?officeId=${data.officeId}`,
    method: 'POST',
    data: data.params
  })
}

/* 文件导入 */
/* 文件下载 */
export function handleDownload (params) {
  return request({
    url: 'device/api/reg/template',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

/* 文件下载 */
