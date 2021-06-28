import request from '@/utils/request'
request.baseURL = 'localhost'
console.log(request)
export function getRouteList () {
  return request({
    baseURL: '',
    url: '/dev-api/routerData',
    method: 'get'
  })
}
