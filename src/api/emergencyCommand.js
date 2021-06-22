import request from '@/utils/request'
// 周边查询
export function getGridMaterial (params) {
  return request({
    url: 'fire/api/gridmaterial/listByTypes',
    method: 'get',
    params
  })
}
export function getGridMaterialInfo (params) {
  return request({
    url: `fire/api/gridmaterial/info/${params.id}`,
    method: 'get',
    params: params.data
  })
}

export function getFireTree (params) {
  return request({
    url: 'system/api/office/fireTree',
    method: 'get',
    params
  })
}
export function getFireOfficerList (params) {
  return request({
    url: '/system/api/user/queryListOffice',
    method: 'get',
    params
  })
}
export function sendPolice (params) {
  return request({
    url: 'system/api/officeinfo/sendPolice',
    method: 'get',
    params
  })
}
export function getMatchingOfficeList (params) {
  return request({
    url: '/system/api/officeinfo/officeList',
    method: 'get',
    params
  })
}

export function getOfficePlanList (params) {
  return request({
    url: '/system/api/officeinfo/officePlanList',
    method: 'get',
    params
  })
}
export function getFirePlanList (params) {
  return request({
    url: '/system/api/officeinfo/FirePlanList',
    method: 'get',
    params
  })
}
