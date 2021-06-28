import router from '@/router'
import Layout from '@/layout'
const map = {
  layout: Layout,
  menuManage: () => import('@/views/systemSetup/menuManagement'), // 系统设置 - 菜单管理
  dangerType: () => import('@/views/systemSetup/dangerType'), // 系统设置 - 危化品类型
  emergencyCommand: () => import('@/views/emergencyRescue/emergencyCommand'), // 应急救援一张图
  govOffice: () => import('@/views/systemSetup/govOffice'), // 系统设置 - 下级政府
  industryOffice: () => import('@/views/systemSetup/industryOffice'), // 系统设置 - 行业主管部门
  fireOffice: () => import('@/views/systemSetup/fireOffice'), // 系统设置 - 消防主管部门
  userOffice: () => import('@/views/systemSetup/userOffice'), // 系统设置 - 公司账号管理
  agentManagement: () => import('@/views/systemSetup/agentManagement'), // 系统设置 - 账号管理
  areaManage: () => import('@/views/systemSetup/areaManage'), // 系统设置 - 区域管理
  agentArea: () => import('@/views/systemSetup/agentArea'), // 系统设置 - 区域管理
  devElectricSet: () => import('@/views/systemSetup/devElectricSet'), // 系统设置 - 消防电系统设置
  pagePermission: () => import('@/views/permission/page'), // 首页 - header
  directivePermission: () => import('@/views/permission/directive'), // 首页 - header
  rolePermission: () => import('@/views/permission/role'), // 首页 - header
  electricEquipmentAll: () => import('@/views/IOT/electricEquipmentAll'), // 物联网 - 智慧用电监测
  waterEquipmentAll: () => import('@/views/IOT/waterEquipmentAll'), // 物联网 - 智慧用水监测
  smokeEquipmentAll: () => import('@/views/IOT/smokeEquipmentAll'), // 物联网 - 独立烟感预警
  cameraEquipmentAll: () => import('@/views/IOT/cameraEquipmentAll'), // 物联网 - 可视化监测
  gasEquipmentAll: () => import('@/views/IOT/gasEquipmentAll'), // 物联网 - 燃气体预警
  infotxOfficeList: () => import('@/views/IOT/infotxOfficeList'), // 物联网 - 火灾自动联网报警
  keyPartsMonitor: () => import('@/views/IOT/keyPartsMonitor'), // 物联网 - 重点部位监测
  dutyPlatform: () => import('@/views/IOT/dutyPlatform'), // 物联网值守 - 物联网值守平台
  electricMonitoring: () => import('@/views/IOT/electricMonitoring'), // 物联网值守 - 智慧用电监测系统
  gasMonitoring: () => import('@/views/IOT/gasMonitoring'), // 物联网值守 - 智慧型可燃气体预警系统
  smokeMonitoring: () => import('@/views/IOT/smokeMonitoring'), // 物联网值守 - 智慧型独立烟感预警系统
  waterRegulatoryAll: () => import('@/views/IOT/waterRegulatoryAll'), // 物联网值守 - 消防用水系统
  page401: () => import('@/views/error-page/401'), // 404
  page404: () => import('@/views/error-page/404'), // 404
  gridMap: () => import('@/views/bigData/gridMap'), // 大数据 - 消防安全网格化管理隐患分布
  firedangerList: () => import('@/views/bigData/firedangerList'), // 大数据 - 隐患分布
  companyChk: () => import('@/views/bigData/companyChk'), // 大数据 - 隐患分布
  rectifyList: () => import('@/views/bigData/rectifyList'), // 大数据 - 单位履责分析
  managementProfile: () => import('@/views/bigData/managementProfile'), // 大数据 - 消防管理概况
  integratedReport: () => import('@/views/bigData/integratedReport'), // 大数据 - 综合报表分析
  industryDirectors: () => import('@/views/bigData/integratedReport/industryDirectors'), // 大数据 - 综合报表分析
  administrativeDivision: () => import('@/views/bigData/integratedReport/administrativeDivision'), // 大数据 - 综合报表分析
  sensorArea: () => import('@/views/bigData/integratedReport/sensorArea'), // 大数据 - 综合报表分析
  electricArea: () => import('@/views/bigData/integratedReport/electricArea'), // 大数据 - 综合报表分析
  waterArea: () => import('@/views/bigData/integratedReport/waterArea'), // 大数据 - 综合报表分析
  officeType: () => import('@/views/bigData/integratedReport/officeType'), // 大数据 - 综合报表分析
  dangerArea: () => import('@/views/bigData/integratedReport/dangerArea'), // 大数据 - 综合报表分析
  dangerDirect: () => import('@/views/bigData/integratedReport/dangerDirect'), // 大数据 - 综合报表分析
  dangerTrend: () => import('@/views/bigData/integratedReport/dangerTrend'), // 大数据 - 综合报表分析
  comyDangerTrend: () => import('@/views/bigData/integratedReport/comyDangerTrend'), // 大数据 - 综合报表分析
  fixedFireTrend: () => import('@/views/bigData/integratedReport/fixedFireTrend'), // 大数据 - 综合报表分析
  dangerOvertime: () => import('@/views/bigData/integratedReport/dangerOvertime'), // 大数据 - 综合报表分析
  sensorAlert: () => import('@/views/bigData/integratedReport/sensorAlert'), // 大数据 - 综合报表分析
  electricAlert: () => import('@/views/bigData/integratedReport/electricAlert'), // 大数据 - 综合报表分析
  enterpriseAsse: () => import('@/views/bigData/integratedReport/enterpriseAsse'), // 大数据 - 综合报表分析
  personalFireSafety: () => import('@/views/bigData/integratedReport/personalFireSafety'), // 大数据 - 综合报表分析
  achievement: () => import('@/views/bigData/integratedReport/achievement'), // 大数据 - 综合报表分析
  drawMap: () => import('@/views/bigData/drawMap'), // 大数据 - 网格化绘制
  notice: () => import('@/views/fireManage/notice'), // 消防管理 - 通知公告
  issue: () => import('@/views/fireManage/notice/issue'), // 消防管理 - 通知公告 - 下发
  receive: () => import('@/views/fireManage/notice/receive'), // 消防管理 - 通知公告 - 接收
  dangerManage: () => import('@/views/fireManage/dangerManage'), // 消防管理 - 危化品管理
  fireSecurity: () => import('@/views/fireManage/dangerManage/fireSecurity'), // 消防管理 - 危化品管理 - 消防和安保设施录入
  dangerDetail: () => import('@/views/fireManage/dangerManage/dangerDetail'), // 消防管理 - 危化品管理 - 危化品明细
  dangerMethod: () => import('@/views/fireManage/dangerManage/dangerMethod'), // 消防管理 - 危化品管理 - 危化品处置方法
  dangerWarehouse: () => import('@/views/fireManage/dangerManage/dangerWarehouse'), // 消防管理 - 危化品管理 - 危化品出入库管理
  devCarnumSettings: () => import('@/views/fireManage/devCarnumSettings'), // 消防管理 - 车牌号管理
  unitRecord: () => import('@/views/fireManage/unitRecord'), // 消防管理 - 单位档案
  // supervisionUnitRecord: () => import('@/views/fireManage/unitFiles'),
  supervisionUnitRecord: () => import('@/views/fireManage/unitRecord/supervisionUnitRecord'), // 消防管理 - 单位档案 - 监管单位档案
  supervisionUnitMent: () => import('@/views/fireManage/unitRecord/supervisionUnitMent'), // 消防管理 - 单位档案 - 监管单位部门
  fireLegal: () => import('@/views/fireManage/unitRecord/fireLegal'), // 消防管理 - 单位档案 - 消防合法文书
  fireTraining: () => import('@/views/fireManage/unitRecord/fireTraining'), // 消防管理 - 单位档案 - 消防培训档案
  firePlan: () => import('@/views/fireManage/unitRecord/firePlan'), // 消防管理 - 单位档案 - 消防预案和演练
  fireRule: () => import('@/views/fireManage/unitRecord/fireRule'), // 消防管理 - 单位档案 - 规章制度
  fireBuilding: () => import('@/views/fireManage/unitRecord/fireBuilding'), // 消防管理 - 单位档案 - 消防平面图
  fireParts: () => import('@/views/fireManage/unitRecord/fireParts'), // 消防管理 - 单位档案 - 消防部位检测
  fireTrain: () => import('@/views/fireManage/fireTrain'), // 消防管理 - 单位档案 - 消防部位检测
  examination: () => import('@/views/fireManage/fireTrain/examination'), // 消防管理 - 单位档案 - 消防部位检测
  TestPaperDispose: () => import('@/views/fireManage/fireTrain/testPaperDispose'), // 消防管理 - 单位档案 - 消防部位检测
  questionType: () => import('@/views/fireManage/fireTrain/questionType'), // 消防管理 - 单位档案 - 消防部位检测
  choiceBank: () => import('@/views/fireManage/fireTrain/choiceBank'), // 消防管理 - 单位档案 - 单选题库
  manyBank: () => import('@/views/fireManage/fireTrain/manyBank'), // 消防管理 - 单位档案 - 多选题库
  judgeBank: () => import('@/views/fireManage/fireTrain/judgeBank'), // 消防管理 - 单位档案 - 判断题库
  training: () => import('@/views/fireManage/fireTrain/training'), // 消防管理 - 单位档案 - 判断题库
  enterpriseUnitRecord: () => import('@/views/fireManage/unitRecord/enterpriseUnitRecord'), // 消防管理 - 单位档案 - 基本信息
  departmentPersonnel: () => import('@/views/fireManage/unitRecord/departmentPersonnel'), // 消防管理 - 单位档案 - 部门及人员
  buildingArea: () => import('@/views/fireManage/unitRecord/buildingArea'), // 消防管理 - 单位档案 - 建筑/区域管理
  Personnel: () => import('@/views/fireManage/unitRecord/unitPersonnel'), // 消防管理 - 单位档案 - 人员
  fireInspection: () => import('@/views/fireManage/fireInspection'), // 消防管理 - 消防检查
  inspectionPoint: () => import('@/views/fireManage/fireInspection/inspectionPoint'), // 消防管理 - 消防检查 - 巡查点
  inspectionTask: () => import('@/views/fireManage/fireInspection/inspectionTask'), // 消防管理 - 消防检查 - 检查任务
  checkTrace: () => import('@/views/fireManage/fireInspection/checkTrace'), // 消防管理 - 消防检查 - 检查痕迹
  dangerFile: () => import('@/views/fireManage/fireInspection/dangerFile'), // 消防管理 - 消防检查 - 隐患档案
  plan: () => import('@/views/fireManage/fireInspection/plan'), // 消防管理 - 消防检查 - 平面图
  chkTaskDistribution: () => import('@/views/fireManage/fireInspection/chkTaskDistribution'), // 消防管理 - 消防检查 - 检查任务下发
  pointTypeSet: () => import('@/views/fireManage/fireInspection/pointTypeSet'), // 消防管理 - 消防检查 - 巡查点类型设置
  safetyRecord: () => import('@/views/fireManage/safetyRecord'), // 消防管理 - 安全档案管理
  enterpriseRecord: () => import('@/views/fireManage/safetyRecord/enterpriseRecord'), // 消防管理 - 安全档案管理 - 一企一档
  buildingRecord: () => import('@/views/fireManage/safetyRecord/buildingRecord'), // 消防管理 - 安全档案管理 - 一楼一档
  personRecord: () => import('@/views/fireManage/safetyRecord/personRecord'), // 消防管理 - 安全档案管理 - 一人一档
  userPerson: () => import('@/views/fireManage/safetyRecord/userPerson'), // 消防管理 - 安全档案管理 - 人员
  residenceRecord: () => import('@/views/fireManage/safetyRecord/residenceRecord'), // 消防管理 - 安全档案管理 - 住宅管理
  dangerInvestigation: () => import('@/views/dangerInvestigation'), // 隐患排查
  checkListDefine: () => import('@/views/dangerInvestigation/checkListDefine'), // 隐患排查 - 检查表定义
  dangerQuery: () => import('@/views/dangerInvestigation/dangerQuery'), // 隐患排查 - 隐患查询
  chkRecord: () => import('@/views/dangerInvestigation/chkRecord'), // 隐患排查 - 检查记录
  laws: () => import('@/views/dangerInvestigation/laws'), // 隐患排查 - 法律法规
  fireRescueDatabase: () => import('@/views/electricRecord/fireRescueDatabase'), // 消防救援力量信息库
  materialRecord: () => import('@/views/electricRecord/fireRescueDatabase/materialRecord'), // 消防救援力量信息库
  projectManage: () => import('@/views/projectManage'), // 项目管理
  projectList: () => import('@/views/projectManage/projectList'), // 项目管理 - 项目列表
  customList: () => import('@/views/projectManage/customList'), // 项目管理 - 客户列表
  keyCustom: () => import('@/views/projectManage/keyCustom'), // 项目管理 - 重点客户
  reportPush: () => import('@/views/projectManage/reportPush'), // 项目管理 - 月报周报推送
  alarmRecord: () => import('@/views/projectManage/alarmRecord'), // 项目管理 - 值守报警记录
  devRegister: () => import('@/views/IOTSettings/devRegister'), // 物联网设备管理 - 设备注册
  sensorTemplate: () => import('@/views/IOTSettings/sensorTemplate'), // 物联网设备管理 - 传感器
  devWaterSettings: () => import('@/views/IOTSettings/devWaterSettings'), // 物联网设备管理 - 水
  devElectricSettings: () => import('@/views/IOTSettings/devElectricSettings'), // 物联网设备管理 - 电
  devSmokeSettings: () => import('@/views/IOTSettings/devSmokeSettings'), // 物联网设备管理 - 烟
  devGasSettings: () => import('@/views/IOTSettings/devGasSettings'), // 物联网设备管理 - 燃气
  devCameraSettings: () => import('@/views/IOTSettings/devCameraSettings'), // 物联网设备管理 - 可视化
  alarmsysSettings: () => import('@/views/IOTSettings/alarmsysSettings'), // 物联网设备管理 - 重点部位检测
  devInfotxSettings: () => import('@/views/IOTSettings/devInfotxSettings'), // 物联网设备管理 - 用传
  roleManagement: () => import('@/views/systemSetup/roleManagement'), // 角色管理
  sysMenuManagement: () => import('@/views/systemSetup/unitAutonomy') // 单位自治页面
}
function mapRouter (data) {
  data.forEach((item, index) => {
    if (item.type === 2) { // 如果type为2 则视为按钮
      item = null
    }
    if (item.component === 'layout') {
      item.component = Layout
    } else {
      item.component = map[item.component]
    }
    if (item.children) {
      mapRouter(item.children)
    }
  })
  return data
}
export default function addRouters (routers) {
  const newRouters = mapRouter(routers)
  newRouters.forEach((itemRouter) => {
    console.log(itemRouter)
    router.addRoute(itemRouter)
  })
}
