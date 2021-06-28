<template>
  <div class="form-box">
    <div class="keyParts-top">
      <div name="title" class="dialog-title">重点部位</div>
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
import { handlerListByOffice } from '@/api/office'

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
            label: '所在部位：',
            name: 'department',
            placeholder: '请选择所在部位',
            dataList: []
          },
          {
            type: 'select',
            label: '具体位置：',
            name: 'address',
            placeholder: '请选择具体位置',
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
          label: '所在部位',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '具体位置',
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
          prop: 'concat',
          label: '负责人',
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
    handlerListByOffice({ officeId: this.id }).then(res => {
      console.log('重点部位', res)
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
