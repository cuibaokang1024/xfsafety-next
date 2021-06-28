<template>
  <div class="mapSelect">
    <div class="select-wrapper">
      <el-input v-model="position" placeholder="请选择" @focus="handleShow" />
      <el-button
        slot="append"
        class="select-btn"
        icon="el-icon-location-outline"
        @click="handleShow"
      />
    </div>
    <!-- 地图弹窗 -->
    <el-dialog
      v-if="dialogMapVisible"
      width="930px"
      class="dark PositionPicker"
      v-model:visible="dialogMapVisible"
      append-to-body
      :destroy-on-close="true"
    >
      <div name="title" class="dialog-title">地图定位</div>
      <div class="dialog-content" style="height: 400px;">
        <position-picker ref="positionPicker" v-model:position="position" v-model:address="address" />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="handlerRefreshPosition">重新定位</el-button>
        <el-button @click="handleHide">关闭</el-button>
        <el-button @click="handlerSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 地图弹窗 -->
  </div>
</template>

<script>
import PositionPicker from '@/components/bmap/positionPicker'

export default {
  name: 'MapSelect',
  components: {
    PositionPicker
  },
  props: {
    lnglat: {
      type: String,
      default: ''
    },
    addr: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogMapVisible: false,
      position: '',
      address: ''
    }
  },
  watch: {
    addr (newVal) {
      this.position = ''
      this.address = newVal
    }
  },
  created () {
    this.position = this.lnglat
    this.address = this.addr
  },
  methods: {
    // 地图重新定位
    handlerRefreshPosition () {
      this.$refs.positionPicker.mapPosition()
    },
    handleShow () {
      this.dialogMapVisible = true
    },
    handleHide () {
      this.dialogMapVisible = false
    },
    handlerSubmit () {
      this.$refs.positionPicker.upDateLnglat()
      this.$emit('update:position', this.position)
      this.$emit('update:address', this.address)
      this.$emit('handleLnglat', this.position)
      this.handleHide()
    }
  }
}
</script>

<style lang="scss" scoped>
.mapSelect {
  .select-wrapper {
    position: relative;
    width: 100%;
    .select-btn {
      position: absolute;
      right: 0;
      top: 0px;
      border: none;
      font-weight: bold;
      color: #97c1ff;
      background: #00479d;
      border: 1px solid #00479d;
    }
  }
  .dialog-content {
    height: 400px;
    overflow-y: auto;
  }
}
</style>
