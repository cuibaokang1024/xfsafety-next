<template>
  <el-dialog
    v-if="dialogVisible"
    class="alertRecord dark"
    :title="model==='record'?'报警记录':'现场照片'"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="800px"
  >
    <div
      ref="content"
      v-loading="loading && model === 'img'"
      class="dialog-content"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
      style="width: 100%; height: 500px;"
    >
      <baseTable
        v-if="model === 'record'"
        class="table"
        :border="false"
        :table-data="tableData"
        :table-height="500"
        :table-config="tableConfig"
      />
      <el-image
        v-if="model === 'img'"
        style="width: 744px; height: 500px;"
        fit="fill"
        :src="url.split(',')[0]"
        :preview-src-list="url.split(',')"
        @load="loadImg"
        @error="errorLoad"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="hide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BaseTable from '@/components/baseTable'
export default {
  components: {
    BaseTable
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      default: 'record' // 报警记录 图片 视频
    },
    isResetFlag: {
      type: Boolean,
      default: false
    },
    alertList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      loading: true,
      tableConfig: [
        {
          prop: 'devId',
          label: '设备号',
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
          prop: 'msg',
          label: '报警信息',
          align: 'left',
          width: ''
        },
        {
          prop: 'alertTime',
          label: '报警时间',
          align: 'left',
          width: ''
        }
      ]
    }
  },
  watch: {
    isResetFlag() {
      this.filterList()
      this.loading = true
    }
  },
  created() {
    this.filterList()
  },
  methods: {
    filterList() {
      if (this.alertList.length > 0) {
        this.tableData = this.alertList.filter(item => {
          return item.devId === this.id
        })
      } else {
        return []
      }
    },
    loadImg() {
      this.loading = false
    },
    errorLoad() {
      this.loading = false
    },
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 0 10px;

  .dialog-content {
    height: 500px;

    .pagination {
      padding: 0;
    }

    .table {
      overflow: auto;
    }
  }
}
</style>
