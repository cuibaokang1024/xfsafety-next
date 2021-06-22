<template>
  <div :class="{'hidden':hidden}" class="pagination-container custom">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      prev-text="上一页"
      next-text="下一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pagination-container{
  margin: 0;
  color: #97c1ff;
}
.pagination-container .hidden {
  display: none;
}
</style>
<style lang="scss">
.pagination-container{
  &.custom{
    .el-pagination{
      button {
        margin: 0 2px;
        padding: 0 12px;
        background: transparent;
        border: 1px solid #143e95;
        span {
          height: 30px;
          color: #97c1ff;
          font-size: 12px;
        }
      }
      .el-pager {
        li {
          font-size: 12px;
          color: #97c1ff;
          margin: 0 2px;
          background: transparent;
          border: 1px solid #143e95;

          &.active {
            color: #fff;
            background: #00a0e9;
          }
        }
      }
      .el-pagination__total {
        color: #97c1ff;
        margin: 1px 0 0 10px;
      }
      .el-pagination__jump {
        color: #97c1ff;
        input {
          color: #97c1ff;
          border: 1px solid #143e95;
          background: transparent;
        }
      }
    }
  }

}
</style>
