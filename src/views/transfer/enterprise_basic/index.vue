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
            <el-select v-model="searchForm.erpName" placeholder="选择ERP" clearable filterable @change="resetCode">
              <el-option v-for="option in enterpriseOptions" :key="option.erpName" :label="option.erpCnName" :value="option.erpName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业号" prop="enterpriseCode">
            <el-select v-model="searchForm.enterpriseCode" placeholder="选择企业" clearable filterable>
              <el-option v-for="value in codes" :key="value.enterpriseCode" :label="value.enterpriseName" :value="value.enterpriseCode" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
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
      <el-table-column label="城市" width="100">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="企业号" width="100">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="ERP名称" width="200">
        <template slot-scope="scope">
          {{ erpNameMap[scope.row.erpName] }}
        </template>
      </el-table-column>
      <el-table-column label="teamID" width="250">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.teamId">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.teamId }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" width="300">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="是否导入部门映射" width="150">
        <template slot-scope="scope">
          <span :class="{'red-text': scope.row.isImportPublicDepartmentsMapping == 1}">
            {{ scope.row.isImportPublicDepartmentsMapping == 1 ? '是': '否' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="是否导入录入人映射" width="150">
        <template slot-scope="scope">
          <span :class="{'red-text': scope.row.isImportInputUserDepartmentsMapping == 1}">
            {{ scope.row.isImportInputUserDepartmentsMapping == 1 ? '是': '否' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="110">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.createTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="info" size="mini">
              详情<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-house" @click="showDialogByTransferRule(scope.row)">查询房源规则</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-house" @click="showAddRule(scope.row)">添加房源规则</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-s-custom" @click="showCustomerRule(scope.row)">查询客源规则</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-s-custom" @click="showAddCustomerRule(scope.row)">添加客源规则</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="创建其它任务" width="120">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="info" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-upload" @click="createOtherTask(scope.row, 'HOUSE_PHOTO_UPLOAD')">房源图片上传COS</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-upload" @click="createOtherTask(scope.row, 'HOUSE_PANORAMA_UPLOAD')">房源全景图上传COS</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-upload" @click="createOtherTask(scope.row, 'CUSTOMER_FOLLOW')">客源跟进清洗上传水星</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-finished" @click="createOtherTask(scope.row, 'HOUSE_FOLLOW_IMPORT')">房源跟进导入后台</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-finished" @click="createOtherTask(scope.row, 'HOUSE_PHOTO_IMPORT')">房源图片导入后台</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-finished" @click="createOtherTask(scope.row, 'HOUSE_VIDEO')">房源视频导入后台</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-finished" @click="createOtherTask(scope.row, 'HOUSE_PANORAMA_IMPORT')">房源全景图导入后台</el-button></el-dropdown-item>
              <el-dropdown-item><el-button size="mini" type="text" icon="el-icon-finished" @click="createOtherTask(scope.row, 'CUSTOMER_FOLLOW_IMPORT')">客源跟进导入后台</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加房源规则对话框 -->
    <el-dialog width="35%" title="添加规则" :visible.sync="addRuleVisible">
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
          <div style="display: flex;">
            <el-select v-model="addRuleForm.inputUserOriginField" style="width: 150px; margin-right: 10px" clearable placeholder="原系统录入人">
              <el-option v-for="(value, index) in agentList" :key="index" :value="value" />
            </el-select>
            <el-select v-model="addRuleForm.secondInputUserOriginField" style="width: 180px; margin-right: 10px" clearable placeholder="(选填)递补录入人">
              <el-option v-for="(value, index) in agentList" :key="index" :value="value" />
            </el-select>
          </div>
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
          <el-select v-model="addRuleForm.saleUserOriginField" style="width: 150px;" clearable placeholder="原系统售维护人">
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
          <el-select v-model="addRuleForm.rentUserOriginField" style="width: 150px;" clearable placeholder="原系统租维护人">
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
          <el-select v-model="addRuleForm.keyUserOriginField" style="width: 150px;" clearable placeholder="系统默认值keyUser">
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
          <el-select v-model="addRuleForm.imgUserOriginField" style="width: 150px;" clearable placeholder="系统默认值imgUser">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统公盘是否导为公盘："
          prop="isUseHouseProperty"
          label-width="180px"
        >
          <el-radio v-model="addRuleForm.isUseHouseProperty" :label="1">是</el-radio>
          <el-radio v-model="addRuleForm.isUseHouseProperty" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否启用维护人部门映射"
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
        <el-form-item
          label="是否启用标签清洗："
          prop="isUseTransferTags"
          label-width="180px"
        >
          <el-radio v-model="addRuleForm.isUseTransferTags" :label="1">是</el-radio>
          <el-radio v-model="addRuleForm.isUseTransferTags" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="房源筛选条件" prop="transferFilter" label-width="180px">
          <el-input v-model="addRuleForm.transferFilter" style="width: 200px;" clearable />
        </el-form-item>
        <el-form-item
          label="需要转为跟进的角色人"
          prop="UserToFollowFieldList"
          label-width="180px"
        >
          <el-select v-model="addRuleForm.UserToFollowFieldList" multiple collapse-tags style="width: 200px;" clearable placeholder="(选填)">
            <el-option
              v-for="(value, index) in agentList"
              :key="index"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitRule">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加客源规则对话框 -->
    <el-dialog width="30%" title="添加规则" :visible.sync="addCustomerRuleVisible">
      <el-form ref="addCustomerRuleForm" :model="addCustomerRuleForm" label-width="80px">
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
          <el-select v-model="addCustomerRuleForm.inputUserOriginField" style="width: 150px;" clearable placeholder="原系统录入人">
            <el-option v-for="(value, index) in agentList" :key="index" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统客源人对应："
          prop="chargeUserOriginField"
          label-width="180px"
          :rules="[{
            required: true,
            message: '原系统客源人对应',
            trigger: 'blur'
          }]"
        >
          <el-select v-model="addCustomerRuleForm.chargeUserOriginField" style="width: 150px;" clearable placeholder="原系统维护人">
            <el-option v-for="(value, index) in agentList" :key="index" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原系统公客导为"
          prop="isUseCustomerProperty"
          label-width="180px"
          :rules="[{
            required: true,
            message: '原系统公客导为',
            trigger: 'blur'
          }]"
        >
          <el-select v-model="addCustomerRuleForm.isUseCustomerProperty" style="width: 150px;" placeholder="类型">
            <el-option v-for="(value, index) in ['私有','企业', '部门']" :key="index" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用维护人部门映射" prop="isUseCustomerPublicDepartmentsMap" label-width="180px">
          <el-radio v-model="addCustomerRuleForm.isUseCustomerPublicDepartmentsMap" :label="1">是</el-radio>
          <el-radio v-model="addCustomerRuleForm.isUseCustomerPublicDepartmentsMap" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否启用录入人部门映射：" prop="isUseCustomerInputUserMap" label-width="180px">
          <el-radio v-model="addCustomerRuleForm.isUseCustomerInputUserMap" :label="1">是</el-radio>
          <el-radio v-model="addCustomerRuleForm.isUseCustomerInputUserMap" :label="0">否</el-radio>
        </el-form-item>
        <div class="divider"><h3 class="title">其它规则：</h3></div>
        <el-form-item label="录入人全导为：" prop="isTransferInputUserToCode" label-width="180px">
          <el-tooltip class="item" effect="dark" content="如下规则填写后会导致上方规则失效" placement="right">
            <el-input v-model="addCustomerRuleForm.isTransferInputUserToCode" style="width: 150px;" clearable placeholder="请输入账号" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="是否全部导为企业公客：" prop="isTransferPublicCustomer" label-width="180px">
          <el-tooltip class="item" effect="dark" content="选择是会导致上方规则失效" placement="bottom">
            <el-radio v-model="addCustomerRuleForm.isTransferPublicCustomer" :label="1">是</el-radio>
          </el-tooltip>
          <el-radio v-model="addCustomerRuleForm.isTransferPublicCustomer" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitCustomerRule">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 房源清洗规则详情查询对话框 -->
    <el-dialog :visible.sync="transferRuleDialogVisible" width="70%" title="房源规则详情">
      <!-- 清洗规则展示对话框列表 -->
      <el-table v-if="transferRuleDialogVisible" :data="ruleData">
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.createTime">
              <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="清洗详情" width="600">
          <template slot-scope="scope">
            <div>
              <span>原系统房源</span><span style="color: #FF0000">录入人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.inputUserOriginField }}】</span>
            </div>
            <div>
              <span>递补</span><span style="color: #FF0000">录入人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.secondInputUserOriginField }}】</span>
            </div>
            <div>
              <span>原系统房源</span><span style="color: #FF0000">售维护人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.saleUserOriginField }}】</span>
            </div>
            <div>
              <span>原系统房源</span><span style="color: #FF0000">租维护人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.rentUserOriginField }}】</span>
            </div>
            <div>
              <span>原系统房源</span><span style="color: #FF0000">钥匙人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.keyUserOriginField }}】</span>
            </div>
            <div>
              <span>原系统房源</span><span style="color: #FF0000">实勘人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.imgUserOriginField }}】</span>
            </div>
            <div>
              <span>当前房源的清洗条件：</span>
              <span style="color: #FF0000">【{{ scope.row.transferFilter }}】</span>
            </div>
            <div>
              <span>原系统公盘是否导为公盘：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseHouseProperty == 1 ? '是': '否' }}】</span>
            </div>
            <div>
              <span>是否启用维护人部门映射：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseHousePublicDepartmentsMap == 1 ? '是': '否' }}】</span>
            </div>
            <div>
              <span>是否启用录入人部门映射：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseHouseInputUserMap == 1 ? '是': '否' }}】</span>
            </div>
            <div>
              <span>是否启用标签清洗：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseTransferTags == 1 ? '是': '否' }}】</span>
            </div>
            <div>
              <span>角色人转跟进：</span>
              <span style="color: #FF0000">【{{ Array.isArray(scope.row.UserToFollowFieldList) ? scope.row.UserToFollowFieldList.join("，"): "" }}】</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="createTask(scope.row, 'HOUSE')">创建房源清洗任务</el-button>
            <el-button size="mini" type="primary" @click="createTask(scope.row, 'HOUSE_FOLLOW')">创建房源跟进清洗任务</el-button>
            <el-button size="mini" type="danger" @click="deleteRule(scope.row, 'HOUSE')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 客源清洗规则详情查询对话框 -->
    <el-dialog :visible.sync="transferCustomerRuleDialogVisible" width="70%" title="房源规则详情">
      <!-- 清洗规则展示对话框列表 -->
      <el-table v-if="transferCustomerRuleDialogVisible" :data="ruleData">
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
              <span>原系统客源</span><span style="color: #FF0000">录入人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.inputUserOriginField }}】</span>
            </div>
            <div>
              <span>原系统客源</span><span style="color: #FF0000">维护人</span><span>字段为：</span>
              <span style="color: #FF0000">【{{ scope.row.chargeUserOriginField }}】</span>
            </div>
            <div>
              <span>原系统公客导为：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseCustomerProperty }}】</span>
            </div>
            <div>
              <span>是否启用维护人部门映射：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseCustomerPublicDepartmentsMap == 1 ? '是': '否' }}】</span>
            </div>
            <div>
              <span>是否启用录入人部门映射：</span>
              <span style="color: #FF0000">【{{ scope.row.isUseCustomerInputUserMap == 1 ? '是': '否' }}】</span>
            </div>
            <div><span>----------------------------------------------</span></div>
            <div>
              <span style="color: #FF0000">录入人</span><span>全部导为：</span>
              <span style="color: #FF0000">【{{ scope.row.isTransferInputUserToCode }}】</span>
            </div>
            <div>
              <span>是否全部导为</span><span style="color: #FF0000">企业公客</span><span>：</span>
              <span style="color: #FF0000">【{{ scope.row.isTransferPublicCustomer == 1 ? '是': '否' }}】</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="createTask(scope.row, 'CUSTOMER')">创建清洗客源任务</el-button>
            <el-button size="mini" type="danger" @click="deleteRule(scope.row, 'CUSTOMER')">删除</el-button>
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
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'
import { queryeEnterpriseInfoList } from '@/api/enterprise/enterprise_info'
import { queryeEnterpriseRuleList } from '@/api/enterprise/enterprise_info'
import { erpOptions } from '@/store/constants'
import { createTaskInfo } from '@/api/enterprise/enterprise_info'
import { deleteEnterpriseRule } from '@/api/enterprise/enterprise_info'
import { queryEntepriseHouseAgent } from '@/api/enterprise/enterprise_info'
import { addEnterpriseRule } from '@/api/enterprise/enterprise_info'
import { queryCustomerAgent } from '@/api/enterprise/enterprise_info'
import { addEnterpriseCustomerRule } from '@/api/enterprise/enterprise_info'
import { queryEnterpriseCustomerRule } from '@/api/enterprise/enterprise_info'
import { deleteEnterpriseCustomerRule } from '@/api/enterprise/enterprise_info'

export default {
  data() {
    return {
      // 清洗规则展示对话框数据
      ruleData: [],
      transferRuleDialogVisible: false,
      transferCustomerRuleDialogVisible: false,
      addCustomerRuleVisible: false,
      addRuleVisible: false,
      // 经纪人列表
      agentList: [],
      // 导入部门该行的参数
      exportRow: '',
      // 页码参数
      page: 1,
      pageSize: 40,
      total: 0,
      // 表格加载
      listLoading: false,
      list: [],
      // 搜索表单
      searchForm: {
        erpName: '',
        enterpriseCode: ''
      },
      // 添加房源规则表单
      addRuleForm: {
        comeFrom: 'FRONTEND',
        erpName: '',
        enterpriseCode: '',
        inputUserOriginField: '',
        secondInputUserOriginField: '',
        saleUserOriginField: '',
        rentUserOriginField: '',
        transferFilter: '',
        keyUserOriginField: 'keyUser',
        imgUserOriginField: 'imgUser',
        isUseHouseProperty: 0,
        isUseHousePublicDepartmentsMap: 0,
        isUseHouseInputUserMap: 0,
        isUseTransferTags: 0,
        UserToFollowFieldList: []
      },
      // 添加客源规则表单
      addCustomerRuleForm: {
        comeFrom: 'FRONTEND',
        erpName: '',
        enterpriseCode: '',
        isTransferInputUserToCode: '',
        inputUserOriginField: '',
        chargeUserOriginField: '',
        isUseCustomerProperty: '私有',
        isUseCustomerPublicDepartmentsMap: 0,
        isUseCustomerInputUserMap: 0,
        isTransferPublicCustomer: 0
      },
      // erp系统映射
      erpOptions: erpOptions,
      enterpriseOptions: [],
      codes: []
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
    this.fetchData()
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
    handleSearch() {
      this.page = 1 // 添加此行代码
      this.fetchData()
    },
    // 打开房源弹出框
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
    },
    // 添加房源规则
    onSubmitRule() {
      addEnterpriseRule(this.addRuleForm)
        .then(response => {
          this.$message({ message: '房源添加规则成功', type: 'success' })
        })
      this.addRuleVisible = false
    },
    // 创建清洗任务
    createTask(row, transferType) {
      const taskData = {
        comeFrom: 'FRONTEND',
        tasks: [{
          taskBelong: 'ENTERPRISE_TRANSFER',
          taskType: transferType,
          ruleId: row.ruleId
        }]
      }
      createTaskInfo(taskData)
        .then(response => {
          this.$message({ message: '创建成功', type: 'success' })
        })
      this.transferRuleDialogVisible = false
      this.transferCustomerRuleDialogVisible = false
    },
    // 删除规则
    deleteRule(row, transferType) {
      const ruleData = {
        comeFrom: 'FRONTEND',
        ruleIds: [row.ruleId]
      }
      if (transferType === 'HOUSE') {
        deleteEnterpriseRule(ruleData)
          .then(response => {
            this.$message({ message: '删除成功', type: 'success' })
          })
      } else if (transferType === 'CUSTOMER') {
        deleteEnterpriseCustomerRule(ruleData)
          .then(response => {
            this.$message({ message: '删除成功', type: 'success' })
          })
      }
      this.transferRuleDialogVisible = false
      this.transferCustomerRuleDialogVisible = false
    },
    // 打开添加客源规则对话框
    showAddCustomerRule(row) {
      const ruleParams = {
        comeFrom: 'FRONTEND',
        enterpriseCode: row.enterpriseCode,
        erpName: row.erpName
      }
      queryCustomerAgent(ruleParams)
        .then(response => {
          this.agentList = response.data.list
        })
      console.log('agentList: ', this.agentList)
      this.addCustomerRuleVisible = true
      this.addCustomerRuleForm.erpName = row.erpName
      this.addCustomerRuleForm.enterpriseCode = row.enterpriseCode
    },
    // 添加客源规则
    onSubmitCustomerRule() {
      addEnterpriseCustomerRule(this.addCustomerRuleForm)
        .then(response => {
          this.$message({ message: '客源添加规则成功', type: 'success' })
        })
      this.addCustomerRuleVisible = false
    },
    // 打开客源弹出框
    showCustomerRule(row) {
      // 请求获取规则
      const ruleParams = {
        comeFrom: 'FRONTEND',
        filter: {
          enterpriseCode: row.enterpriseCode,
          erpName: row.erpName
        }
      }
      queryEnterpriseCustomerRule(ruleParams)
        .then(response => {
          // this.ruleTotal = response.data.totalCount
          this.ruleData = response.data.list
        })
      console.log('ruleData: ', this.ruleData)
      this.transferCustomerRuleDialogVisible = true
    },
    // 创建其它清洗任务
    createOtherTask(row, transferType) {
      const taskData = {
        comeFrom: 'FRONTEND',
        tasks: [{
          taskBelong: 'ENTERPRISE_TRANSFER',
          taskType: transferType,
          erpName: row.erpName,
          enterpriseCode: row.enterpriseCode
        }]
      }
      createTaskInfo(taskData)
        .then(response => {
          this.$message({ message: '创建成功', type: 'success' })
          console.log(response.data)
        })
    }
  }
}
</script>
<style>
.msgBox {
  width: 60%;
}
.red-text {
  color: red;
}
.divider {
  margin-top: 12px;
  margin-bottom: 12px;
  border-top: 1px solid #ccc;
}
</style>
