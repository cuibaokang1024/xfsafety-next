<template>
  <div class="hiddendangerstatus-container">
    <el-dialog
      v-if="dialogVisible"
      class="hiddendangerstatus-dialog dark"
      title="查看隐患状态"
      v-model:visible="dialogVisible"
      width="1382px"
      :append-to-body="true"
    >
      <div class="dialog-content container-position">
        <el-steps :active="stepActive" finish-status="success">
          <div
            v-for="item in dangerInfoList"
            :key="item.id"
            class="el-step-container"
            :class="item.className || ''"
          >
            <el-step :title="dangerStatus[item.status]" :status="stepStatus[item.status]" />
            <div v-if="item.handleDate !== false" class="step-title">
              <!-- 整改状态
              --  (status: 0未整改; 1整改中; 2待审核; 3审核通过; 4审核不通过; 5已存档)
              -->
              <span v-if="item.status === 0">发现日期：</span>
              <span v-if="item.status === 1">整改期限：</span>
              <span v-if="item.status === 2">整改日期：</span>
              <span v-if="item.status === 3">审核日期：</span>
              <span v-if="item.status === 4">审核日期：</span>
              <span v-if="item.status === 5">存档日期：</span>
              <span v-if="item.status === 1">
                <span>{{ item.dueDate }}</span>
              </span>
              <span v-else>
                <span>{{ item.handleDate }}</span>
              </span>
            </div>
            <div v-if="item.handleDate !== false" class="step-info">
              <div v-if="item.status === 0">
                <div class="info-text">
                  <div class="info-tit">隐患内容：</div>
                  <div class="info-txt">{{ item.content }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">隐患位置：</div>
                  <div class="info-txt">{{ item.addr }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">发现人：</div>
                  <div class="info-txt">{{ item.handleUserName }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">隐患等级：</div>
                  <div class="info-txt">{{ item.levelName }}</div>
                </div>
                <div v-if="item.imageUrl" class="info-text">
                  <div class="info-tit">隐患图片：</div>
                  <div class="info-img">
                    <el-image
                      v-if="item.imageUrl"
                      style="width: 80px; height: 110px"
                      :src="item.imageUrl && item.imageUrl.split(',')[0]"
                      :preview-src-list="item.imageUrl.split(',')"
                    />
                    <!-- <img
                      style="width: 80px; height: 110px; cursor: pointer;"
                      :src="item.imageUrl && item.imageUrl.split(',')[0]"
                      @click="handleOpenViewer"
                    >
                    <el-image-viewer
                      v-if="showViewer"
                      :url-list="item.imageUrl.split(',')"
                      :on-close="handleCloseViewer"
                    />-->
                  </div>
                  <span> x {{ item.imageUrl.split(',').length }}</span>
                </div>
              </div>
              <div v-if="item.status === 1">
                <div class="info-text">
                  <div class="info-tit">整改人：</div>
                  <div class="info-txt">{{ item.handleUserName }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">整改部门：</div>
                  <div class="info-txt">{{ item.handleDeptName }}</div>
                </div>
              </div>
              <div v-if="item.status === 2">
                <div class="info-text">
                  <div class="info-tit">整改内容：</div>
                  <div class="info-txt">{{ item.content }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">整改人：</div>
                  <div class="info-txt">{{ item.handleUserName }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">整改部门：</div>
                  <div class="info-txt">{{ item.handleDeptName }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">整改图片：</div>
                  <div class="info-img">
                    <el-image
                      v-if="item.imageUrl"
                      style="width: 80px; height: 110px"
                      :src="item.imageUrl && item.imageUrl.split(',')[0]"
                      :preview-src-list="item.imageUrl.split(',')"
                    />
                  </div>
                </div>
                <div v-if="handlerIsLastItem(item)" class="info-btn">
                  <button class="success" @click="handlerAuditOK(item.dangerId)">审核通过</button>
                  <button class="fail" @click="handlerAuditNO(item.dangerId)">审核不通过</button>
                </div>
              </div>
              <div v-if="item.status === 3">
                <div class="info-text">
                  <div class="info-tit">审核人：</div>
                  <div class="info-txt">{{ item.handleUserName }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">审核部门：</div>
                  <div class="info-txt">{{ item.handleDeptName }}</div>
                </div>
              </div>
              <div v-if="item.status === 4">
                <div class="info-text">
                  <div class="info-tit">审核意见：</div>
                  <div class="info-txt">{{ item.content }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">审核人：</div>
                  <div class="info-txt">{{ item.handleUserName }}</div>
                </div>
                <div class="info-text">
                  <div class="info-tit">审核部门：</div>
                  <div class="info-txt">{{ item.handleDeptName }}</div>
                </div>
              </div>
              <div v-if="item.status === 5">
                <div class="info-text" v-html="replaceStr(item.content)" />
              </div>
              <div class="step-trian" />
            </div>
          </div>
        </el-steps>
      </div>
      <span name="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="auditDialogVisible"
      class="dark auditDialog"
      :destroy-on-close="true"
      v-model:visible="auditDialogVisible"
      width="400px"
    >
      <div name="title" class="dialog-title">审核隐患</div>
      <div class="dialog-content">
        <el-form ref="form" :inline="true" :model="form">
          <el-form-item label="审核意见">
            <el-input v-model="form.content" type="textarea" />
          </el-form-item>
          <el-form-item v-if="auditStatus==='no'" style="margin-bottom: 0;" label="重新整改期限">
            <el-date-picker
              v-model="form.dueDate"
              type="datetime"
              placeholder="选择时间"
              align="right"
            />
          </el-form-item>
        </el-form>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hideAudit">关 闭</el-button>
        <el-button :loading="auditLoading" @click="submitAudit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import './style/index.scss'
import { auditOK, auditNO } from '@/api/office'

// import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'HiddenDangerStatus',
  // components: {
  //   ElImageViewer
  // },
  props: {
    dangerInfoData: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      /* * 整改状态
       *   (status: 0未整改; 1整改中; 2待审核; 3审核通过; 4审核不通过; 5已存档)
       */
      dialogVisible: false,
      auditDialogVisible: false,
      stepActive: 0,
      auditStatus: '',
      dangerId: '',
      auditLoading: false,
      showViewer: false,
      form: {
        content: '',
        dueDate: ''
      },
      dangerStaticData: [
        {
          id: '1',
          status: 0,
          handleDate: false,
          className: 'step-icon-static'
        },
        {
          id: '2',
          status: 1,
          handleDate: false,
          className: 'step-icon-static'
        },
        {
          id: '3',
          status: 2,
          handleDate: false,
          className: 'step-icon-static'
        },
        {
          id: '4',
          status: 5,
          handleDate: false,
          className: 'step-icon-static'
        }
      ],
      dangerStatus: [
        '未整改',
        '整改中',
        '待审核',
        '审核通过',
        '审核不通过',
        '已存档'
      ],
      stepStatus: ['wait', 'proces', 'wait', 'finish', 'error', 'finish']
    }
  },
  computed: {
    dangerInfoList () {
      const length = this.dangerInfoData.length
      const list = this.dangerStaticData.slice()
      list.splice(0, length)
      return [...this.dangerInfoData, ...list]
    }
  },
  methods: {
    handlerIsLastItem (data) {
      const index = this.dangerInfoData.findIndex(item => {
        return item.id === data.id
      })
      if (index + 1 < this.dangerInfoData.length) {
        return false
      } else {
        return true
      }
    },
    handlerShow () {
      this.dialogVisible = true
    },
    handlerHide () {
      this.dialogVisible = false
    },
    replaceStr (data) {
      let string = ''
      try {
        string = data.replace(/\r\n/g, '<br>')
        string = data.replace(/\n/g, '<br>')
      } catch (e) {
        alert(e.message)
      }
      return string
    },
    handlerAuditOK (id) {
      this.dangerId = id
      this.auditDialogVisible = true
      this.auditStatus = 'ok'
    },
    handlerAuditNO (id) {
      this.dangerId = id
      this.auditDialogVisible = true
      this.auditStatus = 'no'
    },
    submitAudit () {
      if (this.auditStatus === 'ok') {
        this.auditLoading = true
        auditOK({ ...this.form, id: this.dangerId })
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.hideAudit()
              // this.handlerHide()
            }
            this.auditLoading = false
          })
          .catch(() => {
            this.auditLoading = false
          })
      } else {
        this.auditLoading = true
        auditNO({ ...this.form, id: this.dangerId })
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.hideAudit()
              // this.handlerHide()
            }
            this.auditLoading = false
          })
          .catch(() => {
            this.auditLoading = false
          })
      }
    },
    hideAudit () {
      this.dangerId = ''
      this.form = {
        content: '',
        dueDate: ''
      }
      this.auditDialogVisible = false
    },
    handleOpenViewer () {
      this.showViewer = true
    },
    handleCloseViewer () {
      this.showViewer = false
    }
  }
}
</script>

<style lang="scss">
.auditDialog {
  .el-dialog__body {
    padding: 0 15px;

    .el-form-item {
      width: 100%;
    }
  }
}
</style>
