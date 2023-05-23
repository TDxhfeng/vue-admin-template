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
          <el-form-item label="原因" prop="reason">
            <el-input v-model="searchForm.reason" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="经纪人名" prop="userName">
            <el-input v-model="searchForm.userName" style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="handleSearch">搜索</el-button>
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
      <el-table-column label="ID" width="300">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.id">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.id }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="经纪人名" width="180">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="经纪人部门" width="250">
        <template slot-scope="scope">
          {{ scope.row.userDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="原因" width="200">
        <template slot-scope="scope">
          {{ scope.row.reason }}
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
import { queryEnterpriseUser } from '@/api/enterprise/enterprise_info'
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
      if (this.searchForm.reason) {
        filter.reason = this.searchForm.reason
      }

      if (this.searchForm.userName) {
        filter.userName = this.searchForm.userName
      }

      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode

      this.listLoading = true
      queryEnterpriseUser(params)
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
    }
  }
}
</script>
