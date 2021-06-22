<template>
  <el-dialog
    v-if="dialogVisible"
    class="custom-form violet"
    :title="formModel.title"
    :visible.sync="dialogVisible"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :width="width"
    :height="height"
    :close-on-click-modal="false"
  >
    <div slot="title" class="dialog-title">{{ formModel.title }}</div>
    <div ref="content" class="dialog-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in deviceTypeList"
          :key="item.id"
          :label="item.label"
          :name="String(item.value)"
        >
          <BaseTable
            :loading="listLoading"
            :table-config="tableConfig"
            :table-data="tableData"
            :table-height="360"
            :border="false"
          />
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="_handleOfficeDeviceList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleHide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { handleDeviceTypeList, handleOfficeDeviceList } from '@/api/agent'

import './index.scss'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'

export default {
  name: 'CustomForm',
  components: {
    BaseTable,
    Pagination
  },
  props: {
    width: {
      type: String,
      default: '900px'
    },
    height: {
      type: String,
      default: '650px'
    },
    formModel: {
      type: Object,
      default: () => {}
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: '',
      listLoading: false,
      listQuery: {
        officeId: '',
        deviceType: '',
        page: 1,
        limit: 10
      },
      tableConfig: [
        {
          prop: 'devId',
          label: '设备号',
          align: 'left',
          width: ''
        },
        {
          prop: 'iotcardId',
          label: '物联网卡号',
          align: 'left',
          width: ''
        },
        {
          prop: 'sensorCat',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'location',
          label: '安装位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'expireTime',
          label: '到期时间',
          align: 'left',
          width: ''
        }
      ],
      total: 0,
      deviceTypeList: [],
      tableData: []
    }
  },
  watch: {
    'formModel.isResetFormFlag': {
      handler: function() {
        this.listQuery.officeId = this.formModel.id
        this._handleOfficeDeviceList()
      },
      deep: true
    }
  },
  created() {
    this._handleDeviceTypeList()
  },
  methods: {
    // 获取字典
    _handleDeviceTypeList() {
      handleDeviceTypeList().then(res => {
        if (res.data) {
          this.activeName = res.data[0].value
          this.listQuery.deviceType = res.data[0].value
          this.deviceTypeList = res.data
        }
      })
    },
    // 获取列表
    _handleOfficeDeviceList() {
      handleOfficeDeviceList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    handleClick(tab, event) {
      this.listQuery.deviceType = tab.name
      this._handleOfficeDeviceList()
    },
    handleShow() {
      this.dialogVisible = true
    },
    handleHide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
