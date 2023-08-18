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

// 企业所有code查询接口
export function queryEnterpriseCode(params) {
  return request({
    url: '/v3/enterprise_code/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-Ym6pWSNnfoVzPIbO'
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
// 查询已导入的部门
export function queryHouseDepartments(params) {
  return request({
    url: '/v3/enterprise/departments/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-r47O0ONyJTpptUQ5'
    }
  })
}
// 导出所有部门
export function exportHouseDepartments(params) {
  return request({
    url: '/v3/enterprise/departments/export',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-9iPTGgzNmuLVOx3j'
    }
  })
}
// 导入部门
export function importHouseDepartments(params) {
  return request({
    url: '/v3/enterprise/departments/export',
    method: 'put',
    data: params,
    headers: {
      'X-Access-Token': 'token-NQyTZNDhV42qE5ya'
    }
  })
}
// 删除部门
export function deleteHouseDepartments(params) {
  return request({
    url: '/v3/enterprise/departments/export',
    method: 'delete',
    data: params,
    headers: {
      'X-Access-Token': 'token-I518nbtp1HuGj6E4'
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

// 房源图片查询
export function queryEnterpriseHousePhoto(params) {
  return request({
    url: '/v3/enterprise/house/photo/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-40M1ByK8CRsiGPpC'
    }
  })
}

// 房源图片查询
export function queryEnterpriseHousePanorama(params) {
  return request({
    url: '/v3/enterprise/house/panorama/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-9wlQKR6IZ7Soqxh5'
    }
  })
}

// 房源视频查询
export function queryEnterpriseHouseVideo(params) {
  return request({
    url: '/v3/enterprise/house/video/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-GED0nvPxHYugMUx4'
    }
  })
}

// 客源人员查询
export function queryCustomerAgent(params) {
  return request({
    url: '/v3/enterprise/customer/allUser/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-C38VpG7qVgTQzvZV'
    }
  })
}

// 客源规则添加
export function addEnterpriseCustomerRule(params) {
  return request({
    url: '/v3/customer/rule/modify',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-6Vzudv4lXhgRaXaW'
    }
  })
}

// 客源规则删除
export function deleteEnterpriseCustomerRule(params) {
  return request({
    url: '/v3/customer/rule/modify',
    method: 'delete',
    data: params,
    headers: {
      'X-Access-Token': 'token-zQ419FlvMcsv2kbW'
    }
  })
}

// 客源规则查询
export function queryEnterpriseCustomerRule(params) {
  return request({
    url: '/v3/customer/rule/record/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-t3rSMWKBCcNwPF5V'
    }
  })
}

// 所有用户查询
export function queryEnterpriseUser(params) {
  return request({
    url: '/v3/enterprise/allUser/map/query',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-PLwaNsVj8U6dsYHL'
    }
  })
}

// 获取最新用户
export function getLeastEnterpriseUser(params) {
  return request({
    url: '/v3/enterprise/allUser/map/query',
    method: 'put',
    data: params,
    headers: {
      'X-Access-Token': 'token-8grHhZSAanh10QVv'
    }
  })
}

// 修改用户
export function updateEnterpriseUser(params) {
  return request({
    url: '/v3/enterprise/allUser/map/modify',
    method: 'put',
    data: params,
    headers: {
      'X-Access-Token': 'token-v78hfdp12nFbWxrV'
    }
  })
}

// 统计房源的信息
export function totalEnterpriseHouse(params) {
  return request({
    url: '/v3/enterprise/house/total',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-HmPzpcemIspkn7Ba'
    }
  })
}

// 房源验证
export function verifyEnterpriseHouse(params) {
  return request({
    url: '/v3/enterprise/house/verify',
    method: 'put',
    data: params,
    headers: {
      'X-Access-Token': 'token-RV84OYUreJPkzipO'
    }
  })
}
// 同步房源编号
export function asyncEnterpriseHouseCode(params) {
  return request({
    url: '/v3/enterprise/house/teamHouseCode/async',
    method: 'post',
    data: params,
    headers: {
      'X-Access-Token': 'token-zYbnSyMjCyXd'
    }
  })
}
