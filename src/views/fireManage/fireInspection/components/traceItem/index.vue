<template>
  <div class="trace-container" @click="handlerTraceDetailView">
    <div class="container-img" :class="traceData.type === 0 ? 'normal' : 'danger'">
      <span class="title">{{ traceData.typeName }}</span>
    </div>
    <div class="container-txt">
      <div class="txt-item">
        <div class="txt-head">位&nbsp;&nbsp;&nbsp;置：</div>
        <div class="txt-text">{{ traceData.addr }}</div>
      </div>
      <div class="txt-item">
        <div class="txt-head">负责人：</div>
        <div class="txt-text">{{ traceData.primaryName }}</div>
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
    handlerTraceDetailView () {
      this.$emit('handlerTraceDetailView')
    }
  }
}
</script>

<style scoped lang="scss">
.trace-container {
  display: flex;
  width: 315px;
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
      background: url(../../images/shield.png) 0px 0px no-repeat;
    }

    &.normal {
      background: url(../../images/shield.png) -66px 0px no-repeat;
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

      .txt-text {
        font-size: 14px;
        color: #97c1ff;
      }
    }
  }
}
</style>
