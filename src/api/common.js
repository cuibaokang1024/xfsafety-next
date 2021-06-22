
import request from '@/utils/request'
// 获取字典值
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}
