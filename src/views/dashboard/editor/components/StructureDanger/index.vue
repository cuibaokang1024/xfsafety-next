<template>
  <div class="container structuredanger">
    <div class="structure">
      <div class="head">
        <div class="icon" />
        <div class="text">组织架构</div>
      </div>
      <div class="structure-chart">
        <OrganizationChart
          v-if="OrgData"
          ref="OrgChart"
          height="274px"
          :org-data="OrgData"
          :node-status="true"
          @handlerLinkOrgView="handlerLinkOrgView"
        />
      </div>
    </div>
    <div class="danger">
      <div class="head">
        <div class="icon" />
        <div class="text">待办事项</div>
      </div>
      <div class="timeline">
        <el-timeline
          v-if="activities.length > 0"
          v-infinite-scroll="handleScrollLoad"
          :reverse="reverse"
          :infinite-scroll-delay="1000"
          :infinite-scroll-disabled="disabled"
        >
          <el-timeline-item v-for="(activity, index) in activities" :key="index">
            <div class="line-container" @click="handlerClickReadDetail(activity.id)">
              <div class="time">
                <span>{{ activity.time }}</span>
              </div>
              <div class="text">
                <div class="tool-text">
                  <span>{{ activity.title }}</span>
                  <div class="tool-container">
                    <div class="tooltip" :class="activity.ifRead ? 'read' : 'unread'">
                      <span>{{ activity.ifRead ? '已读' : '未读' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mess">{{ activity.content }}</div>
            </div>
          </el-timeline-item>
          <div v-if="hasMore" class="loading-text">加载中...</div>
          <div v-else class="loading-text">(Ｔ▽Ｔ)没有更多啦!</div>
        </el-timeline>
        <div v-else class="bg-cover">
          <div class="bg-cover-img" />
        </div>
      </div>
      <div class="dialogview dark">
        <el-dialog title="待办事项" :visible.sync="dialogVisible" width="678px">
          <div class="dialog-content">
            <el-form label-width="60px" :model="activitiesData">
              <el-form-item label="标题：">
                <el-input v-model="activitiesData.title" />
              </el-form-item>
              <el-form-item label="时间：">
                <el-input v-model="activitiesData.time" />
              </el-form-item>
              <el-form-item label="内容：" style="flex: 0 1 100%;">
                <el-input v-model="activitiesData.content" type="textarea" />
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  handlerOfficeOrg,
  handlerTodoList,
  handlerTodoDetail
} from '@/api/companyHome'

import OrganizationChart from '../OrganizationChart'

export default {
  // 组织架构与待办事项
  name: 'TodoList',
  components: {
    OrganizationChart
  },
  data() {
    return {
      OrgData: {},
      listQuery: {
        page: 1,
        pageSize: 5
      },
      disabled: false,
      hasMore: true,
      reverse: false,
      dialogVisible: false,
      activities: [],
      activitiesData: {}
    }
  },
  watch: {
    activitiesData() {
      this._handlerTodoList()
    }
  },
  created() {
    this._handlerOfficeOrg()
    this._handlerTodoList()
  },
  methods: {
    _handlerOfficeOrg() {
      handlerOfficeOrg().then(res => {
        this.OrgData = res.data
      })
    },
    _handlerTodoList() {
      handlerTodoList(this.listQuery).then(res => {
        this.activities = res.data.list
        this.disabled = false
        if (
          this.listQuery.page * this.listQuery.pageSize >=
          res.data.totalCount
        ) {
          this.hasMore = false
          return false
        }
      })
    },
    handlerLinkOrgView() {
      this.$router.push('/dashboard/editor/orgview')
    },
    handleScrollLoad() {
      if (!this.hasMore) {
        this.disabled = true // 关闭无限滚动
        return false
      }
      this.listQuery.pageSize += 5
      this._handlerTodoList()
    },
    handlerClickReadDetail(id) {
      const para = { id }
      handlerTodoDetail(para).then(res => {
        this.activitiesData = res.data
        this.dialogVisible = !this.dialogVisible
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
