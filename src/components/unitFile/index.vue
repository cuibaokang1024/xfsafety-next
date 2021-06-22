<template>
  <el-dialog :visible.sync="dialogVisible" style="" width="1000px">
    <div slot="title" class="dialog-title">{{ unitData.name }}</div>
    <div class="dialog-content">
      <transition name="slide">
        <div v-show="!shouldShowView" class="unitInfo">
          <div class="describe" />
          <ul class="file">
            <li v-for="(item, index) in fileList" :key="index">
              <div class="content" @click="switchView(item)">
                <span>{{ item.name }}</span>
                <span v-if="item.num>0" class="num">{{ `(${item.num})` }}</span>
              </div>
            </li>
          </ul>
          <div class="bot-content">
            <div class="box check-genre">
              <span class="icon-wrapper" />
              <span class="icon-wrapper" />
              <div class="title">安全巡检</div>
              <ul>
                <li v-for="(item, index) in checkList" :key="index">
                  <a href="#">{{ `重点部位(${item.num})` }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
      <transition name="switch">
        <div v-show="shouldShowView" class="detail">
          <component :is="shouldShowView" @back="back" />
        </div>
      </transition>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide()">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import firePlan from './firePlan'
export default {
  name: 'UnitFile',
  components: {
    firePlan
  },
  data() {
    return {
      dialogVisible: false,
      unitData: {
        name: '青岛宽广网络科技有限公司',
        describe: ''
      },
      shouldShowView: '',
      fileList: [
        {
          name: '基本信息',
          num: '',
          component: 'baseInfo'
        },
        {
          name: '消防平面图',
          num: '1',
          component: 'firePlan'
        },
        {
          name: '消防预案',
          num: '1',
          component: 'firePlans'
        },
        {
          name: '规章制度',
          num: '2',
          component: 'rules'
        },
        {
          name: '消防培训',
          num: '1',
          component: 'fireTrain'
        },
        {
          name: '合法性文件',
          num: '1',
          component: 'legalFile'
        }
      ],
      checkList: [
        {
          name: '重点部位',
          num: '1',
          component: 'KeyParts'
        },
        {
          name: '检查计划',
          num: '1',
          component: 'checkPlan'
        },
        {
          name: '消防设施',
          num: '1',
          component: 'fireFacilities'
        },
        {
          name: '隐患记录',
          num: '1',
          component: 'riskRecord'
        },
        {
          name: '检查痕迹',
          num: '1',
          component: 'checkMarks'
        }
      ]
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    switchView(item) {
      this.shouldShowView = item.component
    },
    back() {
      this.shouldShowView = ''
    }
  }
}
</script>

<style lang="scss" scoped>
    .dialog-title{
        font-size: 30px;
        line-height: 30px;
        color: #333333;
        font-weight: 600;
        text-align: center;
    }
    .dialog-content{
        padding: 0 35px;
        height: 500px;
        position: relative;
        overflow: hidden;
         .slide-enter-active,.slide-leave-active{
          transition: all 0.5s
        }
        .slide-enter,.slide-leave-to{
          transform: translate3d(100%,0,0)
        }
        .file{
            display: flex;
            list-style: none;
            padding: 0;
            justify-content: space-between;
            li{
                display: table;
                width: 111px;
                height: 91px;
                text-align: center;
                background: #ccc;
                cursor: pointer;
                border-radius: 5px;
                .content{
                    display: table-cell;
                    font-size: 16px;
                    color: #fff;
                    vertical-align: middle;
                    span{
                        display: block;
                        width: 100%;
                    }
                    .num{
                        font-size: 24px;
                        font-weight: bold;
                    }
                }
            }
            li:nth-child(1){
                background: #007bc6;
            }
            li:nth-child(2){
                background: #f04c91;
            }
            li:nth-child(3){
                background: #eb5a1c;
            }
            li:nth-child(4){
                background: #fb9527;
            }
            li:nth-child(5){
                background: #3cc514;
            }
            li:nth-child(6){
                background: #dcc003;
            }
        }
        .bot-content{
            display: flex;
            justify-content: space-between;
            .box{
                position: relative;
                .title{
                    width: 100%;
                    height: 43px;
                    line-height: 43px;
                    text-align: center;
                    font-size: 20px;
                    border: 1px solid #6b98d2;
                    border-radius: 5px;
                    color: #001c41;
                    background: #95b9e7;
                }
                ul{
                    display: flex;
                    height: 258px;
                    flex-wrap: wrap;
                    list-style: none;
                    justify-content: space-between;
                    border: 1px solid #6b98d2;
                    background: #bbd9ff;
                    padding: 28px 18px;
                    li{
                        width: 94px;
                        height: 56px;
                        line-height: 56px;
                        text-align: center;
                        background: #8f8f8f;
                        border-radius: 5px;
                    }
                    li:last-child{
                        flex: 1;
                    }
                }
            }
            .check-genre{
                width: 230px;
            }
        }
        .switch-enter-active,.switch-leave-active{
          transition: all 0.5s
        }
        .switch-enter,.switch-leave-to{
          transform: translate3d(100%,0,0)
        }
        .detail{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
    }
    .btn {
        --hue: 52;
        position: relative;
        color: white;
        text-decoration: none;
        text-transform: uppercase;
        background-color: hsl(var(--hue), 100%, 41%);
        border: 1px solid hsl(var(--hue), 100%, 41%);
        outline: transparent;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transition: 0.25s;
        &:hover {
            background: hsl(var(--hue), 100%, 31%);
        }
        &-primary {
            --hue: 187;
        }
        &-ghost {
            color: hsl(var(--hue), 100%, 41%);
            background-color: transparent;
            border-color: hsl(var(--hue), 100%, 41%);

            &:hover {
            color: white;
            }
        }
        &-shine {
            color: white;

            &::before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                120deg,
                transparent,
                hsla(var(--hue), 100%, 41%, 0.5),
                transparent
            );
            transform: translateX(-100%);
            transition: 0.6s;
            }
            &:hover {
            background: transparent;
            box-shadow: 0 0 20px 10px hsla(var(--hue), 100%, 41%, 0.5);
            }
            &:hover::before {
            transform: translateX(100%);
            }
        }
    }
</style>
