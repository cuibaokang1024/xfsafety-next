<template>
  <div style="width: 100%;height: 100%;">
    <div
      v-loading="false"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="wraper"
    >
      <el-container>
        <el-header>
          <div class="left">
            <div class="text">可视化监测</div>
          </div>
          <div class="right">
            <div class="alarmNum">
              <span class="text">今日报警设备（台）</span>
              <div class="num">
                <number-roll
                  ref="numberRoll"
                  :bg="true"
                  :width="'28px'"
                  :font-size="'36px'"
                  :number="alertCount"
                />
              </div>
            </div>
            <el-form ref="form" :inline="true" :model="listQuery">
              <el-form-item label="设备类别:">
                <span class="arrow" :class="isSelectSensorCat ? 'arrow-up' : ''" />
                <el-select
                  v-model="listQuery.sensorCat"
                  :popper-append-to-body="false"
                  style="width:146px"
                  placeholder="请选择设备类别"
                  @change="sensorCatChange"
                  @visible-change="selectSensorCat"
                >
                  <!-- <el-option :value="''" label="普通" /> -->
                  <el-option
                    v-for="item in sensorCatList"
                    :key="item.sensorCat"
                    :label="item.sensor"
                    :value="item.sensorCat"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="楼座:">
                <span class="arrow" :class="isSelectBuilding ? 'arrow-up' : ''" />
                <el-select
                  v-model="listQuery.partId"
                  :popper-append-to-body="false"
                  style="width:146px"
                  placeholder="请选择楼座"
                  @change="buildingChange"
                  @visible-change="selectBuilding"
                >
                  <el-option :value="''" label="全部" />
                  <el-option
                    v-for="item in partList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="楼层:">
                <span class="arrow" :class="isSelectFloor ? 'arrow-up' : ''" />
                <el-select
                  v-model="listQuery.partAddrId"
                  :popper-append-to-body="false"
                  class="mini"
                  style="width:80px"
                  placeholder
                  @visible-change="selectFloor"
                >
                  <el-option :value="''" label="全部" />
                  <el-option
                    v-for="item in partAddrList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handlerSearch"
              >查询</el-button>
            </el-form>
          </div>
        </el-header>
        <!-- <el-main>
          <el-container v-if="cameraData.length>0">
            <el-header>
              <div class="title">
              </div>
            </el-header>
            <el-main class="camera-content">
              <ul class="cameraList">
                <li v-for="item in cameraData" :key="item.iotCardId">
                  <dev-item :dev-type="4" :dev-data="item" @viewAlertRecord="viewAlertRecord" />
                </li>
              </ul>
            </el-main>
          </el-container>
        </el-main> -->
        <el-main class="otherCamera">
          <div class="left">
            <ul class="cameraList">
              <li v-for="(camera,index) in cameraData" :key="index">
                <dev-item :dev-type="4" :dev-data="camera" @viewAlertRecord="viewAlertRecord" @playVideo="playVideo" />
              </li>
            </ul>
          </div>

          <div class="center">
            <draggable v-model="videoList" class="videoList" :class="videoClass" group="people" @start="drag=true" @end="drag=false">
              <div v-for="(video,index) in videoList" :key="index" :class="{selected: currentVideoId ===video.id}" class="videoWrapper" @click="selectPlayerDom(video.id)">
                <div v-if="video.location||video.sensor" class="info">{{ video.location||''+video.sensor||'' }}</div>
                <VideoPlayer v-if="video.src" ref="videoPlayer" :options="playerOptions" :src="video.src" />
                <div v-else class="tips">
                  <span class="icon" />
                  <span class="text">请选择您要观看的实时视频</span>
                </div>
              </div>
            </draggable>
            <div class="view-control">
              <div class="label">
                <span>视图<br>控制</span>
              </div>
              <ul class="content">
                <li v-for="view in viewList" :key="view.id" @click="createVideoDom(view.num)">
                  <span class="icon" :class="`view-${view.num}`" />
                  <span class="num">{{ view.num }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="right">
            <div class="header">报警信息</div>
            <ul v-scrollBottom="_getMoreAlertList">
              <li v-for="message in alertList" :key="message.id">
                <p class="title">{{ message.sensor||'' }}</p>
                <p class="text">{{ message.addr||'' }}</p>
                <p class="text">{{ `报警时间：${message.time||''}` }}</p>
                <p class="text content">{{ `报警内容：${message.addr||''}${message.carNum||''}${message.sensor||''}` }}</p>
              </li>
            </ul>
          </div>
        </el-main>
      </el-container>
      <alarm-record
        :id="showAlarmRecordId"
        ref="alertRecord"
        :sensor-cat="sensorCat"
        :dev-type="4"
        :is-reset-table-flag="isResetTableFlag"
        :addr="alertLocation"
      />
      <CameraAlert ref="CameraAlert" :camera-list="cameraList" />
    </div>
  </div>
</template>

<script>
import { getPartsList, getPartsAddrList } from '@/api/partsList'
import { getCameraList, getAlertCount, GBSLogin, streamStart, findAlertAll, streamTouch } from '@/api/camera'
import { handlerTodoList } from '@/api/companyHome'
import { getSensorTypeList } from '@/api/sensor'
import draggable from 'vuedraggable'
import '@/styles/devList.scss'
import AlarmRecord from '@/components/alarmRecord'
import NumberRoll from '@/components/numberRoll'
import DevItem from '@/components/devItem'
import CameraAlert from './components/cameraAlert'
import VideoPlayer from '@/components/VideoPlayer'
import scrollBottom from '@/directive/scroll/index.js'
let idSeq = Date.now()
export default {
  name: '',
  components: {
    DevItem,
    NumberRoll,
    AlarmRecord,
    CameraAlert,
    draggable,
    VideoPlayer
  },
  directives: {
    scrollBottom
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      showAlarmRecordId: '',
      alertLocation: '',
      isResetTableFlag: false,
      cameraData: [],
      alertCount: 0, // 设备报警总数
      partList: [], // 楼座
      partAddrList: [], // 楼层
      sensorCat: '', // 传感器类型
      /**  自定义下拉选择框*/
      isSelectSensorCat: false,
      isSelectBuilding: false,
      isSelectFloor: false,
      sensorCatList: [],
      /** */
      page: 1,
      hasMore: false,
      listQuery: {
        // 查询参数
        partId: '',
        partAddrId: '',
        sensorCat: null
      },
      viewNum: 8,
      cameraList: [],
      timers: [],
      playerOptions: {
        autoplay: true,
        aspectRatio: '16:9',
        videoType: 'application/x-mpegURL'
      },
      videoPlayQuery: {
        username: '',
        password: '',
        serial: '',
        code: ''
      },
      drag: true,
      currentVideo: null,
      currentVideoId: '',
      videoList: [],
      viewList: [
        {
          id: 1,
          num: 4
        },
        {
          id: 2,
          num: 6
        },
        {
          id: 3,
          num: 8
        },
        {
          id: 4,
          num: 9
        },
        {
          id: 5,
          num: 16
        }
      ],
      alertList: []
    }
  },
  computed: {
    videoClass() {
      return `video-${this.viewNum}`
    }
  },
  watch: {
    'listQuery.partId': {
      handler(newVal, oldVal) {
        this.listQuery.partAddrId = ''
        this._getPartsAddrList(newVal)
      }
    }
  },
  beforeDestroy() {
    this.clearAllInterval()
  },
  created() {
    this._getAlertCount()
    this._getPartsList()
    this._getSensorTypeList()
    this._getCameraList()
    this._findAlertAll()
  },
  methods: {
    // 打开报警记录页
    viewAlertRecord(id, location) {
      this.showAlarmRecordId = id
      this.alertLocation = location
      this.isResetTableFlag = !this.isResetTableFlag
      this.$refs.alertRecord.show()
    },
    // 获取可视化设备传感器列表
    _getSensorTypeList() {
      getSensorTypeList({ devType: 5 }).then((res) => {
        if (res.data) {
          this.sensorCatList = res.data
        }
      })
    },
    // 获取采集部位列表
    _getPartsList() {
      getPartsList().then(res => {
        if (res.data) {
          this.partList = res.data
        }
      })
    },
    //
    _getPartsAddrList(id) {
      getPartsAddrList({ partsId: id }).then((res) => {
        if (res.data) {
          this.partAddrList = res.data
        }
      })
    },
    // 获取设备报警总数
    _getAlertCount() {
      getAlertCount().then(res => {
        if (res.data) {
          this.alertCount = res.data
        }
      })
    },
    _findAlertAll() {
      this.hasMore = true
      findAlertAll({ page: this.page, sensorCat: this.listQuery.sensorCat }).then((res) => {
        if (res.data) {
          this.alertList = res.data.page
          this.checkMore(res.data)
        }
      })
    },
    checkMore(data) {
      if (!data.page) {
        this.hasMore = false
      }
    },
    _getMoreAlertList() {
      if (!this.hasMore) {
        return
      }
      this.page++
      findAlertAll({ page: this.page, sensorCat: this.listQuery.sensorCat }).then(res => {
        if (res.data) {
          this.alertList = res.data.page
          this.checkMore(res.data)
        }
      })
    },

    _getCameraList() {
      if (this.timers.length > 0) {
        this.clearAllInterval()
      }
      this.createVideoDom()
      getCameraList(this.listQuery).then(res => {
        if (res.data) {
          const data = []
          res.data.page.list.forEach((item, index) => {
            if (item.channelList && item.channelList.length > 0) {
              item.channelList.forEach((channel) => {
                data.push({ ...item, channelGbsId: channel.channelGbsId, channelList: [], location: channel.location, sensor: item.sensor + channel.name })
              })
            } else {
              data.push(item)
            }
          })
          this.cameraData = data
        }
      })
    },
    handlerSearch() {
      this._getCameraList()
      this._findAlertAll()
    },
    // 获取弹出框
    _handlerChkPlanList() {
      handlerTodoList().then(res => {
        this.cameraList = res.data
      })
    },
    selectSensorCat(flag) {
      this.isSelectSensorCat = flag
    },
    sensorCatChange() {
      this.listQuery.partAddrId = ''
    },
    selectBuilding(flag) {
      this.isSelectBuilding = flag
    },
    buildingChange() {
      this.listQuery.partAddrId = ''
    },
    selectFloor(flag) {
      this.isSelectFloor = flag
    },
    handlerCameraAlertBtn() {
      this._handlerChkPlanList()
      this.$refs.CameraAlert.handlerShow()
    },
    createVideoDom(num) {
      this.videoList = []
      if (num) {
        this.viewNum = num
      }
      for (let i = 0; i < this.viewNum; i++) {
        this.videoList.push({
          id: ++idSeq
        })
      }
    },
    _GBSLogin() {
      const { username, password, baseUrl } = { ...this.videoPlayQuery }
      return new Promise((resolve, reject) => {
        GBSLogin({
          username,
          password
        }, baseUrl).then((res) => {
          let token = ''
          if (res && res.Token) {
            token = res.Token
          }
          resolve(token)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    selectPlayerDom(id) {
      const index = this.videoList.findIndex((item) => {
        return item.id === id
      })
      if (index !== -1 && !this.videoList[index].src) {
        if (this.currentVideo) {
          this.currentVideoId = id
          this.currentVideo = { ...this.currentVideo, id }
          this.videoList.splice(index, 1, this.currentVideo)
          this.currentVideo = null
        }
      }
    },
    clearAllInterval() {
      this.timers.forEach((timer) => {
        clearInterval(timer)
      })
    },
    // 播放实时视频
    async playVideo(camera) {
      this.videoPlayQuery = {
        ...this.videoPlayQuery,
        serial: camera.gbsDeviceid,
        code: camera.channelGbsId || '',
        username: camera.gbsUser,
        password: camera.gbsPassword,
        baseUrl: camera.gbsServer
      }
      await this._GBSLogin()
      const { code, serial, baseUrl } = { ...this.videoPlayQuery }
      try {
        streamStart({ code, serial }, baseUrl).then((res) => {
          if (res && res.HLS) {
            this.currentVideo = {
              src: res.HLS,
              location: camera.location,
              sensor: camera.sensor
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
      const timer = setInterval(() => {
        streamTouch({ code, serial, t: idSeq }, baseUrl)
      }, 14000)
      this.timers.push(timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.wraper{
  .el-container{
    height: 100%;
    .otherCamera{
      display: flex;
      height: calc(100% - 60px);
      padding: 0 16px 30px 16px;
      .left{
        width: 302px;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        .cameraList{
          li{}
        }
      }
      .center{
        flex: 1;
        height: 100%;
        margin: 0 20px;
        overflow: hidden;
        position: relative;
        .videoList{
          display: grid;
          height: 100%;
          grid-row-gap: 5px;
          grid-column-gap: 5px;
          &.video-4{
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }
          &.video-6{
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }
          &.video-8{
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }
          &.video-9{
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
          }
          &.video-16{
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
          }
          .videoWrapper{
            position: relative;
            background: #000000;
            &.selected{
              border: 5px solid #FF4141;
            }
            &:hover{
              .info{
                display: block;
              }
            }
            .info{
              width: 100%;
              position: absolute;
              color: #fff;
              font-size: 14px;
              z-index: 1;
              background: rgba(0,0,0,0.3);
              display: none;
              text-align: center;
            }
            .tips{
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate3d(-50%,-50%,0);
              display: flex;
              flex-direction: column;
              align-items: center;
              .icon{
                display: inline-block;
                width: 81px;
                height: 51px;
                background: url(./icon_camera.png)0 0 no-repeat;
              }
              .text{
                font-size: 16px;
                color: #fff;
                margin-top: 22px;
              }
            }
          }
        }
        .view-control{
          position: absolute;
          right: -315px;
          bottom: 0;
          display: flex;
          height: 62px;
          transition: all linear 0.5s;
          &:hover{
            right: 0;
          }
          .label{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 62px;
            background: #EA6666;
            border-radius: 10px 0px 0px 10px;
            span{
              font-size: 14px;
              font-weight: bold;
              color: #fff;
            }
          }
          .content{
            display: flex;
            background: #1A1C26;
            li{
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 0 15px;
              justify-content: center;
              cursor: pointer;
              .icon{
                width: 33px;
                height: 33px;
                &.view-4{
                  background: url(./view_icon_4.png)0 0 no-repeat;
                }
                &.view-6{
                  background: url(./view_icon_6.png)0 0 no-repeat;
                }
                &.view-8{
                  background: url(./view_icon_8.png)0 0 no-repeat;
                }
                &.view-9{
                  background: url(./view_icon_9.png)0 0 no-repeat;
                }
                &.view-16{
                  background: url(./view_icon_16.png)0 0 no-repeat;
                }
              }
              .num{
                font-size: 14px;
                font-weight: bold;
                color: #fff;
              }
            }
          }
        }
      }
      .right{
        width: 310px;
        background: rgba(0, 36, 109, 0.81);
        display: flex;
        flex-direction: column;
        .header{
          text-indent: 11px;
          font-size: 14px;
          font-weight: bold;
          color: #FCFF05;
          line-height: 14px;
          padding: 16px 0 14px 0;
        }
        ul{
          height: 100%;
          overflow: hidden;
          overflow-y: auto;
          li{
            height: 123px;
            background: rgba(255,255,255,0.1);
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 17px;
            .title{
              font-weight: bold;
              color: #F28A8A;
            }
            p{
              margin: 0;
              line-height: 24px;
              font-size: 14px;
              color: #97C1FF;
            }
            .content{
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
    }
  }
}

.camera-content{
  display: flex;
  .cameraList{
    flex: 1;
  }
  .alertList{
    width: 310px;
  }
}
.dialog-content {
  height: 100%;
}
</style>
