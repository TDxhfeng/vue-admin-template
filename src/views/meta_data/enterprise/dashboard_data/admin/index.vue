<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <el-select v-model="searchForm.erpName" placeholder="选择ERP" clearable filterable @change="resetCode">
          <el-option v-for="option in enterpriseOptions" :key="option.erpName" :label="option.erpCnName" :value="option.erpName" />
        </el-select>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <el-select v-model="searchForm.enterpriseCode" placeholder="选择企业" clearable filterable>
          <el-option v-for="value in codes" :key="value" :label="value" :value="value" />
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <house-status-table ref="HouseStatusTable" :search-form="searchForm" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <house-property-type-table ref="housePropertyTypeTable" :search-form="searchForm" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <house-offer-type-table ref="HouseOfferTypeTable" :search-form="searchForm" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <house-tags-table ref="HouseTagsTable" :search-form="searchForm" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryEnterpriseCode } from '@/api/enterprise/enterprise_info'
import HousePropertyTypeTable from './components/HousePropertyTypeTable'
import HouseOfferTypeTable from './components/HouseOfferTypeTable'
import HouseStatusTable from './components/HouseStatusTable'
import HouseTagsTable from './components/HouseTagsTable'

export default {
  name: 'DashboardAdmin',
  components: {
    'house-property-type-table': HousePropertyTypeTable,
    'house-offer-type-table': HouseOfferTypeTable,
    'house-status-table': HouseStatusTable,
    'house-tags-table': HouseTagsTable
  },
  data() {
    return {
      searchForm: {
        erpName: '',
        enterpriseCode: ''
      },
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
        // 每当searchForm发生变化时，重新调用totalEnterpriseHouse函数获取数据
        if (newValue.erpName && newValue.enterpriseCode) {
          this.$refs.housePropertyTypeTable.fetchData(newValue.erpName, newValue.enterpriseCode)
          this.$refs.HouseOfferTypeTable.fetchData(newValue.erpName, newValue.enterpriseCode)
          this.$refs.HouseStatusTable.fetchData(newValue.erpName, newValue.enterpriseCode)
          this.$refs.HouseTagsTable.fetchData(newValue.erpName, newValue.enterpriseCode)
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
    // 找出erp对应的codes
    erpCodeMap(erp) {
      const map = {}
      const enterpriseOptions = this.enterpriseOptions
      for (let i = 0; i < enterpriseOptions.length; i++) {
        map[enterpriseOptions[i].erpName] = enterpriseOptions[i].codes
      }
      return map[erp]
    },
    // erp变更时清空codes
    resetCode() {
      this.searchForm.enterpriseCode = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
