<template>
  <div class="projectView">
    <div class="projectView-title">
      <span>实施项目概览</span>
    </div>
    <div class="projectView-container">
      <el-scrollbar>
        <el-container class="projectView-list">
          <el-row v-for="item in dataList" :key="item.id" class="projectView-item">
            <el-col :span="2" class="avatar">
              <el-avatar size="large" :src="item.src" />
            </el-col>
            <el-col :span="3" class="name">
              <div>{{ item.name }}</div>
            </el-col>
            <el-col :span="7" class="title">
              <div>{{ item.title }}</div>
            </el-col>
            <el-col :span="6" class="status">
              <el-timeline :reverse="true" :hide-timestamp="true">
                <el-timeline-item
                  size="normal"
                  :color="handleStatus(item.status)"
                >{{ item.statusName }}</el-timeline-item>
              </el-timeline>
            </el-col>
            <el-col :span="4" class="phone">
              <div>{{ item.phone }}</div>
            </el-col>
          </el-row>
        </el-container>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectView',
  data() {
    return {
      dataList: [
        {
          id: '0',
          name: '赵天一',
          title: '消防能力提升工程',
          status: 0,
          statusName: '商务对接中',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        },
        {
          id: '1',
          name: '刘明汉',
          title: '消防能力提升工程',
          status: 1,
          statusName: '签合同',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        },
        {
          id: '2',
          name: '皇甫平',
          title: '消防能力提升工程',
          status: 2,
          statusName: '已勘察',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        },
        {
          id: '3',
          name: '王湘绮',
          title: '消防能力提升工程',
          status: 3,
          statusName: '已安装',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        },
        {
          id: '5',
          name: '王毅',
          title: '消防能力提升工程',
          status: 2,
          statusName: '已勘察',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        },
        {
          id: '4',
          name: '易峰',
          title: '消防能力提升工程',
          status: 4,
          statusName: '已验收',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        },
        {
          id: '6',
          name: '程明凌',
          title: '消防能力提升工程',
          status: 4,
          statusName: '已验收',
          phone: '13685956356',
          src:
            'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        }
      ]
    }
  },
  methods: {
    handleStatus(i) {
      switch (i) {
        case 0: // 商务对接中
          return '#ecef00'
        case 1: // 签合同
          return '#e95d00'
        case 2: // 已勘察
          return '#00a0e9'
        case 3: // 已安装
          return '#b815db'
        case 4: // 已验收
          return '#50c700'
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.projectView {
  width: 100%;
  height: 100%;
  background: #202342;

  .projectView-title {
    padding: 12px 0 12px 16px;
    font-weight: bold;
    font-size: 14px;
    color: #14d0ff;
  }

  .projectView-container {
    height: 256px;

    .projectView-list {
      display: flex;
      flex-direction: column;
      height: 100%;

      .projectView-item {
        width: 100%;
        height: 50px;
        padding: 5px 16px;
        font-size: 14px;
        color: #fff;
        transition: all 0.5s ease-in-out;

        .avatar {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .name {
          text-align: left;
          padding-left: 10px;
          line-height: 40px;
        }

        .title {
          text-align: left;
          padding-left: 10px;
          line-height: 40px;
        }

        .status {
          height: 100%;
          padding-left: 10px;
        }

        .phone {
          text-align: left;
          padding-left: 10px;
          line-height: 40px;
        }

        &:hover {
          background: #40488a;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.projectView {
  .projectView-container {
    .el-timeline {
      display: flex;
      justify-content: left;
      align-items: center;
      height: 100%;

      .el-timeline-item {
        padding-bottom: 0px;
        margin-top: 16px;

        .el-timeline-item__node {
          width: 8px;
          height: 8px;
        }

        .el-timeline-item__wrapper {
          padding-left: 20px;

          .el-timeline-item__content {
            margin-top: -2px;
            font-size: 14px;
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
