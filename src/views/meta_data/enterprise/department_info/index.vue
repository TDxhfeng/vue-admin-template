<template>
  <div class="app-container">
    <!-- 导入部门对话框 -->
    <el-dialog width="40%" :visible.sync="importDepVisble">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
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
              <el-option v-for="value in codes" :key="value.enterpriseCode" :label="value.enterpriseName" :value="value.enterpriseCode" />
            </el-select>
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
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="exportHouseDep">导出Excel</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="showExportHouse">导入Excel</el-button>
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
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column label="原系统部门" width="180">
        <template slot-scope="scope">
          {{ scope.row.originDepartments }}
        </template>
      </el-table-column>
      <el-table-column label="维护人公共部门或账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.targetDepartmentsOrUserCode }}
        </template>
      </el-table-column>
      <el-table-column label="录入人公共账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.targetInputUserCode }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { exportHouseDepartments } from '@/api/enterprise/enterprise_info'
import { importHouseDepartments } from '@/api/enterprise/enterprise_info'
import { queryHouseDepartments } from '@/api/enterprise/enterprise_info'
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  components: { UploadExcelComponent },
  data() {
    return {
      list: [],
      listLoading: false,
      importDepVisble: false,
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
      queryHouseDepartments(params)
        .then(response => {
          this.list = response.data.list
        }).finally(() => {
          this.listLoading = false
        })
    },
    handleSearch() {
      console.log('isExistsUserCode:', this.searchForm.isExistsUserCode)
      this.fetchData()
    },
    // 导出所有房源部门
    exportHouseDep() {
      const postData = {
        comeFrom: 'FRONTEND',
        enterpriseCode: this.searchForm.enterpriseCode,
        erpName: this.searchForm.erpName
      }
      exportHouseDepartments(postData)
        .then(response => {
          this.exportExcel(response.data.list)
          this.openExportMessage()
        })
    },
    exportExcel(allDepartments) {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['原系统部门', '维护人公共部门或账号', '录入人公共账号(默认0001)']
        const filterVal = ['originDepartments', 'targetDepartmentsOrUserCode', 'targetInputUserCode']
        const data = this.formatJson(filterVal, allDepartments)
        const tfileName = this.searchForm.enterpriseCode + '_数据映射'
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
    // 弹框提示重要事项
    openExportMessage() {
      this.$alert('1、【维护人公共部门或账号】如果填写的是部门，如：小鹿系统/技术部，如果维护人账号不匹配则会导为该公盘部门</br>2、【维护人公共部门或账号】如果填写的是账号，如：10010001，如果维护人账号不匹配则会导为该账号</br>3、【录入人公共账号(默认0001)】 录入人不存在默认是导为0001，也可以给对应部门导为指定的账号</br>4、系统提供默认行：【部门不存在时导为】填写账号or部门亦可，当经纪人或经纪人部门都不存在则会导为该情况</br>5、系统提供默认行：【部门不存在时导为】填写账号，当录入人部门不存在或不匹配则会导为该账号', '部门清洗事项', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        customClass: 'msgBox'
      })
    },
    // 导入部门
    showExportHouse() {
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
      const data = results.map(({ '原系统部门': originDepartments = '', '维护人公共部门或账号': targetDepartmentsOrUserCode = '', '录入人公共账号(默认0001)': targetInputUserCode = '' }) => ({ originDepartments, targetDepartmentsOrUserCode, targetInputUserCode }))
      console.log(data)
      const postData = {
        comeFrom: 'FRONTEND',
        enterpriseCode: this.searchForm.enterpriseCode,
        erpName: this.searchForm.erpName,
        mapping: data
      }
      importHouseDepartments(postData)
        .then(response => {
          console.log(response.data)
          this.importDepVisble = false
          this.fetchData()
        })
    }
  }
}
</script>
