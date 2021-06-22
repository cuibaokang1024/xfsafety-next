<template>
  <div class="navbar" :class="{ home: isHome }">
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="center">
      <ul class="menu-list left">
        <div v-show="isHome" class="office-name">{{ officeName }}</div>
        <li
          v-for="route in permission_routes.left"
          v-show="isHome"
          :key="route.id"
          @click.stop="setfilterRouteId(route.id)"
        >
          <el-tooltip effect="dark" :content="route.meta.title ? route.meta.title : ''" placement="right-start">
            <router-link
              :data-text="route.meta.title ? route.meta.title : ''"
              :to="{ path: route.path, query: { id: route.id } }"
              class="
                btn btn-primary btn-ghost btn-border-stroke btn-text-float-up btn-ellipsis
              "
            >
              <div class="btn-borders">
                <div class="border-top" />
                <div class="border-right" />
                <div class="border-bottom" />
                <div class="border-left" />
              </div>
              <span class="btn-text">{{
                route.meta.title ? route.meta.title : ""
              }}</span>
            </router-link>
          </el-tooltip>
        </li>
        <div v-show="!isHome" class="back">
          <span class="icon" @click="back" />
          <span class="text">社会化消防安全管理平台</span>
        </div>
      </ul>
      <div class="content" />
      <div v-show="isHome" class="sysName">社会化消防安全管理云平台</div>
      <ul class="menu-list right">
        <li
          v-for="route in permission_routes.right"
          v-show="isHome"
          :key="route.id"
          @click.stop="setfilterRouteId(route.id)"
        >
          <el-tooltip effect="dark" :content="route.meta.title ? route.meta.title : ''" placement="right-start">
            <router-link
              :data-text="route.meta.title ? route.meta.title : ''"
              :to="{ path: route.path, query: { id: route.id } }"
              class="
              btn btn-primary btn-ghost btn-border-stroke btn-text-float-up btn-ellipsis
            "
            >
              <div class="btn-borders">
                <div class="border-top" />
                <div class="border-right" />
                <div class="border-bottom" />
                <div class="border-left" />
              </div>
              <span class="btn-text">{{
                route.meta.title ? route.meta.title : ""
              }}</span>
            </router-link>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <span
          v-show="!isHome"
          style="
            color: #fff;
            font-size: 12px;
            vertical-align: top;
            margin-right: 40px;
          "
          class="office-name"
        >{{ officeName }}</span>
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <AppCodeDown />
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <el-tooltip effect="dark" :content="userName" placement="bottom">
            <span class="user-name">{{ userName }}</span>
          </el-tooltip>
          <img
            :src="
              photoUrl ||
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
            "
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu name="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>-->
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters, mapState } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import AppCodeDown from '@/components/AppCodeDown'

export default {
  components: {
    // Breadcrumb,
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    AppCodeDown
    // Search
  },
  props: {
    isHome: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userName',
      'officeName',
      'photoUrl'
    ]),
    ...mapState({
      permission_routes (state) {
        const routes = state.permission.routes.filter((route) => {
          return !route.hidden
        })
        const _index = Math.ceil(routes.length / 2)
        return {
          left: routes.filter((item, index) => {
            return index < _index
          }),
          right: routes.filter((item, index) => {
            return index >= _index
          })
        }
      }
    })
  },
  methods: {
    setfilterRouteId (id) {
      sessionStorage.setItem('filterRouteId', id)
      store.dispatch('permission/filterRoutes', id)
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    back () {
      sessionStorage.setItem('filterRouteId', '')
      store.dispatch('permission/filterRoutes', '')
      this.$router.push('/')
      store.dispatch('tagsView/delAllVisitedViews')
      store.dispatch('tagsView/delAllCachedViews')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(3, 11, 24, 0.31);

  &.home {
    background: url(./navbar_bg.png) center no-repeat;
    background-size: cover;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .center {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    .btn-ellipsis {
      max-width: 140px;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .menu-list {
      display: flex;
      flex: 1;
      height: 100%;
      align-items: center;
      justify-content: flex-end;

      &.right {
        justify-content: flex-start;
      }

      &.left {
        position: relative;

        .office-name {
          font-size: 14px;
          color: #fff;
          position: absolute;
          left: 10px;
        }

        .back {
          display: flex;
          flex: 1;
          align-items: center;

          .icon {
            display: inline-block;
            width: 43px;
            height: 28px;
            background: url(./icon_back.png) center no-repeat;
            background-size: 100% 100%;
            margin: 0 15px 0 3px;
            cursor: pointer;
          }

          .text {
            font-size: 18px;
            font-weight: bold;
            color: #ffffff;
          }
        }
      }

      li {
        margin-right: 17px;

        .btn {
          --hue: 210;
          --ease-in-duration: 0.25s;
          --ease-in-exponential: cubic-bezier(0.95, 0.05, 0.795, 0.035);
          --ease-out-duration: 0.65s;
          --ease-out-delay: var(--ease-in-duration);
          --ease-out-exponential: cubic-bezier(0.19, 1, 0.22, 1);
          position: relative;
          display: inline-block;
          padding: 0 25px;
          height: 31px;
          line-height: 31px;
          font-size: 14px;
          border-radius: 15px 0px 15px 0px;
          text-decoration: none;
          background-color: #001660;
          border: 1px solid hsl(var(--hue), 100%, 50%);
          outline: transparent;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          transition: 0.25s;
          &:hover {
            background: hsl(var(--hue), 100%, 40%);
          }
          &-primary {
            --hue: 210;
          }
          &-ghost {
            color: hsl(var(--hue), 100%, 50%);
            border-color: hsl(var(--hue), 100%, 50%);
            &:hover {
              color: white;
            }
          }

          &-border-stroke {
            border-color: hsla(var(--hue), 100%, 50%, 0.35);

            .btn-borders {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;

              .border-top {
                position: absolute;
                top: 0;
                width: 100%;
                height: 1px;
                background: hsl(var(--hue), 100%, 50%);
                transform: scaleX(0);
                transform-origin: left;
              }

              .border-right {
                position: absolute;
                right: 0;
                width: 1px;
                height: 100%;
                background: hsl(var(--hue), 100%, 50%);
                transform: scaleY(0);
                transform-origin: bottom;
              }

              .border-bottom {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 1px;
                background: hsl(var(--hue), 100%, 50%);
                transform: scaleX(0);
                transform-origin: left;
              }

              .border-left {
                position: absolute;
                left: 0;
                width: 1px;
                height: 100%;
                background: hsl(var(--hue), 100%, 50%);
                transform: scaleY(0);
                transform-origin: bottom;
              }

              // when unhover, ease-out left, bottom; ease-in right, top

              .border-left {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                  var(--ease-out-exponential);
              }
              .border-bottom {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                  var(--ease-out-exponential);
              }

              .border-right {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
              }
              .border-top {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
              }
            }

            &:hover {
              color: #00d0ff;
              background: transparent;
              .border-top,
              .border-bottom {
                transform: scaleX(1);
              }
              .border-left,
              .border-right {
                transform: scaleY(1);
              }

              .border-left {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
              }
              .border-bottom {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
              }

              .border-right {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                  var(--ease-out-exponential);
              }
              .border-top {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                  var(--ease-out-exponential);
              }
            }
          }

          &-text-float-up {
            &::after {
              position: absolute;
              content: attr(data-text);
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transform: translateY(35%);
              transition: 0.25s ease-out;
            }
            .btn-text {
              color: #fff;
              display: block;
              transition: 0.75s 0.1s var(--ease-out-exponential);
            }
            &:hover {
              .btn-text {
                opacity: 0;
                transform: translateY(-25%);
                transition: 0.25s ease-out;
              }
              &::after {
                opacity: 1;
                transform: translateY(0);
                transition: 0.75s 0.1s var(--ease-out-exponential);
              }
            }
          }
        }
        &.space {
          width: 500px;
        }
      }
    }
    .content {
      width: 500px;
    }
    .sysName {
      position: absolute;
      left: 50%;
      transform: translate3D(-50%, -50%, 0);
      top: 50%;
      height: 25px;
      font-size: 24px;
      font-weight: 400;
      color: #ffffff;
      line-height: 23px;
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    position: absolute;
    right: 0;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-name {
          vertical-align: top;
          font-size: 12px;
          color: #fff;
          /* float: left; */
          /* margin-top: 29px; */
          display: inline-block;
          margin-top: -3px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          max-width: 120px;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          // border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
