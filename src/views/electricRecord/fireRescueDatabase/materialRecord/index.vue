<template>
  <div class="fireRescue materialRecord">
    <div class="fireRescue-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
      <!-- 搜索框 -->
      <!-- 条件框 -->
      <div class="filter-box" style="display: flex;">
        <el-button class="add" @click="handleMaterialCreate('新增物资信息')">添加</el-button>
        <el-button class="record" @click="handleDownload()">下载模板</el-button>
        <el-button v-show="isUpload" class="weichat" @click="handleImportShow">点击上传</el-button>
        <el-upload
          v-show="!isUpload"
          ref="iUpload"
          action="Fake Action"
          :multiple="false"
          :limit="1"
          accept=".xls"
          :http-request="handleHttpRequest"
        >
          <el-button
            class="weichat"
            style="margin-left: 10px; font-size: 14px;"
            size="small"
            type="primary"
          >点击上传</el-button>
        </el-upload>
      </div>
      <!-- 条件框 -->
      <!-- 列表框 -->
      <div class="table-box">
        <BaseTable
          :loading="listLoading"
          :table-data="tableData"
          :table-config="tableConfig"
          :table-height="'100%'"
          :border="false"
          @rowClick="handleMaterialView($event, '查看')"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            label="操作"
            align="left"
            width="320"
            class-name="small-padding fixed-width"
          >
            <template v-slot="{row}">
              <el-tooltip content="修改" placement="top">
                <el-button
                  icon="el-icon-edit-outline"
                  type="success"
                  circle
                  @click.stop="handleMaterialEdit(row, '修改')"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  circle
                  @click.stop="handleDelete(row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
      <div class="pagination-box">
        <Pagination
          v-show="total > 0"
          :total="total"
          v-model:page="listQuery.page"
          v-model:limit="listQuery.pageSize"
          @pagination="_handleMaterialRecordList"
        />
      </div>
      <!-- 列表框 -->
      <!-- 弹出框 -->
      <el-dialog
        v-if="dialogMaterialVisible"
        class="dark material-dialog devSettingForm"
        width="860px"
        v-model:visible="dialogMaterialVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
      >
        <div
          name="title"
          class="dialog-title"
        >{{ operationStatus === 'create' ? '新增' : operationStatus === 'edit' ? '修改' : '查看' }}</div>
        <div class="dialog-content">
          <el-scrollbar>
            <el-form
              ref="materialForm"
              class="material-form"
              :model="formMaterialOption"
              :rules="rules"
              :disabled="operationStatus === 'view'"
            >
              <div class="form-content">
                <el-col :span="24">
                  <el-form-item label="物资名称:" prop="name">
                    <el-input
                      v-model="formMaterialOption.name"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="资源单位:" prop="officeName">
                    <el-input
                      v-model="formMaterialOption.officeName"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="归属区域:" prop="areaId">
                    <tree-select
                      v-model:value="formMaterialOption.areaId"
                      v-model:label="formMaterialOption.areaName"
                      :tree-select-option="areaSelectOption"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="所属类型:" prop="subType">
                    <el-select v-model="formMaterialOption.subType" placeholder="请选择">
                      <el-option
                        v-for="item in materialTypeList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人:" prop="master">
                    <el-input
                      v-model="formMaterialOption.master"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="责任人电话:" prop="masterTel">
                    <el-input
                      v-model="formMaterialOption.masterTel"
                      placeholder="请输入内容"
                      autocomplete="off"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="入库时间:" prop="enterDate">
                    <el-date-picker
                      v-model="formMaterialOption.enterDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保质期:" prop="quality">
                    <el-input
                      v-model="formMaterialOption.quality"
                      placeholder="请输入内容"
                      autocomplete="off"
                    >
                      <template v-slot:append>年</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="详细地址:" prop="addr">
                    <el-input
                      v-model="formMaterialOption.addr"
                      placeholder="请输入内容"
                      autocomplete="off"
                      @input="addrChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="position" label="经纬度:" prop="lnglat">
                    <el-input
                      v-model="formMaterialOption.lnglat"
                      placeholder="请选择经纬度"
                      autocomplete="off"
                      disabled
                    />
                    <el-button icon="el-icon-location-outline" @click="show" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="物资用途:" prop="purpose">
                    <el-input v-model="formMaterialOption.purpose" type="textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="物资备注:" prop="remarks">
                    <el-input v-model="formMaterialOption.remarks" type="textarea" />
                  </el-form-item>
                </el-col>
                <el-col class="upload-content" :span="24">
                  <upload-file
                    ref="upload-file"
                    :limit="1"
                    :size="50"
                    :list-type="'picture-card'"
                    :file-list="fileList"
                    @uploadSuccess="uploadSuccess"
                    @addDeleteFileList="addDeleteFileList"
                    @removeFile="removeFile"
                  />
                </el-col>
              </div>
            </el-form>
          </el-scrollbar>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="dialogMaterialVisible = false">取 消</el-button>
          <el-button
            v-if="operationStatus !== 'view'"
            type="primary"
            @click="operationStatus === 'create' ? handleCreateData() : handleUpdateData()"
          >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出框 -->
      <!-- 地图弹窗 -->
      <el-dialog
        v-if="dialogVisible"
        class="dark PositionPicker"
        :destroy-on-close="true"
        v-model:visible="dialogVisible"
        width="930px"
      >
        <div name="title" class="dialog-title">地图定位</div>
        <div class="dialog-content" style="height: 400px;">
          <position-picker
            ref="positionPicker"
            v-model:position="formMaterialOption.lnglat"
            v-model:address="formMaterialOption.addr"
          />
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="refreshPosition">重新定位</el-button>
          <el-button type="primary" @click="upDateLnglat">确定</el-button>
          <el-button @click="hide">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 地图弹窗 -->
      <!-- 区域弹窗 -->
      <el-dialog
        v-if="dialogAreaVisible"
        class="dark area-dialog"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :show-close="false"
        v-model:visible="dialogAreaVisible"
        width="360px"
      >
        <div name="title" class="dialog-title">选择区域</div>
        <div class="dialog-content">
          <el-scrollbar>
            <TreeNode height="722px" :tree-data="treeData" @handleNodeClick="handleNodeClick" />
          </el-scrollbar>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button type="primary" @click="handleImportUpload">确定</el-button>
          <el-button @click="handleImportHide">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 区域弹窗 -->
    </div>
  </div>
</template>

<script>
import {
  handleRecordAreaTree,
  handleRecordSubType,
  handleMaterialRecordList,
  handleMaterialRecordInfo,
  handleMaterialRecordSave,
  handleMaterialRecordUpdate,
  handleMaterialRecordDelete,
  handleRecordMaterialDownload,
  handleRecordMaterialImport
} from '@/api/materialrecord'

import '../style/index.scss'
import Download from '@/utils/fileDownload'
import formAction from '@/mixins/form'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import TreeNode from '@/components/treeNode'
import TreeSelect from '@/components/treeSelect'
import UploadFile from '@/components/uploadFile'
import PositionPicker from '@/components/bmap/positionPicker'

export default {
  // 消防救援力量信息库
  name: 'MaterialRecord',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    PositionPicker,
    TreeSelect,
    TreeNode,
    UploadFile
  },
  mixins: [formAction],
  data () {
    var checkNum = (rule, value, callback) => {
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字值且保留两位小数'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      listQuery: {
        name: '',
        type: '',
        areaId: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      treeData: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '物资名称:',
            name: 'name',
            placeholder: '请输入物资名称'
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '物资名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'typeName',
          label: '物资类别',
          align: 'left',
          width: ''
        },
        {
          prop: 'master',
          label: '负责人',
          align: 'left',
          width: ''
        },
        {
          prop: 'addr',
          label: '位置',
          align: 'left',
          width: ''
        }
      ],
      tableData: [],
      operationStatus: 'create',
      dialogMaterialVisible: false,
      formMaterialOption: {
        lnglat: ''
      },
      rules: {
        name: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        areaId: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        addr: [{ required: true, message: '这是必填字段', trigger: 'blur' }],
        quality: [{ required: true, validator: checkNum, trigger: 'blur' }],
        lnglat: [{ required: true, message: '这是必填字段', trigger: 'blur' }]
      },
      materialTypeList: [],
      areaSelectOption: {
        title: '选择区域',
        request: {
          url: 'system/api/area/treeData',
          params: {}
        }
      },
      dialogVisible: false,
      isUpload: true,
      dialogAreaVisible: false
    }
  },
  watch: {
    'this.$route.path': {
      handler: function () {
        this.handleRouteName(this.$route.path)
      },
      deep: true
    }
  },
  created () {
    this.handleRouteName(this.$route.path)
    this._handleRecordAreaTree()
    this._handleMaterialRecordList()
  },
  methods: {
    // 路由名称
    handleRouteName (routeStr) {
      const routeName = routeStr.split('/')[3]
      switch (routeName) {
        // 消防水源
        case 'fireWater':
          this.listQuery.type = 1
          break
        // 灭火药剂
        case 'fireAgent':
          this.listQuery.type = 2
          break
        // 特种车辆
        case 'specialVehicle':
          this.listQuery.type = 3
          break
        // 消防站
        case 'fireStation':
          this.listQuery.type = 4
          break
        // 社会救援力量
        case 'socialRescue':
          this.listQuery.type = 5
          break
        // 危化品
        case 'dangerousGood':
          this.listQuery.type = 6
          break
        // 救援生活物资
        case 'reliefMaterial':
          this.listQuery.type = 7
          break
        // 救援食品
        case 'rescueFood':
          this.listQuery.type = 8
          break
        default:
          break
      }
      this._handleRecordSubType()
    },
    // 获取tree
    _handleRecordAreaTree () {
      handleRecordAreaTree().then(res => {
        this.treeData = res.data
      })
    },
    // 消防物资子类型
    _handleRecordSubType () {
      const params = { type: this.listQuery.type }
      handleRecordSubType(params).then(res => {
        this.materialTypeList = res.data
      })
    },
    // tab
    handleTabClick (tab, event) {
      if (tab.index === '0') {
        this.tabIndex = tab.index
        this._handleRecordAreaTree()
      }
    },
    // 树状方法
    handleNodeClick (data, node) {
      this.listQuery.areaId = data.id
    },
    // 获取列表
    _handleMaterialRecordList () {
      handleMaterialRecordList(this.listQuery).then(res => {
        if (res.data) {
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
    // 导出
    handleDownload () {
      handleRecordMaterialDownload().then(res => {
        if (!res) {
          this.$message.error('下载模板文件失败')
          return false
        }
        this.$message({
          message: '下载模板文件成功',
          type: 'success'
        })
        Download(res.data, '消防物资导入模板.xls')
      })
    },
    // 导入
    handleImportShow () {
      this.dialogAreaVisible = true
      if (this.listQuery.areaId) {
        this.isUpload = false
      }
    },
    handleImportHide () {
      this.dialogAreaVisible = false
      this.isUpload = true
    },
    handleImportUpload () {
      if (this.listQuery.areaId) {
        this.$refs.iUpload.$refs['upload-inner'].handleClick()
        this.handleImportHide()
      } else {
        this.$message({
          message: '上传前请先选择区域!',
          type: 'warning'
        })
      }
    },
    handleHttpRequest (files) {
      const areaId = this.listQuery.areaId
      const type = this.listQuery.type
      const file = new FormData()
      file.append('excel', files.file)
      file.append('name', files.file.name)
      handleRecordMaterialImport({
        type,
        areaId,
        params: file
      }).then(res => {
        if (res.code === 200) {
          this._handleMaterialRecordList()
          this.listQuery.areaId = ''
          this.$refs.iUpload.clearFiles()
          this.$message({
            message: '新增消防物资成功',
            type: 'success'
          })
        } else {
          this._handleMaterialRecordList()
          this.listQuery.areaId = ''
          this.$refs.iUpload.clearFiles()
          this.$message({
            message: '新增消防物资失败',
            type: 'warning'
          })
        }
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery.name = data.name
      this._handleMaterialRecordList()
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        handleMaterialRecordInfo({ id: data.id })
          .then(res => {
            if (res.data) {
              this.fileList = []
              if (res.data.gridMaterial.fileId) {
                this.fileList = [
                  Object.assign({}, res.data.gridMaterial, {
                    fileId: res.data.gridMaterial.fileId,
                    url: res.data.gridMaterial.fileSrc
                  })
                ]
              }
              if (
                res.data.gridMaterial.longitude &&
                res.data.gridMaterial.latitude
              ) {
                var lnglat = `${res.data.gridMaterial.longitude},${res.data.gridMaterial.latitude}`
              }
              const data = Object.assign({}, res.data.gridMaterial, {
                lnglat: lnglat || ''
              })
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 新增页面
    handleMaterialCreate (title) {
      this.operationStatus = 'create'
      this.formMaterialOption = {}
      this.fileList = []
      this.handleShow()
    },
    // 查看表单信息
    async handleMaterialView (data, title) {
      this.operationStatus = 'view'
      const detaile = await this._getListInfo(data)
      this.formMaterialOption = detaile
      this.handleShow()
    },
    // 编辑页面
    async handleMaterialEdit (data, title) {
      this.operationStatus = 'edit'
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (data.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          const detaile = await this._getListInfo(data[0])
          this.formMaterialOption = detaile
          this.handleShow()
        }
      } else {
        const detaile = await this._getListInfo(data)
        this.formMaterialOption = detaile
        this.handleShow()
      }
    },
    // 新增数据
    handleCreateData () {
      this.$refs.materialForm.validate(valid => {
        if (valid) {
          if (this.deleteFileList && this.deleteFileList.length > 0) {
            this._deletedFile()
          }
          const formData = Object.assign({}, this.formMaterialOption, {
            longitude: this.formMaterialOption.lnglat.split(',')[0],
            latitude: this.formMaterialOption.lnglat.split(',')[1],
            type: this.listQuery.type,
            fileId: this.handleFileIdInit(this.files),
            files: this.files
          })
          handleMaterialRecordSave(formData).then(res => {
            if (res.msg === 'ok') {
              this._handleMaterialRecordList()
              this.$message({
                message: '新增物资信息成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '新增物资信息失败',
                type: 'error'
              })
            }
          })
          this.handleHide()
        }
      })
    },
    // 更新数据
    handleUpdateData () {
      this.$refs.materialForm.validate(valid => {
        if (valid) {
          if (this.deleteFileList && this.deleteFileList.length > 0) {
            this._deletedFile()
          }
          const formData = Object.assign({}, this.formMaterialOption, {
            longitude: this.formMaterialOption.lnglat.split(',')[0],
            latitude: this.formMaterialOption.lnglat.split(',')[1],
            type: this.listQuery.type,
            fileId: this.handleFileIdInit(this.files),
            files: this.files,
            id: this.formMaterialOption.id
          })
          handleMaterialRecordUpdate(formData).then(res => {
            if (res.msg === 'ok') {
              this._handleMaterialRecordList()
              this.$message({
                message: '修改物资信息成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '修改物资信息失败',
                type: 'error'
              })
            }
          })
          this.handleHide()
        }
      })
    },
    // 删除数据
    deleteData (data) {
      let list = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          list.push(item.id)
        })
      } else {
        list = [data.id]
      }
      handleMaterialRecordDelete(list).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this._handleMaterialRecordList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    handleFileIdInit (array) {
      const arr = []
      array.forEach(item => {
        arr.push(item.fileId)
      })
      return String(arr)
    },
    handleShow () {
      this.dialogMaterialVisible = true
    },
    handleHide () {
      this.dialogMaterialVisible = false
      this.deleteFileList = []
    },
    // 详细地址改变时 清空经纬度
    addrChange () {
      this.formMaterialOption.lnglat = ''
    },
    // 地图重新定位
    refreshPosition () {
      this.$refs.positionPicker.mapPosition()
    },
    // 获取地图定位坐标
    upDateLnglat () {
      this.$refs.positionPicker.upDateLnglat()
      this.dialogVisible = false
    },
    // 打开地图定位页
    show (data) {
      this.dialogVisible = true
    },
    // 关闭地图定位页
    hide () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.material-dialog {
  .el-input-group__append {
    color: #e3eeff;
    border: 1px solid #00909d;
    background: #00909d;
  }

  .form-content {
    border-left: none !important;

    .el-form-item {
      border-left: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  .upload-content {
    margin-top: 10px;
  }
}
</style>
