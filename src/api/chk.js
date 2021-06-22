import request from '@/utils/request'

/* 巡查点 */
// 字典值
export function handlerPointDict (params) {
  return request({
    url: 'fire/api/pointstype/getTree',
    method: 'get',
    params
  })
}

export function handlerPointDeptId (params) {
  return request({
    url: 'fire/api/points/getDeptList',
    method: 'get',
    params
  })
}

export function handlerPointPrimaryId (params) {
  return request({
    url: 'fire/api/points/getUserList',
    method: 'get',
    params
  })
}

// 列表
export function handlerPointList (params) {
  return request({
    url: 'fire/api/points/queryList',
    method: 'post',
    params
  })
}

// 更新
export function handlerPointUpdate (data) {
  return request({
    url: 'fire/api/points/update',
    method: 'post',
    data
  })
}

// 详情
export function handlerPointDetail (data) {
  return request({
    url: `fire/api/points/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 删除
export function handlerPointDelete (data) {
  return request({
    url: 'fire/api/points/delete',
    method: 'post',
    data
  })
}

export function handlerPointCustomeDelete (data) {
  return request({
    url: 'fire/api/customequipment/delete',
    method: 'post',
    data
  })
}

// 导出当月巡查记录
export function handleMonthCheckRecord (params) {
  return request({
    url: 'fire/api/planrecord/exportRecord',
    method: 'get',
    params
  })
}

/* 巡查点 */

/* 检查计划 */
// 获取检查计划列表
export function getChkPlanList (params) {
  return request({
    url: 'fire/api/plan/list',
    method: 'get',
    params: params
  })
}

// 获取检查计划详情
export function geChktPlaninfo (data) {
  return request({
    url: `fire/api/plan/planinfo/${data.id}`,
    method: 'get',
    params: data.params
  })
}
// 保存检查计划

export function saveChkPlanList (data) {
  return request({
    url: 'fire/api/plan/save',
    method: 'post',
    data
  })
}
// 更新检查计划

export function updateChkPlanList (data) {
  return request({
    url: 'fire/api/plan/update',
    method: 'post',
    data
  })
}
// 删除检查计划及巡查点

export function deleteChkPlanList (data) {
  return request({
    url: 'fire/api/plan/delete',
    method: 'post',
    data
  })
}

// 获取检察人员

export function getUserList (params) {
  return request({
    url: 'system/api/user/getUserList',
    method: 'get',
    params
  })
}
// 获取巡查点类型

export function getLabel (params) {
  return request({
    url: 'fire/api/pointstype/getLabel',
    method: 'get',
    params
  })
}
/* 检查计划 */

/* 检查痕迹 */

// 获取检查痕迹（巡查点列表）

export function getChkMark (params) {
  return request({
    url: 'fire/api/planrecord/findChkMark',
    method: 'get',
    params
  })
}
export function getOnetraceData (params) {
  return request({
    url: '/fire/api/planrecord/findGropIdPoints',
    method: 'get',
    params
  })
}
export function getMarkDetails (params) {
  return request({
    url: '/fire/api/planrecord/findMarkDetails',
    method: 'get',
    params
  })
}

// 单位履职统计列表
export function checkList (params) {
  return request({
    url: '/fire/api/planrecord/findWorkEstimate',
    method: 'get',
    params
  })
}

// 隐患整改进度
export function rectifyList (params) {
  return request({
    url: '/fire/api/dangerStatistics/dangerAnalysis',
    method: 'get',
    params
  })
}
