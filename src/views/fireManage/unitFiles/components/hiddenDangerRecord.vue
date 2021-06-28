<template>
  <div class="form-box">
    <div class="keyParts-top">
      <div name="title" class="dialog-title">隐患记录</div>
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
    </div>
    <div class="table-box keyParts">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :table-height="'100%'"
        :border="false"
      >
        <el-table-column
          label="操作"
          align="left"
        >
          <template v-slot="{ row }">
            <el-button size="mini" type="text" @click="handlerViewDangerDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <HiddenDangerStatus ref="HiddenDangerStatus" :danger-info-data="dangerInfoData" />
  </div>
</template>
<script>
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import HiddenDangerStatus from '@/components/HiddenDangerStatus'
import {
  getDangerInfo
} from '@/api/office'

export default {
  components: {
    SearchForm,
    BaseTable,
    HiddenDangerStatus
  },
  data () {
    return {
      hiddenDetailVisible: false,
      listLoading: false,
      dangerInfoData: [],
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '处理进度：',
            name: 'department',
            placeholder: '请选择处理进度',
            dataList: []
          },
          {
            type: 'select',
            label: '隐患等级：',
            name: 'address',
            placeholder: '请选择隐患等级',
            dataList: []
          }
        ]
      },
      tableData: [
        {
          name: '倡导',
          areaName: '位置',
          address: '详细位置',
          concat: '联系人',
          department: '部门'
        }
      ],
      tableConfig: [
        {
          prop: 'name',
          label: '隐患等级',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '发现时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'address',
          label: '发现人',
          align: 'left',
          width: ''
        },
        {
          prop: 'concat',
          label: '发现部门',
          align: 'left',
          width: ''
        },
        {
          prop: 'department',
          label: '处理进度',
          align: 'left',
          width: ''
        },
        {
          prop: 'department',
          label: '隐患内容',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  methods: {
    handleFilter (data) {
      // this.listQuery = { ...this.listQuery, ...data }
      // this._handlerUnitRecordList()
    },
    handlerViewDangerDetail (data) {
      this.$refs.HiddenDangerStatus.handlerShow()
      getDangerInfo({ danger_id: data.id }).then(res => {
        if (res.data) {
          this.dangerInfoData = res.data.list
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .keyParts-top {
    display: flex;
    justify-content: space-between;
    .search-box {
      width: auto;
    }
  }
  .keyParts {
    flex: 1;
    overflow: auto;
  }
</style>
