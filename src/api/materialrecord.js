import request from '@/utils/request'

// tree
export function handleRecordAreaTree (params) {
  return request({
    url: '/system/admin/division/getOfficeArea',
    method: 'get',
    params
  })
}

// 消防物资子类型
export function handleRecordSubType (params) {
  return request({
    url: '/fire/api/gridmaterial/subType',
    method: 'get',
    params
  })
}

// 列表
export function handleMaterialRecordList (params) {
  return request({
    url: '/fire/api/gridmaterial/list',
    method: 'get',
    params
  })
}

// 详情
export function handleMaterialRecordInfo (data) {
  return request({
    url: `/fire/api/gridmaterial/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 保存
export function handleMaterialRecordSave (data) {
  return request({
    url: '/fire/api/gridmaterial/save',
    method: 'post',
    data
  })
}

// 修改
export function handleMaterialRecordUpdate (data) {
  return request({
    url: '/fire/api/gridmaterial/update',
    method: 'put',
    data
  })
}

// 删除
export function handleMaterialRecordDelete (data) {
  return request({
    url: '/fire/api/gridmaterial/delete',
    method: 'delete',
    data
  })
}

// 下载模板
export function handleRecordMaterialDownload (params) {
  return request({
    url: '/fire/api/gridmaterial/template',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 上传模板
export function handleRecordMaterialImport (data) {
  return request({
    url: `/fire/api/gridmaterial/import?type=${data.type}&areaId=${data.areaId}`,
    method: 'post',
    data: data.params
  })
}
