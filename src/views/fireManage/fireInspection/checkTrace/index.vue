<template>
  <div class="inspect-main checkTrace">
    <!-- <el-aside>
      <div class="title">
        <span>楼座楼层</span>
      </div>
      <TreeNode height="700px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
    </el-aside> -->
    <!-- tab -->
    <el-tabs
      v-model="activeCheckName"
      class="tab-content"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="检查痕迹" name="report" style="overflow: hidden;">
        <TraceReport />
      </el-tab-pane>
      <el-tab-pane label="按检查计划检查" name="according">
        <!-- 搜索框 -->
        <div class="search-box">
          <SearchForm :form-option="searchOption" @search="handleFilter" />
        </div>
        <!-- 搜索框 -->
        <el-divider />
        <div class="container-flex">
          <!-- 树形框 -->
          <div class="container-silder">
            <div class="title">巡查计划：</div>
            <div class="srollbar">
              <el-scrollbar>
                <ul class="list">
                  <li
                    v-for="(item, index) in chkPlanData"
                    :key="item.id"
                    class="item"
                    :class="activeClass == index ? 'active' : ''"
                    @click="handleClickPlanList(item, index)"
                  >
                    <el-popover
                      popper-class="popover-check"
                      placement="left"
                      trigger="hover"
                      :content="item.planName"
                    >
                      <div name="reference">{{ item.planName }}</div>
                    </el-popover>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
          <!-- 树形框 -->
          <!-- 列表框 -->
          <div class="table-box container-content">
            <div class="title">计划名称：每月防火巡检</div>
            <div class="scrollbar">
              <el-scrollbar>
                <BaseTable
                  :loading="listLoading"
                  :table-data="tableData"
                  :table-config="tableConfig"
                  :border="false"
                  :show-summary="true"
                  @rowClick="handleCheckTraceView($event, '查看')"
                />
              </el-scrollbar>
            </div>
          </div>
          <!-- 列表框 -->
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- tab -->
    <!-- 弹出框 -->
    <el-dialog
      v-if="dialogVisible"
      class="dark trace-dialog"
      v-model:visible="dialogVisible"
      width="800px"
    >
      <div name="title" class="dialog-title">巡查点信息</div>
      <div class="dialog-content">
        <div class="inner-mation">
          <el-form ref="form" :model="mationData">
            <el-col :span="12">
              <el-form-item label="巡查点类型：">
                <el-input v-model="mationData.typeName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统自动编号：">
                <el-input v-model="mationData.num" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在部位：">
                <el-input v-model="mationData.part" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="具体位置：">
                <el-input v-model="mationData.partAddr" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址：">
                <el-input v-model="mationData.addr" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人：">
                <el-input v-model="mationData.primaryName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任部门：">
                <el-input v-model="mationData.deptName" />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="inner-record">
          <div class="title">检查记录</div>
          <BaseTable
            :loading="listLoading"
            :table-data="list"
            :table-config="tableListConfig"
            :border="false"
          />
        </div>
        <div class="title">消防隐患</div>
        <div v-for="(item, index) in dangerData" :key="item.id" class="inner-danger">
          <el-form ref="form" :model="item">
            <el-col :span="12">
              <el-form-item label="隐患时间：">
                <el-input v-model="item.chkDate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理进度：">
                <el-input v-model="item.statusName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上报人：">
                <el-input v-model="item.chkUserName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上报部门：">
                <el-input v-model="item.officeName" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="隐患内容：">
                <el-input v-model="item.content" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col v-if="item.image.length > 0" :span="24">
              <el-form-item label="隐患图片：" style="text-align: left">
                <div v-if="activeImg !== index">
                  <el-button
                    type="primary"
                    round
                    size="mini"
                    @click="handleInitImgBtn(index, item.image, item.id)"
                  >查看图片</el-button>
                </div>
                <div v-else>
                  <el-image
                    v-if="handleInitList(item.id, fillImageSrc).length > 0"
                    style="width: 80px; height: 110px"
                    fit="fill"
                    :src="handleInitList(item.id, fillImageSrc)[0]"
                    :preview-src-list="handleInitList(item.id, fillImageSrc)"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <StaffWorkAlert ref="staffworkalert" :search-status="false" :alert-data="alertData" />
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  handlerChkPlanPointDetail,
  handlerChkPlanByChkPlan,
  handlerChkPlanPointInfo,
  handlerChkPlanByChkPlanId
} from '@/api/companyHome'
import { handlerDownload } from '@/api/office'

import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import TraceReport from '../components/traceReport'
import StaffWorkAlert from '@/components/StaffWorkAlert'

export default {
  /* 检查痕迹 */
  name: 'CheckTrace',
  components: {
    SearchForm,
    BaseTable,
    StaffWorkAlert,
    TraceReport
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      dialogVisible: false,
      activeCheckName: 'report',
      treeData: [],
      tabCheckIndex: 0,
      listQuery: {
        primaryName: '',
        planId: '',
        partId: '',
        partAddrId: '',
        startTime: '',
        endTime: '',
        chkUserName: '',
        startDate: '',
        endDate: ''
      },
      searchOption: {
        config: [
          {
            type: 'text',
            label: '巡查人员:',
            name: 'chkUserName',
            placeholder: '请输入巡查人员'
          },
          {
            type: 'date',
            label: '检查时间:',
            name: 'startDate'
          },
          {
            type: 'date',
            label: '至',
            name: 'endDate'
          }
        ]
      },
      tableConfig: [
        {
          prop: 'chkUser',
          label: '检查人',
          align: 'left',
          width: ''
        },
        {
          prop: 'beginTime',
          label: '开始时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'endTime',
          label: '结束时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'pointCount',
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
          label: '隐患数量',
          align: 'left',
          width: ''
        },
        {
          prop: 'score',
          label: '评估分值',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '名称:',
            name: 'name',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '所属单位:',
            name: 'affiliated',
            type: 'text',
            labelWidth: '80px'
          },
          {
            label: '制定时间:',
            name: 'date',
            type: 'date',
            labelWidth: '80px'
          },
          {
            label: '简要:',
            name: 'content',
            type: 'textarea',
            labelWidth: '80px',
            colspan: true
          }
        ],
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          date: [{ required: true, message: '请选择日期', trigger: 'blur' }]
        }
      },
      traceData: [],
      mationData: {},
      tableListConfig: [
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
      activeClass: -1,
      activeImg: -1,
      planId: '',
      planName: '',
      chkPlanData: {},
      alertData: {},
      fillImageSrc: []
    }
  },
  created () {
    this._handlerChkPlanPointDetail()
  },
  methods: {
    // 列表
    _handlerChkPlanPointDetail () {
      handlerChkPlanPointDetail(this.listQuery).then(res => {
        this.traceData = res.data
      })
    },
    // 列表
    _handlerChkPlanByChkPlan () {
      handlerChkPlanByChkPlan(this.listQuery).then(res => {
        this.chkPlanData = res.data.planList
        this.activeClass = -1
        this.tableData = []
      })
    },
    _handlerChkPlanByChkPlanId (planId) {
      handlerChkPlanByChkPlanId({ planId }).then(res => {
        this.tableData = res.data.recordList
      })
    },
    handleClickPlanList (item, index) {
      this.activeClass = index
      this.planId = item.planId
      this.planName = item.planName
      this._handlerChkPlanByChkPlanId(item.planId)
    },
    // 重置查询条件
    resetQuery () {
      this.listQuery.partId = ''
    },
    handleClick (tab) {
      this.tabCheckIndex = Number(tab.index)
      if (!this.tabCheckIndex) {
        this._handlerChkPlanPointDetail()
      } else {
        this._handlerChkPlanByChkPlan()
      }
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      if (!this.tabCheckIndex) {
        this._handlerChkPlanPointDetail()
      } else {
        this._handlerChkPlanByChkPlan()
      }
    },
    _handlerChkPlanPointInfo (pointId) {
      const params = { pointId }
      handlerChkPlanPointInfo(params).then(res => {
        this.mationData = res.data.pointDetail
        this.list = res.data.pointHistory
        this.dangerData = res.data.dangerHisList
      })
    },
    handlerTraceDetailView (pointId) {
      this._handlerChkPlanPointInfo(pointId)
      this.dialogVisible = true
    },
    // staffworkalert
    handleCheckTraceView (data) {
      const alertData = Object.assign({}, data, {
        planId: this.planId,
        planName: this.planName,
        chkUserName: data.chkUser,
        startDateTime: data.beginTime,
        endDateTime: data.endTime
      })
      this.alertData = alertData
      this.$refs.staffworkalert.handlerShow()
    },
    // 文档流方法
    handleInitImgBtn (index, img, id) {
      this.activeImg = index
      const imageIdList = img
      const list = []
      imageIdList.forEach(item => {
        Promise.all([this._handlerDownload(item)])
          .then(res => {
            list.push(...res)
          })
          .catch(err => {
            console.log(err)
          })
      })
      this.fillImageSrc.push({ id, list })
    },
    _handlerDownload (fileId) {
      return new Promise((resolve, reject) => {
        handlerDownload({ fileId })
          .then(res => {
            const blob = new Blob([res])
            resolve(window.URL.createObjectURL(blob))
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    handleInitList (id, data) {
      const imgData = data.filter(item => {
        return item.id === id
      })
      return imgData[0].list
    }
  }
}
</script>

<style scoped lang="scss">
.checkTrace {
  .search-box {
    display: flex;
    .slot-form {
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .img-btn {
    padding-left: 42px;

    .el-form-item {
      text-align: left;
    }
  }
}

.tree-box {
  padding: 20px;
  background: #233560;
}

.trace-dialog {
  .title {
    margin: 10px 0;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: turquoise;
  }

  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      display: flex;
      flex: 0 1 50%;
      margin-bottom: 16px;
    }
  }

  .inner-mation {
    padding: 0 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.07);
  }

  .inner-danger {
    margin-bottom: 12px;
    padding: 16px 10px 0;
    margin-right: 10px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.07);
  }
}
</style>

<style lang="scss">
.checkTrace {
  .container-flex {
    display: flex;
    justify-content: space-between;

    .container-silder {
      width: 185px;
      height: 665px;
      margin-right: 30px;
      background: rgba(255, 255, 255, 0.07);

      .title {
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        color: #97c1ff;
        font-weight: bold;
      }

      .srollbar {
        padding: 10px;
        height: 625px;

        .list {
          margin-right: 6px;

          .item {
            width: 100%;
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
            color: #97c1ff;
            margin-bottom: 6px;
            cursor: pointer;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            &.active {
              background: rgba(255, 255, 255, 0.12);
            }
          }
        }

        > .el-scrollbar {
          height: 100%;

          .el-scrollbar__wrap {
            overflow-x: hidden;
            overflow-y: scroll;
          }

          .el-scrollbar__bar {
            &.is-vertical {
              width: 4px; // 滚动条宽度
            }
          }

          .el-scrollbar__thumb {
            background-color: #4c79eb; // 可设置滚动条颜色
          }
        }
      }
    }

    .container-content {
      flex: 1;
    }
  }
  .slot-form {
    .el-form-item__label {
      color: #97c1ff;
      font-size: 14px;
    }

    .el-input__inner {
      width: 152px;
      height: 30px;
      color: #97c1ff;
      font-size: 14px;
      border: none;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .tab-scrollbar {
    height: 674px;

    > .el-scrollbar {
      height: 100%;

      .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: scroll;
      }

      .el-scrollbar__bar {
        &.is-vertical {
          width: 7px; // 滚动条宽度
        }
      }
      .el-scrollbar__thumb {
        background-color: #4c79eb; // 可设置滚动条颜色
      }
    }
  }

  .trace-dialog {
    .el-dialog__body {
      height: 500px;
      padding-top: 0;

      .dialog-content {
        height: 100%;
        overflow: auto;
        padding-right: 10px;
      }

      .el-form-item__content {
        width: calc(100% - 120px) !important;
      }

      .el-form-item__label {
        width: 120px !important;
      }
    }

    .el-textarea__inner {
      height: 100px !important;
    }

    .el-input__inner {
      color: #97c1ff;
      font-size: 14px;
      border: 1px solid #153f98;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
