<template>
  <div class="number">
    <ul :style="{justifyContent: location}">
      <li v-for="item in complementList" :key="`zero_${item.value}`" :class="bg?'bg':''" :style="{width}">
        <span class="num-text" :style="{fontSize:fontSize}">0123456789</span>
      </li>
      <li v-for="item in numberList" :key="item.id" :class="bg?'bg':''" :style="{width: item.type==='num'?width: '4px'}">
        <span v-if="item.type==='num'" ref="place" class="num-text" :style="{fontSize:fontSize}">0123456789</span>
        <span v-if="item.type==='dot'" ref="place">.</span>
      </li>
      <span class="unit">{{ unit }}</span>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: 'center'
    },
    width: {
      type: String,
      default: '10px'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    bg: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: ''
    },
    complement: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      numberList: []
    }
  },
  computed: {
    complementList() {
      const arr = []
      for (let i = 0; i < this.complement; i++) {
        arr.push({
          value: i
        })
      }
      return arr
    }
  },
  watch: {
    number() {
      this.createHtml(this.number)
      this.$nextTick(() => {
        setTimeout(() => {
          this.update(this.number)
        }, 10)
      })
    }
  },
  created() {
    this.createHtml(this.number)
    this.$nextTick(() => {
      setTimeout(() => {
        this.update(this.number)
      }, 10)
    })
  },
  methods: {
    createHtml(newNum) {
      this.numberList = []
      var maxLen = this.makeThreeNum(newNum).length
      for (let i = 0; i < maxLen; i++) {
        const nn = this.makeThreeNum(newNum)[i]
        let type = 'num'
        if (nn === '.' || nn === '-') {
          type = 'dot'
        }
        const item = {
          id: i,
          type
        }
        this.numberList.push(item)
      }
    },
    update(newNum) {
      var maxLen = this.makeThreeNum(newNum).length
      for (let i = 0; i < maxLen; i++) {
        const nn = parseInt(this.makeThreeNum(newNum)[i])
        if (!isNaN(nn)) {
          if (this.$refs.place[i]) {
            this.$refs.place[i].style.transform = `translate(-50%, -${nn * 10}%)`
          }
        }
      }
    },
    makeThreeNum(num) {
      return num + ''
    }
  }
}
</script>
<style lang="scss" scoped>
.number{
  width: 100%;
  height: 100%;
  ul {
    display: flex;
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;
    height: 100%;
    justify-content: center;
    li {
      &.bg{
        margin-left: 5px;
        background-image: url(../../assets/devImages/number_bg.jpg);
      }
      position: relative;
      overflow: hidden;
      background-position: 0 0;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .num-text{
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        letter-spacing: 10px;
        transition: transform 0.5s ease-in-out;
        text-align: center;
        writing-mode: vertical-lr;
        text-orientation: upright;

      }
    }
  }
}

</style>

