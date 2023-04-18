<template>
  <div class="app-container">
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="ERP名称" prop="erpName" :rules="[{ required: true, message: '请输入ERP名称', trigger: 'blur' }]">
            <el-input v-model="searchForm.erpName" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业号" prop="enterpriseCode" :rules="[{ required: true, message: '请输入企业号', trigger: 'blur' }]">
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="800"
    >
      <el-table-column label="企业号">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="原系统房源ID" width="110">
        <template slot-scope="scope">
          {{ scope.row.houseId }}
        </template>
      </el-table-column>
      <el-table-column label="原系统房源编号" width="120">
        <template slot-scope="scope">
          {{ scope.row.houseNo }}
        </template>
      </el-table-column>
      <el-table-column label="放盘类型">
        <template slot-scope="scope">
          {{ scope.row.offerType }}
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
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
          {{ scope.row.communityName }}
        </template>
      </el-table-column>
      <el-table-column label="楼栋名称">
        <template slot-scope="scope">
          {{ scope.row.buildName }}
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
      <el-table-column label="户型(室)">
        <template slot-scope="scope">
          {{ scope.row.houseType[0] }}
        </template>
      </el-table-column>
      <el-table-column label="户型(厅)">
        <template slot-scope="scope">
          {{ scope.row.houseType[1] }}
        </template>
      </el-table-column>
      <el-table-column label="户型(卫)">
        <template slot-scope="scope">
          {{ scope.row.houseType[2] }}
        </template>
      </el-table-column>
      <el-table-column label="户型(阳)">
        <template slot-scope="scope">
          {{ scope.row.houseType[3] }}
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
          {{ scope.row.offerTime }}
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
      <el-table-column label="售维护人">
        <template slot-scope="scope">
          {{ scope.row.saleUser }}
        </template>
      </el-table-column>
      <el-table-column label="售维护人部门" width="110">
        <template slot-scope="scope">
          {{ scope.row.saleUserDepartment }}
        </template>
      </el-table-column>
      <el-table-column label="租价">
        <template slot-scope="scope">
          {{ scope.row.rentPrice }}
        </template>
      </el-table-column>
      <el-table-column label="租期到期时间" width="110">
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
          {{ scope.row.publicDepartment }}
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
      </el-table-column>
      <el-table-column label="委托类型">
        <template slot-scope="scope">
          {{ scope.row.attorneyType }}
        </template>
      </el-table-column>
      <el-table-column label="委托时间">
        <template slot-scope="scope">
          {{ scope.row.delegateDate }}
        </template>
      </el-table-column>
      <el-table-column label="是否有钥匙" width="110">
        <template slot-scope="scope">
          {{ scope.row.hasKey }}
        </template>
      </el-table-column>
      <el-table-column label="钥匙编号">
        <template slot-scope="scope">
          {{ scope.row.keyNo }}
        </template>
      </el-table-column>
      <el-table-column label="业主信息">
        <template slot-scope="scope">
          {{ scope.row.ownerPhoneList }}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
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
      <el-table-column label="等级">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="scope">
          {{ scope.row.tag }}
        </template>
      </el-table-column>
      <el-table-column label="合租房间号" width="110">
        <template slot-scope="scope">
          {{ scope.row.flatShareNum }}
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
      }
    }
  },
  created() {},
  methods: {
    fetchData() {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          const params = {
            comeFrom: 'FRONTEND',
            erpName: this.searchForm.erpName,
            enterpriseCode: this.searchForm.enterpriseCode,
            filter: {
              page: this.page,
              size: this.pageSize
            }
          }
          this.listLoading = true
          queryHouseList(params)
            .then(response => {
              this.total = response.data.totalCount
              this.list = response.data.list
            })
            .finally(() => {
              this.listLoading = false
            })
        } else {
          return false
        }
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
    }
  }
}
</script>
