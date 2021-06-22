// 社会单位首页
import request from '@/utils/request'

// 获取字典值
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}

/* 新闻公告 */
export function handlerOfficeNewsSwiper (params) {
  return request({
    url: 'fire/api/officehomepage/news',
    method: 'get',
    params
  })
}

export function handlerOfficeNewsNotify (params) {
  return request({
    url: 'fire/api/officehomepage/notify',
    method: 'get',
    params
  })
}

// 下属单位区域
export function handleOfficeOanotifyTree (params) {
  return request({
    url: 'system/api/area/treeData',
    method: 'get',
    params
  })
}

// 本单位部门
export function handleOfficeOanotifyDept (params) {
  return request({
    url: 'system/api/dept/findList',
    method: 'get',
    params
  })
}

// 本单位人员
export function handleOfficeOanotifyUser (params) {
  return request({
    url: 'system/api/user/queryUserOffice',
    method: 'get',
    params
  })
}

// 下属单位单位
export function handleOfficeOanotifySub (params) {
  return request({
    url: 'system/api/office/getSubOffice',
    method: 'get',
    params
  })
}

// 查看详情
export function handleOfficeOanotifyDetail (params) {
  return request({
    url: 'system/api/oanotify/getDetail',
    method: 'get',
    params
  })
}

// 查阅
export function handleOfficeOanotifyRecords (params) {
  return request({
    url: 'system/api/oanotify/queryRecords',
    method: 'get',
    params
  })
}

// 短信
export function handleOfficeOanotifyRemind (data) {
  return request({
    url: 'system/api/oanotify/sendSmsRemind',
    method: 'post',
    data
  })
}

// 下发列表
export function handleOfficeOanotifyList (params) {
  return request({
    url: 'system/api/oanotify/queryList',
    method: 'get',
    params
  })
}

// 接收列表
export function handleOfficeOanotifyRev (params) {
  return request({
    url: 'system/api/oanotify/revNotifyList',
    method: 'get',
    params
  })
}

// 修改详情
export function handleOfficeOanotifyInfo (data) {
  return request({
    url: `system/api/oanotify/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleOfficeOanotifyUpdate (data) {
  return request({
    url: 'system/api/oanotify/update',
    method: 'post',
    data
  })
}

// 下发
export function handleOfficeOanotifySave (data) {
  return request({
    url: 'system/api/oanotify/save',
    method: 'post',
    data
  })
}

// 删除
export function handleOfficeOanotifyDelete (data) {
  return request({
    url: 'system/api/oanotify/delete',
    method: 'post',
    data
  })
}
/* 新闻公告 */

/* 组织架构与隐患值守 */
export function handlerOfficeOrg (params) {
  return request({
    url: 'system/api/dept/getOranization',
    method: 'get',
    params
  })
}

export function handlerStatusAlertRecord (params) {
  return request({
    url: 'device/api/status/alertRecord',
    method: 'get',
    params
  })
}
/* 组织架构与隐患值守 */

/* 待办事项 */
export function handlerTodoList (params) {
  return request({
    url: 'fire/api/officehomepage/getTodoList',
    method: 'get',
    params
  })
}

export function handlerTodoDetail (params) {
  return request({
    url: 'fire/api/officehomepage/readTodoDetail',
    method: 'get',
    params
  })
}
/* 待办事项 */

/* 巡查检查 */
export function handlerChkPlanInfo (params) {
  return request({
    url: 'fire/api/officehomepage/getChkPlanInfo',
    method: 'get',
    params
  })
}

export function handlePointNum (params) {
  return request({
    url: 'fire/api/officehomepage/finUnchkPointNum',
    method: 'get',
    params
  })
}

export function handleUnChePointDay (params) {
  return request({
    url: 'fire/api/points/todayUncheckPoints',
    method: 'get',
    params
  })
}

export function handleUnChePointMonth (params) {
  return request({
    url: 'fire/api/points/monthUncheckPoints',
    method: 'get',
    params
  })
}

// 楼层楼座treeData
export function handlePartInfoList (params) {
  return request({
    url: 'system/api/parts/getPartInfoList',
    method: 'get',
    params
  })
}

// by
export function handlerChkPlanList (params) {
  return request({
    url: 'fire/api/chkplan/getPlanList',
    method: 'get',
    params
  })
}

export function handlerChkPlanPointDetail (params) {
  return request({
    url: 'fire/api/chkplan/queryPointDetail',
    method: 'get',
    params
  })
}

export function handlerChkPlanPointInfo (params) {
  return request({
    url: 'fire/api/chkplan/getPointInfo',
    method: 'get',
    params
  })
}

export function handlerChkPlanHisDetail (params) {
  return request({
    url: 'fire/api/chkplan/getPlanHisDetail',
    method: 'get',
    params
  })
}

export function handlerChkPlanByChkPlan (params) {
  return request({
    url: 'fire/api/chkplan/queryByChkPlan',
    method: 'get',
    params
  })
}

export function handlerChkPlanByChkPlanId (params) {
  return request({
    url: 'fire/api/chkplan/getPlanRecords',
    method: 'get',
    params
  })
}
/* 巡查检查 */

/* 学习成绩 */
export function handlerAssessScore (params) {
  return request({
    url: 'fire/api/officehomepage/getAssessScore',
    method: 'get',
    params
  })
}

export function handlerAssessMentAchieve (params) {
  return request({
    url: 'system/api/officeinfo/assessmentAchieve2',
    method: 'get',
    params
  })
}
/* 学习成绩 */

/* 物联网 */
export function handlerOfficeHomeIotData (params) {
  return request({
    url: 'fire/api/officehomepage/devicecount',
    method: 'get',
    params
  })
}
/* 物联网 */
