<template>
  <div class="staffworkitem-container">
    <el-dialog
      v-if="innerVisible"
      class="staffworkitem-container dark"
      title="巡查点信息"
      :visible.sync="innerVisible"
      width="800px"
      append-to-body
    >
      <div class="staffworkitem-content">
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
            :table-data="tableList"
            :table-config="tableConfig"
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
              <el-form-item label="隐患内容：" style="flex: 0 1 100%;">
                <el-input v-model="item.content" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
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
            <el-col :span="24">
              <el-form-item label="查看详情：">
                <el-button
                  class="hidden-btn"
                  round
                  size="mini"
                  @click="handlerViewDangerDetail(item)"
                >详情</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <HiddenDangerStatus ref="HiddenDangerStatus" :danger-info-data="dangerInfoData" />
  </div>
</template>

<script>
import { getDangerInfo, handlerDownload } from '@/api/office'

import '../style/index.scss'
import BaseTable from '@/components/baseTable'
import HiddenDangerStatus from '@/components/HiddenDangerStatus'

export default {
  name: 'StaffWorkItem',
  components: {
    BaseTable,
    HiddenDangerStatus
  },
  props: {
    mationData: {
      type: Object,
      default: () => {}
    },
    tableList: {
      type: Array,
      default: () => []
    },
    dangerData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listLoading: false,
      innerVisible: false,
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
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
      dangerInfoData: [],
      activeImg: -1,
      fillImageSrc: []
    }
  },
  methods: {
    handlerShow() {
      this.innerVisible = true
    },
    handlerHide() {
      this.innerVisible = false
    },
    // 打开隐患详情
    handlerViewDangerDetail(data) {
      this.$refs.HiddenDangerStatus.handlerShow()
      getDangerInfo({ danger_id: data.id }).then(res => {
        if (res.data) {
          this.dangerInfoData = res.data.list
        }
      })
    },
    // 文档流方法
    handleInitImgBtn(index, img, id) {
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
    _handlerDownload(fileId) {
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
    handleInitList(id, data) {
      const imgData = data.filter(item => {
        return item.id === id
      })
      return imgData[0].list || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
