<template>
  <div class="app-container">
    <el-dialog width="40%" :visible.sync="importDepVisble">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
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
          <el-form-item label="姓名" prop="user">
            <el-input v-model="searchForm.user" style="width: 180px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="部门" prop="userDepartment">
            <el-input v-model="searchForm.userDepartment" style="width: 180px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="工号" prop="employeeNo">
            <el-input v-model="searchForm.employeeNo" style="width: 180px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="是否在职:">
            <el-checkbox-group v-model="searchForm.status">
              <el-checkbox :key="1" label="1">是</el-checkbox>
              <el-checkbox :key="0" label="0">否</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="exportData">导出Excel</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="showImportData">导入小鹿账号</el-button>
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
      <el-table-column label="经纪人ID" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.userId">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.userId }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="工号" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.employeeNo">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.employeeNo }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.user }}
        </template>
      </el-table-column>
      <el-table-column label="部门" width="150">
        <template slot-scope="scope">
          {{ scope.row.userDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="组织架构" width="200">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.userFullDepartment">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.userFullDepartment }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.positionName">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.positionName }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="上司" width="100">
        <template slot-scope="scope">
          {{ scope.row.gradeUser }}
        </template>
      </el-table-column>
      <el-table-column label="上司ID" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.gradeUserId">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.gradeUserId }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="小鹿账号" width="150">
        <template slot-scope="scope">
          {{ scope.row.userCode }}
        </template>
      </el-table-column>
      <el-table-column label="小鹿部门" width="200">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.teamOrganization">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.teamOrganization }}</div>
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
import { queryOrganization } from '@/api/enterprise/enterprise_info'
import { importOrganization } from '@/api/enterprise/enterprise_info'
import { exportOrganization } from '@/api/enterprise/enterprise_info'
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  components: { UploadExcelComponent },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 40,
      total: 0,
      listLoading: false,
      importDepVisble: false,
      searchForm: {
        erpName: '',
        enterpriseCode: '',
        status: []
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
    // 渲染数据
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }

      if (this.searchForm.user) {
        filter.user = this.searchForm.user
      }
      if (this.searchForm.userDepartment) {
        filter.userDepartment = this.searchForm.userDepartment
      }
      if (this.searchForm.employeeNo) {
        filter.employeeNo = this.searchForm.employeeNo
      }
      if (this.searchForm.status.length === 1) {
        filter.status = this.searchForm.status[0]
      }

      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode

      this.listLoading = true
      queryOrganization(params)
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
      const filter = {}
      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode
      exportOrganization(params)
        .then(response => {
          this.exportExcel(response.data.list)
        })
    },
    exportExcel(allDepartments) {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '部门', '姓名', '账号', '手机', '角色', '职位', '入职日期', '转正日期', '性别', '银行名称', '银行账号', '身份证号', '生日',
          '籍贯', '学历', '毕业院校', '执业证号', '个人号账号', '备注', '原系统经纪人id', '原系统经纪人编号', '资源导入账号', '状态'
        ]
        const filterVal = ['teamOrganization', 'user', 'code', 'phone', 'roleName', 'positionName', 'joinDate', 'probationDate',
          'gender', 'bankName', 'bankCode', 'idCard', 'birthday', 'place', 'education', 'graduationInstitution', 'certificateNumber',
          'personalAccount', 'remark', 'userId', 'employeeNo', 'userCode', 'status'
        ]
        const data = this.formatJson(filterVal, allDepartments)
        const tfileName = this.searchForm.enterpriseCode + '_组织架构'
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: tfileName,
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 导入小鹿账号
    showImportData() {
      this.importDepVisble = true
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      const data = results.map(({ 'ID': userId = '', '小鹿账号': userCode = '', '小鹿部门': teamOrganization = '' }) => ({ userId, userCode, teamOrganization }))
      console.log(data)
      const postData = {
        comeFrom: 'FRONTEND',
        enterpriseCode: this.searchForm.enterpriseCode,
        erpName: this.searchForm.erpName,
        organizations: data
      }
      importOrganization(postData)
        .then(response => {
          console.log(response.data)
          this.importDepVisble = false
          this.fetchData()
        })
    }
  }
}
</script>
