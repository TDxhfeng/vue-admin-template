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
        <el-col :span="4">
          <el-form-item
            label="匹配结果:"
            prop="matchState"
          >
            <el-select
              v-model="searchForm.matchState"
              style="width: 150px;"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(option, index) in userMatch"
                :key="index"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="经纪人名:" prop="userName">
            <el-input v-model="searchForm.userName" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="小鹿账号:" prop="userCode">
            <el-input v-model="searchForm.userCode" style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="是否匹配:">
            <el-checkbox-group v-model="searchForm.isMatch">
              <el-checkbox :key="1" label="1">是</el-checkbox>
              <el-checkbox :key="0" label="0">否</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否修改:">
            <el-checkbox-group v-model="searchForm.isUpdate">
              <el-checkbox :key="1" label="1">是</el-checkbox>
              <el-checkbox :key="0" label="0">否</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="名字包含其它字符:">
            <el-checkbox-group v-model="searchForm.isAlpha">
              <el-checkbox :key="1" label="1">是</el-checkbox>
              <el-checkbox :key="0" label="0">否</el-checkbox>
            </el-checkbox-group>
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
      <el-table-column label="小鹿系统账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.userCode }}
        </template>
      </el-table-column>
      <el-table-column label="匹配情况" width="200">
        <template slot-scope="scope">
          {{ userMatchMap[scope.row.matchState] }}
        </template>
      </el-table-column>
      <el-table-column label="是否匹配" width="200">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isMatch === 1 ? 'success' : 'danger'"
            disable-transitions
          >{{ scope.row.isMatch == 1 ? '是': '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否操作修改" width="200">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isUpdate === 1 ? 'success' : 'danger'"
            disable-transitions
          >{{ scope.row.isUpdate == 1 ? '是': '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="showModifyUserCode(scope.row)">修改账号</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改账号" :visible.sync="modifyDialogVisible">
      <el-form>
        <el-form-item label="修改账号">
          <el-input v-model="newUserCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="modifyDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
import { updateEnterpriseUser } from '@/api/enterprise/enterprise_info'
import { userMatch } from '@/store/constants'
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
        enterpriseCode: '',
        isMatch: [],
        isUpdate: [],
        isAlpha: []
      },
      // erp系统映射
      enterpriseOptions: [],
      codes: [],
      userMatch: userMatch,
      // 修改账号
      modifyDialogVisible: false,
      newUserCode: ''
    }
  },
  computed: {
    userMatchMap() {
      const map = {}
      for (let i = 0; i < userMatch.length; i++) {
        map[userMatch[i].value] = userMatch[i].label
      }
      return map
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
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }
      if (this.searchForm.matchState) {
        filter.matchState = this.searchForm.matchState
      }
      if (this.searchForm.userName) {
        filter.userName = this.searchForm.userName
      }
      if (this.searchForm.userCode) {
        filter.userCode = this.searchForm.userCode
      }
      if (this.searchForm.isMatch.length === 1) {
        filter.isMatch = this.searchForm.isMatch[0]
      }
      if (this.searchForm.isUpdate.length === 1) {
        filter.isUpdate = this.searchForm.isUpdate[0]
      }
      if (this.searchForm.isAlpha.length === 1) {
        filter.isAlpha = this.searchForm.isAlpha[0]
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
      console.log('isExistsUserCode:', this.searchForm.isExistsUserCode)
      this.page = 1 // 添加此行代码
      this.fetchData()
    },
    showModifyUserCode(row) {
      this.rowId = row.id
      this.newUserCode = row.userCode
      this.modifyDialogVisible = true
    },
    submit() {
      const params = {
        comeFrom: 'FRONTEND',
        id: this.rowId,
        userCode: this.newUserCode
      }
      updateEnterpriseUser(params)
        .then(response => {
          this.handleSearch()
        }).finally(() => {
          this.modifyDialogVisible = false
        })
    }
  }
}
</script>
