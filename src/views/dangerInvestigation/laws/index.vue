<template>
  <section class="main-wrapper checklist">
    <div class="search-box">
      <SearchForm ref="searchForm" :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
    </div>
    <div
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
      class="table-box"
    >
      <BaseTable
        :loading="listLoading"
        :table-config="tableConfig"
        :table-data="dangerList"
        :border="false"
        :table-height="'100%'"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          width="300"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
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
        @pagination="_lawList"
      />
    </div>
    <BaseForm
      ref="baseForm"
      :width="'1000px'"
      :parent-instance="this"
      :form-option="formOption"
      :is-reset-form-flag="isResetFormFlag"
      @updateData="updateData"
      @createData="createData"
    />
  </section>
</template>

<script>
import '@/styles/list.scss'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import formAction from '@/mixins/form.js'
import BaseForm from '@/components/baseForm'
import { lawList, lawSave, lawUpdate, lawDetail, lawDelete } from '@/api/laws.js'

export default {
  /* 检查任务 */
  name: 'ChkPlan',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: true,
      listQuery: {
        // 查询参数
        page: 1,
        limit: 10,
        desc: '',
        type: ''
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '标准名称:',
            name: 'desc',
            placeholder: '请输入标准名称'
          },
          {
            type: 'text',
            label: '类型:',
            name: 'type',
            placeholder: '请选择类型'
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
          prop: 'id',
          width: '55'
        },
        {
          prop: 'standardTitle',
          label: '标准名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'standardType',
          label: '类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'referenceNumber',
          label: '文号',
          align: 'left',
          width: ''
        },
        {
          prop: 'publicDate',
          label: '实施时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'isPublic',
          label: '是否公开',
          align: 'left',
          width: '',
          formatter: (row, column, cellValue, index) => {
            return row.isPublic === 0 ? '公开' : '未公开'
          }
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'left',
          width: ''
        }
      ],
      dangerList: [],
      formOption: {
        config: [
          {
            label: '标准名称',
            name: 'standardTitle',
            type: 'text',
            labelWidth: '130px',
            colspan: true
          },
          {
            type: 'text',
            label: '类型：',
            name: 'standardType',
            labelWidth: '130px'
          },
          {
            label: '文号：',
            name: 'referenceNumber',
            type: 'text',
            labelWidth: '130px'
          },
          {
            type: 'date',
            label: '实施时间：',
            name: 'publicDate',
            labelWidth: '130px'
          },
          {
            type: 'radio',
            label: '是否公开：',
            name: 'isPublic',
            labelWidth: '130px',
            dataList: [
              {
                text: '公开',
                index: 0
              },
              {
                text: '未公开',
                index: 1
              }
            ]
          },
          {
            type: 'textarea',
            label: '备注：',
            name: 'remarks',
            colspan: true,
            labelWidth: '130px'
          }
        ],
        rules: {
          standardType: [
            {
              required: true,
              message: '请输入类型',
              trigger: 'blur'
            }
          ],
          standardTitle: [
            {
              required: true,
              message: '请输入标准名称',
              trigger: 'blur'
            }
          ],
          referenceNumber: [
            {
              required: true,
              message: '请输入文号',
              trigger: 'blur'
            }
          ],
          publicDate: [
            {
              required: true,
              message: '请选择实施日期',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  computed: {},
  created() {
    this._lawList()
  },
  methods: {
    // 获取检查表列表
    _lawList() {
      this.listLoading = true
      lawList(this.listQuery).then(res => {
        if (res.data) {
          this.dangerList = res.data.page.list
          this.total = res.data.page.totalCount
        }
        this.listLoading = false
      })
    },
    // 获取检查表详情
    _getListInfo(data) {
      return new Promise((resolve, reject) => {
        lawDetail({ id: data.id })
          .then(res => {
            resolve(res.data.checkStandard)
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
      lawDelete(list).then(res => {
        if (res.msg === 'ok') {
          this._lawList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._lawList()
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
      this._lawList()
    },
    // 新增数据
    createData(data) {
      lawSave(data).then(res => {
        if (res.msg === 'ok') {
          this._lawList()
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增失败',
            type: 'error'
          })
        }
      })
    },
    updateData(data) {
      lawUpdate({ ...data, id: this.id }).then(res => {
        if (res.msg === 'ok') {
          this._lawList()
          this.$message({
            message: '修改危化品明细成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改危化品明细失败',
            type: 'error'
          })
        }
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
