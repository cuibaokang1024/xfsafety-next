<template>
  <div class="organization-chart-container">
    <OrganizationChart
      :style="'height:' + height + ';'"
      :datasource="organChartData"
      @node-click="handlerOrganizationNodeClick"
    >
      <template slot-scope="{ nodeData }">
        <el-popover
          popper-class="popover-content"
          placement="top-start"
          width="200"
          trigger="hover"
          :disabled="nodeData.icon ? true : false"
          :content="'职责：' + (nodeData.deptDuty || '暂无')"
        >
          <div slot="reference" class="node-container">
            <div class="node-bot">
              <div v-if="!nodeData.icon" class="node-title">
                <div class="node-officename">
                  <span>{{ nodeData.deptName || '待维护' }}</span>
                </div>
                <div>
                  <span>{{ nodeData.deptPrincipal || '待维护' }}</span>
                </div>
              </div>
              <div v-if="!nodeData.icon" class="node-text">
                <span>职责：</span>
                <span>{{ (nodeData.deptDuty || '暂无').substring(0, 8) }}</span>
              </div>
              <div v-if="nodeData.icon" class="node-icon" @click="handlerLinkOrgView">
                <i :class="nodeData.icon" />
              </div>
            </div>
          </div>
        </el-popover>
      </template>
    </OrganizationChart>
  </div>
</template>

<script>
import OrganizationChart from 'vue-organization-chart'
import 'vue-organization-chart/dist/orgchart.css'

export default {
  components: {
    OrganizationChart
  },
  props: {
    height: {
      type: String,
      default: ''
    },
    nodeStatus: {
      type: Boolean,
      default: false
    },
    orgData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      disabled: true,
      popoverStatus: false,
      organChartData: {}
    }
  },
  watch: {
    orgData(newVal) {
      const orgData = newVal
      let childList = []
      if (orgData.tree.length) {
        if (this.nodeStatus) {
          childList = orgData.tree.slice(0, 3)
          childList.forEach(item => {
            if (item.children) {
              delete item.children
            }
          })
          childList.push({
            id: 10086,
            icon: 'el-icon-more'
          })
        } else {
          childList = orgData.tree
        }
      } else {
        childList = [
          {
            userName: '待维护',
            officeName: '待维护'
          }
        ]
      }
      const organizationChartData = {
        id: orgData.id,
        deptName: '消防安全责任人：',
        deptPrincipal: orgData.officeDuty.deputyName,
        deptDuty: orgData.officeDuty.deputyDuty,
        children: [
          {
            id: orgData.id,
            deptName: '消防安全管理人：',
            deptPrincipal: orgData.officeDuty.primaryName,
            deptDuty: orgData.officeDuty.primaryDuty,
            children: childList
          }
        ]
      }
      this.organChartData = organizationChartData
    }
  },
  methods: {
    handlerOrganizationNodeClick(nodeData) {
      this.$emit('handlerOrganizationNodeClick', nodeData)
    },
    handlerLinkOrgView() {
      this.$emit('handlerLinkOrgView')
    }
  }
}
</script>

<style lang="scss">
.organization-chart-container {
  width: 100%;

  .orgchart-container {
    width: 100%;
    padding: 0 5px;
    border: 0px dashed #aaa;

    .orgchart {
      display: block;
      width: 100%;
      height: 274px;
      padding: 0px;
      border: 0;
      background-image: none;

      table {
        width: 100%;
      }

      > table:first-child {
        margin: 0 auto;
      }

      .node {
        width: auto;
        padding: 8px;
        background: #171c4f;
        border: 0px dashed transparent;

        &:hover {
          background: #171c4f;
        }

        .node-container {
          position: relative;

          .node-top {
            position: relative;

            .node-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              text-align: left;
              white-space: nowrap;
              margin-bottom: 4px;

              .node-name {
                min-width: 60px;
                height: 22px;
                margin-left: 40px;
                text-align: center;
                line-height: 22px;
                background: url(../../image/node-name.png) 0 0 no-repeat;
                background-size: 100%;
              }

              span {
                font-size: 14px;
                color: #e0e260;
              }
            }
            .node-text {
              text-align: left;
              white-space: nowrap;

              span {
                line-height: 20px;
                font-size: 14px;
                color: #97c1ff;
              }
            }
          }

          .node-bot {
            position: relative;

            .node-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;

              .node-officename {
                margin-right: 5px;
              }

              .node-name {
                min-width: 60px;
                height: 22px;
                margin-left: 25px;
                text-align: center;
                line-height: 22px;
                background: url(../../image/node-name.png) 0 0 no-repeat;
                background-size: 100%;
              }

              span {
                font-size: 14px;
                color: #e0e260;
              }
            }

            .node-text {
              display: flex;
              text-align: left;
              white-space: nowrap;

              span {
                line-height: 20px;
                font-size: 14px;
                color: #97c1ff;
              }
            }
          }

          .node-btn {
            position: absolute;
            left: 0;
            bottom: -26px;

            .el-button {
              padding: 1px;
              background: #2b3284;
              border: 1px solid #2b3284;

              i {
                color: #97c1ff;
                font-size: 12px;
                font-weight: bold;
              }
            }
          }

          .node-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 47px;

            i {
              font-weight: bold;
              font-size: 28px;
              color: #97c1ff;
            }
          }
        }
      }

      .lines {
        .topLine {
          border-top: 1px solid #33418f;
        }
        .leftLine {
          border-left: 1px solid #33418f;
        }
        .rightLine {
          border-right: 1px solid #33418f;
        }
        .downLine {
          margin: 0 49.8%;
          background-color: #33418f;
        }
      }
    }
  }
}
</style>
