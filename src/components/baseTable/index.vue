<template>
  <el-table
    ref="table"
    :data="tableData"
    :sort="sort"
    :height="tableHeight"
    :row-key="'id'"
    :row-style="{cursor: 'pointer'}"
    :cell-class-name="cellClassName"
    :default-expand-all="defaultExpandAll"
    :border="border"
    :max-height="maxHeight"
    :show-summary="showSummary"
    :show-header="showHeader"
    :header-cell-class-name="cellClass"
    @sort-change="sortChange"
    @cell-click="handlerCellClick"
    @selection-change="handleSelectionChange"
    @select="select"
    @select-all="selectAll"
    @row-click="rowClick"
  >
    <el-table-column
      v-for="(item, key) in tableConfig"
      :key="key"
      v-bind="item"
      :sortable="item.sortable"
      :render-header="( h, obj ) => handleRenderHeader(h, obj, item.headerIcon, item.headerTooltip)"
    />
    <slot />
  </el-table>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableConfig: {
      type: Array,
      default: () => []
    },
    sort: {
      type: Boolean,
      default: () => false
    },
    defaultExpandAll: {
      type: Boolean,
      default: () => false
    },
    showHeader: {
      type: Boolean,
      default: () => true
    },
    border: {
      type: Boolean,
      default: () => true
    },
    cellClassName: {
      type: Function,
      default: () => {}
    },
    tableHeight: {
      type: [String, Number],
      default: null
    },
    maxHeight: {
      type: [String, Number],
      default: null
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    disabledAllCheck: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    sortChange(column) {
      if (this.sort) {
        this.$emit('sortChange', column)
      }
    },
    handlerCellClick(row, column, cell, event) {
      this.$emit('handlerCellClick', row, column, cell, event)
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    select(selection, row) {
      this.$emit('select', selection, row)
    },
    selectAll(selection) {
      this.$emit('selectAll', selection)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection(index, flag) {
      this.$refs.table.toggleRowSelection(this.tableData[index], flag)
    },
    cellClass(row) {
      if (row.columnIndex === 0 && this.disabledAllCheck) {
        return 'disabledCheck'
      }
    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row)
    },
    handleRenderHeader(h, { column, $index }, headerIcon, headerTooltip) {
      return [
        column.label,
        column.showOverflowTooltip
          ? h(
            `el-tooltip`,
            {
              props: {
                popperClass: 'popover-table-tips',
                placement: 'top'
              }
            },
            [
              h(
                `div`,
                {
                  class: 'table-tips-container',
                  slot: 'content'
                },
                Array.isArray(headerTooltip)
                  ? [
                    headerTooltip.map(item => {
                      return h(`span`, item)
                    })
                  ]
                  : headerTooltip
              ),
              h(`i`, {
                class: `el-icon-tooltips ${headerIcon}`
              })
            ]
          )
          : ``
      ]
    }
  }
}
</script>
<style lang="scss">
/* 去掉全选按钮 */
.el-table .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}

.el-table .disabledCheck .cell::before {
  content: "选择";
  text-align: center;
  line-height: 23px;
}

.el-table {
  .el-table__header-wrapper {
    .el-table__header {
      .el-icon-tooltips {
        color: #409eff;
        margin-left: 5px;
      }
    }
  }
}
</style>
