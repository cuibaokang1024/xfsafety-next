<template>
  <div class="danger-main">
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
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
        :sort="true"
        @rowClick="handleCheck"
        @sortChange="sortChange"
      />
    </div>
    <div class="pagination-box">
      <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_handleDangerMethodList"
      />
    </div>
    <el-dialog
      title="危化品处置方法"
      :visible="dialogVisible"
      class="dark"
      @close="dialogVisible=false"
    >
      <div class="danger-drag">
        <div class="li">
          <span>序号</span>
          <span>{{ data.id }}</span>
        </div>
        <div class="li">
          <span>物质名称</span>
          <span>{{ data.name }}</span>
        </div>
        <div class="li">
          <span>别名</span>
          <span>{{ data.nickName }}</span>
        </div>
        <div class="li">
          <span>英文名称</span>
          <span>{{ data.englishName }}</span>
        </div>
        <div class="li">
          <span>规格号</span>
          <span>{{ data.number }}</span>
        </div>
        <div class="li">
          <span>状态</span>
          <span>{{ data.status }}</span>
        </div>
        <div class="li">
          <span>处置方法</span>
          <span>{{ data.measures }}</span>
        </div>
        <div class="li">
          <span>分子量</span>
          <span>{{ data.molecularWeight }}</span>
        </div>
        <div class="li">
          <span>沸点</span>
          <span>{{ data.boilingPoint }}</span>
        </div>
        <div class="li">
          <span>饱和蒸气压</span>
          <span>{{ data.vaporPressure }}</span>
        </div>
        <div class="li">
          <span>密度</span>
          <span>{{ data.wh }}</span>
        </div>
        <div class="li">
          <span>气化热</span>
          <span>{{ data.gasification }}</span>
        </div>
        <div class="li">
          <span>等压比热</span>
          <span>{{ data.constantPressureHeat }}</span>
        </div>
        <div class="li">
          <span>半致死剂量</span>
          <span>{{ data.halfLethalDose }}</span>
        </div>
        <div class="li">
          <span>轻度伤害剂量</span>
          <span>{{ data.mitigatedInjury }}</span>
        </div>
        <div class="li">
          <span>中度伤害剂量</span>
          <span>{{ data.moderateInjury }}</span>
        </div>
        <div class="li">
          <span>重度伤害剂量</span>
          <span>{{ data.importanceInjury }}</span>
        </div>
        <div class="li">
          <span>蒸气相对密度</span>
          <span>{{ data.vaporRelativeDensity }}</span>
        </div>
        <div class="li">
          <span>爆炸极限上限</span>
          <span>{{ data.explosionUp }}</span>
        </div>
        <div class="li">
          <span>爆炸极限下限</span>
          <span>{{ data.explosionDown }}</span>
        </div>
        <div class="li">
          <span>泄露事故</span>
          <span>{{ data.leakageIncident }}</span>
        </div>
        <div class="li">
          <span>超压爆炸事故</span>
          <span>{{ data.overpressureAccident }}</span>
        </div>
        <div class="li">
          <span>蒸气爆炸事故</span>
          <span>{{ data.steamAccident }}</span>
        </div>
        <div class="li">
          <span>爆炸火球事故</span>
          <span>{{ data.explosiveAccident }}</span>
        </div>
        <div class="li">
          <span>池火燃烧事故</span>
          <span>{{ data.poolAccident }}</span>
        </div>
        <div class="li">
          <span>喷射火灾事故</span>
          <span>{{ data.jetFireAccident }}</span>
        </div>
        <div class="li">
          <span>固体火灾事故</span>
          <span>{{ data.solidFireAccident }}</span>
        </div>
        <div class="li">
          <span>化学空袭事件</span>
          <span>{{ data.chemicalAirstrike }}</span>
        </div>
        <div class="li">
          <span>毒剂恐怖事件</span>
          <span>{{ data.toxicTerror }}</span>
        </div>
        <div class="li">
          <span>核辐射事故</span>
          <span>{{ data.nuclearAccident }}</span>
        </div>
        <div class="li">
          <span>评估数据</span>
          <span>{{ data.evaluationData }}</span>
        </div>
      </div>
      <span name="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/baseTable'
import formAction from '@/mixins/form.js'
import '../style/index.scss'
import Pagination from '@/components/Pagination'
import SearchForm from '@/components/searchForm'
import { handleDangerMethodList, handleDangerMethodDetail } from '@/api/danger'

export default {
  // 危化品处置方法
  name: 'DangerMethod',
  components: {
    BaseTable,
    Pagination,
    SearchForm
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      dialogVisible: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: '',
        nickName: ''
      },
      orderFieldObj: {
        name: 'name',
        nickName: 'nick_name',
        englishName: 'english_name',
        number: 'number',
        status: 'status'
      },
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '物质名称',
            name: 'name',
            placeholder: '请输入物质名称'
          },
          {
            type: 'text',
            label: '别名',
            name: 'nickName',
            placeholder: '请输入别名'
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
          label: '物质名称',
          align: 'left',
          width: '',
          sortable: 'custom'
        },
        {
          prop: 'nickName',
          label: '别名',
          align: 'left',
          width: '',
          sortable: 'custom'
        },
        {
          prop: 'englishName',
          label: '英文名称',
          align: 'left',
          width: '',
          sortable: 'custom'
        },
        {
          prop: 'number',
          label: '规格号',
          align: 'left',
          width: '',
          sortable: 'custom'
        },
        {
          prop: 'status',
          label: '状态',
          align: 'left',
          width: '',
          sortable: 'custom'
        }
      ],
      tableData: [],
      data: []
    }
  },
  created () {
    this._handleDangerMethodList()
  },
  methods: {
    _handleDangerMethodList () {
      handleDangerMethodList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
      })
    },
    handleCheck (data) {
      this.dialogVisible = true
      handleDangerMethodDetail({ id: data.id }).then(res => {
        this.data = res.data
      })
    },
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
      this._handleDangerMethodList()
    },
    sortChange (column) {
      let order = 'asc'
      if (!column.order) {
        this.listQuery = Object.assign({}, this.listQuery, {
          orderField: '',
          order: ''
        })
      } else {
        if (column.order === 'descending') {
          order = 'desc'
        } else if (column.order === 'ascending') {
          order = 'asc'
        }
        this.listQuery = Object.assign({}, this.listQuery, {
          orderField: this.orderFieldObj[column.prop],
          order: order
        })
      }
      this._handleDangerMethodList()
    }
  }
}
</script>

<style lang="scss" scoped>
.danger-drag {
  color: #ccc;
  max-height: 400px;
  overflow-y: auto;
  .li {
    display: flex;
    margin-bottom: 10px;
    span:nth-of-type(1) {
      display: inline-block;
      width: 120px;
      font-weight: 600;
      text-align: right;
      margin-right: 10px;
    }
    span:nth-of-type(2) {
      flex: 1;
      margin-right: 20px;
    }
  }
}
</style>
<style>
.el-icon-edit-outline {
  margin-right: 4px;
}
</style>
