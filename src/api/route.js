import request from '@/utils/request'

export function getRouteList () {
  return request({
    url: 'system/api/menu/menulist',
    method: 'get'
  })
}
