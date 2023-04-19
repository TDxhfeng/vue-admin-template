<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item
            label="ERP名称"
            prop="erpName"
          >
            <el-select
              v-model="searchForm.erpName"
              style="width: 150px;"
              clearable
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
          <el-form-item label="企业号" prop="enterpriseCode">
            <el-input v-model="searchForm.enterpriseCode" style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="fetchData">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="650"
    >
      <el-table-column label="城市" width="150">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="企业号" width="150">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="ERP名称" width="150">
        <template slot-scope="scope">
          {{ erpNameMap[scope.row.erpName] }}
        </template>
      </el-table-column>
      <el-table-column label="teamID">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.teamId">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.teamId }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" width="150">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.createTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showDialogByTransferRule(scope)">清洗规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 清洗规则展示对话框 -->
    <el-dialog :visible.sync="transferRuleDialogVisible" title="清洗规则">
      <el-table v-if="transferRuleDialogVisible" :data="gridData">
        <el-table-column property="date" label="日期" width="150" />
        <el-table-column property="name" label="姓名" width="200" />
        <el-table-column property="address" label="地址" />
      </el-table>
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
import { queryeEterpriseInfoList } from '@/api/enterprise/enterprise_info'
import { erpOptions } from '@/store/constants'

export default {
  data() {
    return {
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      transferRuleDialogVisible: false,
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
  computed: {
    erpNameMap() {
      const map = {}
      for (let i = 0; i < erpOptions.length; i++) {
        map[erpOptions[i].value] = erpOptions[i].label
      }
      return map
    }
  },
  created() {},
  methods: {
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }
      if (this.searchForm.erpName) {
        filter.erpName = this.searchForm.erpName
      }
      if (this.searchForm.enterpriseCode) {
        filter.enterpriseCode = this.searchForm.enterpriseCode
      }
      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }

      this.listLoading = true
      queryeEterpriseInfoList(params)
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
    showDialogByTransferRule(scope) {
      // 打开弹出框
      this.transferRuleDialogVisible = true
    }
  }
}
</script>
