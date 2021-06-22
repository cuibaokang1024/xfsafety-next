<template>
  <div class="dashboard-container" style="height: 100%;">
    <!-- <component :is="currentRole" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import beadhouse from './beadhouse'
// import editorDashboard from './editor'
// import emergency from './emergency'
// import agent from './agent'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard, emergency, agent, beadhouse },
  data () {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'officeType'
    ])
  },
  created () {
    if (this.officeType === 1) {
      this.currentRole = 'editorDashboard'
    } else if (this.officeType === 6) {
      this.currentRole = 'emergency'
    } else if (this.officeType === 5) {
      this.currentRole = 'agent'
    } else if (this.officeType === 3) {
      this.currentRole = 'beadhouse'
    }
  }
}
</script>
