<template>
  <div>
    <el-dialog v-if="dialogVisible" class="bigDataDetail-dialog dark" :visible.sync="dialogVisible" width="1200px">
      <div slot="title" class="dialog-title">{{ title }}</div>
      <div class="dialog-content">
        <el-container>
          <el-main class="scroll">
            <div v-if="searchFlag" class="search-box">
              <SearchForm :form-option="searchFormOption" @search="handleFilter" />
            </div>
            <div class="table-box">
              <BaseTable
                ref="BaseTable"
                :table-height="350"
                :loading="listLoading"
                :table-config="tableConfig"
                :table-data="tableData"
                :border="false"
              >
                <el-table-column v-if="flag === 'office'" label="操作" align="left" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button size="mini" type="warning" round @click="viewUnitArchives(row)">单位档案</el-button>
                  </template>
                </el-table-column>
              </BaseTable>
            </div>
            <div class="pagination-box">
              <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="_handleOfficeViewInfo"
              />
            </div>
          </el-main>
        </el-container>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHide">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogUnitVisible"
      class="dark unitArchives"
      :destroy-on-close="true"
      :visible.sync="dialogUnitVisible"
      width="1240px"
      :close-on-click-modal="false"
    >
      <div slot="title" class="dialog-title">单位档案</div>
      <div class="dialog-content">
        <unit-archives :office-id="viewOfficeId" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict, handleOfficeViewInfo } from '@/api/bigdata'

import './index.scss'
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import UnitArchives from '@/components/unitArchives'

export default {
  name: 'BigDataDetail',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    UnitArchives
  },
  props: {
    isResetFlag: {
      type: Boolean,
      default: false
    },
    viewObj: {
      type: Object,
      default: () => {}
    },
    flag: {
      type: String,
      default: 'office'
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      searchFlag: true,
      title: '单位列表',
      listQuery: {
        id: '',
        type: '',
        page: 1,
        pageSize: 10
      },
      dialogUnitVisible: false,
      viewOfficeId: -1,
      searchFormOption: {},
      searchFormOfficeOption: {
        config: [
          {
            type: 'text',
            label: '单位名称：',
            name: 'officeName',
            placeholder: '请输入字段'
          },
          {
            type: 'text',
            label: '行业主管单位：',
            name: 'directDept',
            placeholder: '请输入字段'
          }
        ]
      },
      searchFormSensorOption: {
        config: [
          {
            type: 'text',
            label: '所属单位：',
            name: 'name',
            placeholder: '请输入字段'
          }
        ]
      },
      searchFormDangerOption: {
        config: [
          {
            type: 'text',
            label: '隐患单位：',
            name: 'dangerOffice',
            placeholder: '请输入字段'
          },
          {
            type: 'select',
            label: '隐患级别：',
            name: 'level',
            placeholder: '请选择隐患级别',
            dataList: []
          },
          {
            type: 'text',
            label: '隐患内容：',
            name: 'content',
            placeholder: '请输入字段'
          }
        ]
      },
      tableConfig: [],
      tableOfficeConfig: [
        {
          prop: 'name',
          label: '单位名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '所属区划',
          align: 'left',
          width: ''
        },
        {
          prop: 'tel',
          label: '联系电话',
          align: 'left',
          width: ''
        },
        {
          prop: 'directDept',
          label: '行业主管部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'fireDept',
          label: '消防主管部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'point',
          label: '巡查点',
          align: 'left',
          width: ''
        }
      ],
      tableSensorConfig: [
        {
          prop: 'type',
          label: '设备类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '所属单位',
          align: 'left',
          width: ''
        },
        {
          prop: 'devId',
          label: '设备ID',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '安装位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'isApplied',
          label: '启用状态',
          align: 'left',
          width: ''
        },
        {
          prop: 'startTime',
          label: '启用时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'lastTime',
          label: '末次数据时间',
          align: 'left',
          width: ''
        }
      ],
      tablePoliceConfig: [
        {
          prop: 'type',
          label: '报警单位',
          align: 'left',
          width: ''
        },
        {
          prop: 'name',
          label: '报警类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'iotCardId',
          label: '安装位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '安装位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'isApplied',
          label: '报警时间',
          align: 'left',
          width: ''
        }
      ],
      tableDangerConfig: [
        {
          prop: 'name',
          label: '隐患单位',
          align: 'left',
          width: ''
        },
        {
          prop: 'fixDate',
          label: '发现时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'content',
          label: '隐患内容',
          align: 'left',
          width: ''
        },
        {
          prop: 'level',
          label: '隐患级别',
          align: 'left',
          width: ''
        },
        {
          prop: 'chkDate',
          label: '整改时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'status',
          label: '整改进度',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      total: 0
    }
  },
  watch: {
    isResetFlag() {
      if (this.flag === 'office') {
        this.title = '单位列表'
        this.searchFormOption = this.searchFormOfficeOption
        this.tableConfig = this.tableOfficeConfig
      } else if (this.flag === 'danger') {
        this.title = '隐患列表'
        this.searchFormOption = this.searchFormDangerOption
        this.tableConfig = this.tableDangerConfig
      } else if (this.flag === 'sensor') {
        this.title = '设备列表'
        this.searchFormOption = this.searchFormSensorOption
        this.tableConfig = this.tableSensorConfig
      } else if (this.flag === 'police') {
        this.title = '报警列表'
        this.searchFlag = false
        this.tableConfig = this.tablePoliceConfig
        this.listQuery.time = this.viewObj.time
        this.listQuery.fmat = this.viewObj.fmat
        this.listQuery.eventType = this.viewObj.eventType
      }
      this.listQuery.day = this.viewObj.day
      this.listQuery.id = this.viewObj.id
      this.listQuery.type = this.viewObj.type
      this._getDict()
      this._handleOfficeViewInfo()
    }
  },
  methods: {
    // 查询函数
    handleFilter(data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleOfficeViewInfo()
    },
    // 字典值
    _getDict() {
      getDict({
        type: 'chk_danger_level'
      }).then(res => {
        if (res.data) {
          this.searchFormDangerOption.config[1].dataList = res.data.dicts
        }
      })
    },
    // 获取列表
    _handleOfficeViewInfo() {
      const data = { listQuery: this.listQuery, url: this.url }
      handleOfficeViewInfo(data).then(res => {
        if (res.data) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    handleShow() {
      this.dialogVisible = true
      this.listQuery = {
        id: '',
        type: '',
        page: 1,
        pageSize: 10
      }
    },
    handleHide() {
      this.dialogVisible = false
    },
    // 打开单位详情页面
    viewUnitArchives(data) {
      const personData = data
      this.viewOfficeId = personData.id
      this.dialogUnitVisible = true
    },
    hide() {
      this.dialogUnitVisible = false
    }
  }
}
</script>

<style>
</style>
