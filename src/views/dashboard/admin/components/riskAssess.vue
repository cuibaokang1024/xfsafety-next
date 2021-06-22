<template>
  <el-container class="home-box">
    <el-header height="26px">
      <span class="block" />
      <span class="text">单位风险评估汇总</span>
      <span class="tagging" />
    </el-header>
    <el-main>
      <div class="select-wrapper">
        <el-select v-model="listQuery.type" placeholder="请选择" @change="_getAssessmentcount()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="content">
        <div class="chart-wrapper">
          <PieChart
            id="riskAssessChart"
            width="100%"
            height="100%"
            :chart-data="pieData"
            @click="filterOfficeLevel"
          />
        </div>
        <div class="list">
          <ul
            v-scrollBottom="getMore"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div v-if="!officeList.length>0&&!loading" class="info">暂无数据</div>
            <li v-for="(item,index) in officeList" :key="item.id">
              <span class="ordinal">{{ index+1 }}</span>
              <span class="text">{{ item.name }}</span>
              <span class="grade">{{ item.totalScore }}</span>
            </li>
          </ul>
        </div>
      </div>

    </el-main>
  </el-container>
</template>

<script>
import './style/index.scss'
import PieChart from '@/components/Charts/pieChart'
import { getAssessmentcount, getAssessmentareacount } from '@/api/home'
import scrollBottom from '@/directive/scroll/index.js'
export default {
  components: {
    PieChart
  },
  directives: {
    scrollBottom
  },
  prop: {
    data: {
      type: Object,
      default: () => {}
    },
    navigatList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      navigatList_copy: [],
      listQuery: {
        type: 'highRisk',
        page: 1,
        limit: 5
      },
      total: 0,
      currPage: 0,
      officeList: [],
      officeLevel: [],
      options: [
        {
          value: 'highRisk',
          label: '火灾高危单位'
        },
        {
          value: 'importantCount',
          label: '重点单位'
        }
      ]
    }
  },
  computed: {
    pieData() {
      const data = []
      this.officeLevel.forEach((item) => {
        data.push({
          name: item.assessmentLevel,
          value: item.total
        })
      })
      const pieData = {
        unit: '家',
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          left: 'center',
          itemWidth: 20,
          itemHeight: 6,
          textStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: '',
          radius: ['50%', '70%'],
          center: ['50%', '35%'],
          data
        }]
      }
      return pieData
    }
  },
  created() {
    this._getAssessmentcount()
  },

  methods: {
    _getAssessmentcount() {
      this.loading = true
      this.listQuery.page = 1
      const name_navigat = this.getLabel(this.listQuery.type)
      const index1 = this.navigatList_copy.findIndex((item) => {
        return item.level === 6
      })
      const index2 = this.navigatList_copy.findIndex((item) => {
        return item.level === 2
      })
      if (index1 > 0) {
        this.navigatList_copy.splice(index1, 1)
      }
      if (index2 > 0) {
        this.navigatList_copy.splice(index2, 1)
      }
      this.navigatList_copy.push({
        level: 2,
        name: name_navigat
      })
      getAssessmentcount(this.listQuery).then((res) => {
        if (res.data) {
          this.officeList = res.data.info.listPage.list
          this.officeLevel = res.data.info.countList
          this.total = res.data.info.listPage.totalCount
          this.currPage = res.data.info.listPage.currPage
          this.loading = false
        }
      })
    },
    getMore() {
      if (this.officeList.length < this.total) {
        this.listQuery.page = this.currPage + 1
        getAssessmentcount(this.listQuery).then((res) => {
          if (res.data) {
            this.officeList = this.officeList.concat(res.data.info.listPage.list)
          }
        })
      }
    },
    getLabel(value) {
      const data = this.options.filter((item) => {
        return item.value === value
      })
      return data[0].label
    },
    filterOfficeLevel(data) {
      const name = data.data.name
      this.navigatList_copy = []
      const name_navigat = this.getLabel(this.listQuery.type)
      this.navigatList_copy.push({
        level: 1,
        name: '单位风险评估汇总'
      }, {
        level: 2,
        name: name_navigat
      },
      {
        level: 6,
        name: `${name}级企业`
      }
      )
      this.$emit('update:navigatList', this.navigatList_copy)
      getAssessmentareacount({
        type: this.listQuery.type,
        assessmentLevel: name
      }).then((res) => {
        if (res.data) {
          const data = {
            areaOfficeList: res.data.info.areaList,
            areaList: res.data.info.areaCount,
            title: `${name}级企业列表`
          }
          this.$emit('filterOfficeLevel', data)
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
    border: 1px solid #0180ff;
    padding: 0 8px 18px 0;
    background-color: #080d4f;
    overflow: hidden;
    .content{
        display: flex;
        flex: 1;
        height: calc(100% - 37px);
    }
    .select-wrapper{
        display: flex;
        justify-content: flex-end;
        padding: 5px 0 10px 0;
    }
    .list{
        flex:3;
        border: 1px solid #01ccff;
        overflow: hidden;
        ul{
          padding: 0;
          overflow: hidden;
          overflow-y: auto;
          height: 100%;
          width: 100%;
          padding-right: 20px;
          box-sizing: content-box;
          position: relative;
          .info{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%,-50%,0);
            color: #97c1ff;
          }
          >li{
            color:#97c1ff;
            display: flex;
            padding: 0 20px;
            margin-top: 16px;
            align-items: center;
            cursor: pointer;
            .ordinal{
              width: 20px;
              height: 20px;
              background-color: #eb6100;
              border-radius: 50%;
              text-align: center;
              line-height: 20px;
              color: #fff;
            }
            .text{
              margin-left: 9px;
              flex: 1;
              font-size: 14px;
            }
            .grade{
              color: #ff7878;
            }
          }
        }

    }
    .chart-wrapper {
      flex: 2;
    }
  }
}
</style>
