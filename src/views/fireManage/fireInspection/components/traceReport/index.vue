<template>
  <section class="traceReport-main">
    <el-aside>
      <div class="title">楼座楼层</div>
      <TreeNode
        height="700px"
        :tree-data="treeData"
        @handleNodeClick="handleNodeClick"
      />
    </el-aside>
    <el-main>
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
        <el-button
          v-show="listQuery.planId"
          type="success"
          style="margin-left: 20px"
          class="edit"
          @click="createChkTraceReport"
        >生成报表</el-button>
      </div>
      <!-- 搜索框 -->
      <el-divider />
      <!-- 内容组件 -->
      <div class="tab-scrollbar">
        <el-scrollbar>
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
        </el-scrollbar>
      </div>
      <!-- 弹出框 -->
      <el-dialog
        v-if="dialogVisible"
        class="dark trace-dialog"
        :visible.sync="dialogVisible"
        width="1000px"
      >
        <div name="title" class="dialog-title">巡查点信息</div>
        <div class="dialog-content">
          <div class="tab-scrollbar">
            <el-scrollbar>
              <div
                v-for="data in oneTraceData"
                :key="data.id"
                class="content-item"
              >
                <div class="item-title">
                  <span>{{ data.name }}</span>
                </div>
                <ul class="item-list">
                  <li v-for="item in data.list" :key="item.id">
                    <TraceItem
                      :trace-data="item"
                      @handlerTraceDetailView="
                        handlerTraceDetailView(item.pointId)
                      "
                    />
                  </li>
                </ul>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <ChkPointDetail
        ref="chkPointDetail"
        :point-detail="pointDetail"
        :merge="detailMerge"
        :other-merge="detailOtherMerge"
      />
      <ChkTraceReport
        ref="chkTraceReport"
        :loading="reportLoading"
        :chk-data="chkData"
        :merge="merge"
        :other-merge="otherMerge"
        @getOnetraceData="_getOnetraceData"
      />
    </el-main>
  </section>
</template>

<script>
import formAction from '@/mixins/form'
import './style/index.scss'

import { getOnetraceData, getChkMark, getMarkDetails } from '@/api/chk'
import {
  handlerChkPlanList,
  handlerChkPlanPointDetail as getTraceList,
  handlePartInfoList
} from '@/api/companyHome'

import SearchForm from '@/components/searchForm'
import TreeNode from '@/components/treeNode'
import TraceItem from '@/components/TraceItem'
import ChkTraceReport from './components/chkTraceReport'
import ChkPointDetail from './components/chkPointDetail'

export default {
  /* 检查痕迹 */
  name: 'TraceReport',
  components: {
    SearchForm,
    TraceItem,
    TreeNode,
    ChkTraceReport,
    ChkPointDetail
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      reportLoading: false,
      listQuery: {
        planId: null,
        startTime: '',
        endTime: '',
        partId: '',
        partAddrId: ''
      },
      dialogVisible: false,
      treeData: [],
      merge: [], // 报表表格第四列合并
      otherMerge: [], // 报表表格其他列合并
      detailMerge: [], // 报表表格第四列合并
      detailOtherMerge: [], // 报表表格其他列合并
      traceData: [],
      oneTraceData: [],
      getOnetraceData: [],
      pointDetail: null,
      chkData: null,
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '检查任务:',
            name: 'planId',
            placeholder: '请选择检查任务',
            dataList: []
          },
          {
            type: 'datetime',
            label: '检查时间:',
            name: 'startTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          },
          {
            type: 'datetime',
            label: '至',
            name: 'endTime',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
          }
        ]
      }
    }
  },
  created() {
    this._getTraceList()
    this._handlePartInfoList()
    this._handlerChkPlanList()
  },
  methods: {
    // 树状方法
    handleNodeClick(data, node) {
      const index = data.id
      if (data.children) {
        this.listQuery.partId = index
        this.listQuery.partAddrId = ''
        this._getTraceList()
      } else {
        this.listQuery.partId = ''
        this.listQuery.partAddrId = index
        this._getTraceList()
      }
    },
    _handlePartInfoList() {
      handlePartInfoList().then((res) => {
        if (res.data) {
          this.treeData = res.data
        }
      })
    },
    // 巡查任务字典值
    _handlerChkPlanList() {
      handlerChkPlanList().then((res) => {
        if (res.data) {
          this.searchFormOption.config = this.searchFormOption.config.map(
            (config) => {
              if (config.name === 'planId') {
                return { ...config, dataList: res.data }
              }
              return { ...config }
            }
          )
        }
      })
    },
    // 获取检查痕迹
    _getTraceList() {
      this.listLoading = true
      getTraceList(this.listQuery)
        .then((res) => {
          if (res.data) {
            this.traceData = res.data
          }
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    _getChkMark() {
      if (!this.listQuery) {
        return
      }
      return new Promise((resolve, reject) => {
        getChkMark(this.listQuery)
          .then((res) => {
            if (res.data) {
              const data = res.data
              data.marks = data.marks.map((item) => {
                // 将巡查点分为带设备设施和不带设备设施方便展示
                if (item.pureChecked && item.purenotChecked) {
                  const [hasEquipArr, noEquipArr] = this.formatData(
                    item.checked
                  )
                  const [noCheckHasEquipArr, noCheckNoEquipArr] =
                    this.formatData(item.notChecked)
                  return {
                    ...item,
                    hasEquipArr,
                    noEquipArr,
                    noCheckHasEquipArr,
                    noCheckNoEquipArr
                  }
                } else if (item.purenotChecked) {
                  const [noCheckHasEquipArr, noCheckNoEquipArr] =
                    this.formatData(item.notChecked)
                  return { ...item, noCheckHasEquipArr, noCheckNoEquipArr }
                } else if (item.pureChecked) {
                  const [hasEquipArr, noEquipArr] = this.formatData(
                    item.checked
                  )
                  return { ...item, hasEquipArr, noEquipArr }
                } else {
                  return { ...item }
                }
              })
              resolve(data)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取单次巡检的巡查点数据
    _getOnetraceData(data) {
      const { planId, groupId } = { ...data }
      getOnetraceData({ planId, groupId }).then((res) => {
        if (res.data) {
          this.oneTraceData = res.data
          this.dialogVisible = true
        }
      })
    },
    // 查询函数
    handleFilter(data) {
      const { planId, startTime, endTime } = { ...data }
      this.listQuery = { planId, startTime, endTime }
      this._getTraceList()
    },
    // 生成检查痕迹报表
    async createChkTraceReport() {
      this.$refs.chkTraceReport.show()
      this.reportLoading = true
      this.chkData = await this._getChkMark()
      this.reportLoading = false
    },
    // 查看巡查点详情
    handlerTraceDetailView(id) {
      getMarkDetails({ pointId: id }).then((res) => {
        if (res.data) {
          res.data.list = this.formatChkRecordData(res.data.list)
          this.pointDetail = res.data
          this.$refs.chkPointDetail.show()
        }
      })
    },
    // 格式化巡查点检查记录数据
    formatChkRecordData(data) {
      this.detailMerge = []
      this.detailOtherMerge = []
      const list = []
      data.forEach((item) => {
        if (!item.children) {
          list.push(item)
        } else {
          const id = item.id
          item.children.forEach((children) => {
            const rowIndex = list.length
            let rowspan = 0
            let obj = { ...item, ...children }
            children.children.forEach((content) => {
              rowspan++
              obj = { ...obj, ...content, name: obj.name }
              list.push(obj)
            })
            this.detailMerge.push({ rowIndex, rowspan, id })
          })
        }
      })
      const merge = []
      this.detailMerge.forEach((item) => {
        const index = merge.findIndex((key) => {
          return item.id === key.id
        })
        if (index === -1) {
          merge.push({ ...item })
        } else {
          merge[index].rowspan += item.rowspan
        }
      })
      this.detailOtherMerge = merge
      return list
    },
    // 格式化报表巡检数据
    formatData(data) {
      this.merge = []
      this.otherMerge = []
      let hasEquipArr = []
      const noEquipArr = []
      if (!data.length > 0) {
        return { hasEquipArr, noEquipArr }
      }
      let rowIndex = 0
      data.forEach((item) => {
        if (!item.children) {
          noEquipArr.push(item)
        } else {
          const arr = []
          const id = item.id
          item.children.forEach((children) => {
            let rowspan = 0
            let obj = { ...item, ...children }
            children.children.forEach((content) => {
              rowspan++

              obj = { ...obj, ...content, name: obj.name }
              arr.push(obj)
            })
            this.merge.push({ rowIndex, rowspan, id })
            rowIndex += rowspan
          })
          hasEquipArr = hasEquipArr.concat(arr)
        }
      })
      const merge = []
      this.merge.forEach((item) => {
        const index = merge.findIndex((key) => {
          return item.id === key.id
        })
        if (index === -1) {
          merge.push({ ...item })
        } else {
          merge[index].rowspan += item.rowspan
        }
      })
      this.otherMerge = merge
      return [hasEquipArr, noEquipArr]
    }
  }
}
</script>

<style scoped lang="scss">
.section-main{
  flex-direction: row!important;
}
.checkTrace {
  height: 100%;

  .search-box {
    display: flex;
  }

  .el-divider {
    margin: 16px 0;
    background-color: #526182;
  }

  .item-list {
    display: flex;
    flex-wrap: wrap;

    li {
      flex: 0 1 25%;
    }
  }

  .item-title {
    font-size: 14px;
    color: #e5ecae;
    margin-bottom: 16px;
  }
}
</style>
