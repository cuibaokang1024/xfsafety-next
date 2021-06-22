<template>
  <div class="tab-table-box">
    <div class="title">接收单位：</div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="已读" name="readed">
        <BaseTable
          :loading="listLoading"
          :table-data="readRecordList || []"
          :table-config="tableConfig"
          :border="false"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column label="阅读时间" align="left" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <span>{{ row.readFlag === "0" ? "未读" : "已读" }}</span>
            </template>
          </el-table-column>
        </BaseTable>
      </el-tab-pane>
      <el-tab-pane label="未读" name="unread">
        <BaseTable
          :loading="listLoading"
          :table-data="unreadRecordList || []"
          :table-config="tableConfig"
          :border="false"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column label="阅读时间" align="left" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <span>{{ row.readFlag === "0" ? "未读" : "已读" }}</span>
            </template>
          </el-table-column>
        </BaseTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseTable from '@/components/baseTable'

export default {
  components: {
    BaseTable
  },
  props: {
    readRecordList: {
      type: Array,
      default: () => []
    },
    unreadRecordList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listLoading: false,
      activeName: 'readed',
      tableConfig: [
        {
          prop: 'userName',
          label: '接受人',
          align: 'left',
          width: ''
        },
        {
          prop: 'readDate',
          label: '阅读时间',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss">
.tab-table-box {
  position: relative;
  text-align: left;

  .title {
    width: 84px;
    height: 40px;
    line-height: 40px;
    text-align: right;
    color: #97c1ff;
    font-size: 14px;
    font-weight: bold;
  }

  .el-tabs {
    .el-tabs__header {
      margin: 0;

      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__active-bar {
              display: none;
            }

            .el-tabs__item {
              height: 34px !important;
              line-height: 34px !important;
              padding: 0 24px !important;
              margin: 0 4px !important;
              color: #fff !important;
              background: #004986 !important;
              border-top-left-radius: 12px;
              border-top-right-radius: 12px;

              &.is-active {
                background: #008bbf !important;
              }
            }
          }
        }
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
    .el-tabs__content {
      margin-left: 4px;
      background: rgba(255, 255, 255, 0.07);
    }
  }
}
</style>
