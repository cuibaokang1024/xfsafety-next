<template>
  <div class="staffworkalert-container">
    <el-dialog
      class="staffworkalert-container dark"
      title="检查详情"
      :visible.sync="outerVisible"
      width="1350px"
      :append-to-body="true"
    >
      <div class="staffworkalert-content">
        <!-- 搜索框 -->
        <div v-if="searchStatus" class="search-box">
          <SearchForm :form-option="searchFormOption" @search="handleFilter" />
        </div>
        <!-- 搜索框 -->
        <!-- 默认框 -->
        <div v-else class="staff-box">
          <el-form class="staff-form" label-width="80px">
            <el-form-item label="任务名:">
              <el-input v-model="alertData.planName" />
            </el-form-item>
            <el-form-item label="任务人:">
              <el-input v-model="alertData.chkUserName" />
            </el-form-item>
            <el-form-item label="开始时间:">
              <el-input v-model="alertData.startDateTime" />
            </el-form-item>
            <el-form-item label="结束时间:">
              <el-input v-model="alertData.endDateTime" />
            </el-form-item>
          </el-form>
        </div>
        <!-- 默认框 -->
        <el-divider />
        <!-- 内容组件 -->
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
        <!-- 内容组件 -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
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
  handlerChkPlanPointDetail,
  handlerChkPlanHisDetail,
  handlerChkPlanPointInfo
} from '@/api/companyHome'

import './style/index.scss'
import SearchForm from '@/components/searchForm'
import TraceItem from '@/components/TraceItem'
import StaffWorkItem from './StaffWorkItem'

export default {
  components: {
    SearchForm,
    TraceItem,
    StaffWorkItem
  },
  props: {
    searchStatus: {
      type: Boolean,
      default: true
    },
    alertData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listQuery: {
        planId: '',
        groupId: ''
      },
      outerVisible: false,
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '楼座：',
            name: 'partId',
            placeholder: '请选择楼座',
            dataList: []
          },
          {
            type: 'select',
            label: '楼层：',
            name: 'partAddrId',
            placeholder: '请选择楼层',
            dataList: []
          }
        ]
      },
      traceData: [],
      mationData: {},
      tableList: [],
      dangerData: []
    }
  },
  watch: {
    alertData(newVal) {
      this.listQuery.planId = newVal.planId
      this.listQuery.groupId = newVal.groupId
      this._handlerChkPlanPointDetail()
    }
  },
  methods: {
    handlerShow() {
      this.outerVisible = true
    },
    handlerHide() {
      this.outerVisible = false
    },
    _handlerChkPlanPointDetail() {
      if (!this.listQuery.groupId) {
        handlerChkPlanPointDetail(this.listQuery).then(res => {
          this.traceData = res.data
        })
      } else {
        handlerChkPlanHisDetail(this.listQuery).then(res => {
          this.traceData = res.data
        })
      }
    },
    _handlerChkPlanPointInfo(pointId) {
      const params = { pointId }
      handlerChkPlanPointInfo(params).then(res => {
        this.mationData = res.data.pointDetail
        this.tableList = res.data.pointHistory
        this.dangerData = res.data.dangerHisList
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = data
    },
    handlerTraceDetailView(pointId) {
      this._handlerChkPlanPointInfo(pointId)
      this.$refs.StaffWorkItem.handlerShow()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
