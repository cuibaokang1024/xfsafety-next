<template>
  <div class="grid-draw">
    <DrawPolygon ref="drawpolygon" :polygon-list="polygonList" @setPolygon="setPolygon" @setPolygonPath="setPolygonPath" @editGraphics="editGraphics" @editPolygonInfo="editPolygonInfo" @deletePolygon="deletePolygon" />
    <div v-show="!isEditGraphics" class="draw-tools">
      <el-button @click="startDrawPolygon">绘制</el-button>
      <el-button @click="savePolygonInfo">保存</el-button>
      <el-button @click="clearPolygon">清除</el-button>
      <el-button @click="polygonPosition">定位</el-button>

    </div>
    <div v-show="isEditGraphics" class="draw-tools">
      <el-button @click="saveEdit">保存编辑</el-button>
      <el-button @click="cancelEdit">取消编辑</el-button>
    </div>
    <el-dialog v-if="dialogVisible" class="polygonInfoForm dark" width="887px" v-model:visible="dialogVisible">
      <div name="title" class="dialog-title">区划设置</div>
      <div class="dialog-content" style="height: 360px; padding-right: 15px;overflow-y: auto;">
        <el-form
          ref="form"
          label-width="120px"
          :inline="true"
          :model="formData"
          :rules="rules"
        ><div class="form-content">
          <el-col :span="12">
            <el-form-item label="行政区划：" prop="areaId">
              <tree-select
                v-model:value="formData.areaId"
                v-model:label="formData.areaName"
                :tree-select-option="areaSelectOption"
              />
            </el-form-item>
            <!-- <el-form-item v-else label="行政2区划：">
              <tree-select
                :value.sync="formData.areaId"
                :label.sync="formData.areaName"
                :tree-select-option="areaSelectOption"
              />
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="背景色：" prop="bgColor">
              <el-color-picker v-model="formData.bgColor" style="display: inherit" show-alpha />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="区划路径：" prop="points">
              <el-input v-model="formData.points" disabled class="input-with-select">
                 <template #append><el-button v-if="isDistrictSearch" icon="el-icon-search" @click="districtSearch" /></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小层级：" prop="minLevel">
              <el-input v-model="formData.minLevel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大层级：" prop="maxLevel">
              <el-input v-model="formData.maxLevel" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容：" prop="remarks">
              <el-input v-model="formData.remarks" type="textarea" />
            </el-form-item>
          </el-col>
        </div>
        </el-form>
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hidePolygonInfoForm">取 消</el-button>
        <el-button type="primary" @click="operationStatus==='create' ? createData(): updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import DrawPolygon from '@/components/bmap/drawPolygon'
import TreeSelect from '@/components/treeSelect'
import { savePolygonInfo, getPolygonList, updatePolygonInfo, deletePolygonInfo, isExistence } from '@/api/map'
export default {
  name: 'IndustryDirectors',
  components: {
    DrawPolygon,
    TreeSelect
  },
  data () {
    var checkArea = (rule, value, callback) => {
      if (this.currentPolygonAreaId === this.formData.areaId) {
        callback()
      } else {
        isExistence({ areaId: value }).then((res) => {
          if (!res.data) {
            callback()
          } else {
            callback(new Error('该区域已存在'))
          }
        })
      }
    }
    return {
      dialogVisible: false,
      areaSelectOption: {
        title: '选择区域',
        request: {
          url: 'system/api/area/treeData',
          params: {}
        }
      },
      isEditGraphics: false, // 编辑图形
      operationStatus: '',
      polygonList: [],
      formData: {
        areaId: null,
        areaName: null,
        bgColor: null,
        maxLevel: null,
        minLevel: null,
        points: null,
        remarks: null
      },
      isDistrictSearch: false,
      currentPolygonAreaId: '', // 当前编辑的多边形区域id 若改变areaId需要加重复校验 否则不加
      rules: {
        areaId: [
          { required: true, message: '请选择区域', trigger: 'blur' },
          { validator: checkArea, trigger: 'change' }
        ],
        bgColor: [
          { required: true, trigger: 'blur', message: '请选择背景颜色' }
        ],
        maxLevel: [
          { required: true, trigger: 'blur', message: '请选择最大层级' }
        ],
        minLevel: [
          { required: true, trigger: 'blur', message: '请选择最小层级' }
        ]
      }
    }
  },
  mounted () {
    this._getPolygonList()
  },
  methods: {
    // 获取行政区划信息
    _getPolygonList () {
      getPolygonList().then((res) => {
        if (res.data) {
          this.polygonList = res.data
          this.$refs.drawpolygon.initDrawMap()
        }
      })
    },
    // 隐藏行政区划表单
    hidePolygonInfoForm () {
      this.dialogVisible = false
      this.isDistrictSearch = false
      this.currentPolygonAreaId = ''
      this.formData.points = ''
      if (this.isEditGraphics) {
        this.isEditGraphics = false
        this.$refs.drawpolygon.cancelEditGraphics()
      }
    },
    // 显示行政区划表单
    showPolygonInfoForm () {
      this.dialogVisible = true
    },
    // 根据区域名称调用地图搜索API获取行政区划边界信息
    districtSearch () {
      if (!this.formData.areaName) {
        return
      }
      this.$refs.drawpolygon.districtSearch(this.formData.areaName)
    },
    // 清除绘制的多边形
    clearPolygon () {
      this.$refs.drawpolygon.clear()
    },
    // 开始绘制
    startDrawPolygon () {
      this.$refs.drawpolygon.draw()
    },
    // 设置当前表单points为绘制的多边形边界信息
    setPolygon (data) {
      const path = data.map((item) => {
        return `${item.lng},${item.lat}`
      })
      this.formData.points = path.join(';')
    },
    // 设置当前表单points为搜索后的行政区划边界信息
    setPolygonPath (data) {
      if (!(data && data.boundaries && data.boundaries.length > 0)) {
        this.$message({
          message: '未能搜索到该区域边界信息，请手动绘制',
          typr: 'info'
        })
        this.formData.points = ''
        return
      }
      const path = data.boundaries.slice(-1)[0].map((item) => {
        return `${item.lng},${item.lat}`
      })
      this.formData.points = path.join(';')
    },
    // 保存绘制的行政区划信息
    savePolygonInfo () {
      this.operationStatus = 'create'
      this.$refs.drawpolygon.getPolygon()
      if (this.formData.points) {
        this.formData = { ...this.formData, areaId: '', areaName: '', bgColor: '', maxLevel: '', minLevel: '', remarks: '' }
        this.showPolygonInfoForm()
      }
    },
    polygonPosition () {
      this.operationStatus = 'create'
      this.isDistrictSearch = true
      this.formData = { areaId: '', areaName: '', bgColor: '', maxLevel: '', minLevel: '', points: '', remarks: '' }
      this.showPolygonInfoForm()
    },
    editPolygonInfo (data) {
      this.operationStatus = 'update'
      this.currentPolygonAreaId = data.area.id
      const { id, areaName, bgColor, points, remarks, maxLevel, minLevel } = { ...data }
      const areaId = data.area.id
      this.formData = { id, areaId, areaName, bgColor, points, remarks, maxLevel, minLevel }
      this.showPolygonInfoForm()
    },
    editGraphics (data) {
      this.isEditGraphics = true
      this.operationStatus = 'update'
      this.currentPolygonAreaId = data.area.id
      this.$refs.drawpolygon.editGraphics(data)
      const { id, areaName, bgColor, remarks, maxLevel, minLevel } = { ...data }
      const areaId = data.area.id
      this.formData = { id, areaId, areaName, bgColor, remarks, maxLevel, minLevel }
    },
    // 保存多边形编辑信息
    saveEdit () {
      this.$refs.drawpolygon.getPolygon()
      this.showPolygonInfoForm()
    },
    // 取消多边形编辑
    cancelEdit () {
      this.isEditGraphics = false
      this.$refs.drawpolygon.cancelEditGraphics()
    },
    deletePolygon (data) {
      this.$confirm('确认删除该网格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePolygonInfo([data.id]).then((res) => {
          if (res.msg === 'ok') {
            this.$message({
              type: 'success',
              message: '删除网格成功'
            })
            this._getPolygonList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          savePolygonInfo(this.formData).then((res) => {
            if (res.msg === 'ok') {
              this.$message.success('保存区域设置成功')
              this.$refs.drawpolygon.clear()
              this.hidePolygonInfoForm()
              this._getPolygonList()
            }
          })
        }
      })
    },
    updateData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updatePolygonInfo(this.formData).then((res) => {
            if (res.msg === 'ok') {
              this.$message.success('修改网格信息成功')
              this.hidePolygonInfoForm()
              this._getPolygonList()
            }
          })
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .grid-draw{
    width: 100%;
    height: 100%;
    padding: 0;
    .draw-tools{
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
    }
  }
</style>
<style lang="scss">
  .districtSearch{
    .el-dialog__body{
      padding-top: 0!important;
    }
  }
</style>
