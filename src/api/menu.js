import request from '@/utils/request'

// 菜单列表
export function menuList () {
  return request({
    url: 'system/sys/menu/sysMenulist',
    method: 'get'
  })
}

// 菜单添加选择的几个按钮
export function menuRadioBtn () {
  return request({
    url: 'system/sys/menu/menuType',
    method: 'get'
  })
}

// 菜单添加按钮
export function menuBtnSave (data) {
  return request({
    url: 'system/sys/menu/saveButton',
    method: 'post',
    data
  })
}

// 菜单添加目录
export function menuDirSave (data) {
  return request({
    url: 'system/sys/menu/saveCatalog',
    method: 'post',
    data
  })
}

// 菜单添加菜单
export function menuMenuSave (data) {
  return request({
    url: 'system/sys/menu/saveMenu',
    method: 'post',
    data
  })
}

// 菜单详情
export function menuDetail (params) {
  return request({
    url: `system/sys/menu/info/${params.id}`,
    method: 'get'
  })
}

// 菜单修改目录
export function menuDirUpdate (data) {
  return request({
    url: 'system/sys/menu/updateCatalog',
    method: 'put',
    data
  })
}

// 菜单修改菜单
export function menuMenuUpdate (data) {
  return request({
    url: 'system/sys/menu/updateMenu',
    method: 'put',
    data
  })
}

// 菜单修改按钮
export function menuBtnUpdate (data) {
  return request({
    url: 'system/sys/menu/updateButton',
    method: 'put',
    data
  })
}

// 菜单删除
export function menuDelete (data) {
  return request({
    url: 'system/sys/menu/delete',
    method: 'delete',
    data
  })
}

// 角色接口
// 角色列表
export function roleList (params) {
  return request({
    url: 'system/api/system/role/selectList',
    method: 'get',
    params
  })
}

// 添加角色
export function roleCreate (data) {
  return request({
    url: 'system/api/system/role/save',
    method: 'post',
    data
  })
}

// 修改角色
export function roleUpdate (data) {
  return request({
    url: 'system/api/system/role/update',
    method: 'post',
    data
  })
}

// 删除角色
export function roleDelete (data) {
  return request({
    url: 'system/api/system/role/delete',
    method: 'post',
    data
  })
}

// 删除角色
export function roleDetail (data) {
  return request({
    url: `system/api/system/role/info/${data.id}`,
    method: 'get'
  })
}

// 配置菜单列表
export function roleMenuList (params) {
  return request({
    url: `system/api/system/role/roleMenuList/${params.id}`,
    method: 'get'
  })
}

// 保存配置菜单
export function roleMenuSave (data) {
  return request({
    url: 'system/api/system/role/saveRoleMenu',
    method: 'post',
    data
  })
}

// 角色类型
export function roleTypeList () {
  return request({
    url: 'system/sys/menu/roleType',
    method: 'get'
  })
}

// 数据范围
export function roleDataScope () {
  return request({
    url: 'system/sys/menu/roleDataScope',
    method: 'get'
  })
}

// 单位自治页面的接口
// 列表
export function unitAutonomyList () {
  return request({
    url: 'system/api/menu/officeMenuList',
    method: 'get'
  })
}

// 修改菜单
export function unitAutonomyMenuSave (data) {
  return request({
    url: 'system/api/menu/updateAlias',
    method: 'put',
    data
  })
}

// 详情
export function unitAutonomyDetail (params) {
  return request({
    url: `system/api/menu/info/${params.id}`,
    method: 'get'
  })
}
