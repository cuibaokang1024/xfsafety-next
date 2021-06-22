<template>
  <div class="custom-detail">
    <div class="custom-title">
      <span>服务到期客户明细</span>
    </div>
    <div class="custom-table">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :table-height="'100%'"
        :border="false"
      >
        <el-table-column width="120" label="到期时间" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <span style="padding-left: 8px;">{{ row.expireTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="超期时间" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <span style="padding-left: 8px; color: #EF3434;">{{ `${row.expireDays}天` }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="primary"
              round
              @click="handleCustomDetail(row.officeId, row.name)"
            >明细</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="custom-form">
      <CustomForm ref="customForm" :form-model="formModel" />
    </div>
  </div>
</template>

<script>
import { handleAgentList } from '@/api/agent'
import { parseTime } from '@/utils'

import './index.scss'
import BaseTable from '@/components/baseTable'
import CustomForm from '@/components/CustomForm'

export default {
  name: 'CustomDetail',
  components: {
    BaseTable,
    CustomForm
  },
  data() {
    return {
      formModel: {
        isResetFormFlag: false,
        id: '',
        title: ''
      },
      listLoading: false,
      tableConfig: [
        {
          prop: 'name',
          label: '单位名称',
          align: 'left',
          width: ''
        }
      ],
      total: 0,
      tableData: []
    }
  },
  created() {
    this._handleAgentList()
  },
  methods: {
    // 获取列表
    _handleAgentList() {
      handleAgentList().then(res => {
        if (res.data) {
          this.tableData = res.data
          this.total = res.totalCount
        }
      })
    },
    // 查看明细
    handleCustomDetail(id, title) {
      this.formModel = {
        isResetFormFlag: !this.formModel.isResetFormFlag,
        id,
        title
      }
      this.$refs.customForm.handleShow()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
