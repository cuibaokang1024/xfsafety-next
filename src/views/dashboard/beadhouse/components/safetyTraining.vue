<template>
  <el-container class="safetyTraining">
    <el-header height="26px">
      <span class="block" />
      <span class="text">安全培训</span>
    </el-header>
    <el-main>
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane label="安全培训" name="news">
          <div class="news-swiper">
            <NewsSwiper height="180px" :swiper-list="swiperList" />
          </div>
          <div class="news-news">
            <NewsItem
              v-for="item in itemList"
              :key="item.id"
              width="100%"
              height="32px"
              :item-obj="item"
              @handleNoticeView="handleNoticeView"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="安全小常识" name="notice">
          <div class="notice-list">
            <NewsItem
              v-for="item in itemList"
              :key="item.id"
              width="100%"
              height="32px"
              :item-obj="item"
              @handleNoticeView="handleNoticeView"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <div class="more" @click="handleHasMore">更多+</div>
  </el-container>
</template>

<script>
import NewsSwiper from '@/components/NewsSwiper'
import NewsItem from '@/components/NewsItem'

export default {
  name: 'SafetyTraining',
  components: {
    NewsSwiper,
    NewsItem
  },
  data() {
    return {
      activeTabName: 'news',
      swiperList: [],
      itemList: [],
      imagelist: [
        {
          id: '001',
          image:
            'http://www.hailiyingjizx.com/resource/images/d8e5b7bafbfc4a3c80f01af0c4bb19c2_3.png',
          title: '应急场馆体验课程',
          url: 'http://www.hailiyingjizx.com/projects/yjaqcg.html'
        },
        {
          id: '002',
          image:
            'http://www.hailiyingjizx.com/resource/images/7eacea614b10440f8994af6495daaf96_31.jpg',
          title: '安全户外拓展课程',
          url: 'http://www.hailiyingjizx.com/projects/ydtygw.html'
        },
        {
          id: '003',
          image:
            'http://www.hailiyingjizx.com/resource/images/2f1a72414e2e4d51816116df1ee1609c_15.jpg',
          title: '应急安全研学课程',
          url: 'http://www.hailiyingjizx.com/projects/yjyxkc.html'
        },
        {
          id: '004',
          image:
            'http://www.hailiyingjizx.com/resource/images/7eacea614b10440f8994af6495daaf96_35.jpg',
          title: '亲子安全活动主题课程',
          url: 'http://www.hailiyingjizx.com/projects/qzaqhdzt.html'
        }
      ],
      list: [
        {
          id: '001',
          title: '看过来！开发区二中安全应急体验',
          createDate: '2020-10-01',
          url: 'http://www.hailiyingjizx.com/projects/kglkfq.html'
        },
        {
          id: '002',
          title: '打造平安校园—新区育英初级中学开展“体验式”安全培训',
          createDate: '2020-10-01',
          url: 'http://www.hailiyingjizx.com/projects/dzpaxy.html'
        },
        {
          id: '003',
          title: '在线学习安全锤正确使用方法',
          createDate: '2020-10-01',
          url: 'http://www.hailiyingjizx.com/projects/zxxxaq.html'
        },
        {
          id: '004',
          title: '在线学习心肺复苏',
          createDate: '2020-10-01',
          url: 'http://www.hailiyingjizx.com/projects/zxxxxf.html'
        },
        {
          id: '005',
          title: '安心姐姐在线教学地震保护动作',
          createDate: '2020-10-01',
          url: 'http://www.hailiyingjizx.com/projects/axjjzx.html'
        }
      ]
    }
  },
  created() {
    this._handleInitNewsSwiper()
  },
  methods: {
    _handleInitNewsSwiper() {
      setTimeout(() => {
        this.swiperList = this.imagelist
        this.itemList = this.list
      }, 500)
    },
    _handleInitNewsItem() {
      setTimeout(() => {
        this.itemList = this.list
      }, 500)
    },
    handleClick(tab, event) {
      this.itemList = []
      if (tab.index === '0') {
        this._handleInitNewsSwiper()
      } else if (tab.index === '1') {
        this._handleInitNewsItem()
      }
    },
    handleNoticeView(data) {
      if (data.url) {
        window.open(data.url, '_blank')
      }
    },
    handleHasMore() {
      if (this.activeTabName === 'news') {
        window.open('http://www.hailiyingjizx.com/', '_blank')
      } else if (this.activeTabName === 'notice') {
        window.open('http://www.hailiyingjizx.com/', '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-header {
    display: flex;
    position: relative;
    padding: 0;
    margin-bottom: 6px;
    align-items: center;
    border-bottom: none;

    .text {
      font-size: 16px;
      color: #fff;
      margin-left: 5px;
    }

    .block {
      display: inline-block;
      width: 6px;
      height: 13px;
      background-color: #0488ea;
      margin-left: 2px;
    }
  }

  .el-main {
    position: relative;
    display: flex;
    border: none;
    padding: 0;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
.safetyTraining {
  position: relative;

  .el-header {
    margin-bottom: 6px !important;
  }

  .more {
    position: absolute;
    top: 10px;
    right: 0px;
    font-size: 12px;
    color: #415e9d;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .el-tabs {
    width: 100%;

    .el-tabs__header {
      margin: 0 0 8px;

      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__active-bar {
              display: none;
            }

            .el-tabs__item {
              height: 30px;
              font-size: 14px;
              color: #fff;
              text-align: center;
              line-height: 30px;
              padding: 0px 14px;
              margin: 0 3px;
              border: 1px solid transparent;
              background: #0d3b86;
              border-radius: 15px;

              &.is-active {
                color: #fff;
                background: #0d3b86;
                border: 1px solid #0180ff;
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
      .news-swiper {
        float: left;
        width: 50%;
        height: 240px;

        .el-carousel {
          .el-carousel__indicators {
            width: 40%;
            left: 70%;
            transform: translateX(0%);
            z-index: 999;

            .el-carousel__indicator {
              padding: 10px 4px;

              .el-carousel__button {
                width: 10px;
              }

              &.is-active {
                .el-carousel__button {
                  width: 16px;
                  background: #00ffff;
                }
              }
            }
          }
        }
      }

      .news-news {
        float: right;
        width: 48%;
        height: 240px;
        overflow: hidden;
      }

      .notice-list {
        width: 100%;
        height: 240px;
        overflow: hidden;
      }
    }
  }
}
</style>
