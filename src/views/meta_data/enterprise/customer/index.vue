<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
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
            <el-select
              v-model="searchForm.erpName"
              style="width: 150px;"
              placeholder="请选择ERP名称"
            >
              <el-option
                v-for="(option, index) in erpOptions"
                :key="index"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业号" prop="enterpriseCode" :rules="[{ required: true, message: '请输入企业号', trigger: 'blur' }]">
            <el-input v-model="searchForm.enterpriseCode" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="外部Id" prop="customerId">
            <el-input v-model="searchForm.customerId" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="客源编号" prop="customerNo">
            <el-input v-model="searchForm.customerNo" style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="fetchData">搜索</el-button>
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
      <el-table-column label="企业号">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="原系统客源ID" width="110">
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
      <el-table-column label="客户微信">
        <template slot-scope="scope">
          {{ scope.row.customerWeChat }}
        </template>
      </el-table-column>
      <el-table-column label="面积">
        <template slot-scope="scope">
          {{ scope.row.buildArea }}
        </template>
      </el-table-column>
      <el-table-column label="客户来源">
        <template slot-scope="scope">
          {{ scope.row.customerComeFrom }}
        </template>
      </el-table-column>
      <el-table-column label="客源人">
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
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="意向" width="120">
        <template slot-scope="scope">
          <div v-for="(i, index) in scope.row.intent" :key="index">
            <span>{{ i }}</span>
          </div>
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
      <el-table-column label="爬取时间" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.createTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
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
import { erpOptions } from '@/store/constants'

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
      erpOptions: erpOptions
    }
  },
  created() {},
  methods: {
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }

      if (this.searchForm.customerId) {
        filter.customerId = this.searchForm.customerId
      }

      if (this.searchForm.customerNo) {
        filter.customerNo = this.searchForm.customerNo
      }

      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode

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
    }
  }
}
</script>
