<template>
  <div class="report-main enterpriseAsse">
    <div class="enterpriseAsse-container">
      <div class="enterpriseAsse-title">风险评估指数情况</div>
      <div class="enterpriseAsse-content">
        <el-scrollbar>
          <div class="list">
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>消防安全合法性</span>
                  <span>({{ assessScoreList[0].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >单位使用的建筑物、场所，经公安机关消防机构依法审核、验收、竣工验收消防备案合格；属于公众聚集场所的单位，应经公安机关消防机构依法进行消防安全检查合格。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[0].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[0].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>消防安全制度、消防安全操作规程制定</span>
                  <span>({{ assessScoreList[1].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >能够针对本单位实际制定相关管理制度和操作规程。每项管理制度和操作规程内容符合对应条款要求。员工对本单位管理制度和操作规程掌握熟练。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[1].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[1].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>落实单位消防安全责任人和消防安全管理人</span>
                  <span>({{ assessScoreList[2].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >明确消防安全责任人、管理人，确定、变更后3日内报当地公安机关消防机构备案；熟练掌握自身消防安全职责；人员密集场所、易燃易爆危险品企业火灾高危单位的消防安全管理人取得注册消防工程师资格。成立消防工作领导机构并按要求开展工作。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[2].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[2].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>落实单位消防安全责任人和消防安全管理人</span>
                  <span>({{ assessScoreList[3].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >明确消防安全责任人、管理人，确定、变更后3日内报当地公安机关消防机构备案；熟练掌握自身消防安全职责；人员密集场所、易燃易爆危险品企业火灾高危单位的消防安全管理人取得注册消防工程师资格。成立消防工作领导机构并按要求开展工作。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[3].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[3].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>归口职能部门</span>
                  <span>({{ assessScoreList[4].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >单建立消防工作职能部门，职责明确，工作开展扎实有效；人员密集场所、易燃易爆危险品企业火灾高危单位消防工作职能部门的负责人取得注册消防工程师资格；委托其他单位管理的，受托方履行管理职责。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[4].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[4].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>单位基础信息、平面图完整</span>
                  <span>({{ assessScoreList[5].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div class="item-top">单位应维护好本单位的基础信息真实有效。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[5].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[5].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>消防安全培训</span>
                  <span>({{ assessScoreList[6].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >开展多种形式内部、对外消防宣传，在消防宣传日、重大节假日或重大活动期间应开展消防宣传活动。消防安全培训应列入年度工作计划。新上岗和进入新岗位的员工应进行岗前消防安全培训。在岗人员应按规定进行消防安全教育培训。进行电焊、气焊等具有火灾危险作业的人员和自动消防系统的操作人员应持证上岗。员工“一懂三会”掌握熟练。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[6].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[6].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>灭火和应急疏散演练</span>
                  <span>({{ assessScoreList[7].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >根据本单位实际制定灭火和应急疏散预案，明确灭火和应急疏散的组织机构、人员、处置程序和措施；至少每半年组织开展一次灭火和应急疏散演练，并根据演练情况不断修改完善预案。单位员工应掌握灭火器、消火栓等消防设施、器材的使用方法。掌握火场逃生自救基本技能，熟悉逃生路线和引导人员疏散程序。演练有全面的书面记录和影像记录。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[7].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[7].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>消防控制室</span>
                  <span>({{ assessScoreList[8].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >消防设施、器材和消防产品类型、数量、位置符合设计文件要求，经消防设施检测和消防产品检测合格，现场核实与相关检验报告一致。应安排专人24小时值班；操作人员需取得职业资格证书</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[8].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[8].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>微型消防站</span>
                  <span>({{ assessScoreList[9].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >应建立微型消防站；应当组织消防员队伍</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[9].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[9].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>防火巡查、防火检查</span>
                  <span>({{ assessScoreList[10].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >每日进行防火巡查，每月进行防火检查，并确定巡查检查的人员、内容、部位和频次；公众聚集场所在营业期间应至少每二小时进行一次防火巡查；医院、养老院、寄宿制的学校、托儿所、幼儿园应开展夜间防火巡查。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[10].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[10].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>火灾隐患整改</span>
                  <span>({{ assessScoreList[11].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >对发现的火灾隐患及时整改。火灾隐患程序符合规定要求，隐患整改方案完整、齐全。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[11].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[11].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>智慧用电安全</span>
                  <span>({{ assessScoreList[12].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >线路中存在剩余电流过多、温度过高未及时整改的，1个扣2分</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[12].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[12].message }}</span>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item-header">
                <div class="title">
                  <span>固定消防设施</span>
                  <span>({{ assessScoreList[13].totalScore }})</span>
                </div>
              </div>
              <div class="item-content">
                <div
                  class="item-top"
                >固定消防设施未联网的扣5分，使用了该系统发生报警未到场进行查看的扣3分，未进行拍照的扣1分，未进行情况描述的扣1分。</div>
                <div class="item-bot">
                  <span>得分:{{ assessScoreList[13].finalScore }}</span>
                  <span>得分情况:{{ assessScoreList[13].message }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { handlerAssessScore } from '@/api/companyHome'
import '../style/index.scss'

export default {
  // 单位消防安全评估报告
  name: 'EnterpriseAsse',
  data() {
    return {
      assessScoreList: []
    }
  },
  created() {
    this._handlerAssessScore()
  },
  methods: {
    _handlerAssessScore() {
      handlerAssessScore().then(res => {
        this.assessScoreList = res.data.datas
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
