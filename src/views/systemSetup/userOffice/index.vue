<template>
  <div class="section-main">
    <UserManage
      v-if="isShowUserManage"
      :back-btn-flag="false"
      :user-type="7"
      :office-id="viewUserOfficeId"
      :office-name="viewUserOfficeName"
      @hideUserManage="hideUserManage"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import UserManage from '@/components/userManage'

export default {
  /* 人员 */
  name: 'Personnel',
  components: {
    UserManage
  },
  data () {
    return {
      isShowUserManage: true,
      viewUserOfficeId: '', // 查看人员officeId
      viewUserOfficeName: '' // 查看人员officeName
    }
  },
  computed: {
    ...mapGetters({
      officeId: 'officeId',
      officeName: 'officeName'
    })
  },
  created () {
    this.viewUserOfficeId = this.officeId
    this.viewUserOfficeName = this.officeName
  },
  methods: {
    // 隐藏人员
    hideUserManage () {
      this.isShowUserManage = true
    }
  }
}
</script>

<style scoped lang="scss">
.section-main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.appCode {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo {
  display: flex;
  margin-top: 14px;
}

.title {
  width: 100px;
  text-align: right;
  color: #97c1ff;
  padding-right: 4px;
  font-weight: bold;
}

.upload {
  flex: 1;
}
</style>
