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
            <el-select
              v-model="searchForm.erpName"
              style="width: 150px;"
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
          <el-form-item label="企业号" prop="enterpriseCode" :rules="[{ required: true, message: '请输入企业号', trigger: 'blur' }]">
            <el-input v-model="searchForm.enterpriseCode" style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="房源ID" prop="houseId">
            <el-input v-model="searchForm.houseId" style="width: 180px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" :disabled="!searchForm.erpName || !searchForm.enterpriseCode" @click="fetchData">搜索</el-button>
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
      <el-table-column label="企业号" width="100">
        <template slot-scope="scope">
          {{ scope.row.enterpriseCode }}
        </template>
      </el-table-column>
      <el-table-column label="原系统房源ID" width="200">
        <template slot-scope="scope">
          {{ scope.row.houseId }}
        </template>
      </el-table-column>
      <el-table-column label="上传人" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.uploadUser">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.uploadUser }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="上传人部门" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.uploadUserDepartment">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.uploadUserDepartment }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.uploadTime }}
        </template>
      </el-table-column>
      <el-table-column label="视频标签" width="100">
        <template slot-scope="scope">
          {{ scope.row.tag }}
        </template>
      </el-table-column>
      <el-table-column label="视频链接" width="100">
        <template slot-scope="scope">
          <el-link :href="scope.row.url" target="_blank" type="primary">跳转</el-link>
        </template>
      </el-table-column>
      <el-table-column label="爬取时间" width="200">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.createTime">
            <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.createTime }}</div>
          </el-tooltip>
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
import { queryEnterpriseHouseVideo } from '@/api/enterprise/enterprise_info'
import { erpOptions } from '@/store/constants'

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
      erpOptions: erpOptions
    }
  },
  created() {},
  methods: {
    fetchData() {
      const filter = {
        page: this.page,
        size: this.pageSize
      }

      if (this.searchForm.houseId) {
        filter.houseId = this.searchForm.houseId
      }

      const params = {
        comeFrom: 'FRONTEND',
        filter: filter
      }
      params.erpName = this.searchForm.erpName
      params.enterpriseCode = this.searchForm.enterpriseCode

      this.listLoading = true
      queryEnterpriseHouseVideo(params)
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
    }
  }
}
</script>
