<template>
  <div class="codeSelect">
    <div class="select-wrapper">
      <el-input
        v-model="value"
        :popper-append-to-body="false"
        placeholder="请选择"
        @focus="handlerShow"
      />
      <el-button slot="append" class="select-btn" icon="el-icon-search" @click="handlerShow" />
    </div>
    <el-dialog
      v-if="dialogCodeVisible"
      class="dark codeSelect-dialog"
      :visible.sync="dialogCodeVisible"
      append-to-body
      width="860px"
    >
      <div slot="title" class="dialog-title">设备注册列表</div>
      <div class="dialog-content">
        <div class="code-content">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-form
              ref="ruleForm"
              :inline="true"
              :model="ruleForm"
              class="demo-form-inline"
              label-width="100px"
            >
              <el-form-item label="安装单位名称:">
                <el-input v-model="ruleForm.name" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item label="ID:">
                <el-input v-model="ruleForm.id" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-refresh-left"
                  @click="resetForm('ruleForm')"
                >重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 搜索框 -->
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
          <div class="pagination-box">
            <Pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.pageSize"
            />
            <!-- @pagination="_handlerUnitRecordList" -->
          </div>
          <!-- 列表框 -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerHide()">关 闭</el-button>
        <el-button type="primary" @click="handlerSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import './index.scss'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  name: 'CodeSelect',
  components: {
    BaseTable,
    Pagination
  },
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: false,
      dialogCodeVisible: false,
      ruleForm: {
        name: '',
        id: ''
      },
      listQuery: {
        name: '',
        id: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      multipleSelection: [],
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'id',
          label: 'ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '安装单位名称',
          align: 'left',
          width: ''
        }
      ],
      tableData: [
        { id: '54400255', name: '沂水设备注册' },
        { id: '00001935010069', name: '深龙达物联信息有限公司' },
        { id: 'ME38174', name: '青岛市市立医院东院' }
      ]
    }
  },
  created() {},
  methods: {
    // 查询函数
    handleFilter() {
      this.listQuery = { ...this.ruleForm }
    },
    // 重置函数
    resetForm(formName) {
      this.ruleForm = {}
    },
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlerShow() {
      this.dialogCodeVisible = true
    },
    handlerHide() {
      this.dialogCodeVisible = false
    },
    handlerSubmit() {
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
          const id = data[0].id
          if (id) {
            this.$emit('update:value', id)
          }
          this.handlerHide()
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
