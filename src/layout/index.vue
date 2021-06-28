<template>
  <div :class="classObj" class="app-wrapper">
    <navbar :is-home="isHome" />
    <div class="content">
      <div
        v-if="device === 'mobile' && sidebar.opened"
        class="drawer-bg"
        @click="handleClickOutside"
      />
      <sidebar
        v-if="!isHome"
        :route-parent-id="routeParentId"
        class="sidebar-container"
      />
      <div
        :class="{ hasTagsView: needTagsView, home: isHome }"
        class="main-container"
      >
        <div v-if="!isHome" :class="{ 'fixed-header': fixedHeader }">
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings && !isHome">
          <settings />
        </right-panel>
      </div>
    </div>
    <!-- <Mqtt /> -->
    <!-- <div id="alert-wrapper" /> -->
  </div>
</template>

<script>
import store from '@/store'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    routeParentId () {
      return this.$route.query.parentId
    },
    isHome () {
      return this.$route.path === '/dashboard'
    }
  },
  created () {
    const filterRouteId = sessionStorage.getItem('filterRouteId')
    store.dispatch('permission/filterRoutes', filterRouteId)
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #001646;
  display: flex;
  flex-direction: column;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .content {
    position: relative;
    height: calc(100% - 50px);
    overflow: hidden;
  }
  #alert-wrapper {
    position: absolute;
    width: 340px;
    right: 0;
    top: 80px;
    bottom: 0;
    overflow: hidden;
    overflow-y: auto;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
