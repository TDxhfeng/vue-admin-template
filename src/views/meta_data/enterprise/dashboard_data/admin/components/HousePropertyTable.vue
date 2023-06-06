<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="房源属性" min-width="50">
      <template slot-scope="scope">
        {{ scope.row.houseProperty }}
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
        totalType: 'HOUSE_PROPERTY'
      }
      totalEnterpriseHouse(params)
        .then(response => {
          this.list = response.data.list
        })
    }
  }
}
</script>
