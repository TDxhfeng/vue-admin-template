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

// 任务重试接口
export function retryTaskTimes(params) {
  return request({
    url: '/v3/system/task/record/modify',
    method: 'put',
    data: params,
    headers: {
      'X-Access-Token': 'token-MmdL0D8RVDLYZZoA'
    }
  })
}

// 任务删除接口
export function deleteTask(params) {
  return request({
    url: '/v3/system/task/record/modify',
    method: 'delete',
    data: params,
    headers: {
      'X-Access-Token': 'token-PtyotAgn966vXLSA'
    }
  })
}

