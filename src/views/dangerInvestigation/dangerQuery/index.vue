<template>
  <section class="main-wrapper checklist">
    <div class="search-box">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="record" @click="handleExport">导出隐患</el-button>
    </div>
    <div
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
      class="table-box"
    >
      <BaseTable
        :table-data="dangerList"
        :table-config="tableConfig"
        :border="false"
        :table-height="'100%'"
        :cell-class-name="cellClassName"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-if="row.status === 0"
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleEdit(row, '修改')"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                icon="el-icon-delete"
                type="danger"
                circle
                @click.stop="handleDelete(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="_getchkListDanger"
      />
    </div>
    <BaseForm
      ref="baseForm"
      :width="'1000px'"
      :parent-instance="this"
      :form-option="formOption"
      :is-reset-form-flag="isResetFormFlag"
      @updateData="updateData"
    >
      <template v-slot:dangerImage>
        <div style="color: #fff;display: flex;align-items: center;">
          <span>隐患图片</span>
          <div v-if="dangerImgs&&dangerImgs.length>0" class="img-wrapper">
            <el-image
              v-for="(img,index) in dangerImgs"
              :key="index"
              style="width: 100px; height: 100px"
              :src="img"
              :preview-src-list="[img]"
            />
          </div>
        </div>
      </template>
      <template v-slot:uploadFile>
        <span>整改图片</span>
        <upload-file
          ref="upload-file"
          :limit="5"
          :size="50"
          :list-type="'picture-card'"
          :accept="'.png,.jpg,.jpeg'"
          :file-list="fileList"
          @uploadSuccess="uploadSuccess"
          @addDeleteFileList="addDeleteFileList"
          @removeFile="removeFile"
        />
      </template>
    </BaseForm>
  </section>
</template>

<script>
import '@/styles/list.scss'
import UploadFile from '@/components/uploadFile'
import {
  getchkListDanger,
  gechkListDangerInfo,
  deleteChkListDanger
} from '@/api/chkList.js'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import formAction from '@/mixins/form.js'
import BaseForm from '@/components/baseForm'
export default {
  /* 检查任务 */
  name: 'ChkPlan',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: true,
      listQuery: {
        // 查询参数
        page: 1,
        limit: 10,
        officeName: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      dangerImgs: [],
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '单位:',
            name: 'officeName',
            placeholder: '请输入单位'
          },
          {
            type: 'select',
            label: '状态:',
            name: 'status',
            placeholder: '请选择状态',
            dataList: [
              {
                label: '未整改',
                value: 0
              },
              {
                label: '已整改',
                value: 5
              }
            ]
          },
          {
            type: 'date',
            label: '检查时间：',
            name: 'startTime',
            placeholder: '请选择检查时间'
          },
          {
            type: 'date',
            label: '检查结束时间：',
            name: 'endTime',
            placeholder: '请选择结束时间'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          label: '序号',
          type: 'index',
          prop: 'index',
          width: '55'
        },
        {
          prop: 'officeName',
          label: '隐患单位',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkDate',
          label: '发现时间',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.chkDate.split(' ')[0]
          }
        },
        {
          prop: 'content',
          label: '隐患内容',
          align: 'left',
          width: ''
        },
        {
          prop: 'levelLabel',
          label: '隐患级别',
          align: 'left',
          width: ''
        },
        {
          prop: 'dueDate',
          label: '整改期限',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.dueDate.split(' ')[0]
          }
        },
        {
          prop: 'status',
          label: '整改进度',
          align: 'left',
          width: '',
          'class-name': 'status',
          formatter: (row, column, cellValue, index) => {
            return row.status === 5 ? '已整改' : '未整改'
          }
        },
        {
          prop: 'chkUserName',
          label: '发现人',
          align: 'left',
          width: ''
        }
      ],
      dangerList: [],
      formOption: {
        config: [
          {
            label: '巡查点：',
            name: 'catName',
            type: 'text',
            labelWidth: '130px'
          },
          {
            type: 'text',
            label: '责任人：',
            name: 'type',
            labelWidth: '130px',
            dataList: []
          },
          {
            label: '发现人：',
            name: 'chkUserName',
            type: 'text',
            labelWidth: '130px'
          },
          {
            type: 'date',
            label: '发现时间：',
            name: 'chkDate',
            labelWidth: '130px'
          },
          {
            type: 'text',
            label: '隐患位置：',
            name: 'addr',
            colspan: true,
            labelWidth: '130px'
          },
          {
            type: 'textarea',
            label: '隐患内容：',
            name: 'content',
            colspan: true,
            labelWidth: '130px'
          },
          {
            type: 'textarea',
            label: '整改情况：',
            name: 'fixContent',
            colspan: true,
            labelWidth: '130px'
          },
          {
            type: 'date',
            label: '整改期限：',
            name: 'dueDate',
            labelWidth: '130px'
          },
          {
            type: 'select',
            label: '整改状态：',
            name: 'status',
            labelWidth: '130px',
            dataList: [
              {
                label: '未整改',
                value: 0
              },
              {
                label: '已整改',
                value: 5
              }
            ]
          },
          {
            type: 'slot',
            name: 'dangerImage',
            colspan: true
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ]
      }
    }
  },
  computed: {},
  created() {
    this._getchkListDanger()
  },
  methods: {
    // 获取检查表列表
    _getchkListDanger() {
      this.listLoading = true
      getchkListDanger(this.listQuery).then(res => {
        if (res.data) {
          this.dangerList = res.data.page.list.map(item => {
            return { ...item }
          })
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取检查表详情
    _getListInfo(data) {
      this.checkItems = []
      return new Promise((resolve, reject) => {
        gechkListDangerInfo({ id: data.id })
          .then(res => {
            if (res.data && res.data.listImage) {
              this.dangerImgs = res.data.listImage.map(item => {
                return item.url
              })
              resolve(res.data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除隐患
    deleteData(data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      deleteChkListDanger(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._getchkListDanger()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._getchkListDanger()
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 7) {
        if (row.status !== 5) {
          return 'error'
        } else {
          return 'success'
        }
      } else {
        return ''
      }
    },
    updateData() {},
    async handleExport() {
      const tHeader = this.tableConfig.map(item => {
        if (item.label) {
          return item.label
        }
      })
      const filterVal = this.tableConfig.map(item => {
        if (item.prop) {
          return item.prop
        }
      })
      const data = (await this.formatJson(filterVal.slice(1))) || []
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader.slice(1),
          data,
          filename: '隐患'
        })
      })
    },
    formatJson(filterVal) {
      return new Promise((resolve, reject) => {
        let data = []
        const query = this.$refs.searchForm.getSearchQuery()
        const listQuery = { ...this.listQuery, ...query, page: -1, limit: 0 }
        getchkListDanger(listQuery)
          .then(res => {
            if (res.data) {
              data = res.data.page.list
            }
            resolve(
              data.map((v, index) =>
                filterVal.map((j) => {
                  if (j === 'index') {
                    return index + 1
                  } else if (j === 'status') {
                    return v.status === 5 ? '已整改' : '未整改'
                  } else {
                    return v[j]
                  }
                })
              )
            )
          })
          .catch(reject)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
.checklist {
  .el-dialog__body {
    height: 500px !important;
  }
  .el-form-item .el-table .el-form-item {
    border-right: none !important;
    border-bottom: none !important;
  }
  .el-form-item .el-table {
    margin-right: 0;
  }
  .el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    background: transparent;
  }
  .el-table .el-table__body tr {
    .error {
      color: red;
    }
    .success {
      color: green;
    }
  }
  .el-image {
    margin-right: 10px;
  }
  .flex {
    .cell {
      display: flex;
      align-items: center;
      .el-form-item {
        flex: 1 !important;
      }
    }
  }
}
</style>
