import request from '@/utils/request'
// 登陆
export function login (data) {
  return request({
    url: 'system/public/pclogin', // 'http://192.168.3.31:9527/public/login',
    method: 'post',
    data
  })
}
export function logout (data) {
  return request({
    url: 'system/public/logout',
    method: 'put',
    data
  })
}
// 获取用户信息
export function getInfo (token) {
  return request({
    url: 'system/api/user/loginuser',
    method: 'get',
    params: { token }
  })
}

// 用户列表

export function getUserList (params) {
  return request({
    url: '/system/api/user/userList',
    method: 'get',
    params
  })
}
// 用户详情
export function getUserInfo (data) {
  return request({
    url: `/system/api/user/userInfo/${data.id}`,
    method: 'get',
    params: data.params
  })
}
// 保存用户
export function saveUser (data) {
  return request({
    url: '/system/api/user/saveUser',
    method: 'post',
    data
  })
}

// 更新用户信息
export function updateUser (data) {
  return request({
    url: '/system/api/user/updateUser',
    method: 'post',
    data
  })
}
// 删除用户
export function deleteUser (data) {
  return request({
    url: '/system/api/user/deleteUser',
    method: 'post',
    data
  })
}
// 获取用户角色列表
export function getRolelist (params) {
  return request({
    url: '/system/api/system/role/roleList',
    method: 'get',
    params
  })
}
// 获取树信息
export function getTreeData (data) {
  return request({
    url: data.url,
    method: 'get',
    params: data.params
  })
}
