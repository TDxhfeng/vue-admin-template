<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="放盘类型" min-width="50">
      <template slot-scope="scope">
        {{ scope.row.houseOfferType }}
      </template>
    </el-table-column>
    <el-table-column label="房源数量" align="center">
      <template slot-scope="scope">
        {{ scope.row.count }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { totalEnterpriseHouse } from '@/api/enterprise/enterprise_info'

export default {
  props: {
    erpName: {
      type: String,
      required: true
    },
    enterpriseCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    fetchData(erpName, enterpriseCode) {
      const params = {
        comeFrom: 'FRONTEND',
        enterpriseCode: enterpriseCode,
        erpName: erpName,
        totalType: 'HOUSE_OFFER_TYPE'
      }
      totalEnterpriseHouse(params)
        .then(response => {
          this.list = response.data.list
        })
    }
  }
}
</script>
