import request from '@/utils/request'

//  获取区域人员列表
export function getUserList (data) {
  let url = ''
  if (data.isAreaPersonnel) {
    url = 'system/admin/division/getAreaUser'
  } else {
    url = 'system/admin/division/getDeptUser'
  }
  return request({
    url,
    method: 'get',
    params: data.params
  })
}

// 新增用户
export function saveUser (data) {
  let url = ''
  if (data.isAreaPersonnel) {
    url = 'system/admin/division/saveAreaUser'
  } else {
    url = 'system/admin/division/saveUser'
  }
  return request({
    url: url,
    method: 'post',
    data: data.params
  })
}

//  获取用户详情
export function getUserInfo (data) {
  return request({
    url: `system/api/user/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 新增区域人员
export function saveAreaUser (data) {
  return request({
    url: 'system/admin/division/saveAreaUser',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser (data) {
  return request({
    url: 'system/api/user/update',
    method: 'post',
    data
  })
}

// 删除用户
export function delUser (data) {
  return request({
    url: 'system/admin/division/delUser',
    method: 'post',
    data
  })
}

/* 系统设置人员 */
// 角色下拉
export function handleRoleList (params) {
  return request({
    url: 'system/api/user/getRoleList',
    method: 'get',
    params
  })
}
// 列表
export function handleUserList (data) {
  const types = {
    JHWL: 0, // 总公司
    SOCIAL: 1, // 监管单位
    FIRE: 2, // 消防主管单位
    INDUSTRY: 3, // 行业主管单位
    GOV: 4, // 下级政府
    agentPersonnel: 5 // 合作商
  }
  data.params.type = types[data.type]
  return request({
    url: 'system/api/user/queryListOffice',
    method: 'get',
    params: data.params
  })
}
/* 系统设置人员 */
