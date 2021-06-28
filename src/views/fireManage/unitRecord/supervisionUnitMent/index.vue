<template>
  <section class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add">添加</el-button>
      <el-button class="edit">修改</el-button>
      <el-button class="delect">删除</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :border="false"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" round @click="handleView(row, '查看部门')">查看</el-button>
            <el-button size="mini" type="success" round @click="handleEdit(row, '修改部门')">修改</el-button>
            <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <Pagination
        :total="100"
        :page="10"
        :limit="10"
        :page-count="10"
        :background="false"
        layout="prev, pager, next, total, jumper"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
      />
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'
import { parseTime } from '@/utils'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'

export default {
  /* 监管单位部门 */
  name: 'SupervisionUnitMent',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm
  },
  mixins: [formAction],
  data() {
    return {
      listLoading: false,
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '部门名称:',
            name: 'name',
            placeholder: '请输入部门名称'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '部门名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'duty',
          label: '部门职责',
          align: 'left',
          width: ''
        },
        {
          prop: 'date',
          label: '更新时间',
          align: 'left',
          width: ''
        },
        {
          prop: 'message',
          label: '备注信息',
          align: 'left',
          width: ''
        }
      ],
      tableData: [
        {
          id: '78856',
          name: '市南院区',
          duty: '10086',
          date: parseTime(1596780867),
          message: '卫生健康委'
        }
      ],
      formOption: {
        config: [
          {
            label: '部门名111称:',
            name: 'name',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '部门职责:',
            name: 'duty',
            type: 'text',
            labelWidth: '100px'
          },
          {
            label: '备注信息:',
            name: 'message',
            type: 'textarea',
            labelWidth: '100px',
            colspan: 'true'
          }
        ]
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    // 查询函数
    handleFilter(listQuery) {
      console.log(listQuery)
    },
    // 删除数据
    deleteData(data) {
      console.log(data)
    },
    // 更新数据
    updateData(data) {
      console.log(data)
    },
    // 新增数据
    createData(data) {
      console.log(data)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
