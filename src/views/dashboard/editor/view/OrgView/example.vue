<template>
  <div class="orgview-main">
    <div class="orgview-container">
      <div class="orgview-btn">
        <el-button class="edit" size="mini" round @click="handlerEditView">编辑</el-button>
        <el-button v-if="saveStatus" class="save" size="mini" round @click="handlerSaveView">保存</el-button>
      </div>
      <OrganizationChart
        v-if="OrgData"
        ref="OrgChart"
        height="100%"
        :org-data.sync="OrgData"
        @handlerPlusNodeOrg="handlerPlusNodeOrg"
        @handlerMinusNodeOrg="handlerMinusNodeOrg"
      />
    </div>
  </div>
</template>

<script>
import { handlerOfficeOrg } from '@/api/companyHome'

import OrganizationChart from '../../components/OrganizationChart'

export default {
  components: {
    OrganizationChart
  },
  data() {
    return {
      saveStatus: false,
      OrgData: null
    }
  },
  created() {
    this._handlerOfficeOrg()
  },
  methods: {
    _handlerOfficeOrg() {
      handlerOfficeOrg().then(res => {
        this.OrgData = res.data
      })
    },
    handlerEditView() {
      this.saveStatus = true
      this.$refs.OrgChart.handlerEdit()
    },
    handlerSaveView() {
      this.saveStatus = false
      this.$refs.OrgChart.handlerSave()
    },
    handlerPlusNodeOrg(nodeData) {
      if (nodeData.id === 2) {
        this.OrgData.deptList[0].children.push({})
      } else {
        this.handlerAddOrgChart(this.OrgData.deptList[0].children, nodeData.id)
      }
    },
    handlerAddOrgChart(data, id) {
      data.forEach((item, index) => {
        if (item.id === id) {
          if (item.children) {
            item.children.push({})
          }
        } else if (item.children) {
          this.handlerAddOrgChart(item.children, id)
        }
      })
    },
    handlerDeleteOrgChart(data, id) {
      data.forEach((item, index) => {
        if (item.id === id) {
          data.splice(index, 1)
        } else if (item.children) {
          this.handlerDeleteOrgChart(item.children, id)
        }
      })
    },
    handlerMinusNodeOrg(nodeData) {
      this.handlerDeleteOrgChart(
        this.OrgData.deptList[0].children,
        nodeData.id
      )
    }
  }
}
</script>

<style lang="scss">
.orgview-main {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #001647;

  .orgview-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #172160;
    overflow-y: scroll;

    .orgview-btn {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 99999;

      span {
        font-size: 14px;
        color: #fff;
      }

      .edit {
        padding: 8px 22px;
        border: 1px solid #4555b8;
        background: #4555b8;
        cursor: pointer;
      }

      .save {
        padding: 8px 22px;
        border: 1px solid #028b93;
        background: #028b93;
        cursor: pointer;
      }
    }

    .organization-chart-container {
      height: 100%;

      .downLine {
        margin: 0 49.9% !important;
        background-color: #33418f;
      }
    }
  }
}
</style>
