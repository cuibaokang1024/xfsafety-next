<template>
  <div class="devIdSelect">
    <div class="select-wrapper">
      <el-input v-model="value" :disabled="true" @focus="show" />
      <el-button slot="append" class="select-btn" icon="el-icon-search" @click="show" />
    </div>
    <el-dialog class="devIdSelectDialog dark" v-model:visible="dialogTreeVisible" :append-to-body="true" width="850px">
      <div name="title" class="dialog-title">设备注册列表</div>
      <div class="dialog-content">
        <el-main>
          <SearchForm
            style="text-align: left; padding: 0;"
            :form-option="searchFormOption"
            @search="handleFilter"
          />
          <BaseTable
            ref="BaseTable"
            :loading="listLoading"
            :table-data="devIdList"
            :table-config="tableConfig"
            :border="false"
            :table-height="'397px'"
            :disabled-all-check="true"
            @handleSelectionChange="handleSelectionChange"
          />
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="listQuery.page"
            v-model:limit="listQuery.limit"
            @pagination="_getAgentDevRegList"
          />
        </el-main>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="handlerSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAgentDevRegList } from '@/api/devRegister'
import { mapGetters } from 'vuex'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  name: 'DevIdSelect',
  components: {
    SearchForm,
    BaseTable,
    Pagination
  },
  props: {
    devType: {
      type: String,
      default: -1 // 0电设备 1水设备 2烟感设备 3可燃气体 4信息传输装置
    },
    value: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      dialogTreeVisible: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        devid: ''
      },
      total: 0,
      devIdList: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: 'ID:',
            name: 'devId',
            placeholder: '请输入名称'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'devId',
          label: 'ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'createDate',
          label: '创建时间',
          align: 'left',
          width: ''
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'officeId'
    ])
  },
  created () {
    this._getAgentDevRegList()
  },
  methods: {
    _getAgentDevRegList () {
      getAgentDevRegList({ ...this.listQuery, deviceType: this.devType, officeId: this.officeId }).then(res => {
        if (res.data) {
          this.total = res.data.page.totalCount
          this.devIdList = res.data.page.list
        }
      })
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cellClass (row) {
      if (row.columnIndex === 0) {
        return 'disabledCheck'
      }
    },
    hide () {
      this.dialogTreeVisible = false
    },
    show () {
      if (this.disabled) {
        return false
      }
      if (this.officeId) {
        this._getAgentDevRegList()
        this.dialogTreeVisible = true
      }
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getAgentDevRegList()
    },
    handlerSubmit () {
      const data = this.multipleSelection
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (data.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          const id = data[0].devId
          if (id) {
            this.$emit('update:value', id)
          }
          this.hide()
        }
      } else {
        this.$message({
          message: '请选择数据!',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.devIdSelect {
  .select-wrapper {
    position: relative;
    width: 100%;

    .select-btn {
      position: absolute;
      right: 0;
      top: 0px;
      border: none;
      font-weight: bold;
      color: #97c1ff;
      background: #00479d;
      border: 1px solid #00479d;
    }
  }

  .content {
    width: 100%;
    height: 100%;

    .el-container {
      height: 100%;

      .el-main {
        padding: 0;
        height: 100%;
        overflow: hidden;

        .el-table{
          margin: 15px 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.devIdSelectDialog {
  .el-dialog__body {
    padding-top: 0!important;
  }
}
</style>
