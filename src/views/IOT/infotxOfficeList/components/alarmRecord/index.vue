<template>
  <el-dialog class="alertRecord dark" :visible.sync="dialogVisible" width="1160px">
    <div ref="content" class="dialog-content">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" />
      <el-divider />
      <el-tabs v-model="tabActiveName" @tab-click="handleClick">
        <div
          v-loading="loading"
          class="mask"
          style="position: absolute;width: 100%;height: 100%;"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
        />
        <el-tab-pane label="火警" name="fire">
          <div v-for="item in fireData" :key="item.id" class="container">
            <div class="title">{{ item.title }}</div>
            <div class="list">
              <div v-if="item.unresolved" class="item">
                <div class="view untreated">未处理</div>
                <div class="content">
                  <div class="left">
                    <div class="left-top">
                      <span class="text">今日报警次数</span>
                      <span style="display: flex; margin-top: 8px;">
                        <i class="icon" />
                        <span class="num">{{ item.unresolved.alertNum }}</span>
                      </span>
                    </div>
                    <div class="left-bot">
                      <div class="icon" />
                      <div style="display: flex; flex-direction: column;">
                        <span class="text">{{ item.unresolved.addr }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center" />
                  <div class="right">
                    <span class="text">{{ `探测器描述: ${item.unresolved.salType}` }}</span>
                    <span class="text">{{ `编码: ${item.unresolved.addrNum}` }}</span>
                    <span>
                      <span class="text">报警时间:</span>
                      <span class="text-care">{{ item.unresolved.time }}</span>
                    </span>
                    <span class="text">{{ `接收时间: ${item.unresolved.time}` }}</span>
                    <span>
                      <span class="text">最后一次报警内容:</span>
                      <span
                        class="text-care"
                      >{{ `${item.unresolved.addr}, 类型：${item.unresolved.sensor}` }}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="item.resolved" class="item">
                <div class="view processed">已处理</div>
                <div class="content">
                  <div class="left">
                    <div class="left-top">
                      <span class="text">今日报警次数</span>
                      <span style="display: flex; margin-top: 8px;">
                        <i class="icon" />
                        <span class="num">{{ item.resolved.alertNum }}</span>
                      </span>
                    </div>
                    <div class="left-bot">
                      <div class="icon" />
                      <div style="display: flex; flex-direction: column;">
                        <span class="text">{{ item.resolved.addr }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center" />
                  <div class="right">
                    <span class="text">{{ `探测器描述: ${item.resolved.salType}` }}</span>
                    <span class="text">{{ `编码: ${item.resolved.addrNum}` }}</span>
                    <span>
                      <span class="text">报警时间:</span>
                      <span class="text-care">{{ item.resolved.time }}</span>
                    </span>
                    <span class="text">{{ `接收时间: ${item.resolved.time}` }}</span>
                    <span>
                      <span class="text">最后一次报警内容:</span>
                      <span
                        class="text-care"
                      >{{ `${item.resolved.addr}, 类型：${item.resolved.sensor}` }}</span>
                    </span>
                    <span class="text">{{ `最后一次处置时间: ${item.resolved.handData.handle_date}` }}</span>
                    <span class="text">{{ `处理原因: ${item.resolved.handData.handle_result}` }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="故障" name="fault">
          <div v-for="item in faultData" :key="item.id" class="container">
            <div class="title">{{ item.title }}</div>
            <div class="list">
              <div v-if="item.unresolved" class="item">
                <div class="view untreated">未处理</div>
                <div class="content">
                  <div class="left">
                    <div class="left-top">
                      <span class="text">今日报警次数</span>
                      <span style="display: flex; margin-top: 8px;">
                        <i class="icon" />
                        <span class="num">{{ item.unresolved.alertNum }}</span>
                      </span>
                    </div>
                    <div class="left-bot">
                      <div class="icon" />
                      <div style="display: flex; flex-direction: column;">
                        <span class="text">{{ item.unresolved.addr }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center" />
                  <div class="right">
                    <span class="text">{{ `探测器描述: ${item.unresolved.salType}` }}</span>
                    <span class="text">{{ `编码: ${item.unresolved.addrNum}` }}</span>
                    <span>
                      <span class="text">报警时间:</span>
                      <span class="text-care">{{ item.unresolved.time }}</span>
                    </span>
                    <span class="text">{{ `接收时间: ${item.unresolved.time}` }}</span>
                    <span>
                      <span class="text">最后一次报警内容:</span>
                      <span
                        class="text-care"
                      >{{ `${item.unresolved.addr}, 类型：${item.unresolved.sensor}` }}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="item.resolved" class="item">
                <div class="view processed">已处理</div>
                <div class="content">
                  <div class="left">
                    <div class="left-top">
                      <span class="text">今日报警次数</span>
                      <span style="display: flex; margin-top: 8px;">
                        <i class="icon" />
                        <span class="num">{{ item.resolved.alertNum }}</span>
                      </span>
                    </div>
                    <div class="left-bot">
                      <div class="icon" />
                      <div style="display: flex; flex-direction: column;">
                        <span class="text">{{ item.resolved.addr }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center" />
                  <div class="right">
                    <span class="text">{{ `探测器描述: ${item.resolved.salType}` }}</span>
                    <span class="text">{{ `编码: ${item.resolved.addrNum}` }}</span>
                    <span>
                      <span class="text">报警时间:</span>
                      <span class="text-care">{{ item.resolved.time }}</span>
                    </span>
                    <span class="text">{{ `接收时间: ${item.resolved.time}` }}</span>
                    <span>
                      <span class="text">最后一次报警内容:</span>
                      <span
                        class="text-care"
                      >{{ `${item.resolved.addr}, 类型：${item.resolved.sensor}` }}</span>
                    </span>
                    <span class="text">{{ `最后一次处置时间: ${item.resolved.handData.handle_date}` }}</span>
                    <span class="text">{{ `处理原因: ${item.resolved.handData.handle_result}` }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其他" name="other">
          <div v-for="item in otherData" :key="item.id" class="container">
            <div class="title">{{ item.title }}</div>
            <div class="list">
              <div v-if="item.unresolved" class="item">
                <div class="view untreated">未处理</div>
                <div class="content">
                  <div class="left">
                    <div class="left-top">
                      <span class="text">今日报警次数</span>
                      <span style="display: flex; margin-top: 8px;">
                        <i class="icon" />
                        <span class="num">{{ item.unresolved.alertNum }}</span>
                      </span>
                    </div>
                    <div class="left-bot">
                      <div class="icon" />
                      <div style="display: flex; flex-direction: column;">
                        <span class="text">{{ item.unresolved.addr }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center" />
                  <div class="right">
                    <span class="text">{{ `探测器描述: ${item.unresolved.salType}` }}</span>
                    <span class="text">{{ `编码: ${item.unresolved.addrNum}` }}</span>
                    <span>
                      <span class="text">报警时间:</span>
                      <span class="text-care">{{ item.unresolved.time }}</span>
                    </span>
                    <span class="text">{{ `接收时间: ${item.unresolved.time}` }}</span>
                    <span>
                      <span class="text">最后一次报警内容:</span>
                      <span
                        class="text-care"
                      >{{ `${item.unresolved.addr}, 类型：${item.unresolved.sensor}` }}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="item.resolved" class="item">
                <div class="view processed">已处理</div>
                <div class="content">
                  <div class="left">
                    <div class="left-top">
                      <span class="text">今日报警次数</span>
                      <span style="display: flex; margin-top: 8px;">
                        <i class="icon" />
                        <span class="num">{{ item.resolved.alertNum }}</span>
                      </span>
                    </div>
                    <div class="left-bot">
                      <div class="icon" />
                      <div style="display: flex; flex-direction: column;">
                        <span class="text">{{ item.resolved.addr }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="center" />
                  <div class="right">
                    <span class="text">{{ `探测器描述: ${item.resolved.salType}` }}</span>
                    <span class="text">{{ `编码: ${item.resolved.addrNum}` }}</span>
                    <span>
                      <span class="text">报警时间:</span>
                      <span class="text-care">{{ item.resolved.time }}</span>
                    </span>
                    <span class="text">{{ `接收时间: ${item.resolved.time}` }}</span>
                    <span>
                      <span class="text">最后一次报警内容:</span>
                      <span
                        class="text-care"
                      >{{ `${item.resolved.addr}, 类型：${item.resolved.sensor}` }}</span>
                    </span>
                    <span class="text">{{ `最后一次处置时间: ${item.resolved.handData.handle_date}` }}</span>
                    <span class="text">{{ `处理原因: ${item.resolved.handData.handle_result}` }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div name="footer" class="dialog-footer">
      <el-button @click="hide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { handleInfotxSourceList, handleInfotxDetail } from '@/api/infotx'
import '../../style/index.scss'
import SearchForm from '@/components/searchForm'

export default {
  name: 'AlarmRecord',
  components: {
    SearchForm
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    index: {
      type: String,
      default: '1'
    },
    isResetFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      listQuery: {
        devId: '',
        cat: '',
        sensorType: ''
      },
      tabActiveName: '',
      indexToActive: {
        '1': 'fire',
        '2': 'fault',
        '3': 'other'
      },
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '上报来源：',
            name: 'sensorType',
            placeholder: '请选择上报来源',
            dataList: []
          }
        ]
      },
      fireData: {},
      faultData: {},
      otherData: {}
    }
  },
  watch: {
    isResetFlag(newVal) {
      this.listQuery.devId = this.id
      this.listQuery.cat = this.index
      this.tabActiveName = this.indexToActive[this.index]
      this.$nextTick(() => {
        this.$refs.searchForm.reset()
      })
      this._handleInfotxDetail()
    }
  },
  created() {
    this._handleInfotxSourceList()
  },
  methods: {
    _handleInfotxSourceList() {
      handleInfotxSourceList().then(res => {
        this.searchFormOption.config[0].dataList = res.data
      })
    },
    _handleInfotxDetail() {
      this.loading = true
      handleInfotxDetail(this.listQuery).then(res => {
        if (res.data) {
          this.fireData = res.data.list
          this.faultData = res.data.list
          this.otherData = res.data.list
        }
        this.loading = false
      })
    },
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    handleClick(tab, event) {
      switch (tab.index) {
        case '0':
          this.listQuery.cat = '1'
          this._handleInfotxDetail()
          break
        case '1':
          this.listQuery.cat = '2'
          this._handleInfotxDetail()
          break
        case '2':
          this.listQuery.cat = '3'
          this._handleInfotxDetail()
          break
        default:
          break
      }
    },
    handleFilter(data) {
      this.listQuery.sensorType = data.sensorType
      this._handleInfotxDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
