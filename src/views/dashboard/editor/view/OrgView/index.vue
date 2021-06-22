<template>
  <div class="orgview-main">
    <div class="orgview-container">
      <OrganizationChart v-if="OrgData" ref="OrgChart" height="100%" :org-data="OrgData" />
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
      OrgData: {}
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
