<template>
  <el-dialog
    class="dark camera-alert"
    title="所有视频识别通道"
    :visible.sync="dialogVisible"
    width="1304px"
  >
    <div class="dialog-content">
      <div class="cam-video">
        <div class="camera-list" :class="className">
          <div
            v-for="(item, index) in itemList"
            :key="index"
            class="camera-item"
            :class="classNameList[index]"
          >
            <iframe
              class="camera-iframe"
              :class="item.id"
              src="http://140.249.194.108:10000/play.html?serial=34020000001320000010&code=34020000001320000010&iframe=yes&aspect=640x360"
              width="100%"
              height="100%"
              allowfullscreen
            />
          </div>
        </div>
      </div>
      <div class="cam-list">
        <div class="title">设备列表</div>
        <div class="list">
          <el-checkbox-group v-model="cameraCheck" :min="1" :max="9">
            <el-checkbox v-for="item in cameraList" :key="item.id" :label="item.id">
              <i class="icon" />
              <span class="text">{{ item.content }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div name="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import './index.scss'

const nameList = [
  'item-1',
  'item-2',
  'item-3',
  'item-4',
  'item-5',
  'item-6',
  'item-7',
  'item-8',
  'item-9',
  'item-10'
]

export default {
  name: 'CameraAlert',
  props: {
    cameraList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      className: 'main-list-1',
      cameraCheck: [], // checkbox model
      itemList: [], // Grid初始化
      classNameList: [] // class数组
    }
  },
  watch: {
    cameraList(newVal) {
      this.cameraCheck.push(newVal[0].id)
    },
    cameraCheck: {
      handler: function(newList, oldList) {
        const newListLength = newList.length
        const oldListLength = oldList.length
        if (newListLength < oldListLength) {
          const delectId = this.handlerArrayDifferentEle(newList, oldList)[0]
          const delectIndex = this.itemList.findIndex(item => {
            return item.id === delectId
          })
          this.itemList.splice(delectIndex, 1)
          this.handlerInitDom(this.itemList)
        } else {
          this.itemList = []
          newList.forEach(item => {
            const obj = this.cameraList.find(data => {
              return data.id === item
            })
            this.itemList.push(obj)
          })
          this.handlerInitDom(this.itemList)
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始化Grid布局
    handlerInitDom(list) {
      this.className = 'main-list-1'
      let classNameList = nameList.slice()
      if (list.length === 2) {
        this.className = 'main-list-2'
        classNameList = nameList.slice(0, 2)
      } else if (list.length === 3) {
        this.className = 'main-list-3'
        classNameList = nameList.slice(0, 3)
      } else if (list.length === 4) {
        this.className = 'main-list-4'
        classNameList = nameList.slice(0, 4)
      } else if (list.length === 5) {
        this.className = 'main-list-5'
        classNameList = nameList.slice(0, 5)
      } else if (list.length === 6) {
        this.className = 'main-list-6'
        classNameList = nameList.slice(0, 6)
      } else if (list.length === 7) {
        this.className = 'main-list-7'
        classNameList = nameList.slice(0, 7)
      } else if (list.length === 8) {
        this.className = 'main-list-8'
        classNameList = nameList.slice(0, 8)
      } else if (list.length === 9) {
        this.className = 'main-list-9'
        classNameList = nameList.slice(0, 9)
      }
      this.classNameList = classNameList
    },
    // 找出两个数组中的不同元素
    handlerArrayDifferentEle(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    handlerShow() {
      this.dialogVisible = true
    },
    handlerHide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
