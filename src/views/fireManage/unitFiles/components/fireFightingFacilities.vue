<template>
  <div class="form-box">
    <div class="keyParts-top">
      <div name="title" class="dialog-title">消防设施</div>
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
      />
    </div>
  </div>
</template>
<script>
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import { handlerFireControlOffice } from '@/api/office'

export default {
  components: {
    SearchForm,
    BaseTable
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      listLoading: false,
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '类型：',
            name: 'type',
            placeholder: '请选择',
            dataList: []
          },
          {
            type: 'select',
            label: '',
            name: 'address',
            placeholder: '请选择',
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
          label: '类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '编号',
          align: 'left',
          width: ''
        },
        {
          prop: 'address',
          label: '位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'concat',
          label: '责任人',
          align: 'left',
          width: ''
        },
        {
          prop: 'department',
          label: '责任部门',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  created () {
    handlerFireControlOffice({ officeId: this.id }).then(res => {
      console.log('消防设施', res)
    })
  },
  methods: {
    handleFilter (data) {
      // this.listQuery = { ...this.listQuery, ...data }
      // this._handlerUnitRecordList()
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
