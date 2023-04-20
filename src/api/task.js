import request from '@/utils/request'

// 任务列表查询接口
export function queryTaskInfo(params) {
  return request({
    url: '/v3/system/task/record/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-LCx0Th8VGYKeHTDM'
    }
  })
}
