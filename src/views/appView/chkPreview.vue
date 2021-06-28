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
        <tr :key="index" style="text-align: center;font-weight: bold;">
          <td colspan="4">{{ listItem.label }}</td>
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
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      chkList: {}
    }
  },
  created() {
    this._getChkPreview()
  },
  methods: {
    getChkPreview() {
      const url = `http://114.116.109.144:8300/system/public/appChkSupervision/chkPreview?recordId=${this.$route.query.id}`
      return axios.get(url).then((res) => {
        return Promise.resolve(res.data)
      })
    },
    _getChkPreview() {
      this.getChkPreview().then((res) => {
        if (res.data) {
          this.chkList = res.data
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
}
.checkbox-wrapper{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
