<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">监管部门绩效综合排名</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <base-table class="table-wrapper" :border="false" :table-data="tableData" :table-height="'100%'" :table-config="tableConfig" />
    </el-main>
  </el-container>
</template>

<script>
import BaseTable from '@/components/baseTable'
import { getDirectchkcount } from '@/api/home'
import './style/index.scss'
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      tableData: [
      ],
      tableConfig: [
        {
          prop: 'areaName',
          label: '监管部门',
          align: 'center',
          width: ''
        },
        {
          prop: 'total',
          label: '监管单位数',
          align: 'center',
          width: ''
        },
        {
          prop: 'onlineCount',
          label: '检查单位数',
          align: 'center',
          width: ''
        },
        {
          prop: 'onlinePercent',
          label: '检查率',
          align: 'center',
          width: ''
        },
        {
          prop: 'offlineCount',
          label: '现场检查单位数',
          align: 'center',
          width: '120px'
        },
        {
          prop: 'offlinePercent',
          label: '检查率',
          align: 'center',
          width: ''
        }
      ]
    }
  },
  created() {
    this._getDirectchkcount()
  },
  methods: {
    accMul(arg1, arg2) {
      var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString()
      // eslint-disable-next-line no-empty
      try { m += s1.split('.')[1].length } catch (e) {}
      // eslint-disable-next-line no-empty
      try { m += s2.split('.')[1].length } catch (e) {}
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    },
    _getDirectchkcount() {
      getDirectchkcount().then((res) => {
        res.data.list.forEach((item) => {
          this.tableData.push(Object.assign({}, item, {
            onlinePercent: this.accMul(item.onlinePercent, 100) + '%',
            offlinePercent: this.accMul(item.offlinePercent, 100) + '%'
          }))
        })
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
    padding: 0;
    border: 1px solid #0180ff;
    background-color: #080d4f;
    overflow: hidden;
    .table-wrapper{
      height: 100%;
      // display: flex;
      // flex-direction: column;
    }
  }
}
</style>
