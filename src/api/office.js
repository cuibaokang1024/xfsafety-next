import request from '@/utils/request'

// 获取消防合法文书字典值
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}

// 获取单位分级信息
export function getOfficeLevelList (params) {
  return request({
    url: 'system/api/office/officeLevelList',
    method: 'get',
    params
  })
}

/* 规章制度 */

// 获取规章制度列表
export function getFireRuleList (params) {
  return request({
    url: 'system/api/firerule/fireRuleList',
    method: 'get',
    params
  })
}

// 获取规章制度详情
export function getFireRuleInfo (data) {
  return request({
    url: `system/api/firerule/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新规章制度
export function updateFireRule (data) {
  return request({
    url: 'system/api/firerule/update',
    method: 'post',
    data
  })
}

// 新增规章制度列表
export function saveFireRule (data) {
  return request({
    url: 'system/api/firerule/save',
    method: 'post',
    data
  })
}

// 删除规章制度
export function fireRuleDelete (data) {
  return request({
    url: 'system/api/firerule/delete',
    method: 'POST',
    data
  })
}
/* 规章制度 */

/* 消防预案和演练 */

// 获取预案和演练列表
export function getFirePlanList (params) {
  return request({
    url: 'system/api/fireplan/firePlanList',
    method: 'GET',
    params
  })
}

// 获取消防预案和演练详情
export function getFirePlanInfo (data) {
  return request({
    url: `system/api/fireplan/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新消防预案和演练
export function updateFirePlan (data) {
  return request({
    url: 'system/api/fireplan/update',
    method: 'post',
    data
  })
}

// 新增消防预案和演练列表
export function saveFirePlan (data) {
  return request({
    url: 'system/api/fireplan/save',
    method: 'post',
    data
  })
}

// 删除消防预案和演练
export function fireplanDelete (data) {
  return request({
    url: 'system/api/fireplan/delete',
    method: 'POST',
    data
  })
}
/* 消防预案和演练 */

/* 消防培训 */

// 获取消防培训列表
export function getFireTrainList (params) {
  return request({
    url: 'system/api/firetrain/fireTrainList',
    method: 'GET',
    params
  })
}

// 获取消防培训详情
export function getFireTrainInfo (data) {
  return request({
    url: `system/api/firetrain/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 删除消防培训
export function firetrainDelete (data) {
  return request({
    url: 'system/api/firetrain/delete',
    method: 'POST',
    data
  })
}

// 新增消防培训
export function saveFireTrain (data) {
  return request({
    url: 'system/api/firetrain/save',
    method: 'post',
    data
  })
}

// 更新消防培训
export function updateFireTrain (data) {
  return request({
    url: 'system/api/firetrain/update',
    method: 'post',
    data
  })
}
/* 消防培训 */

/* 合法文书 */

// 获取合法文书列表
export function getLegalDocList (params) {
  return request({
    url: 'system/api/legaldoc/legalDocList',
    method: 'GET',
    params
  })
}

// 获取合法文书详情
export function getLegaldocInfo (data) {
  return request({
    url: `system/api/legaldoc/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新合法文书
export function updateLegaldoc (data) {
  return request({
    url: 'system/api/legaldoc/update',
    method: 'post',
    data
  })
}

// 新增合法文书
export function saveLegaldoc (data) {
  return request({
    url: 'system/api/legaldoc/save',
    method: 'post',
    data
  })
}

// 删除消防合法文书
export function legaldocDelete (data) {
  return request({
    url: 'system/api/legaldoc/delete',
    method: 'POST',
    data
  })
}
/* 合法文书 */

/* 消防平面图 */

// 获取消防平面图列表
export function getBuildingPlanList (params) {
  return request({
    url: 'system/api/buildingplan/buildingPlanList',
    method: 'GET',
    params
  })
}

// 获取消防平面图详情
export function getBuildingPlanInfo (data) {
  return request({
    url: `system/api/buildingplan/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新消防平面图
export function updateBuildingPlan (data) {
  return request({
    url: 'system/api/buildingplan/update',
    method: 'post',
    data
  })
}

// 新增消防平面图
export function saveBuildingPlan (data) {
  return request({
    url: 'system/api/buildingplan/save',
    method: 'post',
    data
  })
}

// 删除消防消防平面图
export function buildingplanDelete (data) {
  return request({
    url: 'system/api/buildingplan/delete',
    method: 'POST',
    data
  })
}
/* 消防平面图 */

/** 单位详情 */

// 消防合法文书
export function getLegalDocByOffice (params) {
  return request({
    url: 'system/api/legaldoc/getLegalDocByOffice',
    method: 'get',
    params
  })
}

// 规章制度
export function getFireRuleByOffice (params) {
  return request({
    url: 'system/api/firerule/getFireRuleByOffice',
    method: 'get',
    params
  })
}

// 消防预案和演练
export function getFirePlanByOffice (params) {
  return request({
    url: 'system/api/fireplan/getFirePlanByOffice',
    method: 'get',
    params
  })
}

// 消防培训
export function getFireTrainByOffice (params) {
  return request({
    url: 'system/api/firetrain/getFireTrainByOffice',
    method: 'get',
    params
  })
}

// 单位基本信息
export function getOfficeDetail (params) {
  return request({
    url: 'device/api/officeinfo/getOfficeDetail',
    method: 'get',
    params
  })
}

// 重点部位
export function handlerListByOffice (params) {
  return request({
    url: 'device/api/alarmsys/getListByOffice',
    method: 'get',
    params
  })
}

// 获取隐患档案列表
export function getDangerList (params) {
  return request({
    url: 'fire/api/danger/list',
    method: 'get',
    params
  })
}

// 隐患详情
export function getDangerInfo (params) {
  return request({
    url: 'fire/api/dangerrecord/getRecordList',
    method: 'get',
    params
  })
}
// 删除隐患
export function dangerDelete (data) {
  return request({
    url: 'fire/api/danger/delete',
    method: 'post',
    data
  })
}

export function auditOK (data) {
  return request({
    url: 'fire/api/danger/auditOK',
    method: 'post',
    data
  })
}
// 审核不通过
export function auditNO (data) {
  return request({
    url: 'fire/api/danger/auditNO',
    method: 'post',
    data
  })
}
// 隐患督办
export function dangerSupervise (data) {
  return request({
    url: 'fire/api/dangersupervise/danger',
    method: 'post',
    data
  })
}

/* 安全巡检 */
// 检查任务
export function handlerChkplanListByOffice (params) {
  return request({
    url: 'fire/api/chkplan/getListByOffice',
    method: 'get',
    params
  })
}

// 消防设施
export function handlerFireControlOffice (params) {
  return request({
    url: 'device/api/water/fireControlOffice',
    method: 'get',
    params
  })
}

export function handlerFireControlDetail (params) {
  return request({
    url: 'device/api/water/fireControlDetail',
    method: 'get',
    params
  })
}

// 隐患记录
export function handlerDangerByOffice (params) {
  return request({
    url: 'fire/api/danger/getListByOffice',
    method: 'get',
    params
  })
}

/* 安全巡检 */

/* 建筑区域 */

// 获取建筑区域列表
export function getBuildingList (params) {
  return request({
    url: 'system/api/building/queryList',
    method: 'GET',
    params
  })
}

// 获取建筑区域详情
export function getBuildingInfo (data) {
  return request({
    url: `system/api/building/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新建筑区域
export function updateBuilding (data) {
  return request({
    url: 'system/api/building/update',
    method: 'post',
    data
  })
}

// 新增建筑区域
export function saveBuilding (data) {
  return request({
    url: 'system/api/building/save',
    method: 'post',
    data
  })
}

// 删除消防建筑区域
export function buildingDelete (data) {
  return request({
    url: 'system/api/building/delete',
    method: 'POST',
    data
  })
}

// 删除消防楼层平面图
export function delBuildingFile (data) {
  return request({
    url: 'system/api/building/delBuildingFile',
    method: 'POST',
    data
  })
}
// 删除消防楼层
export function delFloor (data) {
  return request({
    url: 'system/api/building/delFloor',
    method: 'POST',
    data
  })
}
/* 建筑区域 */

/* 部门及人员 */
// 角色下拉1
export function getRoleList (params) {
  return request({
    url: 'system/api/user/getRoleList',
    method: 'get',
    params
  })
}

// 部门列表1
export function getDeptList (params) {
  return request({
    url: 'system/api/dept/findList',
    method: 'get',
    params
  })
}

// 部门及人员列表
export function getUserList (params) {
  return request({
    url: 'system/api/dept/findList',
    method: 'get',
    params
  })
}

// 监管单位档案人员列表
export function getUserOfficeList (params) {
  return request({
    url: 'system/api/user/queryListOffice',
    method: 'get',
    params
  })
}

// 保存部门1
export function saveDept (data) {
  return request({
    url: 'system/api/dept/save',
    method: 'post',
    data
  })
}

// 保存人员1
export function saveUser (data) {
  return request({
    url: 'system/api/user/save',
    method: 'post',
    data
  })
}

// 详情部门1
export function getDeptInfo (data) {
  return request({
    url: `system/api/dept/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 详情人员
export function getUserInfo (data) {
  return request({
    url: `system/api/user/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 修改部门1
export function updateDept (data) {
  return request({
    url: 'system/api/dept/update',
    method: 'post',
    data
  })
}

// 修改人员
export function updateUser (data) {
  return request({
    url: 'system/api/user/update',
    method: 'post',
    data
  })
}

// 删除部门1
export function deleteDept (data) {
  return request({
    url: 'system/api/dept/delete',
    method: 'post',
    data
  })
}

// 删除人员
export function deleteUser (data) {
  return request({
    url: 'system/api/user/delete',
    method: 'post',
    data
  })
}

/* 部门及人员 */

/* 巡查点类型设置 */
// 树状
export function handlerPointTypeSetTree (params) {
  return request({
    url: 'fire/api/pointstype/getTree',
    method: 'get',
    params
  })
}

// 列表
export function handlerPointTypeSetList (params) {
  return request({
    url: 'fire/api/pointstype/findList',
    method: 'get',
    params
  })
}

// 保存
export function handlerPointTypeSetSave (data) {
  return request({
    url: 'fire/api/pointstype/save2',
    method: 'post',
    data
  })
}

// 更新
export function handlerPointTypeSetUpdate (data) {
  return request({
    url: 'fire/api/pointstype/update2',
    method: 'put',
    data
  })
}

// 详情
export function handlerPointTypeSetDetail (data) {
  return request({
    url: `fire/api/pointstype/getDetail?id=${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 删除
export function handlerPointTypeSetDelete (data) {
  return request({
    url: `fire/api/pointstype/delete2?id=${data.id}`,
    method: 'post',
    data
  })
}

/* 巡查点类型设置 */

/* 监管单位档案 */
// tree
export function handlerUnitRecordAreaTree (params) {
  return request({
    url: 'system/api/area/treeData',
    method: 'get',
    params
  })
}

export function getFireTree (params) {
  return request({
    url: 'system/api/office/fireTree',
    method: 'get',
    params
  })
}

export function handlerUnitRecordDeptList (params) {
  return request({
    url: 'system/api/user/getDeptList',
    method: 'get',
    params
  })
}

export function handlerUnitRecordMaintenanceList (params) {
  return request({
    url: 'system/api/officeinfo/getMaintenanceList',
    method: 'get',
    params
  })
}

// 列表
export function handlerUnitRecordList (params) {
  return request({
    url: 'system/api/officeinfo/queryList',
    method: 'get',
    params
  })
}

// 代理商列表
export function handleAgentUnitList (params) {
  return request({
    url: 'system/api/office/getAgentList',
    method: 'get',
    params
  })
}

// 保存
export function handlerUnitRecordSave (data) {
  return request({
    url: 'system/api/officeinfo/save',
    method: 'post',
    data
  })
}

// 详情
export function handlerUnitRecordDetail (data) {
  return request({
    url: `system/api/officeinfo/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 修改
export function handlerUnitRecordUpdate (data) {
  return request({
    url: 'system/api/office/archives/update',
    method: 'post',
    data
  })
}

// 删除
export function handlerUnitRecordDelete (data) {
  return request({
    url: 'system/api/officeinfo/delete',
    method: 'post',
    data
  })
}

/* 监管单位档案 */

/* 单位用户管理 */
// 列表
export function handleUserOfficeList (params) {
  return request({
    url: 'system/api/user/queryUserOffice',
    method: 'get',
    params
  })
}

// 保存
export function handleUserOfficeSave (data) {
  return request({
    url: 'system/api/user/saveUserOffice',
    method: 'post',
    data
  })
}

/* 单位用户管理 */

/* 文件下载 */
export function handlerDownload (params) {
  return request({
    url: 'system/api/file/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/* 文件下载 */

// 代理商管理
// tree

export function handlerAgentManaAreaTree (params) {
  return request({
    url: 'system/api/area/getAreaList',
    method: 'get',
    params
  })
}

export function handlerAreaTree (params) {
  return request({
    url: 'system/api/agentarea/getAreaTree',
    method: 'get',
    params
  })
}

// list
export function handlerAgentManaList (params) {
  return request({
    url: 'system/api/office/queryAgentList',
    method: 'get',
    params
  })
}

// 新增和修改

export function handlerAgentManaAdd (data) {
  return request({
    url: 'system/api/office/createAgent',
    method: 'post',
    data
  })
}

export function handlerAgentManaUpdate (data) {
  return request({
    url: 'system/api/office/updateAgent',
    method: 'post',
    data
  })
}

// 详情

export function handlerAgentManaDetail (params) {
  return request({
    url: 'system/api/office/getAgentInfo',
    method: 'get',
    params
  })
}

// 删除

export function handlerAgentManaDel (data) {
  return request({
    url: 'system/api/office/delete',
    method: 'post',
    data
  })
}

// 判断代理区域是否冲突
export function handlerAgentManaConflict (data) {
  return request({
    url: 'api/office/checkAreaId',
    method: 'post',
    data
  })
}
