<template>
  <div class="main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="list"
        :table-config="tableConfig"
        :border="false"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button
                icon="el-icon-document"
                type="info"
                circle
                @click.stop="handleCheckTraceView(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="_handlerChkPlanInfo"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <StaffWorkAlert ref="staffworkalert" :alert-data="alertData" />
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import { handlerChkPlanInfo } from '@/api/companyHome'

import '../style/notice.scss'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import StaffWorkAlert from '@/components/StaffWorkAlert'

export default {
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    StaffWorkAlert
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        userName: '',
        page: 1,
        pageSize: 10
      },
      total: 10,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '任务人:',
            name: 'userName',
            placeholder: '请输入任务人'
          }
        ]
      },
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'planName',
          label: '任务名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'planName',
          label: '任务名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'pointNum',
          label: '应巡查点',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkCount',
          label: '实际巡查点',
          align: 'left',
          width: ''
        },
        {
          prop: 'dangerNum',
          label: '发现隐患数',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkUserName',
          label: '检查人',
          align: 'left',
          width: ''
        },
        {
          prop: 'startDateTime',
          label: '开始时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'endDateTime',
          label: '结束时间',
          align: 'left',
          width: ''
        }
      ],
      list: [],
      alertData: {}
    }
  },
  created() {
    this._handlerChkPlanInfo()
  },
  methods: {
    // 获取列表
    _handlerChkPlanInfo() {
      handlerChkPlanInfo(this.listQuery).then(res => {
        this.list = res.data.listData.list
        this.total = res.data.listData.totalCount
      })
    },
    handleCheckTraceView(data) {
      this.alertData = data
      this.$refs.staffworkalert.handlerShow()
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerChkPlanInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: block;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #001647;
}
</style>
