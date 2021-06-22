<template>
  <div class="dialog-container">
    <el-dialog class="dark" title="检查详情" :visible.sync="outerVisible" width="1350px">
      <div class="dialog-outer-content">
        <!-- 搜索框 -->
        <div class="search-box">
          <SearchForm :form-option="searchFormOption" @search="handleFilter" />
        </div>
        <!-- 搜索框 -->
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
      <!-- 内部详情 -->
      <el-dialog
        class="dark"
        title="巡查点信息"
        :visible.sync="innerVisible"
        width="800px"
        append-to-body
      >
        <div class="dialog-inner-content">
          <div class="inner-mation">
            <el-form ref="form" :model="mationData" label-width="120px">
              <el-form-item label="巡查点类型：">
                <el-input v-model="mationData.typeName" />
              </el-form-item>
              <el-form-item label="系统自动编号：">
                <el-input v-model="mationData.num" />
              </el-form-item>
              <el-form-item label="所在部位：">
                <el-input v-model="mationData.part" />
              </el-form-item>
              <el-form-item label="具体位置：">
                <el-input v-model="mationData.partAddr" />
              </el-form-item>
              <el-form-item label="详细地址：" style="flex: 0 1 100%;">
                <el-input v-model="mationData.addr" />
              </el-form-item>
              <el-form-item label="责任人：">
                <el-input v-model="mationData.primaryName" />
              </el-form-item>
              <el-form-item label="责任部门：">
                <el-input v-model="mationData.deptName" />
              </el-form-item>
            </el-form>
          </div>
          <div class="inner-record">
            <div class="title">检查记录</div>
            <BaseTable
              :loading="listLoading"
              :table-data="list"
              :table-config="tableConfig"
              :border="false"
            >
              <el-table-column label="现场图片" align="left" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                  <el-image
                    v-if="row.image"
                    style="min-width: 80px; min-height: 110px"
                    :src="row.image"
                    fit="fill"
                  />
                </template>
              </el-table-column>
            </BaseTable>
          </div>
          <div class="title">消防隐患</div>
          <div v-for="item in dangerData" :key="item.id" class="inner-danger">
            <el-form ref="form" :model="item" label-width="120px">
              <el-form-item label="隐患时间：">
                <el-input v-model="item.chkDate" />
              </el-form-item>
              <el-form-item label="处理进度：">
                <el-input v-model="item.statusName" />
              </el-form-item>
              <el-form-item label="上报人：">
                <el-input v-model="item.chkUserName" />
              </el-form-item>
              <el-form-item label="上报部门：">
                <el-input v-model="item.officeName" />
              </el-form-item>
              <el-form-item label="隐患内容：" style="flex: 0 1 100%;">
                <el-input v-model="item.content" />
              </el-form-item>
              <el-form-item label="隐患图片：" style="flex: 0 1 100%;">
                <el-image
                  v-if="item.image"
                  style="width: 80px; height: 110px"
                  :src="item.image"
                  :preview-src-list="item.srcList"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 内部详情 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  handlerChkPlanPointDetail,
  handlerChkPlanDictList,
  handlerChkPlanPointInfo
} from '@/api/companyHome'
import { getPartsList } from '@/api/partsList'

import SearchForm from '@/components/searchForm'
import TraceItem from '@/views/fireManage/fireInspection/components/traceItem'
import BaseTable from '@/components/baseTable'

export default {
  components: {
    SearchForm,
    TraceItem,
    BaseTable
  },
  props: {
    alertData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listLoading: false,
      outerVisible: false,
      innerVisible: false,
      listQuery: {
        planId: '',
        partId: '',
        partAddrId: '',
        startTime: '',
        endTime: ''
      },
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
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'primaryName',
          label: '检查人',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkDateTime',
          label: '检查时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '所在单位',
          align: 'left',
          width: ''
        }
      ],
      list: [],
      dangerData: [],
      BuildingList: []
    }
  },
  computed: {
    // 楼层列表
    floorList() {
      const selectedBuilding = this.BuildingList.filter(item => {
        return item.id === this.listQuery.partId
      })
      if (selectedBuilding.length > 0) {
        return selectedBuilding[0].partsAddrEntity
      } else {
        return false
      }
    }
  },
  watch: {
    alertData(newVal) {
      const data = Object.assign({}, newVal, {
        planId: 'b9f39dfb062646f58317790f080d25fb'
      })
      this.listQuery = data
      this._getPartsList()
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
    // 获取采集部位列表
    _getPartsList() {
      getPartsList().then(res => {
        if (res.data) {
          console.log(res.data)
          // this.BuildingList = res.data;
        }
      })
    },
    _handlerChkPlanPointDetail() {
      handlerChkPlanPointDetail(this.listQuery).then(res => {
        this.traceData = res.data
      })
    },
    _handlerChkPlanPointInfo(pointId) {
      handlerChkPlanPointInfo(pointId).then(res => {
        this.mationData = res.data.pointDetail
        this.list = res.data.pointHistory
        this.dangerData = res.data.dangerHisList
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = data
    },
    handlerTraceDetailView(pointId) {
      this._handlerChkPlanPointInfo(pointId)
      this.innerVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
