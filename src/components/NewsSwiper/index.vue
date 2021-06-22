<template>
  <div v-if="swiperList" class="block">
    <el-carousel :height="height" :autoplay="true" :interval="4000" @change="handlerOnChange">
      <el-carousel-item v-for="item in swiperList" :key="item.id">
        <el-image :style="'width: 100%; height:' + height + ';'" :src="item.image" fit="fill" />
      </el-carousel-item>
    </el-carousel>
    <div class="cover">
      <div class="title" @click="handlerGoLink">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsSwiper',
  props: {
    swiperList: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '240px'
    }
  },
  data() {
    return {
      title: '',
      message: '',
      link: ''
    }
  },
  watch: {
    swiperList: {
      handler(newVal) {
        this.$nextTick(function() {
          this.title = this.swiperList[0].title
          this.link = this.swiperList[0].url
        })
      },
      deep: true
    }
  },
  methods: {
    handlerOnChange(index) {
      this.$nextTick(() => {
        this.title = this.swiperList[index].title
        this.link = this.swiperList[index].url
      })
    },
    handlerGoLink() {
      window.open(this.link, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  position: relative;

  .el-carousel {
    .el-carousel__indicators {
      z-index: 999;
    }
  }

  .cover {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.54);
    z-index: 99;

    &:hover {
      .title,
      .text {
        text-decoration: underline;
      }
    }

    .title {
      width: 60%;
      height: 20px;
      line-height: 20px;
      font-weight: bold;
      font-size: 12px;
      color: #edff24;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}
</style>
