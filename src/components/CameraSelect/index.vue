<template>
  <div class="cameraSelect">
    <div class="select-wrapper">
      <el-select
        v-model="value"
        :popper-append-to-body="false"
        placeholder="请选择"
        @focus="handleShow"
      >
        <el-option v-if="value !== -1" :value="value" :label="label" />
        <el-option v-else :value="-1" label="请选择" />
      </el-select>
      <el-button slot="append" class="select-btn" icon="el-icon-search" @click="handleShow" />
    </div>
    <el-dialog
      class="dark cameraSelect-dialog"
      :visible.sync="dialogVisible"
      append-to-body
      width="940px"
    >
      <div name="title" class="dialog-title">摄像机选择</div>
      <div class="dialog-content">
        <div
          v-loading="listLoading"
          class="camera-content"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
        >
          <div class="right-content">
            <!-- 搜索框 -->
            <div class="search-box">
              <el-form
                ref="ruleForm"
                class="demo-form-inline"
                :inline="true"
                :model="ruleForm"
                label-width="80px"
              >
                <el-form-item label="安装位置:">
                  <el-input v-model="ruleForm.location" placeholder="请输入安装位置" />
                </el-form-item>
                <el-form-item label="摄像机型号:">
                  <el-select v-model="ruleForm.sensorCat">
                    <el-option
                      v-for="item in sensorCatList"
                      :key="item.id"
                      :value="item.sensorCat"
                      :label="item.sensor"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-refresh-left"
                    @click="handleResetForm('ruleForm')"
                  >重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 搜索框 -->
            <!-- 列表框 -->
            <div class="table-box">
              <BaseTable
                :table-data="tableData"
                :table-height="'450'"
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
                @pagination="_handleCamSelectList"
              />
            </div>
            <!-- 列表框 -->
          </div>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handleHide()">关 闭</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handleCamSelectDict, handleCamSelectList } from '@/api/camera'

import './index.scss'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  name: 'CameraSelect',
  components: {
    BaseTable,
    Pagination
  },
  props: {
    officeId: {
      type: [Number, String],
      default: ''
    },
    value: {
      type: [Number, String],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      ruleForm: {
        location: '',
        sensorCat: ''
      },
      listQuery: {
        officeId: '',
        // location: '',
        // sensorCat: '',
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
          prop: 'devId',
          label: '设备ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'devName',
          label: '设备名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '单位名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'location',
          label: '安装位置',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      sensorCatList: []
    }
  },
  created() {
    this._handleCamSelectDict()
  },
  methods: {
    // 获取字典值
    _handleCamSelectDict() {
      handleCamSelectDict().then(res => {
        if (res) {
          this.sensorCatList = res.data
        }
      })
    },
    // 获取列表
    _handleCamSelectList() {
      this.listLoading = true
      handleCamSelectList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
        this.listLoading = false
      })
    },
    // 查询函数
    handleFilter() {
      this.listQuery = { ...this.listQuery, ...this.ruleForm }
      this._handleCamSelectList()
    },
    // 重置函数
    handleResetForm(formName) {
      this.ruleForm = {}
    },
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleShow() {
      this.dialogVisible = true
      this.listQuery.officeId = this.officeId
      this._handleCamSelectList()
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
          const id = data[0].id
          const name = data[0].devName
          if (id && name) {
            this.$emit('update:value', id)
            this.$emit('update:label', name)
          }
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
