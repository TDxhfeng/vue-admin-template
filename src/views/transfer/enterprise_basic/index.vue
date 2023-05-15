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
          <el-button size="mini" type="primary" @click="showDialogByTransferRule(scope.row)">查询规则</el-button>
          <el-button size="mini" type="success" @click="showAddRule(scope.row)">添加规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加规则对话框 -->
    <el-dialog width="30%" title="添加规则" :visible.sync="addRuleVisible">
      <el-form ref="addRuleForm" :model="addRuleForm" label-width="80px">
        <el-form-item
          label="原系统录入人对应："
          prop="inputUserOriginField"
          label-width="180px"
          :rules="[{
            required: true,
            message: '原系统录入人对应',
            trigger: 'blur'
          }]"
        >
          <el-select v-model="addRuleForm.inputUserOriginField" style="width: 220px;" clearable placeholder="请选择原系统录入人字段">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统售维护人对应："
          prop="saleUserOriginField"
          label-width="180px"
          :rules="[{
            required: true,
            message: '原系统售维护人对应',
            trigger: 'blur'
          }]"
        >
          <el-select v-model="addRuleForm.saleUserOriginField" style="width: 220px;" clearable placeholder="请选择原系统售维护人字段">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统租维护人对应："
          prop="rentUserOriginField"
          label-width="180px"
          :rules="[{
            required: true,
            message: '原系统租维护人对应',
            trigger: 'blur'
          }]"
        >
          <el-select v-model="addRuleForm.rentUserOriginField" style="width: 220px;" clearable placeholder="请选择原系统租维护人字段">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统钥匙人对应："
          prop="keyUserOriginField"
          label-width="180px"
        >
          <el-select v-model="addRuleForm.keyUserOriginField" style="width: 220px;" clearable placeholder="系统默认值keyUser">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统实勘人对应："
          prop="imgUserOriginField"
          label-width="180px"
        >
          <el-select v-model="addRuleForm.imgUserOriginField" style="width: 220px;" clearable placeholder="系统默认值imgUser">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否启用公私盘标记："
          prop="isUseHouseProperty"
          label-width="180px"
        >
          <el-radio v-model="addRuleForm.isUseHouseProperty" :label="1">是</el-radio>
          <el-radio v-model="addRuleForm.isUseHouseProperty" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否启用公盘部门映射"
          prop="isUseHousePublicDepartmentsMap"
          label-width="180px"
        >
          <el-radio v-model="addRuleForm.isUseHousePublicDepartmentsMap" :label="1">是</el-radio>
          <el-radio v-model="addRuleForm.isUseHousePublicDepartmentsMap" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否启用录入人部门映射："
          prop="isUseHouseInputUserMap"
          label-width="180px"
        >
          <el-radio v-model="addRuleForm.isUseHouseInputUserMap" :label="1">是</el-radio>
          <el-radio v-model="addRuleForm.isUseHouseInputUserMap" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitRule">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 清洗规则详情查询对话框 -->
    <el-dialog :visible.sync="transferRuleDialogVisible" width="70%" title="规则详情">
      <!-- 清洗规则展示对话框列表 -->
      <el-table v-if="transferRuleDialogVisible" :data="ruleData">
        <el-table-column label="清洗类型" width="100">
          <template slot-scope="scope">
            {{ scope.row.transferType }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.createTime">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="清洗详情">
          <template slot-scope="scope">
            <div>
              <span>原系统房源录入人字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.inputUserOriginField }}】</span>
              <span>默认：录入人</span>
            </div>
            <div>
              <span>原系统房源售维护人字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.saleUserOriginField }}】</span>
              <span>默认：售盘源人</span>
            </div>
            <div>
              <span>原系统房源租维护人字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.rentUserOriginField }}】</span>
              <span>默认：租盘源人</span>
            </div>
            <div>
              <span>原系统房源钥匙人字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.keyUserOriginField }}】</span>
              <span>默认：钥匙人</span>
            </div>
            <div>
              <span>原系统房源实勘人字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.imgUserOriginField }}】</span>
              <span>默认：实勘人</span>
            </div>
            <div>
              <span>是否启用私盘标记：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseHouseProperty == 1 ? '是': '否' }}】</span>
              <span>默认：否</span>
            </div>
            <div>
              <span>是否启用公盘部门映射：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseHousePublicDepartmentsMap == 1 ? '是': '否' }}】</span>
              <span>默认：否</span>
            </div>
            <div>
              <span>是否启用录入人部门映射：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseHouseInputUserMap == 1 ? '是': '否' }}】</span>
              <span>默认：否</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="createTask(scope.row)">创建清洗任务</el-button>
            <el-button size="mini" type="danger" @click="deleteRule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
import { queryeEnterpriseInfoList } from '@/api/enterprise/enterprise_info'
import { queryeEnterpriseRuleList } from '@/api/enterprise/enterprise_info'
import { erpOptions } from '@/store/constants'
import { createTaskInfo } from '@/api/enterprise/enterprise_info'
import { deleteEnterpriseRule } from '@/api/enterprise/enterprise_info'
import { queryEntepriseHouseAgent } from '@/api/enterprise/enterprise_info'
import { addEnterpriseRule } from '@/api/enterprise/enterprise_info'

export default {
  data() {
    return {
      ruleData: [],
      transferRuleDialogVisible: false,
      addRuleVisible: false,
      list: [],
      agentList: [],
      page: 1,
      pageSize: 40,
      total: 0,
      listLoading: false,
      searchForm: {
        erpName: '',
        enterpriseCode: ''
      },
      // 添加规则表单
      addRuleForm: {
        comeFrom: 'FRONTEND',
        erpName: '',
        transferType: 'HOUSE',
        enterpriseCode: '',
        inputUserOriginField: '',
        saleUserOriginField: '',
        rentUserOriginField: '',
        keyUserOriginField: 'keyUser',
        imgUserOriginField: 'imgUser',
        isUseHouseProperty: 0,
        isUseHousePublicDepartmentsMap: 0,
        isUseHouseInputUserMap: 0
      },
      // erp系统映射
      erpOptions: erpOptions
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
      queryeEnterpriseInfoList(params)
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
    },
    // 打开弹出框
    showDialogByTransferRule(row) {
      // 请求获取规则
      const ruleParams = {
        comeFrom: 'FRONTEND',
        filter: {
          enterpriseCode: row.enterpriseCode,
          erpName: row.erpName
        }
      }
      queryeEnterpriseRuleList(ruleParams)
        .then(response => {
          // this.ruleTotal = response.data.totalCount
          this.ruleData = response.data.list
        })
      console.log('ruleData: ', this.ruleData)
      this.transferRuleDialogVisible = true
    },
    // 打开添加房源映射弹出框
    showAddRule(row) {
      const ruleParams = {
        comeFrom: 'FRONTEND',
        enterpriseCode: row.enterpriseCode,
        erpName: row.erpName
      }
      queryEntepriseHouseAgent(ruleParams)
        .then(response => {
          this.agentList = response.data.list
        })
      console.log('agentList: ', this.agentList)
      this.addRuleVisible = true
      this.addRuleForm.erpName = row.erpName
      this.addRuleForm.enterpriseCode = row.enterpriseCode
      this.addRuleForm.keyUserOriginField = 'keyUser'
      this.addRuleForm.imgUserOriginField = 'imgUser'
      this.addRuleForm.isUseHouseProperty = 0
      this.addRuleForm.isUseHousePublicDepartmentsMap = 0
      this.addRuleForm.isUseHouseInputUserMap = 0
    },
    // 添加规则
    onSubmitRule() {
      addEnterpriseRule(this.addRuleForm)
        .then(response => {
          console.log('addRuleRes: ', this.data.list)
        })
      this.addRuleVisible = false
    },
    // 创建清洗任务
    createTask(row) {
      const taskData = {
        comeFrom: 'FRONTEND',
        tasks: [{
          taskBelong: 'ENTERPRISE_TRANSFER',
          taskType: row.transferType,
          ruleId: row.ruleId
        }]
      }
      createTaskInfo(taskData)
        .then(response => {
          console.log(response.data)
        })
      this.transferRuleDialogVisible = false
    },
    // 删除规则
    deleteRule(row) {
      const ruleData = {
        comeFrom: 'FRONTEND',
        ruleIds: [row.ruleId]
      }
      deleteEnterpriseRule(ruleData)
        .then(response => {
          console.log(response.data.list)
        })
      this.transferRuleDialogVisible = false
    }
  }
}
</script>
