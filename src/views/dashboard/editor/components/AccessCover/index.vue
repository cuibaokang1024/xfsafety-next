<template>
  <div class="access-cover" :style="'width:' + width + ';' + 'height:' + height + ';'">
    <div class="head">
      <div class="icon" />
      <div class="text">{{ title }}</div>
    </div>
    <div class="access-content">
      <div class="cover cover-img">
        <div class="img" :class="handleSwitchStatus(status)" />
        <div class="text">
          <span v-if="status === 0">水设备</span>
          <span v-if="status === 1">电设备</span>
          <span v-if="status === 2">烟感设备</span>
          <span v-if="status === 3">燃气设备</span>
          <span v-if="status === 4">火灾设备</span>
          <br>
          <span>未接入</span>
        </div>
      </div>
      <div class="cover cover-text" style="align-items: flex-start;">
        <div class="bg">
          <span class="duct">产品介绍</span>
        </div>
        <div v-if="status === 0" class="copywriting">
          <div>1.数据传输装置和前端采集单元相互配合</div>
          <div>2.实现对社会单位灭火剂资源的实时监测</div>
          <div>3.实时告警信息，及时进行督办</div>
        </div>
        <div v-if="status === 1" class="copywriting">
          <div>1.实时在线监测和统计分析引起电气火灾因素</div>
          <div>2.手机APP掌握线路存在的用电安全隐患状态</div>
          <div>3.判断故障发生的原因，指导企业开展治理</div>
        </div>
        <div v-if="status === 2" class="copywriting">
          <div>1.实现二十四小时不间断地对火情进行监测</div>
          <div>2.大大降低应用场所的火灾发生率</div>
          <div>3.应用于消防重点部位等场所</div>
        </div>
        <div v-if="status === 3" class="copywriting">
          <div>1.由“间断性检查”变“连续实时监控”</div>
          <div>2.生产运行和应急调度充分融合</div>
          <div>3.对燃气管网实时监控和智能报警</div>
        </div>
        <div v-if="status === 4" class="copywriting">
          <div>1.火灾报警系统加装信息传输装置</div>
          <div>2.采集消防报警系统内的报警信息</div>
          <div>3.避免管理人员对值守人员无法监管</div>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button round @click="handleClickInfo">查看详情 >></el-button>
    </div>
  </div>
</template>

<script>
import './index.scss'

export default {
  name: 'AccessCover',
  props: {
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    status: {
      // 0为水 1为电 2为烟感 3为燃气 4为火灾
      type: Number,
      default: null
    }
  },
  methods: {
    handleSwitchStatus(status) {
      switch (status) {
        case 0:
          return 'waterImg'
        case 1:
          return 'electricImg'
        case 2:
          return 'smokeImg'
        case 3:
          return 'gasImg'
        case 4:
          return 'infotxImg'
        default:
          break
      }
    },
    handleClickInfo() {
      const status = this.status
      this.$emit('handleClickInfo', status)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
