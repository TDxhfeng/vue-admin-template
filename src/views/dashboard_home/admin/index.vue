<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :chart-data="monthTotalResult" />
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :chart-data="cityTotalResult" />
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :chart-data="levelTotalResult" />
    </el-row>
  </div>
</template>

<script>

import BarChart from './components/BarChart'
import { totalEnterprise } from '@/api/enterprise/enterprise_info'

// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165]
//     // actualData: [120, 82, 91, 154, 162, 140, 145]
//   }
// }

export default {
  name: 'DashboardAdmin',
  components: {
    BarChart
  },
  data() {
    return {
      cityTotalResult: {},
      levelTotalResult: {},
      monthTotalResult: {}
    }
  },
  created() {
    this.totalEnterprise()
  },
  methods: {
    totalEnterprise() {
      const params = {
        comeFrom: 'FRONTEND'
      }
      totalEnterprise(params)
        .then(response => {
          this.cityTotalResult = this.transferFormList(response.data.city)
          this.levelTotalResult = this.transferFormList(response.data.level)
          this.monthTotalResult = this.transferFormList(response.data.month)
        })
    },
    transferFormList(totalValues) {
      const map = {}
      const x = []
      const y = []
      for (let i = 0; i < totalValues.length; i++) {
        x.push(totalValues[i].key)
        y.push(totalValues[i].totalCount)
      }
      map['x'] = x
      map['y'] = y
      return map
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
