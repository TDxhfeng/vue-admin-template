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
            <el-select v-model="searchForm.erpName" placeholder="选择ERP" style="width: 150px;" clearable filterable @change="resetCode">
              <el-option v-for="option in enterpriseOptions" :key="option.erpName" :label="option.erpCnName" :value="option.erpName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业号" prop="enterpriseCode" :rules="[{ required: true, message: '请输入企业号', trigger: 'blur' }]">
            <el-select v-model="searchForm.enterpriseCode" placeholder="选择企业" style="width: 150px;" clearable filterable>
              <el-option v-for="value in codes" :key="value" :label="value" :value="value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="外部Id" prop="houseId">
            <el-input v-model="searchForm.houseId" style="width: 150px;" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="房源编号" prop="houseNo">
            <el-input v-model="searchForm.houseNo" style="width: 150px;" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="小鹿编号" prop="teamHouseCode">
            <el-input v-model="searchForm.teamHouseCode" style="width: 150px;" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="经纪人" prop="userNames">
            <el-input v-model="searchForm.userNames" style="width: 150px;" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="小区" prop="communityName">
            <el-input v-model="searchForm.communityName" style="width: 150px;" clearable />
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
      <el-table-column label="爬取时间" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.createTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="原系统相关人" width="300">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.allUsers" :key="index">
            <span style="color: #FF0000">{{ item.userFieldName }}:</span><span>{{ item.userName }}</span><span style="color: #999; margin: 0 4px;">|</span><span style="color: #FF0000">部门:</span><span>{{ item.userDepartment }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="企业号">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column> -->
      <el-table-column label="小鹿编号" width="110">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.teamHouseCode">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.teamHouseCode }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="原系统房源ID" width="110">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.houseId">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.houseId }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="原系统房源编号" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.houseNo">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.houseNo }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="放盘类型">
        <template slot-scope="scope">
          {{ scope.row.offerType }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="城市">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column> -->
      <el-table-column label="房源状态">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="行政区">
        <template slot-scope="scope">
          {{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column label="片区">
        <template slot-scope="scope">
          {{ scope.row.subArea }}
        </template>
      </el-table-column>
      <el-table-column label="小区名">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.communityName">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.communityName }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="楼栋名称">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.buildName">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.buildName }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="单元名称">
        <template slot-scope="scope">
          {{ scope.row.unitName }}
        </template>
      </el-table-column>
      <el-table-column label="楼层">
        <template slot-scope="scope">
          {{ scope.row.floorNum }}
        </template>
      </el-table-column>
      <el-table-column label="房间号">
        <template slot-scope="scope">
          {{ scope.row.roomNum }}
        </template>
      </el-table-column>
      <el-table-column label="面积">
        <template slot-scope="scope">
          {{ scope.row.buildArea }}
        </template>
      </el-table-column>
      <el-table-column label="套内面积">
        <template slot-scope="scope">
          {{ scope.row.internalBuildArea }}
        </template>
      </el-table-column>
      <el-table-column label="户型(室厅卫阳)">
        <template slot-scope="scope">
          {{ scope.row.houseType.join("-") }}
        </template>
      </el-table-column>
      <el-table-column label="朝向">
        <template slot-scope="scope">
          {{ scope.row.direction }}
        </template>
      </el-table-column>
      <el-table-column label="房屋类型">
        <template slot-scope="scope">
          {{ scope.row.propertyType }}
        </template>
      </el-table-column>
      <el-table-column label="装修情况">
        <template slot-scope="scope">
          {{ scope.row.decoration }}
        </template>
      </el-table-column>
      <el-table-column label="放盘时间">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.offerTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.offerTime }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="底价">
        <template slot-scope="scope">
          {{ scope.row.floorSalePrice }}
        </template>
      </el-table-column>
      <el-table-column label="售价">
        <template slot-scope="scope">
          {{ scope.row.salePrice }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="售维护人">
        <template slot-scope="scope">
          {{ scope.row.saleUser }}
        </template>
      </el-table-column>
      <el-table-column label="售维护人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.saleUserDepartment }}
        </template>
      </el-table-column> -->
      <el-table-column label="租价">
        <template slot-scope="scope">
          {{ scope.row.rentPrice }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="租期到期时间" width="110">
        <template slot-scope="scope">
          {{ scope.row.rentDaysRemaining }}
        </template>
      </el-table-column>
      <el-table-column label="租维护人">
        <template slot-scope="scope">
          {{ scope.row.rentUser }}
        </template>
      </el-table-column>
      <el-table-column label="租维护人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.rentUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="公盘部门">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.publicDepartment">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.publicDepartment }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="录入人">
        <template slot-scope="scope">
          {{ scope.row.inputUser }}
        </template>
      </el-table-column>
      <el-table-column label="录入人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.inputUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="开盘人">
        <template slot-scope="scope">
          {{ scope.row.openUser }}
        </template>
      </el-table-column>
      <el-table-column label="开盘人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.openUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="钥匙人">
        <template slot-scope="scope">
          {{ scope.row.keyUser }}
        </template>
      </el-table-column>
      <el-table-column label="钥匙人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.keyUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="实勘人">
        <template slot-scope="scope">
          {{ scope.row.imgUser }}
        </template>
      </el-table-column>
      <el-table-column label="实勘人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.imgUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="私盘人">
        <template slot-scope="scope">
          {{ scope.row.privateUser }}
        </template>
      </el-table-column>
      <el-table-column label="私盘人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.privateUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="委托人">
        <template slot-scope="scope">
          {{ scope.row.attorneyUser }}
        </template>
      </el-table-column>
      <el-table-column label="委托人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.attorneyUserDepartment }}
        </template>
      </el-table-column> -->
      <el-table-column label="委托类型">
        <template slot-scope="scope">
          {{ scope.row.attorneyType }}
        </template>
      </el-table-column>
      <el-table-column label="委托时间">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.delegateDate">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.delegateDate }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="是否有钥匙" width="110">
        <template slot-scope="scope">
          {{ scope.row.hasKey }}
        </template>
      </el-table-column>
      <el-table-column label="钥匙编号">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.keyNo">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.keyNo }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="业主信息" width="300">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.ownerPhoneList" :key="index">
            <span>{{ item.name }}</span><span style="color: #999; margin: 0 4px;">/</span><span>{{ item.phone }}</span>
            <!--换行组件 <el-divider v-if="index < scope.row.ownerPhoneList.length - 1" content-position="center">|</el-divider> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.remark">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="现状">
        <template slot-scope="scope">
          {{ scope.row.current }}
        </template>
      </el-table-column>
      <el-table-column label="来源">
        <template slot-scope="scope">
          {{ scope.row.source }}
        </template>
      </el-table-column>
      <el-table-column label="公私盘">
        <template slot-scope="scope">
          {{ scope.row.property }}
        </template>
      </el-table-column>
      <el-table-column label="等级" width="100">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="scope">
          {{ scope.row.tag }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="合租房间号" width="110">
        <template slot-scope="scope">
          {{ scope.row.flatShareNum }}
        </template>
      </el-table-column> -->
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
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'
import { queryHouseList } from '@/api/enterprise/house'

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
      enterpriseOptions: []
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
      if (this.searchForm.userNames) {
        filter.userNames = this.searchForm.userNames
      }
      if (this.searchForm.communityName) {
        filter.communityName = this.searchForm.communityName
      }

      if (this.searchForm.houseId) {
        filter.houseId = this.searchForm.houseId
      }

      if (this.searchForm.houseNo) {
        filter.houseNo = this.searchForm.houseNo
      }
      if (this.searchForm.teamHouseCode) {
        filter.teamHouseCode = this.searchForm.teamHouseCode
      }

      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode

      this.listLoading = true
      queryHouseList(params)
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
