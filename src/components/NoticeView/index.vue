<template>
  <div class="noticeView-main">
    <el-dialog
      v-if="dialogVisible"
      class="dark noticeView-dialog"
      v-model:visible="dialogVisible"
      append-to-body
      width="1000px"
    >
      <div name="title" class="dialog-title">查看</div>
      <div class="dialog-content">
        <el-scrollbar>
          <el-main>
            <div class="noticeView-title">
              <div class="noticeView-title-left">
                <div>
                  <i class="user" />
                  <span>发布人：</span>
                  <span>{{ formData.createByName }}</span>
                </div>
                <div>
                  <i class="time" />
                  <span>发布时间：</span>
                  <span>{{ formData.createDate }}</span>
                </div>
              </div>
              <div v-if="noticeFlag === 'issue'" class="noticeView-title-right">
                <span>查阅(已读/未读)：</span>
                <span>{{ formData.readNum }}</span>
                <span>/</span>
                <span class="num">{{ formData.unReadNum }}</span>
                <el-button
                  size="mini"
                  type="primary"
                  round
                  @click="handleInitConsult"
                >详情</el-button>
              </div>
            </div>
            <el-divider />
            <el-form
              class="noticeView-form"
              :model="formData"
              :rules="rules"
              :disabled="true"
            >
              <el-col :span="12">
                <el-form-item label="标题:" prop="title">
                  <el-input
                    v-model="formData.title"
                    placeholder="请输入内容"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型:" prop="type">
                  <el-select v-model="formData.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容:" prop="content">
                  <div class="content">
                    <div>{{ formData.content }}</div>
                    <div v-if="imageList.length > 0" class="swiper-main">
                      <div class="swiper-container">
                        <div class="swiper-wrapper">
                          <div
                            v-for="item in imageList"
                            :key="item.item"
                            class="swiper-slide"
                          >
                            <el-image
                              style="width: 400px; height: 280px"
                              :src="item.url"
                              fit="fill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="imageList.length > 0" class="swiper-bot">
                      <span class="swiper-tips">可滑动查看图片</span>
                      <span
                        class="swiper-more"
                        @click="handleShowViewer"
                      >查看大图</span>
                    </div>
                    <image-viewer
                      v-if="showViewer"
                      :on-close="handleHideViewer"
                      :url-list="showViewerList"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="附件:" prop="file">
                  <div class="file-table">
                    <BaseTable
                      :loading="listLoading"
                      :table-config="tableConfig"
                      :table-data="tableData"
                      :border="false"
                    >
                      <el-table-column
                        label="图标"
                        align="left"
                        width="100"
                        class-name="small-padding fixed-width"
                      >
                        <template v-slot="{ row }">
                          <div
                            class="notice-icon"
                            :class="row.suffix | suffixClass"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        align="left"
                        width="100"
                        class-name="small-padding fixed-width"
                      >
                        <template v-slot="{ row }">
                          <div class="notice-down" @click="handleFileDown(row)">
                            下载
                          </div>
                        </template>
                      </el-table-column>
                    </BaseTable>
                  </div>
                </el-form-item>
              </el-col>
            </el-form>
          </el-main>
        </el-scrollbar>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <Consult ref="Consult" :notify-id="notifyId" />
  </div>
</template>

<script>
import { getDict, handleOfficeOanotifyDetail } from '@/api/companyHome'

import BaseTable from '@/components/baseTable'
import Consult from '@/components/Consult'
import Swiper from 'swiper'
import 'swiper/swiper.scss'
import ImageViewer from 'element-plus'
import download from '@/utils/fileDownload'
import { handlerDownload } from '@/api/office'

export default {
  name: 'NoticeView',
  components: {
    BaseTable,
    Consult,
    ImageViewer
  },
  filters: {
    suffixClass (suffix) {
      let className = ''
      if (suffix === 'xls' || suffix === 'xlsx') {
        className = 'xls'
      } else if (suffix === 'doc' || suffix === 'docx') {
        className = 'doc'
      } else if (suffix === 'pdf') {
        className = 'pdf'
      } else if (suffix === 'ppt') {
        className = 'ppt'
      } else {
        className = 'other'
      }
      return className
    }
  },
  props: {
    viewId: {
      type: [String, Number],
      default: ''
    },
    noticeFlag: {
      type: String,
      default: 'issue'
    }
  },
  data () {
    return {
      listLoading: false,
      dialogVisible: false,
      showViewer: false,
      read: '',
      tableConfig: [
        {
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'size',
          label: '大小',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      imageList: [],
      formData: {},
      rules: {
        title: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ]
      },
      typeList: [],
      showViewerList: [],
      notifyId: ''
    }
  },
  watch: {
    viewId (newVal, oldVal) {
      this._getDict()
      this._getListInfo(newVal)
    }
  },
  methods: {
    // 获取字典值
    _getDict () {
      getDict({
        type: 'oa_notify_type'
      }).then((res) => {
        if (res.data) {
          this.typeList = res.data.dicts
        }
      })
    },
    // 详情信息
    _getListInfo (id) {
      return new Promise((resolve, reject) => {
        if (this.noticeFlag === 'issue') {
          this.read = ''
        } else if (this.noticeFlag === 'receive') {
          this.read = '1'
        }
        handleOfficeOanotifyDetail({ id, read: this.read })
          .then((res) => {
            if (res.data) {
              this.formData = res.data
              this.tableData = res.data.fileList
              this.imageList = res.data.imageList
              this.$nextTick(() => {
                new Swiper('.swiper-container', {
                  slidesPerView: 2,
                  spaceBetween: 10,
                  freeMode: true
                })
              })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    handleInitConsult () {
      this.notifyId = this.formData.id
      this.$refs.Consult.handleShow()
    },
    handleFileDown (data) {
      handlerDownload({ fileId: data.fileId }).then((res) => {
        download(res.data, data.name)
      })
    },
    handleShow () {
      this.dialogVisible = true
      this.$nextTick(() => {
        new Swiper('.swiper-container', {
          slidesPerView: 2,
          spaceBetween: 10,
          freeMode: true
        })
      })
    },
    handleHide () {
      this.dialogVisible = false
    },
    handleShowViewer () {
      this.showViewerList = this.imageList.map((item) => {
        return item.url
      })
      this.showViewer = true
    },
    handleHideViewer () {
      this.showViewer = false
    }
  }
}
</script>

<style lang="scss">
.noticeView-dialog {
  .dialog-content {
    height: 520px;
    background: rgba(255, 255, 255, 0.07);

    .el-main {
      .noticeView-title {
        display: flex;
        justify-content: space-between;

        span {
          font-size: 14px;
          color: #fff;
        }

        .noticeView-title-left {
          display: flex;
          line-height: 20px;

          .user {
            margin-right: 10px;
            padding: 1px 9px;
            background: url(./image/user.png) 0 0 no-repeat;
          }

          .time {
            margin-left: 24px;
            margin-right: 10px;
            padding: 1px 9px;
            background: url(./image/time.png) 0 0 no-repeat;
          }
        }

        .noticeView-title-right {
          .num {
            color: #00fcff;
          }

          .el-button {
            padding: 2px 10px;
            background: #0084bb;
            border: 1px solid #0084bb;
            border-radius: 10px;
          }
        }
      }

      .el-divider {
        margin: 12px 0;
        background-color: #12458c;
      }

      .noticeView-form {
        .el-form-item {
          display: flex;

          .content {
            color: #97c1ff;
            padding: 0px 10px;
            text-align: left;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.1);

            .swiper-main {
              height: 280px;

              .swiper-container {
                height: 100%;
                overflow: hidden;

                .swiper-slide {
                  width: 400px;
                  height: 280px;
                }
              }
            }

            .swiper-bot {
              display: flex;
              justify-content: space-between;

              span {
                font-size: 12px;
                color: #5185f5;
              }

              .swiper-more {
                font-size: 12px;
                padding-right: 6px;
                text-align: right;
                cursor: pointer;

                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }

          .file-table {
            line-height: 18px;

            .notice-icon {
              width: 14px;
              height: 14px;
              margin-left: 8px;

              &.xls {
                background: url(./image/xls.png) 0 0 no-repeat;
              }

              &.pdf {
                background: url(./image/pdf.png) 0 0 no-repeat;
              }

              &.ppt {
                background: url(./image/ppt.png) 0 0 no-repeat;
              }

              &.doc {
                background: url(./image/doc.png) 0 0 no-repeat;
              }

              &.other {
                background: url(./image/other.png) 0 0 no-repeat;
              }
            }

            .notice-down {
              width: 54px;
              height: 26px;
              text-align: center;
              line-height: 28px;
              color: #fff;
              font-size: 12px;
              border-radius: 20px;
              background: #0cc3b4;
              cursor: pointer;
            }
          }

          .el-form-item__label {
            width: 60px;
          }

          .el-form-item__content {
            width: calc(100% - 60px);
          }

          .el-select {
            width: 100%;
          }
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
</style>
