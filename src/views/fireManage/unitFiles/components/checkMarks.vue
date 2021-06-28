<template>
  <div class="form-box staffworkalert-container">
    <div name="title" class="dialog-title">检查痕迹</div>
    <!-- 内容组件 -->
    <div class="staffworkalert-content rulesForm">
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <el-divider />
      <div v-if="traceData" class="content-outer">
        <div v-for="data in traceData" :key="data.id" class="content-item">
          <div class="item-title">
            <span>{{ data.title }}</span>
          </div>
          <ul class="item-list">
            <li v-for="item in data.list" :key="item.id">
              <TraceItem
                :trace-data="item"
                @handlerTraceDetailView="handlerTraceDetailView(item.pointId)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <StaffWorkItem
      ref="StaffWorkItem"
      :mation-data="mationData"
      :table-list="tableList"
      :danger-data="dangerData"
    />
  </div>
</template>

<script>
import {
  handlerChkPlanPointInfo
} from '@/api/companyHome'
import '@/components/StaffWorkAlert/style/index.scss'
import TraceItem from '@/components/TraceItem'
import SearchForm from '@/components/searchForm'
import StaffWorkItem from '@/components/StaffWorkAlert/StaffWorkItem'

export default {
  components: {
    SearchForm,
    StaffWorkItem,
    TraceItem
  },
  data () {
    return {
      listLoading: false,
      listQuery: {
        userName: '',
        page: 1,
        pageSize: 10
      },
      mationData: {},
      tableList: [],
      dangerData: [],
      traceData: [
        {
          title: '巡检',
          list: [
            {
              name: ''
            }
          ]
        }
      ],
      total: 10,
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '检查任务:',
            name: 'userName',
            placeholder: '请选择',
            dataList: []
          },
          {
            type: 'daterange',
            label: '检查时间:',
            name: 'userName',
            placeholder: '请选择'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'planName',
          label: '任务名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'pointNum',
          label: '应巡查点',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkCount',
          label: '实际巡查点',
          align: 'left',
          width: ''
        },
        {
          prop: 'dangerNum',
          label: '发现隐患数',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkUserName',
          label: '检查人',
          align: 'left',
          width: ''
        },
        {
          prop: 'startDateTime',
          label: '开始时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'endDateTime',
          label: '结束时间',
          align: 'left',
          width: ''
        }
      ],
      list: [],
      alertData: {}
    }
  },
  created () {
    // this._handlerChkPlanInfo()
  },
  methods: {
    // 获取列表
    // _handlerChkPlanInfo() {
    //   handlerChkPlanInfo(this.listQuery).then(res => {
    //     this.list = res.data.listData.list
    //     this.total = res.data.listData.totalCount
    //   })
    // },
    // handleCheckTraceView(data) {
    //   this.alertData = data
    //   this.$refs.staffworkalert.handlerShow()
    // },
    _handlerChkPlanPointInfo (pointId) {
      const params = { pointId }
      handlerChkPlanPointInfo(params).then(res => {
        this.mationData = res.data.pointDetail
        this.tableList = res.data.pointHistory
        this.dangerData = res.data.dangerHisList
      })
    },
    handlerTraceDetailView (pointId) {
      this._handlerChkPlanPointInfo(pointId)
      this.$refs.StaffWorkItem.handlerShow()
    },
    // // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handlerChkPlanInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: block;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #001647;
}
</style>
