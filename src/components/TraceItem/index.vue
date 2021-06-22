<template>
  <div class="trace-container" @click="handlerTraceDetailView">
    <div class="container-img" :class="handleInitCheckData(traceData.isDanger, traceData.chkStat,traceData.status)">
      <span class="title">{{ traceData.typeName || traceData.pointName }}</span>
    </div>
    <div class="container-txt">
      <div class="txt-item">
        <div class="txt-head" style="letter-spacing: 28px">位置：</div>
        <div class="txt-dot">：</div>
        <el-tooltip class="item" effect="dark" :content="traceData.addr" placement="top-start">
          <div class="txt-text ellipsis">{{ `${traceData.addr}` }}</div>
        </el-tooltip>
      </div>
      <div class="txt-item">
        <div class="txt-head" style="letter-spacing: 7px">负责人</div>
        <div class="txt-dot">：</div>
        <el-tooltip class="item" effect="dark" :content="traceData.primaryName" placement="top-start">
          <div class="txt-text ellipsis-person">{{ `${traceData.primaryName}` }}</div>
        </el-tooltip>
      </div>
      <div v-if="traceData.chkNum||traceData.chkNum===0" class="txt-item">
        <div class="txt-head" style="letter-spacing: 7px">应巡检</div>
        <div class="txt-text">：<span style="color: #fff954;font-weight: bold;">{{ traceData.chkNum }}</span><span style="color: #fff954">次</span></div>
      </div>
      <div v-if="traceData.actualNum||traceData.actualNum===0" class="txt-item">
        <div class="txt-head">实际巡检</div>
        <div class="txt-text">：<span style="color: #84ff00;font-weight: bold">{{ traceData.actualNum }}</span><span style="color: #84ff00">次</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TraceItem',
  props: {
    traceData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleInitCheckData(isDanger, isCheck, status) {
      if (isDanger) {
        return 'trip'
      } else {
        if (isCheck || status) {
          return 'normal'
        } else {
          return 'danger'
        }
      }
    },
    handlerTraceDetailView() {
      this.$emit('handlerTraceDetailView')
    }
  }
}
</script>

<style scoped lang="scss">
.trace-container {
  display: flex;
  width: 320px;
  height: 118px;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  .container-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23%;
    height: 89px;
    padding: 10px;
    margin-left: 4px;
    text-align: center;

    &.danger {
      background: url(./image/shield.png) 0px 0px no-repeat;
    }

    &.normal {
      background: url(./image/shield.png) -66px 0px no-repeat;
    }

    &.trip {
      background: url(./image/shield.png) -132px 0px no-repeat;
    }

    .title {
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .container-txt {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 66%;
    margin-left: 18px;
    line-height: 20px;

    .txt-item {
      display: flex;

      .txt-head {
        width: 30%;
        font-size: 14px;
        color: #97c1ff;
        white-space: nowrap;
      }
      .txt-dot {
        color: #97c1ff;
      }
      .txt-text {
        font-size: 14px;
        color: #97c1ff;
        flex: 1
      }
      .ellipsis {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .ellipsis-person {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
}
</style>
