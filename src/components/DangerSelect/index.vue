<template>
  <div class="dangerSelect">
    <div class="select-wrapper">
      <el-select
        v-model="value"
        :popper-append-to-body="false"
        placeholder="请选择"
        :disabled="disabled"
        @focus="handleShow"
      >
        <el-option v-if="value !== -1" :value="value" :label="label" />
        <el-option v-else :value="-1" label="请选择" />
      </el-select>
      <el-button
        slot="append"
        class="select-btn"
        icon="el-icon-search"
        :disabled="disabled"
        @click="handleShow"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      class="dark dangerSelect-dialog"
      :visible.sync="dialogVisible"
      append-to-body
      width="860px"
    >
      <div slot="title" class="dialog-title">危化品列表</div>
      <div class="dialog-content">
        <div class="danger-content">
          <!-- 列表框 -->
          <div class="table-box">
            <BaseTable
              :loading="listLoading"
              :table-data="tableData"
              :table-config="tableConfig"
              :border="false"
              @handleSelectionChange="handleSelectionChange"
            />
          </div>
          <!-- 列表框 -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHide()">关 闭</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handleDangerList } from '@/api/danger'

import './index.scss'

import BaseTable from '@/components/baseTable'

export default {
  name: 'DangerSelect',
  components: {
    BaseTable
  },
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      multipleSelection: [],
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '危化品名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'inventory',
          label: '储量',
          align: 'left',
          width: ''
        },
        {
          prop: 'unitName',
          label: '单位',
          align: 'left',
          width: ''
        }
      ],
      tableData: []
    }
  },
  created() {
    this._handleDangerList()
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 列表
    _handleDangerList() {
      handleDangerList().then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      })
    },
    handleShow() {
      this.dialogVisible = true
    },
    handleHide() {
      this.dialogVisible = false
    },
    handleSubmit() {
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
          const { id, name, storageId } = data[0]
          this.$emit('update:value', id || storageId)
          this.$emit('update:label', name)
          this.$emit('update:data', data[0])
          this.handleHide()
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

<style lang="scss" scoped>
</style>
