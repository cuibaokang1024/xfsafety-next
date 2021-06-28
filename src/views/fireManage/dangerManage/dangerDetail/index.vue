<template>
  <div class="danger-main">
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
    </div>
    <div
      v-loading="listLoading"
      class="table-box"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <base-table
        :table-config="tableConfig"
        :table-data="tableData"
        :default-expand-all="true"
        :border="false"
        @rowClick="handleView($event, '查看')"
      >
        <el-table-column label="操作" align="left" width="230" class-name="small-padding fixed-width">
          <template v-slot="{ row }">
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
      </base-table>
    </div>
    <div class="pagination-box">
      <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_handlerAgentManaList"
      />
    </div>
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :form-loading="formLoading"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
      />
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/baseTable'
import formAction from '@/mixins/form.js'
import SearchForm from '@/components/searchForm'
import BaseForm from '@/components/baseForm'
import '../style/index.scss'
import Pagination from '@/components/Pagination'
import {
  getDict, handleSecDeptList, handleDangerDelList, handleDangerDelSearch,
  handleDangerDelCreate, handleDangerDelUpdate, handleDangerDelDelete, handleTypeList
} from '@/api/danger'
import { phoneAndTel } from '@/utils'

export default {
  // 危化品明细
  name: 'DangerDetail',
  components: {
    BaseTable,
    BaseForm,
    SearchForm,
    Pagination
  },
  mixins: [formAction],
  data () {
    var phoneAndTelCheck = (rule, value, callback) => {
      if (value) {
        if (!phoneAndTel(value)) {
          callback(new Error('请输入正确的手机号或者电话'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: '',
        deptId: '',
        typeName: '',
        chemicalType: ''
      },
      detailData: {},
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '名称：',
            name: 'name',
            placeholder: '请输入名称',
            maxlength: 64
          },
          {
            type: 'treeSelect',
            label: '所属部门',
            name: 'deptId',
            placeholder: '请选择所属部门',
            treeSelectOption: {
              title: '选择所属部门',
              name: 'deptName',
              request: {
                url: '/system/api/dept/findList',
                params: {}
              }
            }
          },
          {
            type: 'treeSelect',
            label: '物品种类：',
            name: 'type',
            placeholder: '请选择物品种类',
            treeSelectOption: {
              title: '选择物品种类',
              name: 'typeName',
              request: {
                url: 'fire/api/chechemicaltype/list',
                params: {}
              }
            }
          },
          {
            type: 'select',
            label: '危化品类别',
            name: 'chemicalType',
            placeholder: '请选择危化品类别',
            dataList: []
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
          prop: 'name',
          label: '名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '物品种类',
          align: 'left',
          width: ''
        },
        {
          prop: 'chemicalTypeName',
          label: '危化品类别',
          align: 'left',
          width: ''
        },
        {
          prop: 'deptName',
          label: '所属部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'address',
          label: '详细地址',
          align: 'left',
          width: ''
        },
        {
          prop: 'inventory',
          label: '储量',
          align: 'left',
          width: ''
        },
        {
          prop: 'contact',
          label: '联系方式',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateBy',
          label: '更新人',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      formOption: {
        config: [
          {
            label: '所属部门:',
            name: 'deptId',
            type: 'treeSelect',
            labelWidth: '100px',
            colspan: true,
            treeSelectOption: {
              title: '选择所属部门',
              name: 'deptName',
              request: {
                url: '/system/api/dept/findList',
                params: {}
              }
            }
          },
          {
            label: '物品名称:',
            name: 'name',
            type: 'text',
            labelWidth: '100px',
            colspan: true,
            maxlength: 64
          },
          {
            label: '物品种类:',
            name: 'type',
            type: 'treeSelect',
            labelWidth: '100px',
            treeSelectOption: {
              title: '选择物品种类',
              name: 'typeName',
              request: {
                url: 'fire/api/chechemicaltype/list',
                params: {}
              }
            }
          },
          {
            label: '物品用途:',
            name: 'purpose',
            type: 'select',
            labelWidth: '100px',
            dataList: []
          },
          {
            label: '详细地址:',
            name: 'address',
            type: 'text',
            labelWidth: '100px',
            colspan: true,
            maxlength: 225
          },
          {
            label: '经纬度:',
            name: 'lnglat',
            type: 'mapSelect',
            labelWidth: '100px',
            treeSelectOption: {
              name: 'address'
            },
            colspan: true
          },
          {
            label: '负责人:',
            name: 'master',
            type: 'text',
            labelWidth: '100px',
            maxlength: 20
          },
          {
            label: '联系方式:',
            name: 'contact',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '单位:',
            name: 'unit',
            type: 'select',
            labelWidth: '100px',
            dataList: []
          },
          {
            label: '危化品类别:',
            name: 'chemicalType',
            type: 'select',
            labelWidth: '100px',
            dataList: []
          },
          {
            label: '备注:',
            name: 'remarks',
            type: 'textarea',
            labelWidth: '100px',
            colspan: true,
            maxlength: 250
          }
        ],
        rules: {
          deptId: [
            {
              required: true,
              message: '请输入编号',
              trigger: 'blur'
            }
          ],
          contact: [{ validator: phoneAndTelCheck, trigger: 'blur' }],
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          chemicalType: [
            {
              required: true,
              message: '请选择危化品类别',
              trigger: 'blur'
            }
          ],
          purpose: [
            {
              required: true,
              message: '请选择物品用途',
              trigger: 'blur'
            }
          ],
          unit: [
            {
              required: true,
              message: '请选择单位',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择物品种类',
              trigger: 'blur'
            }
          ],
          address: [
            {
              required: true,
              message: '请输入详细地址',
              trigger: 'blur'
            }
          ],
          lnglat: [
            {
              required: true,
              message: '请选择经纬度',
              trigger: 'blur'
            }
          ],
          master: [
            {
              required: true,
              message: '请输入负责人',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  created () {
    this.listLoading = true
    this._handleSecDeptList()
    this._handleDangerDelList()
    this._getDict()
  },
  methods: {
    _getDict () {
      const typeList = ['chemical_type', 'purpose', 'unit']
      typeList.map(ele => {
        getDict({
          type: ele
        }).then(res => {
          this.formOption.config.map(val => {
            if ((val.name === ele || ele === 'chemical_type') && val.name === 'chemicalType') {
              val.dataList = res.data.dicts
            }
          })
          this.searchFormOption.config.map(val => {
            if ((val.name === ele || ele === 'chemical_type') && val.name === 'chemicalType') {
              val.dataList = res.data.dicts
            }
          })
        })
      })
    },
    // 物品种类
    _handleTypeList () {
      handleTypeList().then(res => {
        this.searchFormOption.config.map(ele => {
          if (ele.name === 'typeName') {
            ele.dataList = res.data
          }
        })
      })
    },
    // 部门列表
    _handleSecDeptList () {
      handleSecDeptList().then(res => {
        this.formOption.config.map(val => {
          if (val.name === 'deptId') {
            val.dataList = res.data
          }
        })
        this.searchFormOption.config.map(val => {
          if (val.name === 'deptId') {
            val.dataList = res.data
          }
        })
      })
    },
    // 危化品明细列表
    _handleDangerDelList () {
      handleDangerDelList(this.listQuery).then(res => {
        this.total = res.data.page.totalCount
        this.tableData = res.data.page.list
        this.listLoading = false
      })
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleDangerDelList()
    },
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleDangerDelSearch({ id: data.id })
          .then((res) => {
            if (res.data) {
              const data = Object.assign({}, res.data.cheChemical, {
                lnglat: res.data.cheChemical.lon ? `${res.data.cheChemical.lon}, ${res.data.cheChemical.lat}` : ''
              })
              this.detailData = data
              console.log('返回的结果', data)
              resolve(data)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 新增数据
    createData (data) {
      const payload = Object.assign({}, data, {
        lon: data.lnglat.split(',')[0],
        lat: data.lnglat.split(',')[1]
      })
      handleDangerDelCreate(payload).then(res => {
        if (res.msg === 'ok') {
          this._handleDangerDelList()
          this.$message({
            message: '新增危化品明细成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '新增危化品明细失败',
            type: 'error'
          })
        }
      })
    },
    // 更新数据
    updateData (data) {
      const payload = Object.assign({}, data, {
        lon: data.lnglat.split(',')[0],
        lat: data.lnglat.split(',')[1],
        id: this.detailData.id
      })
      handleDangerDelUpdate(payload).then(res => {
        if (res.msg === 'ok') {
          this._handleDangerDelList()
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
    },
    // 删除数据
    deleteData (data) {
      const arr = []
      if (Array.isArray(data)) {
        data.map(val => {
          arr.push(val.id)
        })
      } else {
        arr.push(data.id)
      }
      handleDangerDelDelete(arr).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleDangerDelList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    _handlerAgentManaList () {
      this.listLoading = true
      this._handleDangerDelList(this.listQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
