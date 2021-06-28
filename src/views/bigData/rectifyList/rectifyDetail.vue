<template>
  <section class="inspect-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="rectified" @click="handleFilterBtn('0')">未整改</el-button>
      <el-button class="rectification" @click="handleFilterBtn('1')">整改中</el-button>
      <el-button class="reviewed" @click="handleFilterBtn('2')">待审核</el-button>
      <el-button class="archived" @click="handleFilterBtn('5')">已存档</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div
      v-loading="listLoading"
      class="table-box"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <BaseTable
        :table-config="tableConfig"
        :table-data="dangerList"
        :table-height="'600px'"
        :border="false"
        @rowClick="viewDangerDetail($event, '查看')"
      />
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        @pagination="_getDangerList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->

    <HiddenDangerStatus
      ref="hiddenDangerStatus"
      :danger-id="dangerId"
      :danger-info-data="dangerInfoData"
    />

    <el-dialog
      v-if="superviseDialogVisible"
      class="dark superviseDialog"
      :destroy-on-close="true"
      v-model:visible="superviseDialogVisible"
      width="400px"
    >
      <div name="title" class="dialog-title">审核隐患</div>
      <div class="dialog-content">
        <el-form ref="form" :model="superviseForm" :inline="true" :rules="superviseRule">
          <el-form-item label="督办意见" prop="options">
            <el-input v-model="superviseForm.options" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hideSupervise">关闭</el-button>
        <el-button @click="submitSupervise">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import {
  getDict,
  getDangerList,
  getDangerInfo,
  dangerDelete,
  dangerSupervise
} from '@/api/office'
import '@/views/fireManage/fireInspection/style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import HiddenDangerStatus from '@/components/HiddenDangerStatus'

export default {
  /* 隐患档案 */
  name: 'FirePlan',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    HiddenDangerStatus
  },
  mixins: [formAction],
  props: {
    isShowComp: {
      type: Boolean,
      default: true
    },
    detail: {
      type: Object,
      default: () => {}
    },
    query: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      listLoading: false,
      superviseDialogVisible: false,
      officeId: '',
      superviseForm: {
        options: '' // 督办意见
      },
      superviseRule: {
        options: [
          { required: true, message: '请输入督办意见', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        level: '',
        chkDate: '',
        dataType: '',
        type: null
      },
      dialogVisible: '',
      dangerId: '',
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '隐患级别:',
            name: 'level',
            placeholder: '请选择隐患级别',
            dataList: []
          },
          // {
          //   type: 'quarterDate',
          //   label: '操作时间:',
          //   name: 'chkDate',
          //   placeholder: '请选择操作时间',
          //   defaultDateValue: '2021年第2季度'
          // }
          {
            type: 'select',
            label: '汇总口径:',
            name: 'type',
            placeholder: '请选择',
            defaultValue: 1,
            dataList: [
              {
                value: 0,
                label: '季度'
              },
              {
                value: 1,
                label: '月'
              },
              {
                value: 2,
                label: '天'
              }
            ]
          },
          {
            type: 'date',
            label: '查询日期:',
            name: 'chkDate',
            placeholder: '请选择',
            defaultDateValue: ''
          }
        ]
      },
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'content',
          label: '隐患内容',
          align: 'left',
          width: ''
        },
        {
          prop: 'statusVal',
          label: '隐患状态',
          align: 'left',
          width: ''
        },
        {
          prop: 'levelVal',
          label: '隐患级别',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkUserName',
          label: '发现人',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkDate',
          label: '发现日期',
          align: 'left',
          width: ''
        },
        {
          prop: 'dueDate',
          label: '整改期限',
          align: 'left',
          width: ''
        },
        {
          prop: 'fixDate',
          label: '整改时间',
          align: 'left',
          width: ''
        }
      ],
      total: 0,
      dangerList: [],
      dangerInfoData: [],
      statusOptions: {
        newNum: 0,
        processNum: 1,
        auditingNum: 2,
        doneNum: 5
      }
    }
  },
  created () {
    this.listQuery.chkDate = this.detail.chkDate
    this.listQuery.status = this.statusOptions[this.detail.status] || this.statusOptions[this.detail.status] === 0 ? this.statusOptions[this.detail.status] : ''
    this.listQuery.dataType = this.query.type
    // this.searchFormOption.config.map(ele => {
    //   if (ele.name === 'type') {
    //     ele.defaultValue = this.detail.type
    //   }
    //   if (ele.name === 'chkDate') {
    //     const time = this.detail.chkDate.replace(/[^\d]/g, '-')
    //     const date = time.substring(0, time.lastIndexOf('-'))
    //     console.log('时间的修改', date)
    //     ele.defaultDateValue = this.detail.chkDate
    //   }
    // })
    // this.listQuery.type = this.detail.type
    this._getDangerList()
    this._getDict()
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery.level = data.level
      this.listQuery.chkDate = data.chkDate
      this._getDangerList()
    },
    handleFilterBtn (status) {
      this.listQuery.status = status
      this._getDangerList()
    },
    // 获取字典值
    _getDict () {
      getDict({
        type: 'chk_danger_level'
      }).then(res => {
        if (res.data) {
          this.searchFormOption.config[0].dataList = res.data.dicts
        }
      })
    },
    // 获取列表
    _getDangerList () {
      this.listLoading = true
      getDangerList(this.listQuery).then(res => {
        if (res.data) {
          this.dangerList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 打开隐患详情
    viewDangerDetail (data) {
      getDangerInfo({ danger_id: data.id }).then(res => {
        if (res.data) {
          this.dangerInfoData = res.data.list
          this.dangerId = data.id
          this.$refs.hiddenDangerStatus.handlerShow()
        }
      })
    },
    // 打开督办页面
    openSupervise (data) {
      this.superviseDialogVisible = true
      this.officeId = data.officeId
      this.dangerId = data.id
    },
    // 关闭督办页面
    hideSupervise () {
      this.superviseDialogVisible = false
      this.options = ''
    },
    // 督办
    submitSupervise () {
      this.$refs.form.validate(valid => {
        if (valid) {
          dangerSupervise({
            masterId: this.dangerId,
            officeId: this.officeId,
            superviseOpinion: this.superviseForm.options
          }).then(res => {
            if (res.msg === 'ok') {
              this.$message({
                type: 'success',
                message: '督办成功'
              })
              this.hideSupervise()
            }
          })
        }
      })
    },
    // 删除数据
    deleteData (data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      dangerDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getDangerList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.superviseDialog {
  .el-dialog__body {
    padding: 0 15px;
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
