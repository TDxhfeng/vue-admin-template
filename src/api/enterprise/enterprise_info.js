import request from '@/utils/request'

// 企业基本信息接口
export function queryeEnterpriseInfoList(params) {
  return request({
    url: '/v3/enterprise/info/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-DngKgfDrQ8cpIWUZ'
    }
  })
}

// 企业规则查询接口
export function queryeEnterpriseRuleList(params) {
  return request({
    url: '/v3/enterprise/rule/record/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-8UklVFWsjuzCUh6Q'
    }
  })
}

// 清洗任务创建接口
export function createTaskInfo(params) {
  return request({
    url: '/v3/system/task/record/modify',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-HU5BupyGe5D0hi19'
    }
  })
}
