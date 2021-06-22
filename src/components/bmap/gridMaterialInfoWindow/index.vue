<template>
  <div class="input-card content-window-card">
    <div>
      <div class="title">{{ `物资名称：${windowData.name||''}` }}</div>
      <div class="content">
        <div class="text">{{ `归属单位：${windowData.officeName||''}` }}</div>
        <div class="text">
          <span>{{ `保质期：${windowData.quality||''}` }}</span>
          <span>{{ `入库时间：${windowData.enterDate||''}` }}</span>
        </div>
        <div class="text">
          <span>{{ `负责人：${windowData.master||''}` }}</span>
          <span>{{ `联系电话：${windowData.masterTel||''}` }}</span>
        </div>
        <div class="text">
          <span>{{ `物资类别：${windowData.typeName||''}` }}</span>
          <span>{{ `物资类型：${windowData.subTypeName||''}` }}</span>
        </div>
        <div class="text">{{ `存放位置：${windowData.addr||''}` }}</div>
        <div class="text">{{ `物资用途：${windowData.purpose||''}` }}</div>
        <div class="img-wrapper">
          位置图片
          <el-image
            v-if="windowData.fileSrc"
            style="width: 100px; height: 100px"
            :src="windowData.fileSrc"
            :preview-src-list="[windowData.fileSrc]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoWindow',
  props: {
    windowData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
 .content-window-card{
    .title{
        font-size: 18px;
        font-weight: 700;
        color: #0000ff;
        border-bottom: 1px solid #DCDCDC;
    }
    .content{
        font-size: 14px;
        color: #000;
        max-width: 450px;
        .text{
          border-bottom: 1px dotted #aeaeae;
          font-size: 14px;
          color: #434343;
          line-height: 18px;
          padding: 6px 0;
          text-indent: 3px;
          overflow: hidden;
        }
        .img-wrapper{
          padding-top: 10px;
          display: flex;
          align-items: center;
        }
    }
    .footer{
        padding: 5px 0;
        .btn{
            padding: 4px 5px;
            font-size: 12px;
            border-radius: 3px;
            background-color: #23c6c8;
            color: #FFFFFF;
            cursor: pointer;
        }
    }

}
</style>
