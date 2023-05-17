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
// 企业房源经济人类型映射查询
export function queryEntepriseHouseAgent(params) {
  return request({
    url: '/v3/enterprise/house/allUser/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-x3R01P1HhNHUy6Oq'
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
// 删除企业规则
export function deleteEnterpriseRule(params) {
  return request({
    url: '/v3/enterprise/rule/modify',
    method: 'delete',
    data: params,
    headers: {
      'X-Access-Token': 'token-ki3PhemkadLlzVbW'
    }
  })
}

// 添加规则
export function addEnterpriseRule(params) {
  return request({
    url: '/v3/enterprise/rule/modify',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-bTsQ0caIDsHizDgz'
    }
  })
}
// 导出所有部门
export function exportHouseDepartments(params) {
  return request({
    url: '/v3/enterprise/house/departments/export',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-9iPTGgzNmuLVOx3j'
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

// 导入部门
export function importHouseDepartments(params) {
  return request({
    url: '/v3/enterprise/house/departments/export',
    method: 'put',
    data: params,
    headers: {
      'X-Access-Token': 'token-NQyTZNDhV42qE5ya'
    }
  })
}

// 客源查询
export function queryEnterpriseCustomers(params) {
  return request({
    url: '/v3/enterprise/customer/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-yS4Q0Yowf9Iso4HF'
    }
  })
}

// 房源跟进查询
export function queryEnterpriseHouseFollow(params) {
  return request({
    url: '/v3/enterprise/house/follow/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-pImL3U6OYO0TfMFa'
    }
  })
}

// 客源跟进查询
export function queryEnterpriseCustomerFollow(params) {
  return request({
    url: '/v3/enterprise/customer/follows/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-MTxBoLEzeY8Vkjm5'
    }
  })
}
