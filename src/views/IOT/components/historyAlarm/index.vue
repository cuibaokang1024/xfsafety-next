<template>
  <el-dialog class="dark historyAlarm" title="告警处理" :visible.sync="dialogVisible" width="987px">
    <div name="title" class="dialog-title">历史报警</div>
    <div ref="content" class="dialog-content">
      <el-container>
        <el-header style="height: auto;">
          <search-form :form-option="searchFormOption" @search="handleFilter" />
        </el-header>
        <el-main>
          <div class="title">督办及处置记录</div>
          <baseTable class="table" :border="false" :table-data="recordData" :table-config="recordConfig" />
        </el-main>
        <el-main>
          <div class="title">报警信息</div>
          <baseTable class="table" :border="false" :table-data="alarmData" :table-config="alarmConfig" />
        </el-main>
      </el-container>
    </div>
    <div name="footer" class="dialog-footer">
      <el-button type="primary" @click="hide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAlertRecord } from '@/api/iot'
import BaseTable from '@/components/baseTable'
import SearchForm from '@/components/searchForm'
export default {
  name: 'HistoryAlarm',
  components: {
    BaseTable,
    SearchForm
  },
  props: {
    devCategory: {
      type: Number,
      default: 0
    },
    // 是否更新数据
    isResetFlag: {
      type: Boolean,
      default: false
    },
    isShowCategory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const category = this.devCategory
    const config = this.isShowCategory ? [
      {
        type: 'datetimerange',
        label: '报警时间',
        name: 'date',
        placeholder: '',
        valueFormat: 'yyyy-M-dd HH:mm:ss',
        labelWidth: '70px'
      },
      {
        type: 'text',
        label: '单位名称',
        name: 'name',
        placeholder: '请输入单位名称',
        labelWidth: '70px'
      },
      {
        type: 'select',
        label: '报警类型:',
        name: 'category',
        labelWidth: '70px',
        dataList: [
          {
            index: 0,
            text: '电'
          },
          {
            index: 1,
            text: '水'
          },
          {
            index: 2,
            text: '烟感'
          },
          {
            index: 4,
            text: '燃气'
          }
        ]

      }
    ] : [
      {
        type: 'datetimerange',
        label: '报警时间',
        name: 'date',
        placeholder: '',
        valueFormat: 'yyyy-M-dd HH:mm:ss',
        labelWidth: '70px'
      },
      {
        type: 'text',
        label: '单位名称',
        name: 'name',
        placeholder: '请输入单位名称',
        labelWidth: '70px'
      }
    ]
    return {
      dialogVisible: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        category: category,
        startDate: '',
        endDate: '',
        officeName: ''
      },
      recordData: [],
      searchFormOption: {
        config
      },
      recordConfig: [
        {
          prop: 'time',
          label: '',
          align: 'right',
          width: ''
        },
        {
          prop: 'content',
          label: '',
          align: 'left',
          width: ''
        }
      ],
      alarmConfig: [
        {
          prop: 'id',
          label: '单位名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'devId',
          label: '设备id',
          align: 'center',
          width: ''
        },
        {
          prop: 'time',
          label: '报警时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'msg',
          label: '报警信息',
          align: 'center',
          width: ''
        }
      ],
      alarmData: []
    }
  },
  watch: {
    isResetFlag() {
      this._getAlertRecord()
    }
  },
  created() {

  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    formatData(data) {
      const list = []
      const category = this.listQuery.category
      data.forEach((item) => {
        let msg = ''
        if (category === 0 || category === 1) {
          msg = `${item.addr}${item.sensor}发生报警，报警值：${item.data}${item.unit}`
        }
        if (category === 2 || category === 3) {
          msg = `${item.addr}发生报警`
        }
        if (category === 4) {
          msg = `${item.reportType}${item.addr}发生${item.alarmType}`
        }
        if (category === 5) {
          msg = `${item.addr}${item.sensor}发生报警`
        }
        list.push({
          officeName: item.officeName,
          devId: item.devId,
          time: item.time,
          msg: msg

        })
      })
      return list
    },
    handleFilter(data) {
      this.listQuery = Object.assign({}, this.listQuery, {
        startDate: data.date[0],
        endDate: data.date[1],
        officeName: data.name
      })
      this._getAlertRecord()
    },
    _getAlertRecord() {
    //   this.listLoading = true
      getAlertRecord(this.listQuery).then((res) => {
        if (res.data) {
          const data = res.data.list
          if (!data.length > 0) {
            return
          }
          this.alarmData = this.formatData(data)
          this.recordData = res.data.alertSupers
        //   this.listLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-container{
        .el-header{
            padding: 0;
           .el-form{
              display: flex;
            flex-wrap: wrap;
           }
        }
        .el-main{
            .title{
                font-size: 14px;
                font-weight: bold;
                color: #fff;
            }
        }
    }
</style>
