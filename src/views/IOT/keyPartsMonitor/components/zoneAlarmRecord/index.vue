<template>
  <el-dialog class="dark" title="报警记录" :visible.sync="dialogVisible" width="744px">
    <div name="title" class="dialog-title">报警记录</div>
    <div ref="content" class="dialog-content zoneAlertRecord">
      <div class="form-wrapper">
        <el-form ref="form" inline :model="alertData" :disabled="true">
          <el-col :span="12">
            <el-form-item label="防区编号:">
              <el-input v-model="zoneData.areaId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称:">
              <el-input v-model="zoneData.devName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警时间:">
              <el-date-picker
                v-model="alertData.lastTime"
                type="datetime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装位置:">
              <el-input v-model="zoneData.location" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警内容:">
              <el-input v-model="alertData.lastDesc" />
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <el-header>历史报警记录</el-header>
      <baseTable v-loading="listLoading" class="table" :border="false" :table-data="alertData.list" :table-config="tableConfig" />
      <pagination
        v-show="total>0"
        class="pagination"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <div name="footer" class="dialog-footer">
      <el-button type="primary" @click="hide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import './style/index.scss'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
export default {
  name: 'ZoneAlarmRecord',
  components: {
    Pagination,
    BaseTable
  },
  props: {
    alertData: {
      type: Object,
      default: () => {}
    },
    zoneData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        devid: ''
      },
      form: {
        areaId: '',
        devName: '',
        createDate: '',
        location: '',
        alertMsg: ''
      },
      tableData: [],
      tableConfig: [
        {
          prop: 'areano',
          label: '防区编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'desc',
          label: '报警内容',
          align: 'left',
          width: ''
        },
        {
          prop: 'time',
          label: '时间',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    handleFilter(data) {
      console.log(data)
    },
    getList() {
      this.listLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
