<template>
  <div
    class="newsitem-content"
    :style="'width:' + width + ';' + 'height:' + height + ';'"
    @click="handleNoticeView(itemObj)"
  >
    <div class="left">
      <div class="icon" />
      <div class="text">{{ itemObj.title }}</div>
    </div>
    <div
      class="right"
    >{{ (itemObj.commitDate || itemObj.updateDate || itemObj.createDate) | parseTime('{y}-{m}-{d}') }}</div>
  </div>
</template>

<script>
export default {
  name: 'NewsItem',
  props: {
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    itemObj: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleNoticeView(data) {
      this.$emit('handleNoticeView', data)
    }
    /* handlerLinkGo(url) {
      if (url) {
        window.open(url, '_blank')
      }
    } */
  }
}
</script>

<style lang="scss" scoped>
.newsitem-content {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  font-size: 12px;
  line-height: 18px;
  color: #97c1ff;
  background: rgba(163, 209, 255, 0.08);

  &:hover {
    .left {
      .text {
        text-decoration: underline;
      }
    }

    .right {
      text-decoration: underline;
    }
  }

  .left {
    float: left;
    display: flex;
    width: 68%;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    .icon {
      width: 8px;
      height: 7px;
      margin-right: 5px;
      background: url(./image/news-tab-circle.png) 0 0 no-repeat;
    }
    .text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .right {
    float: right;
  }
}
</style>
