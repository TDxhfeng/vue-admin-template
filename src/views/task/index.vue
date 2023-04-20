<template>
  <div class="app-container">
    <!-- 表单 -->
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
          <el-form-item
            label="任务归属"
            prop="taskBelong"
          >
            <el-select
              v-model="searchForm.taskBelong"
              style="width: 150px;"
              clearable
              placeholder="请选择任务归属"
            >
              <el-option
                v-for="(option, index) in taskBelong"
                :key="index"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="任务类型"
            prop="taskType"
          >
            <el-select
              v-model="searchForm.taskType"
              style="width: 150px;"
              clearable
              placeholder="请选择任务类型"
            >
              <el-option
                v-for="(option, index) in taskType"
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
      stripe="true"
      fit
      highlight-current-row
      max-height="650"
    >
      <el-table-column label="任务归属" width="200">
        <template slot-scope="scope">
          {{ taskBelongMap[scope.row.taskBelong] }}
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="100">
        <template slot-scope="scope">
          {{ taskTypeMap[scope.row.taskType] }}
        </template>
      </el-table-column>
      <el-table-column label="任务名称" width="250">
        <template slot-scope="scope">
          {{ scope.row.taskName }}
        </template>
      </el-table-column>
      <el-table-column label="ERP名称" width="150">
        <template slot-scope="scope">
          {{ erpNameMap[scope.row.erpName] }}
        </template>
      </el-table-column>
      <el-table-column label="企业teamCode" width="150">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="150">
        <template slot-scope="scope">
          <el-tag :type="taskTap[scope.row.status]" effect="dark" size="small ">
            <span>{{ taskStatusMap[scope.row.status] }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" width="220">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.finishTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.finishTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="retry(scope.row)">重试</el-button>
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
import { queryTaskInfo } from '@/api/task'
import { erpOptions } from '@/store/constants'
import { taskBelong } from '@/store/constants'
import { taskType } from '@/store/constants'
import { taskStatus } from '@/store/constants'
import { taskTap } from '@/store/constants'

export default {
  data() {
    return {
      ruleData: [],
      transferRuleDialogVisible: false,
      list: [],
      page: 1,
      pageSize: 40,
      total: 0,
      listLoading: false,
      searchForm: {
        taskBelong: '',
        taskType: '',
        enterpriseCode: '',
        erpName: ''
      },
      // 系统映射
      erpOptions: erpOptions,
      taskBelong: taskBelong,
      taskType: taskType,
      taskStatus: taskStatus,
      taskTap: taskTap
    }
  },
  computed: {
    // 计算erp名称映射
    erpNameMap() {
      const map = {}
      for (let i = 0; i < erpOptions.length; i++) {
        map[erpOptions[i].value] = erpOptions[i].label
      }
      return map
    },
    taskBelongMap() {
      const map = {}
      for (let i = 0; i < taskBelong.length; i++) {
        map[taskBelong[i].value] = taskBelong[i].label
      }
      return map
    },
    taskTypeMap() {
      const map = {}
      for (let i = 0; i < taskType.length; i++) {
        map[taskType[i].value] = taskType[i].label
      }
      return map
    },
    taskStatusMap() {
      const map = {}
      for (let i = 0; i < taskStatus.length; i++) {
        map[taskStatus[i].value] = taskStatus[i].label
      }
      return map
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 列表数据查询
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }
      if (this.searchForm.taskBelong) {
        filter.taskBelong = this.searchForm.taskBelong
      }
      if (this.searchForm.taskType) {
        filter.taskType = this.searchForm.taskType
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
      queryTaskInfo(params)
        .then(response => {
          this.total = response.data.totalCount
          this.list = response.data.list
        }).finally(() => {
          this.listLoading = false
        })
    },
    // 页面大小
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.fetchData()
    },
    // 页码
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    }
  }
}
</script>
