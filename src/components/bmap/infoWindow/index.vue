<template>
  <div class="input-card content-window-card">
    <div class="title">{{ windowData.name }}</div>
    <div>
      <div class="content">{{ windowData.address }}</div>
      <div class="footer">
        <span class="btn" @click="viewDetail">查看详情</span>
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
    viewDetail () {
      this.$emit('viewDetail', this.windowData.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .amap-info{
    .amap-info-contentContainer{
        min-width: 200px;
        .amap-info-content{
            .amap-info-close{
                right: 3px!important;
            }
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
                    padding-top: 10px;
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
        }
    }
}
</style>
