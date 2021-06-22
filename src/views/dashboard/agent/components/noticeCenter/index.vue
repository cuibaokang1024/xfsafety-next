<template>
  <div class="noticeCenter">
    <div class="noticeCenter-title">
      <span>通知中心</span>
    </div>
    <div class="noticeCenter-container">
      <el-scrollbar>
        <el-timeline :reverse="true" :hide-timestamp="true">
          <div v-for="item in dataList" :key="item.id" class="noticeCenter-list">
            <el-timeline-item>
              <el-row class="noticeCenter-item">
                <el-col :span="12" class="title">
                  <span>{{ item.title }}</span>
                </el-col>
                <el-col :span="12" class="date">
                  <span>{{ item.date }}</span>
                </el-col>
              </el-row>
            </el-timeline-item>
          </div>
        </el-timeline>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeCenter',
  data() {
    return {
      dataList: [
        {
          id: '0',
          title: '系统升级2.0版本',
          date: '2021-03-10'
        },
        {
          id: '1',
          title: '电设备升级',
          date: '2020-09-22'
        },
        {
          id: '2',
          title: '系统升级2.0版本',
          date: '2021-03-10'
        },
        {
          id: '3',
          title: '电设备升级',
          date: '2020-09-22'
        },
        {
          id: '4',
          title: '系统升级2.0版本',
          date: '2021-03-10'
        },
        {
          id: '5',
          title: '电设备升级',
          date: '2020-09-22'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.noticeCenter {
  width: 100%;
  height: 100%;
  background: #202342;

  .noticeCenter-title {
    padding: 12px 0 12px 16px;
    font-weight: bold;
    font-size: 14px;
    color: #14d0ff;
  }

  .noticeCenter-container {
    height: 256px;

    .noticeCenter-list {
      padding: 5px 24px;
      border-bottom: solid 1px rgba(255,255,255,0.07);
      transition: all 0.5s ease-in-out;

      .noticeCenter-item {
        margin-top: 2px;

        .date {
          padding-right: 10px;
          text-align: right;
        }
      }

      &:hover {
        background: #40488a;
        border-bottom: solid 1px #40488a;
      }
    }
  }
}
</style>

<style lang="scss">
.noticeCenter {
  .noticeCenter-container {
    .el-timeline {
      height: 100%;

      .el-timeline-item {
        height: 36px;
        padding-top: 14px;
        padding-bottom: 0px;

        .el-timeline-item__node {
          width: 11px;
          height: 11px;
          background-color: transparent;
          background-image: url("../../images/dot.png");
        }

        .el-timeline-item__wrapper {
          padding-left: 26px;

          .el-timeline-item__content {
            margin-top: -2px;
            font-size: 15px;
            color: #fff;
          }
        }
      }
    }

    > .el-scrollbar {
      height: 100%;

      .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: scroll;
      }

      .el-scrollbar__bar {
        right: 14px;

        &.is-vertical {
          width: 4px; // 滚动条宽度
        }
      }

      .el-scrollbar__thumb {
        background-color: #4c79eb; // 可设置滚动条颜色
      }
    }
  }
}
</style>
