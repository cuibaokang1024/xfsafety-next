<template>
  <div class="wrapper">
    <el-container>
      <el-aside>
        <grid-map />
      </el-aside>
      <el-main>
        <div class="container">
          <div class="baseInfo">
            <div class="header">
              <span class="switch_arrow left" @click="move('right')" />
              <ul ref="baseInfoTab">
                <li
                  v-for="item in baseInfoList"
                  :key="item.id"
                  :class="{selected : topVisible === item.value}"
                  @click="switchBaseInfo(item.value)"
                >
                  <span class="text">{{ item.label }}</span>
                  <span class="line" />
                </li>
              </ul>
              <span
                :class="{flip:visible==='baseInfo'}"
                class="icon"
                @click="toggleVisible('baseInfo')"
              />
              <span class="mask" />
              <span class="switch_arrow right" @click="move('left')" />
            </div>
            <transition name="slide">
              <div v-show="visible==='baseInfo'" class="content">
                <div class="box-wrapper">
                  <transition name="switch">
                    <div v-show="topVisible==='unitInfo'" class="unitInfo box">
                      <div class="content">
                        <div class="left">
                          <p class="title">{{ officeDetail&&officeDetail.levelName||'' }}</p>
                          <p :title="officeDetail&&officeDetail.fireDeptName||''">{{ `消防主管部门：${officeDetail&&officeDetail.fireDeptName||''}` }}</p>
                          <p>{{ `消防监督员：${officeDetail&&officeDetail.fireMonitors||''}` }}</p>
                          <p>{{ `单位所属行业：${officeDetail&&officeDetail.industryName||''}` }}</p>
                          <p>{{ `行业主管部门：${officeDetail&&officeDetail.directDeptName||''}` }}</p>
                          <p class="line" />
                          <p class="line" />
                        </div>
                        <div class="right">
                          <div class="item">
                            <span class="cricle" />
                            <span class="label">位置：</span>
                            <span class="text">{{ officeDetail&&officeDetail.addr||'' }}</span>
                          </div>
                          <div class="item">
                            <span class="cricle" />
                            <span class="label">归属区域：</span>
                            <span class="text">{{ officeDetail&&officeDetail.areaName||'' }}</span>
                          </div>
                          <div class="item">
                            <span class="cricle" />
                            <span class="label">单位类型：</span>
                            <span class="text">{{ officeDetail&&officeDetail.categoryName||'' }}</span>
                          </div>
                          <div class="item">
                            <span class="cricle" />
                            <span class="label">单位安全消防负责人：</span>
                            <span class="text">{{ officeDetail&&officeDetail.primaryName||'' }}</span>
                            <span class="label">联系电话：</span>
                            <span class="text">{{ officeDetail&&officeDetail.primaryTel||'' }}</span>
                          </div>
                          <div class="item">
                            <span class="cricle" />
                            <span class="label">消防安全管理人：</span>
                            <span class="text">{{ officeDetail&&officeDetail.deputyName ||'' }}</span>
                            <span class="label">联系电话：</span>
                            <span class="text">{{ officeDetail&&officeDetail.deputyName ||'' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-if="topVisible === 'unitBuilding'" class="fireBuilding box">
                      <el-image v-for="url in unitUrls" :key="url" :src="url" :lazy="true" />
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-if="topVisible === 'fireBuilding'" class="fireBuilding box">
                      <el-image v-for="url in fireUrls" :key="url" :src="url" :lazy="true" />
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-if="topVisible === 'keyParts'" class="keyParts box">
                      <ul>
                        <li v-for="item in keyPartsList" :key="item.id">
                          <span class="icon">
                            <el-image
                              style="width: 100%; height: 100%;"
                              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                              fit="fill"
                            />
                          </span>
                          <div class="data">
                            <p class="title">{{ item.name }}</p>
                            <p>具体位置：{{ item.location }}</p>
                            <p>所属楼宇：{{ item.partName === null ? '' : item.partName }}</p>
                            <p>所在楼层：{{ item.partAddrName === null ? '' : item.partAddrName }}</p>
                            <p>火灾危险性：{{ item.fireDanger === null ? '' : item.fireDanger }}</p>
                            <p>耐火等级：{{ item.fireProofLevel === null ? '' : item.fireProofLevel }}</p>
                            <p>确立原因：{{ item.estabReason === null ? '' : item.estabReason }}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible === 'maintenance'" class="maintenance box">
                      <div class="date">
                        <ul>
                          <li
                            v-for="(item,index) in mothList"
                            :key="index"
                            :class="{select: item.time === '9月'}"
                          >{{ item.time }}</li>
                        </ul>
                      </div>
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="maintenanceList"
                        height="100%"
                        :table-config="maintenanceConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >下载</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible==='assessment'" class="assessment box">
                      <div class="chart-wrapper">
                        <div class="chart-wrapper-container">
                          <PieChart
                            id="assessMentPieChart"
                            width="100%"
                            height="100%"
                            :chart-data="assessMentPieData"
                          />
                          <div class="chart-wrapper-container-date" style="bottom: 24px;">
                            <span>单位评估成绩：</span>
                            <b>{{ scoreNum }}</b>
                            <span>等级：</span>
                            <b>{{ scoreLevel }}</b>
                          </div>
                          <div class="chart-wrapper-container-date">{{ `评估时间：${scoreDate}` }}</div>
                        </div>
                        <div class="chart-wrapper-btn">
                          <el-button
                            class="chart-wrapper-btn-mini"
                            size="mini"
                            round
                            @click="handlerAssessMent"
                          >单位评估</el-button>
                        </div>
                      </div>
                      <div class="scoreList">
                        <div class="title" />
                        <ul>
                          <li v-for="item in scoreList" :key="item.id">
                            <span class="score">得分：{{ item.finalScore }}</span>
                            <p class="title">消防安全合法性（{{ item.totalScore }}）</p>
                            <p
                              class="content"
                            >单位使所，经公安机关消防机构依法审核、验收、竣工验收消防备案合格；属于公众聚集场所的单位，应经公安机关消防机构依法进行消防安全检查合格。</p>
                            <ul class="down">
                              <li>得分情况：{{ item.message }}</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible === 'iot'" class="iot box">
                      <ul>
                        <li
                          v-for="item in iotList"
                          :key="item.id"
                          class="item"
                          @click="viewDevDetail(item)"
                        >
                          <div class="content">
                            <span class="icon" :style="{backgroundImage:`url(${item.icon})`}" />
                            <div class="data">
                              <span class="text">{{ item.text }}</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible === 'firePlan'" class="firePlan box">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="firePlanList"
                        height="100%"
                        :table-config="firePlanConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click.stop="handlerDownloadFile(row)"
                            >下载</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible === 'fireRule'" class="fireRule box">
                      <base-table
                        height="100%"
                        class="table-wrapper"
                        :border="false"
                        :table-config="fireRuleConfig"
                        :table-data="fireRuleList"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handlerDownloadFile(row)"
                            >下载</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible === 'fireTrain'" class="fireTrain box">
                      <base-table
                        height="100%"
                        class="table-wrapper"
                        :border="false"
                        :table-config="fireTrainConfig"
                        :table-data="fireTrainList"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handlerDownloadFile(row)"
                            >下载</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="topVisible === 'fireLegal'" class="fireLegal box">
                      <base-table
                        height="100%"
                        class="table-wrapper"
                        :border="false"
                        :table-config="fireLegalConfig"
                        :table-data="fireLegalList"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handlerDownloadFile(row)"
                            >下载</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
          <div class="check box">
            <div class="header">
              <span class="text">安全巡检</span>
              <span
                class="icon"
                :class="{flip: visible === 'check'}"
                @click="toggleVisible('check')"
              />
            </div>
            <transition name="slide">
              <div v-show="visible === 'check'" class="main">
                <div class="tab-wrapper">
                  <ul>
                    <li
                      v-for="item in checkTabList"
                      :key="item.id"
                      :class="{select : checkVisible === item.value}"
                      @click="switchCheck(item.value)"
                    >
                      <span class="text">{{ item.label }}</span>
                      <span class="line" />
                    </li>
                  </ul>
                </div>
                <div class="content">
                  <transition name="switch">
                    <div v-show="checkVisible === 'checkPlan'" class="checkPlan item">
                      <ul>
                        <li v-for="item in checkPlanList" :key="item.id">
                          <span class="icon" />
                          <div class="data">
                            <p class="title">{{ item.name }}</p>
                            <p>{{ `开始时间：${item.startTime}` }}</p>
                            <p>{{ `结束时间：${item.endTime}` }}</p>
                            <p>{{ `检查开始日期：${item.startDate}` }}</p>
                            <p>{{ `检查结束日期：${item.endDate}` }}</p>
                            <p>{{ `检察人员：${item.chkUserName}` }}</p>
                            <p>{{ `检查点：${item.pointNum }` }}</p>
                          </div>
                          <div class="cycle">{{ `检查周期：${item.chkCycle}` }}</div>
                        </li>
                      </ul>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="checkVisible === 'fireFacilities'" class="fireFacilities item">
                      <ul>
                        <li
                          v-for="item in fireFacilities"
                          :key="item.id"
                          @click="viewFireFacilitiesDetail(item)"
                        >
                          <span class="icon" :style="{backgroundImage : `url(${item.url})`}" />
                          <div class="data">
                            <span class="text">{{ item.name }}</span>
                            <span class="num">
                              {{ item.count }}
                              <span class="unit">个</span>
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="checkVisible === 'dangerRecord'" class="dangerRecord item">
                      <ul>
                        <li v-for="(item, index) in dangerRecordList" :key="item.id">
                          <span class="number">{{ index + 1 }}</span>
                          <div class="data">
                            <p>{{ `发现时间：${item.chkDate}` }}</p>
                            <p>{{ `发现人：${item.chkUserName}` }}</p>
                            <p>{{ `发现部门：${item.chkOfficeName}` }}</p>
                            <p>{{ `隐患内容：${item.content}` }}</p>
                          </div>
                          <div class="btn-wrapper">
                            <span class="btn">{{ item.statusName }}</span>
                            <span class="btn" @click="handlerViewDangerDetail(item)">查看</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="checkVisible === 'checkMark'" class="checkMark item">
                      <base-table
                        class="table-wrapper"
                        height="100%"
                        :table-height="340"
                        :border="false"
                        :table-data="checkMark"
                        :table-config="checkMarkConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleCheckTraceView(row)"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
          <div class="dualSystem box">
            <div class="header">
              <span class="text">双重体系</span>
              <span
                :class="{flip:visible === 'dualSystem'}"
                class="icon"
                @click="toggleVisible('dualSystem')"
              />
            </div>
            <transition name="slide">
              <div v-show="visible === 'dualSystem'" class="main">
                <div class="tab-wrapper">
                  <ul>
                    <li
                      v-for="item in dualSystemTabList"
                      :key="item.id"
                      :class="{select:dualSystemVisible===item.value}"
                      @click="switchDualSystem(item.value)"
                    >
                      <span class="text">{{ item.label }}</span>
                      <span class="line" />
                    </li>
                  </ul>
                </div>
                <div class="content">
                  <transition name="switch">
                    <div v-show="dualSystemVisible==='riskPoint'" class="riskPoint item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="riskPoint"
                        height="100%"
                        :table-config="riskPointConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >详情</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="dualSystemVisible==='dangerSource'" class="dangerSource item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="dangerSource"
                        height="100%"
                        :table-config="dangerSourceConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="dualSystemVisible==='danger'" class="danger item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="danger"
                        height="100%"
                        :table-config="dangerConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="dualSystemVisible==='majorDanger'" class="majorDanger item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="majorDanger"
                        height="100%"
                        :table-config="majorDangerConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
          <div class="checkRecord box">
            <div class="header">
              <span class="text">监管部门检查记录</span>
              <span
                :class="{flip:visible==='checkRecord'}"
                class="icon"
                @click="toggleVisible('checkRecord')"
              />
            </div>
            <transition name="slide">
              <div v-show="visible==='checkRecord'" class="main">
                <div class="content">
                  <base-table
                    class="table-wrapper"
                    :border="false"
                    :table-data="checkRecord"
                    height="100%"
                    :table-config="checkRecordConfig"
                  >
                    <el-table-column
                      label="操作"
                      align="center"
                      class-name="small-padding fixed-width"
                    >
                      <template slot-scope="{row}">
                        <el-button
                          size="mini"
                          type="primary"
                          round
                          @click="handleView(row, '详情')"
                        >查看</el-button>
                      </template>
                    </el-table-column>
                  </base-table>
                </div>
              </div>
            </transition>
          </div>
          <div class="specialPerson box">
            <div class="header">
              <span class="text">特种人员作业资质</span>
              <span
                :class="{flip:visible==='specialPerson'}"
                class="icon"
                @click="toggleVisible('specialPerson')"
              />
            </div>
            <transition name="slide">
              <div v-show="visible==='specialPerson'" class="main">
                <div class="content">
                  <div class="specialPerson item">
                    <base-table
                      class="table-wrapper"
                      :border="false"
                      :table-data="specialPerson"
                      height="100%"
                      :table-config="specialPersonConfig"
                    >
                      <el-table-column
                        label="操作"
                        align="center"
                        class-name="small-padding fixed-width"
                      >
                        <template slot-scope="{row}">
                          <el-button
                            size="mini"
                            type="primary"
                            round
                            @click="handleView(row, '详情')"
                          >查看</el-button>
                        </template>
                      </el-table-column>
                    </base-table>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="safeProduction box">
            <div class="header">
              <span class="text">安全生产相关信息</span>
              <span
                :class="{flip:visible==='safeProduction'}"
                class="icon"
                @click="toggleVisible('safeProduction')"
              />
            </div>
            <transition name="slide">
              <div v-show="visible==='safeProduction'" class="main">
                <div class="tab-wrapper">
                  <ul>
                    <li
                      v-for="item in safeProductionTabList"
                      :key="item.id"
                      :class="{select:safeProductionVisible===item.value}"
                      @click="switchSafeProduction(item.value)"
                    >
                      <span class="text">{{ item.label }}</span>
                      <span class="line" />
                    </li>
                  </ul>
                </div>
                <div class="content">
                  <transition name="switch">
                    <div
                      v-show="safeProductionVisible==='mainMaterials'"
                      class="mainMaterials item"
                    >
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="mainMaterials"
                        height="100%"
                        :table-config="mainMaterialsConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        />
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="safeProductionVisible==='mainProducts'" class="mainProducts item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="mainProducts"
                        height="100%"
                        :table-config="mainProductsConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div
                      v-show="safeProductionVisible==='explosiveDust'"
                      class="explosiveDust item"
                    >
                      <base-table
                        class="table-wrapper"
                        height="100%"
                        :border="false"
                        :table-data="explosiveDust"
                        :table-config="explosiveDustConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="safeProductionVisible==='safeSystem'" class="safeSystem item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="safeSystem"
                        height="100%"
                        :table-config="safeSystemConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div
                      v-show="safeProductionVisible==='standardization'"
                      class="standardization item"
                    >
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="standardization"
                        height="100%"
                        :table-config="standardizationConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="safeProductionVisible==='safeInput'" class="safeInput item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="safeInput"
                        height="100%"
                        :table-config="safeInputConfig"
                      />
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="safeProductionVisible==='technology'" class="technology item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="technology"
                        height="100%"
                        :table-config="technologyConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
          <div class="emergency box">
            <div class="header">
              <span class="text">应急管理</span>
              <span
                :class="{flip:visible==='emergency'}"
                class="icon"
                @click="toggleVisible('emergency')"
              />
            </div>
            <transition name="slide">
              <div v-show="visible==='emergency'" class="main">
                <div class="tab-wrapper">
                  <ul>
                    <li
                      v-for="item in emergencyTabList"
                      :key="item.id"
                      :class="{select:emergencyVisible===item.value}"
                      @click="switchEmergency(item.value)"
                    >
                      <span class="text">{{ item.label }}</span>
                      <span class="line" />
                    </li>
                  </ul>
                </div>
                <div class="content">
                  <transition name="switch">
                    <div v-show="emergencyVisible==='goodLocation'" class="goodLocation item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="goodLocation"
                        height="100%"
                        :table-config="goodLocationConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="emergencyVisible==='goods'" class="goods item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="goods"
                        height="100%"
                        :table-config="goodsConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="emergencyVisible==='equipment'" class="equipment item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="equipment"
                        height="100%"
                        :table-config="equipmentConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                  <transition name="switch">
                    <div v-show="emergencyVisible==='reservePlan'" class="reservePlan item">
                      <base-table
                        class="table-wrapper"
                        :border="false"
                        :table-data="reservePlan"
                        height="100%"
                        :table-config="reservePlanConfig"
                      >
                        <el-table-column
                          label="操作"
                          align="center"
                          class-name="small-padding fixed-width"
                        >
                          <template slot-scope="{row}">
                            <el-button
                              size="mini"
                              type="primary"
                              round
                              @click="handleView(row, '详情')"
                            >查看</el-button>
                          </template>
                        </el-table-column>
                      </base-table>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </el-main>
    </el-container>
    <!--  -->
    <BaseForm ref="baseForm" :form-option="formOption" :append-to-body="true" :modal-append-to-body="true" :is-reset-form-flag="isResetFormFlag" />
    <!--  -->
    <StaffWorkAlert ref="staffworkalert" :search-status="false" :alert-data="alertData" />
    <!--  -->
    <HiddenDangerStatus ref="HiddenDangerStatus" :danger-info-data="dangerInfoData" />
    <!--  -->
    <el-dialog
      v-if="fireDialogVisible"
      class="dark fireFacilities"
      :destroy-on-close="true"
      :visible.sync="fireDialogVisible"
      append-to-body
      width="797px"
    >
      <div slot="title" class="dialog-title">{{ facilitieTitle }}</div>
      <div class="dialog-content" style="padding: 0;">
        <base-table
          class="table-wrapper"
          height="100%"
          :border="false"
          :table-config="fireFacilitiesConfig"
          :table-data="fireFacilitiesData"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fireFacilitiesHide()">关 闭</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <!--  -->
    <el-dialog
      v-if="devDialogVisible"
      class="dark unitDevDetail-wrapper"
      :destroy-on-close="true"
      :visible.sync="devDialogVisible"
      append-to-body
      width="1161px"
    >
      <div slot="title" class="dialog-title">安装设备</div>
      <div class="dialog-content">
        <unit-dev-detail
          :office-id="officeId"
          :category="category"
          :category-name="categoryName"
          :is-show-base-info="false"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="devDetailhide()">关 闭</el-button>
      </div>
    </el-dialog>
    <!--  -->
  </div>
</template>

<script>
import {
  getOfficeDetail,
  getLegalDocByOffice,
  getFireRuleByOffice,
  getFirePlanByOffice,
  getFireTrainByOffice,
  handlerListByOffice,
  handlerChkplanListByOffice,
  handlerFireControlOffice,
  handlerDangerByOffice,
  handlerFireControlDetail,
  getDangerInfo,
  handlerDownload
} from '@/api/office'

import {
  handlerAssessScore,
  handlerAssessMentAchieve,
  handlerChkPlanInfo
} from '@/api/companyHome'

import BaseTable from '@/components/baseTable'
import GridMap from '@/components/bmap/gridMap'
import BaseForm from '@/components/baseForm'
import formAction from '@/mixins/form.js'
import UnitDevDetail from '@/components/unitDevDetail'
import PieChart from '@/components/Charts/pieChart'
import HiddenDangerStatus from '@/components/HiddenDangerStatus'
import download from '@/utils/fileDownload'
import StaffWorkAlert from '@/components/StaffWorkAlert'

export default {
  components: {
    GridMap,
    BaseTable,
    BaseForm,
    UnitDevDetail,
    HiddenDangerStatus,
    StaffWorkAlert,
    PieChart
  },
  mixins: [formAction],
  props: {
    officeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      devDialogVisible: false,
      fireDialogVisible: false,
      facilitieTitle: '',
      topVisible: 'unitInfo', // 头部可见内容
      formOption: {},
      checkVisible: 'checkPlan',
      dualSystemVisible: 'riskPoint',
      safeProductionVisible: 'mainMaterials',
      emergencyVisible: 'goodLocation',
      rightTabLength: 4,
      leftTabLength: 0,
      visible: 'baseInfo',
      officeDetail: {}, // 单位详情
      // 单位消防预案列表
      firePlanConfig: [
        {
          prop: 'name',
          label: '预案名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'date',
          label: '制定时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'fileName',
          label: '附件',
          align: 'center',
          width: ''
        }
      ],
      // 单位规章制度列表
      fireRuleConfig: [
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'date',
          label: '制定时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'fileName',
          label: '附件',
          align: 'center',
          width: ''
        }
      ],
      // 单位消防培训列表
      fireTrainConfig: [
        {
          prop: 'trainTime',
          label: '培训时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'person',
          label: '参与人员',
          align: 'center',
          width: ''
        },
        {
          prop: 'content',
          label: '培训内容',
          align: 'center',
          width: ''
        }
      ],
      // 单位合法文书列表
      fireLegalConfig: [
        {
          prop: 'officeName',
          label: '机构名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'docTypeName',
          label: '消防合法文书类型',
          align: 'center',
          width: ''
        }
      ],
      firePlanList: [], // 单位消防预案列表
      fireLegalList: [], // 单位合法文书列表
      fireTrainList: [], // 单位消防培训列表
      fireRuleList: [], // 单位规章制度列表
      mothList: [
        {
          time: '1月'
        },
        {
          time: '2月'
        },
        {
          time: '3月'
        },
        {
          time: '4月'
        },
        {
          time: '5月'
        },
        {
          time: '6月'
        },
        {
          time: '7月'
        },
        {
          time: '8月'
        },
        {
          time: '9月'
        },
        {
          time: '10月'
        },
        {
          time: '11月'
        },
        {
          time: '12月'
        }
      ],
      iotList: [
        {
          id: 1,
          path: '/IOT/electricEquipmentAll',
          name: 'electric',
          text: '智慧用电监测',
          icon: require('./images/icon_electric.png')
        },
        {
          id: 2,
          path: '/IOT/waterEquipmentAll',
          name: 'water',
          text: '智慧用水监测',
          icon: require('./images/icon_water.png')
        },
        {
          id: 3,
          path: '/IOT/smokeEquipmentAll',
          name: 'smoke',
          text: '独立烟感监测',
          icon: require('./images/icon_smoke.png')
        },
        {
          id: 4,
          path: '/IOT/gasEquipmentAll',
          name: 'gas',
          text: '可燃气体监测',
          icon: require('./images/icon_gas.png')
        },
        {
          id: 5,
          path: '/IOT/cameraEquipmentAll',
          name: 'cam',
          text: '可视化监测',
          icon: require('./images/icon_camera.png')
        },
        {
          id: 6,
          path: '/IOT/infotxOfficeList',
          name: 'infotx',
          text: '火灾自动联网报警监测',
          icon: require('./images/icon_infoTx.png')
        }
      ],
      scoreLevel: '',
      scoreNum: '',
      scoreDate: '',
      scorePieList: [],
      scoreList: [],
      baseInfoList: [
        {
          id: 1,
          label: '基本信息',
          value: 'unitInfo'
        },
        {
          id: 11,
          label: '单位建筑全貌图',
          value: 'unitBuilding'
        },
        {
          id: 2,
          label: '消防平面图',
          value: 'fireBuilding'
        },
        {
          id: 3,
          label: '重点部位',
          value: 'keyParts'
        },
        {
          id: 4,
          label: '维保记录',
          value: 'maintenance'
        },
        {
          id: 5,
          label: '单位评估',
          value: 'assessment'
        },
        {
          id: 6,
          label: '物联网设备',
          value: 'iot'
        },
        {
          id: 7,
          label: '消防预案',
          value: 'firePlan'
        },
        {
          id: 8,
          label: '规章制度',
          value: 'fireRule'
        },
        {
          id: 9,
          label: '消防培训',
          value: 'fireTrain'
        },
        {
          id: 10,
          label: '合法性文件',
          value: 'fireLegal'
        }
      ],
      checkTabList: [
        {
          id: 1,
          label: '检查任务',
          value: 'checkPlan'
        },
        {
          id: 2,
          label: '消防设施',
          value: 'fireFacilities'
        },
        {
          id: 3,
          label: '隐患记录',
          value: 'dangerRecord'
        },
        {
          id: 4,
          label: '检查痕迹',
          value: 'checkMark'
        }
      ],
      dualSystemTabList: [
        {
          id: 1,
          label: '风险点',
          value: 'riskPoint'
        },
        {
          id: 2,
          label: '危险源',
          value: 'dangerSource'
        },
        {
          id: 3,
          label: '隐患',
          value: 'danger'
        },
        {
          id: 4,
          label: '重大危险源',
          value: 'majorDanger'
        }
      ],
      emergencyTabList: [
        {
          id: 1,
          label: '物资储备地点',
          value: 'goodLocation'
        },
        {
          id: 2,
          label: '应急物资',
          value: 'goods'
        },
        {
          id: 3,
          label: '应急装备',
          value: 'equipment'
        },
        {
          id: 4,
          label: '应急预案',
          value: 'reservePlan'
        }
      ],
      safeProductionTabList: [
        {
          id: 1,
          label: '主要原料',
          value: 'mainMaterials'
        },
        {
          id: 2,
          label: '涉爆粉尘',
          value: 'explosiveDust'
        },
        {
          id: 3,
          label: '安全生产制度',
          value: 'safeSystem'
        },
        {
          id: 4,
          label: '安全生产标准化',
          value: 'standardization'
        },
        {
          id: 5,
          label: '安全投入',
          value: 'safeInput'
        },
        {
          id: 6,
          label: '生产工艺',
          value: 'technology'
        }
      ],
      unitUrls: [
        'http://60.205.250.163/image/01.png'
      ],
      fireUrls: [
        'http://60.205.250.163/image/02.jpg'
      ],
      goodLocation: [
        {
          id: 1,
          name: '消防水源',
          type: '消防水源'
        },
        { id: 2, name: '灭火器', type: '灭火剂' },
        {
          id: 3,
          name: '消防栓',
          type: '消防水源'
        },
        {
          id: 4,
          name: '安全出口',
          type: '安全出口'
        },
        {
          id: 5,
          name: '应急照明灯',
          type: '救援生活物资'
        }
      ],
      fireBuildingConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'createDate',
          label: '创建时间',
          align: 'center',
          width: ''
        }
      ],
      goodLocationConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '物资名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'type',
          label: '物资类别',
          align: 'center',
          width: ''
        }
      ],
      goods: [
        {
          id: 1,
          name: '消防水源',
          type: '消防水源'
        },
        { id: 2, name: '灭火器', type: '灭火剂' },
        {
          id: 3,
          name: '消防栓',
          type: '消防水源'
        },
        {
          id: 4,
          name: '安全出口',
          type: '安全出口'
        },
        {
          id: 5,
          name: '应急照明灯',
          type: '救援生活物资'
        }
      ],
      goodsConfig: [
        {
          prop: 'id',
          label: '物资名称',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '物资类别',
          align: 'center',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '入库日期',
          align: 'center',
          width: ''
        }
      ],
      equipment: [
        {
          id: '1',
          name: '挖掘机',
          model: '',
          type: '清障设备及工具'
        },
        {
          id: '2',
          name: '冲锋舟及挂机',
          model: '',
          type: '应急救援快艇'
        },
        {
          id: '3',
          name: '消防车',
          model: '',
          type: '车辆'
        },
        {
          id: '4',
          name: '直升机',
          model: '',
          type: '救援直升机'
        }
      ],
      checkRecord: [
        {
          id: '1',
          name: '化工及危险化学品检查表',
          hasDanger: '无',
          time: '2020-8-27'
        },
        {
          id: '2',
          name: '防火安全检查表',
          hasDanger: '无',
          time: '2020-8-27'
        },
        {
          id: '3',
          name: '隐患排查检查表',
          hasDanger: '无',
          time: '2020-8-27'
        },
        {
          id: '4',
          name: '消防设施检查表',
          hasDanger: '无',
          time: '2020-8-27'
        },
        {
          id: '5',
          name: '应急处置检查表',
          hasDanger: '无',
          time: '2020-8-27'
        }
      ],
      checkRecordConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '检查表名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'hasDanger',
          label: '有无隐患',
          align: 'center',
          width: ''
        },
        {
          prop: 'time',
          label: '检查时间',
          align: 'center',
          width: ''
        }
      ],
      equipmentConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '装备名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'model',
          label: '规格型号',
          align: 'center',
          width: ''
        },
        {
          prop: 'type',
          label: '装备类型',
          align: 'center',
          width: ''
        }
      ],
      reservePlan: [
        {
          id: '1',
          name: '自然灾害应急救援预案',
          type: '市级应急预案',
          personLiable: '秦勇'
        },
        {
          id: '2',
          name: '生产安全事故应急预案',
          type: '市级应急预案',
          personLiable: '生淏'
        },
        {
          id: '3',
          name: '化工园区应急救援预案',
          type: '市级应急预案',
          personLiable: '赵凯'
        },
        {
          id: '4',
          name: '抗震救灾应急预案',
          type: '专项应急预案',
          personLiable: '秦勇'
        }
      ],
      reservePlanConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '标题',
          align: 'center',
          width: ''
        },
        {
          prop: 'type',
          label: '类型',
          align: 'center',
          width: ''
        },
        {
          prop: 'personLiable',
          label: '应急责任人',
          align: 'center',
          width: ''
        }
      ],
      maintenanceList: [
        {
          id: '1',
          person: '王毅',
          company: '青岛胶州医院',
          time: '2020-8-6',
          date: '2020-9-1'
        },
        {
          id: '2',
          person: '王毅',
          company: '青岛胶州医院',
          time: '2020-8-6',
          date: '2020-9-1'
        },
        {
          id: '3',
          person: '王毅',
          company: '青岛胶州医院',
          time: '2020-8-6',
          date: '2020-9-1'
        },
        {
          id: '4',
          person: '王毅',
          company: '青岛胶州医院',
          time: '2020-8-6',
          date: '2020-9-1'
        }
      ],
      maintenanceConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'person',
          label: '维保人员',
          align: 'center',
          width: ''
        },
        {
          prop: 'company',
          label: '维保单位',
          align: 'center',
          width: ''
        },
        {
          prop: 'time',
          label: '维保时间',
          align: 'center',
          width: ''
        },
        {
          prop: 'date',
          label: '维保日期',
          align: 'center',
          width: ''
        }
      ],
      mainMaterials: [
        {
          id: 1,
          name: '甲醇',
          describle: '甲醇'
        },
        {
          id: 2,
          name: '丙酮',
          describle: '丙酮'
        },
        {
          id: 3,
          name: '、氯乙烯',
          describle: '氯乙烯'
        },
        {
          id: 4,
          name: '纤维素',
          describle: '纤维素'
        }
      ],
      mainMaterialsConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '原料名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'describle',
          label: '描述',
          align: 'center',
          width: ''
        }
      ],
      mainProducts: [],
      mainProductsConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '产品名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '产能',
          align: 'center',
          width: ''
        }
      ],
      explosiveDust: [],
      explosiveDustConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '爆炸危险性级别',
          align: 'center',
          width: ''
        }
      ],
      safeSystem: [
        {
          id: 1,
          safe1: '油料管理员安全职责',
          safe2: '安全投入保障制度',
          safe3: '罐区维修作业安全操作规程'
        },
        {
          id: 2,
          safe1: '设备管理员安全职责',
          safe2: '安全生产风险分级管控制度',
          safe3: '有限空间作业安全操作规程'
        },
        {
          id: 3,
          safe1: '计量员安全职责',
          safe2: '事故隐患报告和举报奖励制度',
          safe3: '电工岗位安全操作规程'
        }
      ],
      safeSystemConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: ''
        },
        {
          prop: 'safe1',
          label: '安全生产责任制目录',
          align: 'center',
          width: ''
        },
        {
          prop: 'safe2',
          label: '安全生产管理制度目录',
          align: 'center',
          width: ''
        },
        {
          prop: 'safe3',
          label: '安全作业和主要岗位操作规程目录',
          align: 'center',
          width: ''
        }
      ],
      standardization: [
        {
          level: '三级',
          company: '',
          department: '青岛市应急管理局',
          date: '2018-02-07'
        }
      ],
      standardizationConfig: [
        {
          prop: 'level',
          label: '标准化等级',
          align: 'center',
          width: ''
        },
        {
          prop: 'company',
          label: '评审机构',
          align: 'center',
          width: ''
        },
        {
          prop: 'department',
          label: '认定部门',
          align: 'center',
          width: ''
        },
        {
          prop: 'date',
          label: '认定时间',
          align: 'center',
          width: ''
        }
      ],
      safeInput: [
        {
          year: '2016',
          income: '850',
          percent: '4',
          should: '34',
          actual: '34'
        },
        {
          year: '2017',
          income: '550',
          percent: '4',
          should: '22',
          actual: '22'
        },
        {
          year: '2018',
          income: '600',
          percent: '4',
          should: '24',
          actual: '24'
        },
        {
          year: '2019',
          income: '740',
          percent: '4',
          should: '29.6',
          actual: '29.6'
        },
        {
          year: '2020',
          income: '',
          percent: '',
          should: '',
          actual: ''
        }
      ],
      safeInputConfig: [
        {
          prop: 'year',
          label: '年度',
          align: 'center',
          width: '70px'
        },
        {
          prop: 'income',
          label: '上年度销售收入（万元）',
          align: 'center',
          width: ''
        },
        {
          prop: 'percent',
          label: '提取标准（%）',
          align: 'center',
          width: ''
        },
        {
          prop: 'should',
          label: '应提取（万元）',
          align: 'center',
          width: ''
        },
        {
          prop: 'actual',
          label: '实际提取（万元）',
          align: 'center',
          width: ''
        }
      ],
      technology: [],
      technologyConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: ''
        },
        {
          prop: 'name',
          label: '工艺名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'ruleDate',
          label: '工艺类型',
          align: 'center',
          width: ''
        }
      ],
      riskPoint: [
        {
          id: 1,
          name: '电梯',
          category: '设备设施类',
          level: '一般风险'
        },
        {
          id: 2,
          name: '备用发电机',
          category: '设备设施类',
          level: '低风险'
        },
        {
          id: 3,
          name: '电梯',
          category: '设备设施类',
          level: '一般风险'
        },
        {
          id: 4,
          name: '有限空间作业',
          category: '作业活动类',
          level: '低风险'
        },
        {
          id: 5,
          name: '消防水泵房',
          category: '设备设施类',
          level: '低风险'
        }
      ],
      riskPointConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: ''
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'category',
          label: '类别',
          align: 'center',
          width: ''
        },
        {
          prop: 'level',
          label: '等级',
          align: 'center',
          width: ''
        }
      ],
      specialPerson: [
        {
          id: 1,
          typeOfWork: '电工作业（低压）',
          numPeople: '20',
          certificateNumPeople: '20'
        },
        {
          id: 2,
          typeOfWork: '电工作业（高压）',
          numPeople: '20',
          certificateNumPeople: '15'
        },
        {
          id: 3,
          typeOfWork: '焊接与热切割作业',
          numPeople: '10',
          certificateNumPeople: '10'
        },
        {
          id: 4,
          typeOfWork: '高处作业',
          numPeople: '5',
          certificateNumPeople: '5'
        }
      ],
      specialPersonConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: ''
        },
        {
          prop: 'typeOfWork',
          label: '工种',
          align: 'center',
          width: ''
        },
        {
          prop: 'numPeople',
          label: '人数',
          align: 'center',
          width: ''
        },
        {
          prop: 'certificateNumPeople',
          label: '持证人数',
          align: 'center',
          width: ''
        }
      ],
      dangerSource: [
        {
          id: 1,
          name: '取样员身穿化纤类衣物',
          dangerLevel: '一般风险',
          dangerType: ''
        },
        {
          id: 2,
          name: '未经培训上岗或特种作业无证上岗',
          dangerLevel: '一般风险',
          dangerType: ''
        },
        {
          id: 3,
          name: '透水',
          dangerLevel: '重大风险',
          dangerType: '房屋坍塌'
        }
      ],
      dangerSourceConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'dangerLevel',
          label: '风险等级',
          align: 'center',
          width: ''
        },
        {
          prop: 'dangerType',
          label: '可能发生的事故类型',
          align: 'center',
          width: ''
        }
      ],
      danger: [
        {
          id: 1,
          name: '电梯安全许可证遗失',
          dangerLevel: '生产现场类',
          dangerType: '一般隐患'
        },
        {
          id: 2,
          name: '缺警示标志',
          dangerLevel: '生产现场类',
          dangerType: '一般隐患'
        },
        {
          id: 3,
          name: '变电箱电线裸露',
          dangerLevel: '生产现场类',
          dangerType: '一般隐患'
        },
        {
          id: 4,
          name: '锅炉房风机不是防爆的',
          dangerLevel: '生产现场类',
          dangerType: '一般隐患'
        }
      ],
      dangerConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '隐患名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'dangerType',
          label: '隐患类别',
          align: 'center',
          width: ''
        },
        {
          prop: 'dangerLevel',
          label: '隐患等级',
          align: 'center',
          width: ''
        }
      ],
      majorDanger: [
        {
          id: 1,
          name: '液体库储存罐区',
          describe: '液体库储存罐区'
        },
        {
          id: 2,
          name: '电气线路老化',
          describe: '电气线路老化'
        },
        {
          id: 3,
          name: '机械设备外壳带电',
          describe: '机械设备外壳带电'
        }
      ],

      majorDangerConfig: [
        {
          prop: 'id',
          label: '序号',
          align: 'center',
          width: '150%'
        },
        {
          prop: 'name',
          label: '名称',
          align: 'center',
          width: ''
        },
        {
          prop: 'describe',
          label: '描述',
          align: 'center',
          width: ''
        }
      ],
      keyPartsList: [],
      // 检查任务
      checkPlanList: [],
      // 隐患记录
      dangerRecordList: [],
      // 消防设施
      controlList: [],
      // 隐患记录
      dangerInfoData: [],
      fireFacilitiesConfig: [
        {
          prop: 'location',
          label: '位置',
          align: 'center',
          width: ''
        },
        {
          prop: 'primaryName',
          label: '责任人',
          align: 'center',
          width: ''
        },
        {
          prop: 'officeName',
          label: '责任部门',
          align: 'center',
          width: ''
        }
      ],
      fireFacilitiesData: [],
      // 检查痕迹
      checkMarkConfig: [
        {
          prop: 'planName',
          label: '检查任务',
          align: 'center',
          width: ''
        },
        {
          prop: 'chkCount',
          label: '已检查',
          align: 'center',
          width: ''
        },
        {
          prop: 'unChkNum',
          label: '未检查',
          align: 'center',
          width: ''
        }
      ],
      checkMark: [],
      alertData: {}
    }
  },
  computed: {
    assessMentPieData() {
      const pieChart = {
        unit: '分',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: false,
        series: [
          {
            name: '评估成绩',
            radius: ['40%', '75%'],
            center: ['50%', '40%'],
            roseType: 'radius',
            label: {
              show: false,
              position: 'center'
            },
            data: this.scorePieList,
            color: ['#f5a72c', '#2cc8f5', '#f14545', '#08b948']
          }
        ]
      }
      return pieChart
    },
    fireFacilities() {
      const fireFacilities = [
        {
          id: '001',
          url: require('./images/icon_hydrant.png'),
          name: '室内消火栓',
          count: this.controlList[0]
        },
        {
          id: '002',
          url: require('./images/icon_spray.png'),
          name: '自动水喷淋',
          count: this.controlList[1]
        },
        {
          id: '003',
          url: require('./images/icon_tank.png'),
          name: '高位水箱',
          count: this.controlList[2]
        },
        {
          id: '004',
          url: require('./images/icon_pool.png'),
          name: '消防水池',
          count: this.controlList[3]
        }
      ]
      return fireFacilities
    }
  },
  created() {
    this._getOfficeDetail()
  },
  methods: {
    viewDevDetail(item) {
      this.devDialogVisible = true
      this.category = item.id - 1
      this.categoryName = item.name
    },
    devDetailhide() {
      this.devDialogVisible = false
    },
    move(direction) {
      this.$nextTick(() => {
        if (direction === 'right') {
          if (this.leftTabLength > 0) {
            this.leftTabLength -= 1
            this.rightTabLength += 1
            this.$refs.baseInfoTab.style.transform = `translate3d(-${118 *
              this.leftTabLength}px,0,0)`
          } else {
            return
          }
        } else if (direction === 'left') {
          if (this.rightTabLength > 0) {
            this.leftTabLength += 1
            this.rightTabLength -= 1
            this.$refs.baseInfoTab.style.transform = `translate3d(-${118 *
              this.leftTabLength}px,0,0)`
          } else {
            return
          }
        }
      })
    },
    // 查看表单信息
    handleView(data, title, type) {
      // createFormOption(tyle)
      const operationStatus = 'view'
      this.formAction(title, operationStatus, data)
    },
    fireFacilitiesHide() {
      this.fireDialogVisible = false
    },
    viewFireFacilitiesDetail(data) {
      this.fireDialogVisible = true
      this.facilitieTitle = data.name
      const params = {
        officeId: this.officeId,
        sensorType: data.id
      }
      handlerFireControlDetail(params).then(res => {
        this.fireFacilitiesData = res.data
      })
    },
    toggleVisible(visible) {
      if (this.visible === visible) {
        this.visible = ''
      } else {
        this.visible = visible
      }
    },
    switchCheck(visible) {
      this.checkVisible = visible
      const params = {
        officeId: this.officeId
      }
      switch (this.checkVisible) {
        case 'checkPlan': // 检查任务
          handlerChkplanListByOffice(params).then(res => {
            if (res.data) {
              this.checkPlanList = res.data
            }
          })
          break
        case 'fireFacilities': // 消防设施
          handlerFireControlOffice(params).then(res => {
            if (res.data) {
              this.controlList = Object.values(res.data)
            }
          })
          break
        case 'dangerRecord': // 隐患记录
          handlerDangerByOffice(params).then(res => {
            if (res.data) {
              this.dangerRecordList = res.data
            }
          })
          break
        case 'checkMark': // 检查痕迹
          handlerChkPlanInfo({
            page: 1,
            pageSize: 10000
          }).then(res => {
            this.checkMark = res.data.listData.list
          })
          break
        default:
          break
      }
    },
    switchDualSystem(visible) {
      this.dualSystemVisible = visible
    },
    switchEmergency(visible) {
      this.emergencyVisible = visible
    },
    switchSafeProduction(visible) {
      this.safeProductionVisible = visible
    },
    switchBaseInfo(visible) {
      if (this.visible === 'baseInfo') {
        this.topVisible = visible
      }
      this.visible = 'baseInfo'
      const params = {
        officeId: this.officeId
      }
      switch (this.topVisible) {
        case 'unitInfo':
          getOfficeDetail(params).then(res => {
            if (res.data) {
              this.officeDetail = res.data.officeDetail
            }
          })
          break
        case 'keyParts':
          handlerListByOffice(params).then(res => {
            if (res.data) {
              this.keyPartsList = res.data
            }
          })
          break
        case 'assessment':
          handlerAssessScore(params).then(res => {
            if (res.data) {
              this.scoreLevel = res.data.level
              this.scoreNum = res.data.score
              this.scoreDate = res.data.createDate
              this.scorePieList = res.data.scorings
              this.scoreList = res.data.datas
            }
          })
          break
        case 'fireLegal': // 合法性文件
          getLegalDocByOffice(params).then(res => {
            if (res.data) {
              this.fireLegalList = res.data.list
            }
          })
          break
        case 'fireRule': // 规章制度
          getFireRuleByOffice(params).then(res => {
            if (res.data) {
              this.fireRuleList = res.data.list
            }
          })
          break
        case 'firePlan': // 消防预案
          getFirePlanByOffice(params).then(res => {
            if (res.data) {
              this.firePlanList = res.data.list
            }
          })
          break
        case 'fireTrain': // 消防培训
          getFireTrainByOffice(params).then(res => {
            if (res.data) {
              this.fireTrainList = res.data.list
            }
          })
      }
    },
    _getOfficeDetail() {
      const para = {
        officeId: this.officeId
      }
      getOfficeDetail(para).then(res => {
        if (res.data) {
          this.officeDetail = res.data.officeDetail
        }
      })
      handlerChkplanListByOffice(para).then(res => {
        if (res.data) {
          this.checkPlanList = res.data
        }
      })
    },
    handlerAssessMent() {
      const para = {
        officeId: this.officeId
      }
      handlerAssessMentAchieve(para).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '单位评估成功',
            type: 'success'
          })
          handlerAssessScore(para).then(res => {
            if (res.data) {
              this.scoreDate = res.data.createDate
              this.scorePieList = res.data.scorings
              this.scoreList = res.data.datas
            }
          })
        } else {
          this.$message({
            message: '单位评估失败',
            type: 'error'
          })
        }
      })
    },
    // 打开隐患详情
    handlerViewDangerDetail(data) {
      this.$refs.HiddenDangerStatus.handlerShow()
      getDangerInfo({ danger_id: data.id }).then(res => {
        if (res.data) {
          this.dangerInfoData = res.data.list
        }
      })
    },
    // staffworkalert
    handleCheckTraceView(data) {
      this.alertData = data
      this.$refs.staffworkalert.handlerShow()
    },
    // 文档下载
    handlerDownloadFile(row) {
      const params = {
        officeId: this.officeId,
        fileId: row.fileId
      }
      handlerDownload(params).then(res => {
        if (!res) {
          this.$message.error('下载模板文件失败')
          return false
        }
        download(res.data, row.fileName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 557px;
  padding: 0 0 6px 0;

  .el-container {
    .el-aside {
      width: 405px !important;
      background: transparent;
      padding: 0;
      margin: 0;
    }
    .el-main {
      padding: 0;
      margin-left: 16px;
      background-color: rgba(255, 255, 255, 0.07);
      overflow: hidden;
      .container {
        width: 100%;
        padding-right: 34px;
        box-sizing: content-box;
        overflow: hidden;
        overflow-y: scroll;
        height: 100%;
        .header {
          position: relative;
          .icon {
            position: absolute;
            right: 19px;
            top: 13px;
            width: 13px;
            height: 12px;
            background: url(./images/icon_arrow.png) 0 0 no-repeat;
            transition: all 0.3s;
            transform: rotateZ(0deg);
            z-index: 1;
            cursor: pointer;
            &.flip {
              transform: rotateZ(180deg);
            }
          }
        }
        .baseInfo {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          .slide-enter-active,
          .slide-leave-active {
            transition: height 0.5s ease-out;
            // transform: translate3d(100%, 0, 0);
          }
          .slide-enter,
          .slide-leave-to {
            height: 0;
          }
          .slide-enter-to,
          .slide-leave {
            height: calc(400px - 37px);
          }
          .header {
            height: 37px;
            line-height: 37px;
            background-color: rgba(0, 113, 255, 0.36);
            position: relative;
            overflow: hidden;
            .mask {
              position: absolute;
              right: 0;
              top: 0;
              width: 64px;
              height: 37px;
              background-color: #0c4192;
            }
            .switch_arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 12px;
              height: 20px;
              background: url(./images/switch_arrow.png) 0 0 no-repeat;
              z-index: 1;
              cursor: pointer;
              &.left {
                top: 50%;
                transform: translateY(-50%);
                left: 4px;
              }
              &.right {
                right: 40px;
                transform: translateY(-50%) rotateY(180deg);
              }
            }
            > ul {
              list-style: none;
              padding: 0;
              margin: 0;
              display: flex;
              height: 100%;
              transition: all 0.5s linear;
              transform: translate3d(0, 0, 0);
              > li {
                flex: 1;
                min-width: 118px;
                text-align: center;
                height: 100%;
                font-size: 14px;
                color: #97c1ff;
                font-weight: bold;
                display: flex;
                align-items: center;
                cursor: pointer;

                .text {
                  flex: 1;
                  height: 100%;
                  &:hover {
                    background-color: rgba(0, 113, 255, 0.36);
                  }
                }
                .line {
                  display: inline-block;
                  width: 1px;
                  height: 15px;
                  background-color: #316acb;
                }
                &.selected {
                  .text {
                    background-color: rgba(0, 113, 255, 0.36);
                  }
                }
                &:last-child {
                  .line {
                    display: none;
                  }
                }
              }
            }
          }
          > .content {
            overflow: hidden;
            position: relative;
            .box-wrapper {
              height: calc(400px - 37px);
              position: relative;
              .switch-enter-active,
              .switch-leave-active {
                transition: all 0.5s;
                // transform: translate3d(100%, 0, 0);
              }
              .switch-enter,
              .switch-leave-to {
                transform: translate3d(-100%, 0, 0);
              }
              .box {
                width: 100%;
                position: absolute;
                padding: 8px 13px 0 13px;
                box-sizing: border-box;
              }
            }
            .assessment {
              display: flex;
              height: 100%;

              .chart-wrapper {
                width: 224px;
                height: 355px;

                .chart-wrapper-container {
                  position: relative;
                  width: 100%;
                  height: 300px;

                  .chart-wrapper-container-date {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 224px;
                    height: 24px;
                    line-height: 14px;
                    text-align: center;
                    color: #97c1ff;
                  }
                }

                .chart-wrapper-btn {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  height: 55px;

                  .chart-wrapper-btn-mini {
                    padding: 7px 26px;
                    font-size: 14px;
                    color: #fff;
                    background: #00a39e;
                    border: 1px solid #00a39e;
                  }
                }
              }

              .scoreList {
                flex: 1;
                overflow-y: scroll;

                > .title {
                  font-size: 14px;
                  font-weight: bold;
                  color: #0ebcc7;
                }

                > ul {
                  margin-right: 8px;

                  > li {
                    padding: 14px 12px 10px 12px;
                    background-color: rgba(255, 255, 255, 0.09);
                    margin-bottom: 10px;
                    border-radius: 5px;
                    min-height: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: #97c1ff;
                    position: relative;

                    .score {
                      position: absolute;
                      right: 0;
                      top: 0;
                      width: 85px;
                      height: 24px;
                      line-height: 24px;
                      color: #fff;
                      text-align: center;
                      background-color: #b4535b;
                      border-radius: 0 5px 0px 20px;
                    }

                    .title {
                      color: #e8e283;
                      font-size: 14px;
                      font-weight: bold;
                    }

                    .content {
                      line-height: 20px;
                    }

                    p {
                      margin: 0;
                    }

                    .down {
                      display: flex;
                      flex-wrap: wrap;

                      li {
                        background-color: #122654;
                        padding: 9px 13px;
                        border-radius: 5px;
                      }
                    }
                  }
                }
              }
            }
            .maintenance {
              display: flex;
              flex-direction: column;
              .date {
                height: 57px;
                display: flex;
                align-items: center;
                ul {
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                  li {
                    width: 37px;
                    height: 37px;
                    line-height: 37px;
                    text-align: center;
                    color: #97c1ff;
                    font-size: 14px;
                    border-radius: 50%;
                    background-color: rgba(4, 126, 183, 0.15);
                    &.select {
                      background-color: #047eb7;
                    }
                  }
                }
              }
            }
            .unitInfo {
              padding: 26px 10px 0 10px;
              font-size: 14px;
              color: #97c1ff;
              .content {
                display: flex;
                justify-content: flex-end;
                background-color: #001647;
                .left {
                  position: absolute;
                  left: 26px;
                  top: 13px;
                  line-height: 26px;
                  padding: 11px 12px;
                  background-color: #052772;
                  p {
                    max-width: 310px;
                    margin: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .line {
                    position: absolute;
                    height: 4px;
                    background-color: #052772;
                    left: 0;
                    bottom: -10px;
                    right: 35px;
                    &:last-child {
                      bottom: -19px;
                      right: 72px;
                    }
                  }
                }
                .right {
                  flex: 0 1 50%;
                  padding: 20px 0 16px 0;
                  line-height: 30px;
                }
              }
            }
            .fireBuilding {
              width: 100%;
              height: 100%;
              padding: 0;
              overflow: auto;
              .el-image {
                width: 100%;
                height: 100%;
                margin-bottom: 10px;
              }
            }
            .iot {
              ul {
                display: flex;
                flex-wrap: wrap;

                li {
                  width: 183px;
                  height: 68px;
                  border: 1px solid #1e4295;
                  margin-top: 12px;
                  margin-right: 7px;
                  cursor: pointer;

                  .content {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    color: #97c1ff;

                    .icon {
                      width: 70px;
                      height: 100%;
                      background-size: 47px 47px;
                      background-position: center;
                      background-repeat: no-repeat;
                    }
                  }
                }
              }
            }

            .firePlan {
              padding: 8px 13px 0 13px;
            }

            .keyParts {
              ul {
                width: 100%;
                height: 363px;
                overflow-y: scroll;

                li {
                  display: flex;
                  align-items: center;
                  height: 144px;
                  margin: 27px 0;
                  margin-right: 5px;
                  border: 3px solid rgba(255, 255, 255, 0.17);

                  .icon {
                    width: 208px;
                    height: 100%;
                    margin-top: -25px;
                    margin-right: 16px;
                  }

                  .data {
                    flex: 1;

                    .title {
                      width: 110px;
                      height: 26px;
                      line-height: 26px;
                      text-align: center;
                      background-color: #294c9d;
                      color: #e9e1b8;
                      font-weight: bold;
                      border-radius: 13px;
                      margin-top: -26px;
                      margin-bottom: 10px;
                    }

                    p {
                      line-height: 18px;
                      margin: 0;
                      color: #97c1ff;
                    }
                  }
                }
              }
            }
          }
        }
        > .box {
          margin-bottom: 10px;
          .slide-enter-active,
          .slide-leave-active {
            transition: height 0.5s ease-out;
            // transform: translate3d(100%, 0, 0);
          }
          .slide-enter,
          .slide-leave-to {
            height: 0;
          }
          .slide-enter-to,
          .slide-leave {
            height: calc(400px - 37px);
          }
          &.check {
            .main {
              .content {
                height: 350px;
              }
            }
          }
          &.checkRecord {
            .main {
              .content {
                height: 300px;
              }
            }
          }
          &.specialPerson {
            .main {
              .content {
                height: 300px;
              }
            }
          }
          &.dualSystem {
            .main {
              .content {
                height: 300px;
              }
            }
          }
          &.safeProduction {
            .main {
              .content {
                height: 300px;
              }
            }
          }
          &.emergency {
            .main {
              .content {
                height: 300px;
              }
            }
          }
          .header {
            padding: 0 20px 0 10px;
            height: 37px;
            line-height: 37px;
            background-color: rgba(0, 113, 255, 0.36);
            display: flex;
            .text {
              font-size: 14px;
              color: #e2e87f;
              font-weight: bold;
            }
          }
          .main {
            overflow: hidden;
            .tab-wrapper {
              height: 42px;
              line-height: 42px;
              > ul {
                width: 100%;
                height: 100%;
                display: flex;
                padding: 0;
                margin: 0;
                list-style: none;
                li {
                  flex: 1;
                  height: 100%;
                  font-size: 14px;
                  color: #97c1ff;
                  font-weight: bold;
                  text-align: center;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  &.select {
                    .text {
                      color: #fff;
                    }
                  }
                  cursor: pointer;
                  &:last-child {
                    .line {
                      display: none;
                    }
                  }
                  .text {
                    flex: 1;
                    height: 100%;
                    text-align: center;
                    &:hover {
                      color: #fff;
                    }
                  }
                  .line {
                    width: 1px;
                    height: 15px;
                    background-color: rgba(0, 113, 255, 0.36);
                  }
                }
              }
            }
            .content {
              background-color: #001647;
              margin: 0 10px;
              position: relative;
              flex: 1;
              .item {
                position: absolute;
                left: 0;
                right: 0;
                margin: 12px 15px;
                box-sizing: border-box;
              }
              .switch-enter-active,
              .switch-leave-active {
                transition: all 0.5s;
                // transform: translate3d(100%, 0, 0);
              }
              .switch-enter,
              .switch-leave-to {
                transform: translate3d(-100%, 0, 0);
              }
              .checkPlan {
                > ul {
                  display: flex;
                  flex-direction: column;
                  height: 328px;
                  overflow-y: scroll;
                  padding: 0;
                  margin: 0;
                  list-style: none;

                  li {
                    position: relative;
                    display: flex;
                    height: 106px;
                    margin: 8px 5px 8px 0;
                    padding: 16px 0;
                    border: 3px solid rgba(255, 255, 255, 0.17);

                    .cycle {
                      position: absolute;
                      right: 0;
                      top: 0;
                      height: 23px;
                      padding: 0 15px;
                      line-height: 23px;
                      color: #fff;
                      text-align: center;
                      border-radius: 0 0 0 5px;
                      background-color: #016f7c;
                    }

                    .icon {
                      width: 97px;
                      height: 100%;
                      background: url(./images/icon_checkPlan.png) center center
                        no-repeat;
                      background-size: 67px 67px;
                    }

                    .data {
                      flex: 1;
                      display: flex;
                      flex-wrap: wrap;
                      align-items: flex-start;

                      p {
                        flex: 0 1 50%;
                        margin: 6px 0 0 0;
                        font-size: 14px;
                        line-height: 14px;
                        color: #97c1ff;

                        &.title {
                          flex: 0 1 100%;
                          color: #f0eaab;
                          margin: 0;
                        }
                      }
                    }
                  }
                }
              }
              .fireFacilities {
                > ul {
                  display: flex;

                  li {
                    flex: 1;
                    height: 89px;
                    background-color: rgba(255, 255, 255, 0.07);
                    margin-right: 11px;
                    display: flex;
                    align-items: center;

                    .icon {
                      width: 79px;
                      height: 100%;
                      background-repeat: no-repeat;
                      background-size: 59px 59px;
                      background-position: right center;
                    }

                    .data {
                      flex: 1;
                      height: 59px;
                      display: flex;
                      flex-direction: column;
                      justify-content: space-evenly;
                      font-size: 14px;
                      margin-left: 12px;

                      .text {
                        color: #97c1ff;
                      }

                      .num {
                        font-size: 18px;
                        font-weight: bold;
                        color: #e2e87f;

                        .unit {
                          font-size: 14px;
                        }
                      }
                    }

                    &:last-child {
                      margin-right: 0;
                    }
                  }
                }
              }
              .dangerRecord {
                ul {
                  display: flex;
                  flex-direction: column;
                  height: 328px;
                  overflow-y: scroll;

                  li {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 106px;
                    margin: 5px 5px 5px 0;
                    padding: 0 13px 0 65px;
                    border: 3px solid rgba(255, 255, 255, 0.17);

                    .number {
                      position: absolute;
                      left: 11px;
                      top: -7px;
                      width: 42px;
                      height: 74px;
                      text-align: center;
                      line-height: 74px;
                      font-size: 16px;
                      color: #ffffff;
                      font-weight: bold;
                      background-color: #0a54b0;
                    }

                    .data {
                      p {
                        margin: 0;
                        color: #97c1ff;
                        line-height: 22px;
                      }
                    }

                    .btn-wrapper {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-evenly;
                      width: 89px;
                      height: 100%;

                      .btn {
                        width: 100%;
                        height: 31px;
                        line-height: 31px;
                        text-align: center;
                        color: #fff;
                        border-radius: 15px;
                        border: 1px solid #9d9049;
                        background-color: rgba(157, 144, 73, 0.55);
                        cursor: pointer;

                        &:last-child {
                          border-color: #114aa9;
                          background-color: rgba(3, 59, 130, 0.36);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
