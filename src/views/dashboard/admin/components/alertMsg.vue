<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">告警信息统计</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <div class="select-wrapper" />
      <div class="table-wrapper">
        <base-table :border="false" :table-height="'100%'" :table-data="tableData" :table-config="tableConfig" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import BaseTable from '@/components/baseTable'
import { getAlertRecord } from '@/api/home'
import './style/index.scss'
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      tableData: [],
      tableConfig: [
        {
          prop: 'officeName',
          label: '所属单位',
          align: 'center',
          width: ''
        },
        {
          prop: 'location',
          label: '位置',
          align: 'center',
          width: ''
        },
        {
          prop: 'alertMsg',
          label: '报警信息',
          align: 'center',
          width: '='
        },
        {
          prop: 'alertTime',
          label: '报警时间',
          align: 'center',
          width: ''
        }
      ]
    }
  },
  created() {
    this._getAlertRecord()
  },
  methods: {
    _getAlertRecord() {
      getAlertRecord().then((res) => {
        if (res.data) {
          this.tableData = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  .el-main {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 16px 0 10px;
    border: 1px solid #0180ff;
    background-color: #080d4f;
    overflow: hidden;
    .select-wrapper{
      display: flex;
      justify-content: flex-end;
      padding: 5px 0 3px 0;
    }
    .table-wrapper{
      flex:1;
    }
  }
}
</style>
