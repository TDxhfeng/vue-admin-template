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
              message: '请输入',
              trigger: 'blur'
            }]"
          >
            <el-select v-model="searchForm.erpName" placeholder="选择ERP" clearable filterable @change="resetCode">
              <el-option v-for="option in enterpriseOptions" :key="option.erpName" :label="option.erpCnName" :value="option.erpName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业号:" prop="enterpriseCode" :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
            <el-select v-model="searchForm.enterpriseCode" placeholder="选择企业" clearable filterable>
              <el-option v-for="value in codes" :key="value" :label="value" :value="value" />
            </el-select>
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
      <el-table-column label="原系统部门" width="180">
        <template slot-scope="scope">
          {{ scope.row.originDepartments }}
        </template>
      </el-table-column>
      <el-table-column label="现系统部门或账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.targetDepartmentsOrUserCode }}
        </template>
      </el-table-column>
      <el-table-column label="录入人部门公共账号" width="250">
        <template slot-scope="scope">
          {{ scope.row.targetInputUserCode }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { exportHouseDepartments } from '@/api/enterprise/enterprise_info'
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'

export default {
  data() {
    return {
      list: [],
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
  computed: {
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
    fetchData() {
      const params = {
        comeFrom: 'FRONTEND'
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode

      this.listLoading = true
      exportHouseDepartments(params)
        .then(response => {
          this.list = response.data.list
        }).finally(() => {
          this.listLoading = false
        })
    },
    handleSearch() {
      console.log('isExistsUserCode:', this.searchForm.isExistsUserCode)
      this.fetchData()
    }
  }
}
</script>
