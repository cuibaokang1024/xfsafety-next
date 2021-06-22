<template>
  <el-dialog class="devList" :visible.sync="dialogVisible" width="800px">
    <div slot="title" class="dialog-title">{{ '设备列表' }}</div>
    <div class="dialog-content">
      <div class="devList">
        <ul>
          <li v-for="(list,index) in devListData.normal" :key="index">
            <dev-item :dev-data="list" :dev-type="devType" />
          </li>
        </ul>
        <ul>
          <li v-for="(list,index) in devListData.alarm" :key="index">
            <dev-item :dev-data="list" :dev-type="devType" />
          </li>
        </ul>
        <ul>
          <li v-for="(list,index) in devListData.outline" :key="index">
            <dev-item :dev-data="list" :dev-type="devType" />
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import DevItem from '../devItem'
export default {
  name: 'DevList',
  components: {
    DevItem
  },
  data() {
    return {
      devType: 0,
      dialogVisible: false,
      devListData: {
        normal: [
          {
            id: '21908090070070',
            upDate: '2020/02/28 13:10:17',
            location: '中德生物一楼总配电室 AAL1-1柜 进户1-4'
          }
        ],
        alarm: [],
        outLine: []
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.devList {
  ul {
    list-style: none;
  }
}
</style>
