<template>
  <div class="input-card content-window-card">
    <div class="title">{{ windowData.areaName }}</div>
    <div>
      <div class="content">{{ windowData.remarks }}</div>
      <div class="footer">
        <span class="btn" @click="editPolygonInfo">编辑信息</span>
        <span class="btn" @click="editGraphics">编辑图形</span>
        <span class="btn" @click="deletePolygon">删除</span>
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
  },
  methods: {
    editPolygonInfo () {
      this.$emit('editPolygonInfo', this.windowData)
    },
    editGraphics () {
      this.$emit('editGraphics', this.windowData)
    },
    deletePolygon () {
      this.$emit('deletePolygon', this.windowData)
    }
  }
}
</script>

<style lang="scss" scoped>
  .amap-info{
    .amap-info-contentContainer{
        .amap-info-content{
            .amap-info-close{
                right: 3px!important;
            }
            .content-window-card{
                 width: 400px;
                .title{
                    height: 40px;
                    line-height: 40px;
                    font-size: 18px;
                    font-weight: 700;
                    color: #0000ff;
                    border-bottom: 1px solid #DCDCDC;
                    text-indent: 5px;
                }
                .content{
                    padding: 15px;
                    border-bottom: 1px solid #DCDCDC;
                    line-height: 24px;
                    font-size: 14px;
                    text-align: justify;
                    text-indent: 20px;
                }
                .footer{
                    margin-top: 15px;
                    padding: 5px 0;
                    display: flex;
                    justify-content: space-around;
                    .btn{
                        padding: 8px 15px;
                        font-size: 12px;
                        border-radius: 3px;
                        background-color: #23c6c8;
                        color: #FFFFFF;
                        cursor: pointer;
                    }
                }

            }
        }
    }
}
</style>
