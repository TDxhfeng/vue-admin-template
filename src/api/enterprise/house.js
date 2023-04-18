import request from '@/utils/request'

export function queryHouseList(params) {
  return request({
    url: '/v3/enterprise/house/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-D7NUQDS7q7gInNki'
    }
  })
}
