<template>
  <div class="input-card content-window-card">
    <div>
      <div class="content">
        <div class="address" :title="address">{{ address }}</div>
        <div class="range"><span>周边范围查询：</span><el-input v-model="radius" size="mini" />米</div>
        <div class="goods">
          <div class="title">物资类型</div>
          <div class="goodsType">
            <el-checkbox-group v-model="checkedGoods">
              <el-checkbox v-for="good in goods" :key="good.value" :label="good.value">{{ good.label }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div v-if="model==='office'" class="start"><span>起点：</span><el-input v-model="start" size="mini" /></div>
      </div>
      <div class="footer">
        <el-button size="mini" type="success" @click="query">周边查询</el-button>
        <el-button v-if="model==='dispatch'||model==='office'" size="mini" type="success" @click="dispatch">分级调度</el-button>
        <el-button v-if="model==='office'" size="mini" type="success" @click="openDevDetail">物联网设备</el-button>
        <el-button v-if="model==='office'" size="mini" type="success" @click="navigation">导航</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PeripheryQueryWindow',
  props: {
    address: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkedGoods: [],
      radius: 1000,
      start: '',
      goods: [
        {
          label: '消防水源',
          value: 1
        },
        {
          label: '消防站',
          value: 4
        },
        {
          label: '社会救援力量',
          value: 5
        },
        {
          label: '特种车辆',
          value: 3
        },
        {
          label: '灭火药剂',
          value: 2
        },
        {
          label: '危化品',
          value: 6
        },
        {
          label: '救援生活物资',
          value: 7
        },
        {
          label: '救援食品',
          value: 8
        }

      ]
    }
  },
  methods: {
    query () {
      const data = {
        radius: this.radius,
        checkedGoods: this.checkedGoods
      }
      this.$emit('query', data)
    },
    dispatch () {
      this.$emit('dispatch')
    },
    navigation () {
      if (this.start) {
        this.$emit('navigation', this.start)
      } else {
        this.$message({
          message: '请输入起点',
          type: 'error'
        })
      }
    },
    openDevDetail () {
      this.$emit('openDevDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
    max-width: 500px;
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .address{
        width: 460px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .address,.goods .title{
        background-color: #eee;
        line-height: 35px;
        padding: 0 10px;
    }
    .range{
        background-color: #eee;
        display: flex;
        height: 35px;
        padding: 0 10px;
        align-items: center;
        .el-input{
            width: 100px;
            height: 28px;
        }
    }
    .start{
        margin-top: 10px;
        background-color: #eee;
        display: flex;
        height: 35px;
        padding: 0 10px;
        align-items: center;
        .el-input{
            width: 200px;
            height: 28px;
        }
    }
    .goods{
        .goodsType{
            margin-top: 10px;
        }
    }
}
.footer{
    padding: 0 20px;
}
</style>
