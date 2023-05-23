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
          <el-form-item
            label="原因"
            prop="erpName"
            :rules="[{
              required: true,
              message: '请选择原因',
              trigger: 'blur'
            }]"
          >
            <el-select
              v-model="searchForm.reason"
              style="width: 150px;"
              placeholder="请选择原因"
              clearable
            >
              <el-option
                v-for="(value, index) in reasonList"
                :key="index"
                :value="value"
              />
            </el-select>
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
          <el-checkbox-group v-model="searchForm.isExistsUserCode">
            <el-checkbox :key="1" label="1">有账号</el-checkbox>
            <el-checkbox :key="0" label="0">无账号</el-checkbox>
          </el-checkbox-group>
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
      <el-table-column label="小鹿系统账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.userCode }}
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
        enterpriseCode: '',
        isExistsUserCode: []
      },
      // erp系统映射
      erpOptions: erpOptions,
      reasonList: ['重名', '名字一致', '账号不存在'],
      // 修改账号
      modifyDialogVisible: false,
      newUserCode: ''
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
      if (this.searchForm.isExistsUserCode.length === 1) {
        filter.isExistsUserCode = this.searchForm.isExistsUserCode[0]
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
