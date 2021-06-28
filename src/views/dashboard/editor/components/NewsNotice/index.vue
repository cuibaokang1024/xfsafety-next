<template>
  <div class="container newsnotice">
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane label="国内新闻" name="news">
        <div class="news-swiper">
          <NewsSwiper :swiper-list="swiperList" />
        </div>
        <div class="news-news">
          <NewsItem
            v-for="item in itemList"
            :key="item.id"
            width="100%"
            height="36px"
            :item-obj="item"
            @handleNoticeView="handleNoticeView"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="通知公告" name="notice">
        <div v-if="itemList.length > 0" class="notice-list">
          <NewsItem
            v-for="item in itemList"
            :key="item.id"
            width="100%"
            height="36px"
            :item-obj="item"
            @handleNoticeView="handleNoticeView"
          />
        </div>
        <div v-else class="notice-list">
          <div class="notice-list-no">暂无数据</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="到期提醒" name="reminder">
        <div class="notice-list">
          <BaseTable
            :loading="listLoading"
            :table-height="240"
            :table-config="tableConfig"
            :table-data="tableData"
            :border="false"
          >
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
              <template slot-scope="{ row }">
                <el-button size="mini" type="primary" round @click="handleSecView(row)">查看详情</el-button>
              </template>
            </el-table-column>
          </BaseTable>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="more" @click="handleHasMore">更多+</div>
    <!-- 弹出框 -->
    <NoticeView ref="NoticeView" :view-id="viewId" notice-flag="receive" />
    <!-- 弹出框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <el-dialog
        v-if="dialogVisible"
        class="dark fireSecurity-dialog devSettingForm"
        width="1000px"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
      >
        <div name="title" class="dialog-title">查看详情</div>
        <div class="dialog-content">
          <el-scrollbar class="scroll">
            <el-form
              ref="fireSecurityForm"
              class="fireSecurity-form"
              :model="formData"
              :disabled="true"
            >
              <div class="form-content">
                <el-col :span="12">
                  <el-form-item label="设备类型:" prop="type">
                    <TreeSelect
                      :level.sync="formData.type"
                      :label.sync="formData.typeName"
                      :tree-select-option="typeOption"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="code">
                  <el-form-item label="系统自动编号:" prop="num">
                    <el-input v-model="formData.num" placeholder="请输入内容" autocomplete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称:" prop="name">
                    <el-input v-model="formData.name " placeholder="请输入内容" autocomplete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备设施类型:" prop="facilityType">
                    <el-select v-model="formData.facilityType" placeholder="请选择">
                      <el-option
                        v-for="item in facilityTypeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所在部位:" prop="partId">
                    <el-select v-model="formData.partId" placeholder="请选择">
                      <el-option
                        v-for="item in partList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="具体位置:" prop="partAddrId">
                    <el-select v-model="formData.partAddrId" placeholder="请选择">
                      <el-option
                        v-for="item in partAddrList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="详细地址:" prop="addr">
                    <el-input v-model="formData.addr" placeholder="请输入内容" autocomplete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="设施品牌:" prop="brand">
                    <el-input v-model="formData.brand" placeholder="请输入内容" autocomplete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="购入时间:" prop="buyTime">
                    <el-date-picker
                      v-model="formData.buyTime"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="质保时间:" prop="qualityTime">
                    <el-date-picker
                      v-model="formData.qualityTime"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="过期时间:" prop="outTime">
                    <el-date-picker
                      v-model="formData.outTime"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="剩余天数提醒:" prop="surplusDay">
                    <el-input v-model="formData.surplusDay" placeholder="请输入内容" autocomplete="off" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任部门:" prop="dutyDept">
                    <el-select v-model="formData.dutyDept" placeholder="请选择">
                      <el-option
                        v-for="item in dutyDeptList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人:" prop="dutyUser">
                    <el-select v-model="formData.dutyUser" placeholder="请选择">
                      <el-option
                        v-for="item in dutyUserList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </div>
            </el-form>
          </el-scrollbar>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="handleHide">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
  </div>
</template>

<script>
import {
  getDict,
  handlerOfficeNewsSwiper,
  handleOfficeOanotifyRev
} from '@/api/companyHome'
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import {
  handleSecExpiredDev,
  handleSecInfo,
  handleSecDeptList,
  handleSecDeptUser
} from '@/api/danger'

import formAction from '@/mixins/form.js'

import NewsSwiper from '@/components/NewsSwiper'
import NewsItem from '@/components/NewsItem'
import BaseTable from '@/components/baseTable'
import TreeSelect from '@/components/treeSelect'
import NoticeView from '@/components/NoticeView'

export default {
  // 新闻公告
  name: 'NewsNotice',
  components: {
    NewsSwiper,
    NewsItem,
    BaseTable,
    TreeSelect,
    NoticeView
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      tableConfig: [
        {
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'num',
          label: '系统编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'outTime',
          label: '到期时间',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formData: {},
      partList: [],
      partAddrList: [],
      dutyDeptList: [],
      dutyUserList: [],
      facilityTypeList: [],
      typeOption: {
        title: '选择类型',
        request: {
          url: 'device/api/facilityinput/getDeviceType',
          params: {}
        }
      },
      activeTabName: 'news',
      swiperList: [],
      itemList: [],
      listQuery: {
        page: 1,
        limit: 5
      },
      viewId: ''
    }
  },
  watch: {
    'formData.partId': {
      handler(newVal, oldVal) {
        if (oldVal) {
          this.formData.partAddrId = ''
        }
        if (newVal) {
          this._getPartsAddrList(newVal)
        }
      }
    },
    'formData.dutyDept': {
      handler(newVal, oldVal) {
        if (oldVal) {
          this.formData.dutyUser = ''
        }
        if (newVal) {
          this._handleSecDeptUser(newVal)
        }
      }
    }
  },
  created() {
    this._getDict()
    this._getPartsList()
    this._handleSecDeptList()
    this._handlerOfficeNewsSwiper()
  },
  methods: {
    // 责任部门
    _handleSecDeptList() {
      handleSecDeptList().then(res => {
        if (res.data) {
          this.dutyDeptList = res.data
        }
      })
    },
    // 责任人
    _handleSecDeptUser(deptId) {
      handleSecDeptUser({ deptId }).then(res => {
        if (res.data) {
          this.dutyUserList = res.data
        }
      })
    },
    // 获取采集部位列表
    _getPartsList() {
      getPartsList().then(res => {
        if (res.data) {
          this.buildingList = res.data
          this.partList = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },
    // 根据采集部位获取楼层
    _getPartsAddrList(id) {
      getPartsAddrList({ partsId: id }).then(res => {
        if (res.data) {
          this.partAddrList = res.data.map(partAddr => {
            return {
              value: partAddr.id,
              label: partAddr.name
            }
          })
        }
      })
    },
    // 获取字典值
    _getDict() {
      getDict({
        type: 'facility_type'
      }).then(res => {
        if (res.data) {
          this.facilityTypeList = res.data.dicts
        }
      })
    },
    _handlerOfficeNewsSwiper() {
      handlerOfficeNewsSwiper().then(res => {
        this.swiperList = res.data.imagelist
        this.itemList = res.data.list
      })
    },
    // 获取列表
    _handleOfficeOanotifyRev() {
      handleOfficeOanotifyRev(this.listQuery).then(res => {
        this.itemList = res.data.list
      })
    },
    // 获取列表详情信息
    handleSecListInfo(data) {
      return new Promise((resolve, reject) => {
        handleSecInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              resolve(res.data.facilityInput)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 查看表单信息
    async handleSecView(data) {
      const detaile = await this.handleSecListInfo(data)
      this.formData = detaile
      this.handleShow()
    },
    _handleSecExpiredDev() {
      handleSecExpiredDev().then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      })
    },
    handleShow() {
      this.dialogVisible = true
    },
    handleHide() {
      this.dialogVisible = false
    },
    handleClick(tab, event) {
      this.itemList = []
      if (tab.index === '0') {
        this._handlerOfficeNewsSwiper()
      } else if (tab.index === '1') {
        this._handleOfficeOanotifyRev()
      } else if (tab.index === '2') {
        this._handleSecExpiredDev()
      }
    },
    handleNoticeView(data) {
      if (this.activeTabName === 'news') {
        if (data.url) {
          window.open(data.url, '_blank')
        }
      } else if (this.activeTabName === 'notice') {
        this.viewId = data.id
        this.$refs.NoticeView.handleShow()
      }
    },
    handleHasMore() {
      if (this.activeTabName === 'news') {
        window.open('http://www.xfsb119.com/news/', '_blank')
      } else if (this.activeTabName === 'notice') {
        this.$router.push('/fireManage/notice/receive')
      } else if (this.activeTabName === 'reminder') {
        this.$router.push('fireManage/unitRecord/fireSecurity')
      }
    }
  }
}
</script>

<style lang="scss">
.formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.fireSecurity-dialog {
  .dialog-content .el-form .form-content {
    border-left: none !important;

    .el-form-item {
      border-left: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  .dialog-content {
    height: 420px;

    .scroll {
      padding: 15px 0;
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

    .fireSecurity-form {
      padding: 0px 20px 0 15px !important;

      .code {
        .el-input-group__append {
          border: none;
          border-radius: 0px;
          background: transparent;

          .el-button {
            font-weight: bold;
            color: #97c1ff;
            background: #00479d;
            border: 1px solid #00479d;

            .el-icon-refresh-left {
              font-size: 15px;
              color: #97c1ff;
            }
          }
        }
      }

      .el-form-item {
        display: flex;
      }

      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
