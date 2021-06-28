<template>
  <div class="organization-chart-container">
    <OrganizationChart
      :style="'height:' + height + ';'"
      :datasource="organizationChartData"
      @node-click="handlerOrganizationNodeClick"
    >
      <template v-slot="{ nodeData }">
        <el-popover
          popper-class="popover-content"
          placement="top-start"
          width="200"
          trigger="hover"
          :disabled="nodeData.icon ? true : false"
          :content="'职责：' + ((nodeData.primaryDuty || nodeData.deputyDuty || nodeData.duty) || '')"
        >
          <div name="reference" class="node-container">
            <div v-if="nodeData.type" class="node-top">
              <div class="node-title">
                <span v-if="nodeData.officeName === 1" style="padding-top: 1px;">消防安全责任人：</span>
                <span v-if="nodeData.officeName === 2" style="padding-top: 1px;">消防安全管理人：</span>
                <el-input
                  v-if="nodeData.officeName === 1"
                  v-model="primaryJob"
                  class="node-title-input"
                  type="text"
                  :disabled="disabled"
                />
                <el-input
                  v-if="nodeData.officeName === 2"
                  v-model="deputyJob"
                  class="node-title-input"
                  type="text"
                  :disabled="disabled"
                />
                <div class="node-name">
                  <el-input
                    v-if="nodeData.officeName === 1"
                    v-model="primaryName"
                    class="node-name-input"
                    type="text"
                    :disabled="disabled"
                  />
                  <el-input
                    v-if="nodeData.officeName === 2"
                    v-model="deputyName"
                    class="node-name-input"
                    type="text"
                    :disabled="disabled"
                  />
                </div>
              </div>
              <div class="node-text">
                <span>职责：</span>
                <el-input
                  v-if="nodeData.officeName === 1"
                  v-model="primaryDuty"
                  class="node-duty-input"
                  type="text"
                  :disabled="disabled"
                />
                <el-input
                  v-if="nodeData.officeName === 2"
                  v-model="deputyDuty"
                  class="node-duty-input"
                  type="text"
                  :disabled="disabled"
                />
              </div>
            </div>
            <div v-else class="node-bot">
              <div v-if="!nodeData.icon" class="node-title">
                <el-input
                  v-model="nodeData.officeName"
                  class="node-title-input"
                  type="text"
                  :disabled="disabled"
                />
                <el-input
                  v-model="nodeData.jobName"
                  class="node-title-input"
                  type="text"
                  :disabled="disabled"
                />
                <div class="node-name">
                  <el-input
                    v-model="nodeData.userName"
                    class="node-name-input"
                    type="text"
                    :disabled="disabled"
                  />
                </div>
              </div>
              <div v-if="!nodeData.icon" class="node-text">
                <span style="margin-left: 4px;">职责：</span>
                <el-input
                  v-model="nodeData.duty"
                  class="node-duty-input"
                  type="text"
                  :disabled="disabled"
                />
              </div>
              <div v-if="nodeData.icon" class="node-icon" @click="handlerLinkOrgView">
                <i :class="nodeData.icon" />
              </div>
            </div>
            <div v-if="popoverStatus && (nodeData.type !== 1)" class="node-btn">
              <el-button
                size="mini"
                icon="el-icon-plus"
                circle
                @click="handlerPlusNodeOrg(nodeData)"
              />
              <el-button
                v-if="nodeData.officeName !== 2"
                size="mini"
                icon="el-icon-minus"
                circle
                @click="handlerMinusNodeOrg(nodeData)"
              />
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
  data () {
    return {
      disabled: true,
      popoverStatus: false,
      primaryJob: '',
      primaryName: '',
      primaryDuty: '',
      deputyJob: '',
      deputyName: '',
      deputyDuty: ''
    }
  },
  computed: {
    organizationChartData () {
      var childList = []
      if (this.nodeStatus) {
        childList = this.OrgData.deptList[0].children.slice(0, 3)
        childList.forEach(item => {
          if (item.children) {
            delete item.children
          }
        })
        childList.push({
          id: '6',
          icon: 'el-icon-more'
        })
      } else {
        childList = this.OrgData.deptList[0].children
      }
      const organizationChartData = {
        id: 1,
        primaryJob: this.primaryJob,
        primaryName: this.primaryName,
        primaryDuty: this.primaryDuty,
        type: 1,
        officeName: 1,
        children: [
          {
            id: 2,
            deputyJob: this.deputyJob,
            deputyName: this.deputyName,
            deputyDuty: this.deputyDuty,
            type: 2,
            officeName: 2,
            children: childList
          }
        ]
      }
      return organizationChartData
    }
  },
  created () {
    this.primaryJob = this.OrgData.primaryJob || ''
    this.primaryName = this.OrgData.primaryName || ''
    this.primaryDuty = this.OrgData.primaryDuty || ''
    this.deputyJob = this.OrgData.deputyJob || ''
    this.deputyName = this.OrgData.deputyName || ''
    this.deputyDuty = this.OrgData.deputyDuty || ''
  },
  methods: {
    handlerOrganizationNodeClick (nodeData) {
      this.$emit('handlerOrganizationNodeClick', nodeData)
    },
    handlerLinkOrgView () {
      this.$emit('handlerLinkOrgView')
    },
    handlerPlusNodeOrg (nodeData) {
      this.$emit('handlerPlusNodeOrg', nodeData)
    },
    handlerMinusNodeOrg (nodeData) {
      this.$emit('handlerMinusNodeOrg', nodeData)
    },
    handlerEdit () {
      this.disabled = false
      this.popoverStatus = true
    },
    handlerSave () {
      this.disabled = true
      this.popoverStatus = false
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

          .el-input {
            width: 0;

            .el-input__inner {
              width: 100%;
              height: 100%;
              padding: 0 3px;
              color: #97c1ff;
              font-size: 14px;
              border: 1px solid transparent;
              background: transparent;
            }
          }

          .node-top {
            position: relative;

            .node-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              text-align: left;
              white-space: nowrap;
              margin-bottom: 4px;

              .node-title-input {
                min-width: 60px;

                .el-input__inner {
                  font-size: 14px;
                  color: #e0e260;
                }
              }

              .node-name {
                min-width: 60px;
                height: 22px;
                margin-left: 40px;
                text-align: center;
                line-height: 22px;

                .node-name-input {
                  min-width: 60px;

                  .el-input__inner {
                    padding-left: 10px;
                    background: url(../../image/node-name.png) 0 0 no-repeat;
                    background-size: 100%;
                  }
                }
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

              .node-duty-input {
                min-width: 140px;
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

              .node-title-input {
                min-width: 60px;

                .el-input__inner {
                  font-size: 14px;
                  color: #e0e260;
                }
              }

              .node-name {
                min-width: 60px;
                height: 22px;
                margin-left: 10px;
                text-align: center;
                line-height: 22px;

                .node-name-input {
                  min-width: 60px;

                  .el-input__inner {
                    padding-left: 10px;
                    background: url(../../image/node-name.png) 0 0 no-repeat;
                    background-size: 100%;
                  }
                }
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

              .node-duty-input {
                min-width: 140px;
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
