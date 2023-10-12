<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="searchForm" label-width="130px">
      <el-row>
        <el-col :span="4">
          <el-form-item
            label="ERP名称"
            prop="erpName"
            :rules="[{
              required: true,
              message: '请输入ERP名称',
              trigger: 'blur'
            }]"
          >
            <el-select v-model="searchForm.erpName" placeholder="选择ERP" clearable filterable @change="resetCode">
              <el-option v-for="option in enterpriseOptions" :key="option.erpName" :label="option.erpCnName" :value="option.erpName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业号" prop="enterpriseCode" :rules="[{ required: true, message: '请输入企业号', trigger: 'blur' }]">
            <el-select v-model="searchForm.enterpriseCode" placeholder="选择企业" clearable filterable>
              <el-option v-for="value in codes" :key="value.enterpriseCode" :label="value.enterpriseName" :value="value.enterpriseCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="客源外部ID" prop="customerId">
            <el-input v-model="searchForm.customerId" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="客源编号" prop="customerNo">
            <el-input v-model="searchForm.customerNo" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="经纪人" prop="userNames">
            <el-input v-model="searchForm.userNames" style="width: 150px;" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="warning" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="async_customer_team_code">同步小鹿编号</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="exportData">导出Excel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="650"
    >
      <el-table-column label="爬取时间" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.createTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="原系统相关人" width="300">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.allUsers" :key="index">
            <span style="color: #FF0000">{{ item.userFieldName }}:</span><span>{{ item.userName }}</span><span style="color: #999; margin: 0 4px;">|</span><span style="color: #FF0000">部门:</span><span>{{ item.userDepartment }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="小鹿编号" width="110">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.teamCustomerCode">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.teamCustomerCode }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="客源外部ID" width="110">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.customerId">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.customerId }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="原系统客源编号" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.customerNo">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.customerNo }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="客户类型">
        <template slot-scope="scope">
          {{ scope.row.tradeType }}
        </template>
      </el-table-column>
      <el-table-column label="客户状态">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="客户性别">
        <template slot-scope="scope">
          {{ scope.row.customerGender }}
        </template>
      </el-table-column>
      <el-table-column label="客户等级">
        <template slot-scope="scope">
          {{ scope.row.customerLevel }}
        </template>
      </el-table-column>
      <el-table-column label="客户电话" width="150">
        <template slot-scope="scope">
          <div v-for="(phone, index) in scope.row.customerPhone" :key="index">
            <span>{{ phone }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="客户微信">
        <template slot-scope="scope">
          {{ scope.row.customerWeChat }}
        </template>
      </el-table-column> -->
      <el-table-column label="客户来源">
        <template slot-scope="scope">
          {{ scope.row.customerComeFrom }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="客源人">
        <template slot-scope="scope">
          {{ scope.row.chargeUser }}
        </template>
      </el-table-column>
      <el-table-column label="客源人部门" width="120">
        <template slot-scope="scope">
          {{ scope.row.chargeUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="录入人">
        <template slot-scope="scope">
          {{ scope.row.inputUser }}
        </template>
      </el-table-column>
      <el-table-column label="录入人部门" width="120">
        <template slot-scope="scope">
          {{ scope.row.inputUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="公客部门">
        <template slot-scope="scope">
          {{ scope.row.publicDepartment }}
        </template>
      </el-table-column> -->
      <el-table-column label="备注">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.remark">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="意向" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.intent">
            <div v-for="(i, index) in scope.row.intent" :key="index">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ i }}</div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="录客时间">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.entryTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.entryTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="公私客">
        <template slot-scope="scope">
          {{ scope.row.property }}
        </template>
      </el-table-column>
      <el-table-column label="委托时间">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.delegateDate">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.delegateDate }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 翻页组件，用于控制显示数据条数和页码-->
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="[20, 40, 60, 80]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryEnterpriseCustomers } from '@/api/enterprise/enterprise_info'
import { exportEnterpriseCustomers } from '@/api/enterprise/enterprise_info'
import { queryCustomerAgent } from '@/api/enterprise/enterprise_info'
import { asyncEnterpriseCustomerCode } from '@/api/enterprise/enterprise_info'
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'

export default {
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 40,
      total: 0,
      listLoading: false,
      searchForm: {
        erpName: '',
        enterpriseCode: ''
      },
      // erp系统映射
      enterpriseOptions: [],
      codes: []
    }
  },
  watch: {
    searchForm: {
      handler(newValue) {
        if (newValue.erpName) {
          this.codes = this.erpCodeMap(newValue.erpName)
        }
      },
      deep: true, // 深度监听，用以监听对象属性变化
      immediate: true // 立即执行一次handler函数
    }
  },
  created() {
    this.queryCode()
  },
  methods: {
    queryCode() {
      const params = {
        comeFrom: 'FRONTEND'
      }
      queryEnterpriseCode(params)
        .then(response => {
          this.enterpriseOptions = response.data.list
        })
    },
    // erp变更时清空codes
    resetCode() {
      this.searchForm.enterpriseCode = ''
    },
    // 找出erp对应的codes
    erpCodeMap(erp) {
      const map = {}
      const enterpriseOptions = this.enterpriseOptions
      for (let i = 0; i < enterpriseOptions.length; i++) {
        map[enterpriseOptions[i].erpName] = enterpriseOptions[i].codes
      }
      return map[erp]
    },
    async_customer_team_code() {
      const params = {
        comeFrom: 'FRONTEND',
        erpName: this.searchForm.erpName,
        enterpriseCode: this.searchForm.enterpriseCode
      }
      this.$message({ message: '正在同步小鹿编号' })
      asyncEnterpriseCustomerCode(params)
        .then(response => {
          this.$notify({
            title: '成功',
            message: '小鹿编号同步完毕',
            type: 'success',
            position: 'top-left'
          })
        })
    },
    // 格式化查询
    formatSearch(filter) {
      if (this.searchForm.customerId) {
        filter.customerId = this.searchForm.customerId
      }
      if (this.searchForm.customerNo) {
        filter.customerNo = this.searchForm.customerNo
      }
      if (this.searchForm.userNames) {
        filter.userNames = this.searchForm.userNames
      }
    },
    // 渲染数据
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }
      this.formatSearch(filter)
      const params = {
        comeFrom: 'FRONTEND',
        filter: filter,
        erpName: this.searchForm.erpName,
        enterpriseCode: this.searchForm.enterpriseCode
      }
      this.listLoading = true
      queryEnterpriseCustomers(params)
        .then(response => {
          this.total = response.data.totalCount
          this.list = response.data.list
        }).finally(() => {
          this.listLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
    handleSearch() {
      this.page = 1 // 添加此行代码
      this.fetchData()
    },
    // 导出数据
    exportData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }
      this.formatSearch(filter)
      const params = {
        comeFrom: 'FRONTEND',
        filter: filter,
        erpName: this.searchForm.erpName,
        enterpriseCode: this.searchForm.enterpriseCode
      }
      this.listLoading = true
      exportEnterpriseCustomers(params)
        .then(response => {
          this.queryCustomerAgent(response.data.list)
        }).finally(() => {
          this.listLoading = false
        })
    },
    queryCustomerAgent(customers) {
      const ruleParams = {
        comeFrom: 'FRONTEND',
        enterpriseCode: this.searchForm.enterpriseCode,
        erpName: this.searchForm.erpName
      }
      queryCustomerAgent(ruleParams)
        .then(response => {
          this.exportExcel(customers, response.data.list)
        })
    },
    exportExcel(customers, agentList) {
      import('@/vendor/Export2Excel').then(excel => {
        const baseHeader = [
          '小鹿编号', '客源外部ID', '原系统编号', '客户类型', '客户状态', '客户姓名'
        ]
        const baseFilterVal = [
          'teamCustomerCode', 'customerId', 'customerNo', 'tradeType', 'status', 'customerName'
        ]
        const tHeader = baseHeader.concat(agentList)
        const filterVal = baseFilterVal.concat(agentList)
        const data = this.formatJson(filterVal, customers, agentList)
        const tfileName = this.searchForm.enterpriseCode + '_客源'
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: tfileName,
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData, agentList) {
      return jsonData.map(v => filterVal.map(j => {
        if (agentList.includes(j)) {
          const user = v.allUsers.find(u => u.userFieldName === j)
          return user ? user.userName : ''
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
