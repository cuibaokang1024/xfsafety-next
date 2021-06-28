<template>
  <div class="chkPreview">
    <h1 class="title">{{ chkList.title }}</h1>
    <table>
      <tr>
        <td>单位名称</td>
        <td width="30%">{{ chkList.name }}</td>
        <td>企业法人营业执照</td>
        <td>
          <span v-if="chkList.isCode===1" class="checkbox-wrapper">
            <input disabled checked type="checkbox"><label>有</label>
            <input disabled type="checkbox"><label>无</label>
          </span>
          <span v-else-if="chkList.isCode===0" class="checkbox-wrapper">
            <input disabled type="checkbox"><label>有</label>
            <input disabled checked type="checkbox"><label>无</label>
          </span>
          <span v-else class="checkbox-wrapper">
            <input disabled type="checkbox"><label>有</label>
            <input disabled type="checkbox"><label>无</label>
          </span>
        </td>
      </tr>
      <tr>
        <td>经营地址</td>
        <td>{{ chkList.addr }}</td>
        <td>检查人</td>
        <td>{{ chkList.chkUser }}</td>
      </tr>
      <tr>
        <td>法人</td>
        <td>{{ chkList.primaryName }}</td>
        <td>电话</td>
        <td>{{ chkList.primaryTel }}</td>
      </tr>
      <template v-for="(listItem,index) in chkList.listItems">
        <tr :key="index">
          <td class="title" colspan="4">{{ listItem.label }}</td>
        </tr>
        <tr v-for="chkItem in listItem.children" :key="chkItem.id">
          <td colspan="3">{{ chkItem.label }}</td>
          <td v-if="chkItem.termType===0">
            <span v-if="chkItem.isAccord===1" class="checkbox-wrapper">
              <input disabled checked type="checkbox"><label>{{ chkItem.tempType===1?'符合':'是' }}</label>
              <input disabled type="checkbox"><label>{{ chkItem.tempType===1?'不符合':'否' }}</label>
            </span>
            <span v-else-if="chkItem.isAccord===0" class="checkbox-wrapper">
              <input disabled type="checkbox"><label>{{ chkItem.tempType===1?'符合':'是' }}</label>
              <input disabled checked type="checkbox"><label>{{ chkItem.tempType===1?'不符合':'否' }}</label>
            </span>
            <span v-else class="checkbox-wrapper">
              <input disabled type="checkbox"><label>{{ chkItem.tempType===1?'符合':'是' }}</label>
              <input disabled type="checkbox"><label>{{ chkItem.tempType===1?'不符合':'否' }}</label>
            </span>
          </td>
          <td v-else-if="chkItem.termType===1">
            {{ chkItem.content }}
          </td>
        </tr>
      </template>
      <tr v-if="dangerList.length>0">
        <td class="title">隐患内容</td>
        <td class="title" colspan="3">隐患图片</td>
      </tr>
      <template v-for="(danger,index) in dangerList">
        <tr :key="`content${index}`">
          <td>
            {{ danger.msg }}
          </td>
          <td colspan="3">
            <div style="width: 100%;height:100px;" class="img-wrapper">
              <el-image
                v-for="(img,key) in danger.url"
                :key="`img{${key}}`"
                style="width: 100px; height: 100px"
                :src="img"
                :preview-src-list="[img]"
              />
            </div>
          </td>
        </tr>
      </template>
      <tr>
        <td colspan="4" class="title">现场图片</td>
      </tr>
      <tr>
        <td colspan="4">
          <div v-if="chkList.signImage1&&chkList.signImage1.length>0" class="img-wrapper">
            <el-image
              v-for="(img,index) in chkList.signImage1"
              :key="index"
              style="width: 100px; height: 100px"
              :src="img.url"
              :preview-src-list="[img.url]"
            />
          </div>
        </td>
      </tr>
      <tr style="border-top: none;">
        <td colspan="4">
          <div class="sign-wrapper">
            <span>
              <span>检察人员签字：</span>
              <el-image
                v-if="chkList.signImage2"
                :src="chkList.signImage2[0].url"
              />
            </span>
            <span>
              <span>被检查单位签字：</span>
              <el-image
                v-if="chkList.signImage3"
                :src="chkList.signImage3[0].url"
              />
            </span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getChkPreview } from '@/api/chkList'
export default {
  props: {
    id: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      chkList: {},
      dangerList: []
    }
  },
  created() {
    this._getChkPreview()
  },
  methods: {
    _getChkPreview() {
      getChkPreview({ recordId: this.id }).then((res) => {
        if (res.data) {
          this.chkList = res.data
          let dangerItems = []
          res.data.listItems.forEach((item) => {
            const dangerItem = item.children.filter((key) => {
              return key.isDanger === 1 && key.listImg
            })
            dangerItems = [...dangerItems, ...dangerItem]
          })
          dangerItems.forEach((dangerItem) => {
            if (dangerItem.listImg && dangerItem.listImg.length > 0) {
              const listImg = dangerItem.listImg.map((item) => {
                return item.url
              })
              this.dangerList = [...this.dangerList, { msg: dangerItem.dangerMsg, url: listImg }]
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chkPreview{
    >.title{
      font-size: 14px;
      text-align: center;
    }
  }
  table,tr,th,td{
    border: 1px solid #d6d6d6;
  }
  table{
    border-collapse: collapse;
    width: 100%;
    color: #555;
    font-size: 14px;
    table-layout: fixed;
  }
  th,td{
    padding: 6px 12px;
    &.title,.title{
      width: 100%;
      font-weight: bold;
      text-align: center;
    }
    .img-wrapper{
      width: 100%;height:100px;
      display: flex;
      flex-wrap: wrap;
      .el-image{
        margin-right: 15px;
      }
    }
    .sign-wrapper{
      width: 100%;
      height:100px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      >span{
        display: flex;align-items: center;
        .el-image{
          width: 50px;
          height: auto;
        }
      }
    }
  }
  .checkbox-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
