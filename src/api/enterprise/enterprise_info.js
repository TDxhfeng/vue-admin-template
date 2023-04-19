import request from '@/utils/request'

export function queryeEterpriseInfoList(params) {
  return request({
    url: '/v3/enterprise/info/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-DngKgfDrQ8cpIWUZ'
    }
  })
}
