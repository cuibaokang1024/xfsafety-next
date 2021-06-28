<template>
  <section class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('新增')">新增</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="list"
        :table-config="tableConfig"
        :border="false"
        @rowClick="handleView($event, '查看')"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column
          label="操作"
          align="left"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                icon="el-icon-edit-outline"
                type="success"
                circle
                @click.stop="handleEdit(row, '修改')"
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
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
        @pagination="_getBuildingList"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container dark buildingArea">
      <el-dialog
        v-if="dialogVisible"
        v-model:visible="dialogVisible"
        width="987px"
      >
        <div name="title" class="dialog-title">{{ title }}</div>
        <div class="dialog-content">
          <el-form
            ref="form"
            :model="formOption"
            :rules="rules"
            :disabled="operationStatus === 'view'"
          >
            <el-col :span="12">
              <el-form-item label="名称：" prop="name">
                <el-input
                  v-model="formOption.name"
                  placeholder="请输入内容"
                  autocomplete="off"
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地图区域：">
                <el-input
                  v-model="formOption.mapArea"
                  placeholder="请绘制地图区域"
                  class="input-with-select"
                >
                <template #append>
                  <el-button icon="el-icon-location"  @click="showDrawPolygon"></el-button>
                </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="floor">
              <el-form-item
                label="起止楼层："
                prop="startFloor"
                style="width: auto"
              >
                <el-input
                  v-model.number="formOption.startFloor"
                  class="el-table-input"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item style="text-align: left" prop="endFloor">
                <el-input
                  v-model.number="formOption.endFloor"
                  class="el-table-input"
                  autocomplete="off"
                />
                <el-button
                  class="record"
                  @click="generateFloor"
                >自动生成</el-button>
                <el-button class="add" @click="addFloor">新增</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="floorList">
                <el-table
                  v-loading="listLoading"
                  height="350px"
                  :data="formOption.floorList"
                  style="width: 100%"
                >
                  <el-table-column
                    label="序号"
                    width="80"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`floorList.${$index}.sort`"
                        :rules="rules.sort"
                      >
                        <el-input
                          v-model="row.sort"
                          class="edit-input"
                          size="small"
                          disabled
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="代码"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`floorList.${$index}.code`"
                        :rules="rules.code"
                      >
                        <el-input
                          v-model="row.code"
                          class="edit-input"
                          size="small"
                          maxlength="64"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="名称"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        :prop="`floorList.${$index}.floorName`"
                        :rules="rules.floorName"
                      >
                        <el-input
                          v-model="row.floorName"
                          class="edit-input"
                          size="small"
                          maxlength="50"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="平面图名称"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row, $index }">
                      <el-form-item :prop="`floorList.${$index}.planName`">
                        <el-input
                          v-model="row.planName"
                          class="edit-input"
                          size="small"
                          :disabled="!row.fileId"
                          maxlength="100"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="operationStatus === 'create'"
                    label="平面图"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row }">
                      <upload-file
                        ref="upload-file"
                        :del-flag="'file'"
                        :limit="1"
                        @uploadSuccess="uploadSuccess($event, row)"
                        @addDeleteFileList="addDeleteFileList"
                        @removeFile="removeFile($event, row)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else
                    label="平面图"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row }">
                      <upload-file
                        ref="upload-file"
                        :limit="1"
                        :del-flag="'file'"
                        :file-list="getShowFile(row.id)"
                        @uploadSuccess="uploadSuccess($event, row)"
                        @addDeleteFileList="addDeleteFileList"
                        @removeFile="removeFile($event, row)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="删除"
                    width="80"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template v-slot="{ row }">
                      <el-button
                        size="mini"
                        style="background: transparent; border: none"
                        @click="deleteFloor(row)"
                      >
                        <i
                          style="font-size: 20px; color: red"
                          class="el-icon-remove"
                        />
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="hide">关闭</el-button>
          <el-button
            v-if="operationStatus !== 'view'"
            type="primary"
            @click="operationStatus === 'create' ? createData() : updateData()"
          >确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="mapDialogVisible"
        ref="drawpolygon"
        class="drawpolygon"
        :destroy-on-close="true"
        v-model:visible="mapDialogVisible"
        width="930px"
      >
        <div name="title" class="dialog-title">地图定位</div>
        <div class="dialog-content">
          <draw-polygon
            ref="drawpolygon"
            :is-draw-building="true"
            :path="formOption.mapArea"
            @setPolygon="setPolygon"
          />
        </div>
        <div name="footer" class="dialog-footer">
          <el-button @click="startDrawPolygon">开始绘制</el-button>
          <el-button @click="clearPolygon">清除</el-button>
          <el-button @click="getPolygon">确定</el-button>
          <el-button @click="hideDrawPolygon">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import {
  getBuildingList,
  buildingDelete,
  delBuildingFile,
  saveBuilding,
  getBuildingInfo,
  delFloor,
  updateBuilding
} from '@/api/office'
import { deletedFile } from '@/api/uploadFile'

import '../style/supervisionUnit.scss'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import DrawPolygon from '@/components/bmap/drawPolygon'
import UploadFile from '@/components/uploadFile'

let idSeq = Date.now()

export default {
  /* 建筑区域管理 */
  name: '',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    DrawPolygon,
    UploadFile
  },
  data () {
    // 起止楼层校验
    const checkStartFloor = (rule, value, callback) => {
      if (!value) {
        if (value === 0) {
          callback(new Error('输入非0楼层'))
        } else {
          if (value > 160) {
            callback(new Error('输入楼层不可大于160层'))
          }
          callback()
        }
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('输入数字值'))
        } else {
          if (this.formOption.endFloor) {
            if (value > this.formOption.endFloor) {
              this.$refs.form.validateField('end')
            }
            callback()
          }
        }
      }
    }
    const checkEndFloor = (rule, value, callback) => {
      if (!value) {
        if (value === 0) {
          callback(new Error('输入非0楼层'))
        } else {
          if (value > 160) {
            callback(new Error('输入楼层不可大于160层'))
          } else {
            callback()
          }
        }
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('输入数字值'))
        } else {
          if (this.formOption.startFloor) {
            if (value < this.formOption.startFloor) {
              callback(new Error('终止楼层必须大于起始楼层'))
            } else {
              if (value - this.formOption.startFloor > 150) {
                callback(new Error('楼层区间不可超过150层'))
              } else {
                if (value > 160) {
                  callback(new Error('输入楼层不可大于160层'))
                }
                callback()
              }
            }
          }
        }
      }
    }
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      title: '',
      list: [],
      fileList: [],
      operationStatus: '',
      dialogVisible: false,
      mapDialogVisible: false,
      multipleSelection: [],
      searchFormOption: {
        config: [
          {
            type: 'text',
            label: '建筑/区域名称:',
            name: 'name',
            placeholder: '建筑/区域名称'
          }
        ]
      },
      tableConfig: [
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'center'
        },
        {
          prop: 'name',
          label: '建筑/区域名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'officeName',
          label: '所属单位',
          align: 'left',
          width: ''
        },
        {
          prop: 'updateDate',
          label: '更新时间',
          align: 'left',
          width: ''
        }
      ],
      delFileList: [], // 要删除的文件列表
      delPlanList: [], // 要删除的楼层列表
      delFlooList: [], // 要删除的楼层列表
      rules: {
        name: [
          { required: true, message: '请输入建筑/区域管理', trigger: 'change' }
        ],
        sort: [{ required: true, trigger: 'change', message: '请输入序号' }],
        code: [{ required: true, trigger: 'change', message: '请输入代码' }],
        floorName: [
          { required: true, trigger: 'change', message: '请输楼层名称' }
        ],
        startFloor: [{ validator: checkStartFloor, trigger: 'change' }],
        endFloor: [{ validator: checkEndFloor, trigger: 'change' }]
      },
      formOption: {}
    }
  },
  created () {
    this._getBuildingList()
  },
  methods: {
    // 获取列表
    _getBuildingList () {
      getBuildingList(this.listQuery).then((res) => {
        if (res.data) {
          this.list = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    // 获取列表详情信息
    _getListInfo (data) {
      return new Promise((resolve, reject) => {
        getBuildingInfo({ id: data.id })
          .then((res) => {
            if (res.data) {
              resolve(res.data)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 查询函数
    handleFilter (data) {
      this.listQuery.name = data.name
      this.ruleDate = data.date
      this._getBuildingList()
    },
    // 新增表单数据
    handleCreate (title) {
      this.operationStatus = 'create'
      this.title = title
      this.formOption = {
        startFloor: '',
        endFloor: '',
        name: '',
        mapArea: '',
        floorList: []
      }
      this.show()
    },
    // 表格选择checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 查看表单信息
    async handleView (data, title) {
      this.title = title
      this.operationStatus = 'view'
      const detaile = await this._getListInfo(data)
      this.formOption = detaile
      this.show()
      this.fileList = this.generateFileList(detaile.floorList)
    },
    // 编辑表单信息
    async handleEdit (data, title) {
      this.title = title
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
          this.formOption = detaile
          this.show()
          this.fileList = this.generateFileList(detaile.floorList)
        }
      } else {
        const detaile = await this._getListInfo(data)
        this.formOption = detaile
        this.show()
        this.fileList = this.generateFileList(detaile.floorList)
      }
    },
    // 删除表单数据
    handleDelete (data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let list = []
            if (Array.isArray(data)) {
              data.forEach((item) => {
                list.push(item.id)
              })
            } else {
              list = [data.id]
            }
            buildingDelete(list).then((res) => {
              if (res.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '删除建筑区域成功'
                })
                this._getBuildingList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // 自动生成
    generateFloor () {
      const { startFloor, endFloor } = this.formOption
      if (startFloor > 162) {
        this.$message({
          type: 'warning',
          message: '输入楼层不可大于160层'
        })
      } else if (endFloor > 162) {
        this.$message({
          type: 'warning',
          message: '输入楼层不可大于160层'
        })
      } else if (endFloor - startFloor > 150) {
        this.$message({
          type: 'warning',
          message: '楼层区间不可超过150层'
        })
      } else if (startFloor && endFloor) {
        let j = 1
        for (let i = startFloor; i <= endFloor; i++) {
          const str = i.toString()
          let name
          if (str.indexOf('-') !== -1) {
            name = `负${Math.abs(i)}层`
          } else {
            name = `${i}层`
          }
          if (i === 0) {
            continue
          }
          if (
            this.formOption.floorList.findIndex((item) => {
              return item.sort === j && item.flag === 'generate'
            }) === -1
          ) {
            this.formOption.floorList.push({
              generateId: ++idSeq,
              sort: j,
              code: i,
              floorName: name,
              planName: '',
              fileId: '',
              fileName: '',
              flag: 'generate'
            })
          }
          j++
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请在起止楼层处输入楼层数据'
        })
        this.$refs.form.validateField(['startFloor', 'endFloor'])
      }
    },
    // 新增楼层
    addFloor () {
      this.formOption.floorList.push({
        generateId: ++idSeq,
        flag: 'generate'
      })
    },
    // 删除楼层
    deleteFloor (data) {
      if (!data.generateId) {
        this.delFlooList.push(data.id)
      }
      this.formOption.floorList = this.formOption.floorList.filter((item) => {
        const id = item.id || item.generateId
        const delId = data.id || data.generateId
        return id !== delId
      })
    },
    // 生成显示文件列表
    generateFileList (data) {
      return data.map((item) => {
        const file = item.fileId
          ? [
            {
              name: item.fileName,
              id: item.fileId,
              planId: item.planId,
              url: item.fileUrl
            }
          ]
          : []
        return {
          id: item.id,
          file: file
        }
      })
    },
    // 获取显示文件
    getShowFile (id) {
      const index = this.fileList.findIndex((item) => {
        return item.id === id
      })
      if (index !== -1) {
        return this.fileList[index].file
      }
    },
    // 文件上传成功
    uploadSuccess (data, row) {
      this.formOption.floorList = this.formOption.floorList.map((item) => {
        const itemId = item.id || item.generateId
        const targetId = row.id || row.generateId
        return itemId === targetId
          ? {
            ...item,
            fileId: data.id,
            fileName: data.userFileName
          }
          : item
      })
    },
    addDeleteFileList (data) {
      this.delFileList.push(data.id)
      this.delPlanList.push(data.planId)
    },
    removeFile (file, row) {
      const id = row.id || row.generateId
      this.formOption.floorList = this.formOption.floorList.map((item) => {
        const itemId = item.id || item.generateId
        return itemId === id
          ? {
            ...item,
            fileId: '',
            fileName: ''
          }
          : item
      })
    },
    show () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    hide () {
      this.dialogVisible = false
    },
    showDrawPolygon () {
      this.mapDialogVisible = true
    },
    hideDrawPolygon () {
      this.mapDialogVisible = false
    },
    // 新增建筑区域
    createData () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          saveBuilding(this.formOption).then((res) => {
            if (res.msg === 'ok') {
              this.$message.success('新增建筑区域成功')
              this.hide()
              this._getBuildingList()
            }
          })
        }
      })
    },
    // 更新建筑区域
    updateData () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.delFlooList.length > 0) {
            await delFloor(this.delFlooList)
          }
          if (this.delFileList.length > 0) {
            this.delFileList.forEach((i) => {
              this.formOption.floorList = this.formOption.floorList.map((j) => {
                return j.fileId === i
                  ? {
                    ...j,
                    fileId: '',
                    fileName: ''
                  }
                  : j
              })
            })
            await delBuildingFile(this.delPlanList)
            await deletedFile(this.delFileList)
            this.delPlanList = []
            this.delFileList = []
          }
          updateBuilding(this.formOption).then((res) => {
            if (res.msg === 'ok') {
              this.$message.success('修改建筑区域成功')
              this.hide()
              this._getBuildingList()
            }
          })
        }
      })
    },
    setPolygon (data) {
      if (!data) {
        this.formOption.mapArea = ''
        return
      }
      let str = ''
      data.forEach((item) => {
        str += `${item.lng},${item.lat};`
      })
      this.formOption.mapArea = str
    },
    getPolygon () {
      this.$refs.drawpolygon.getPolygon()
      this.hideDrawPolygon()
    },
    clearPolygon () {
      this.$refs.drawpolygon.clear()
    },
    startDrawPolygon () {
      this.$refs.drawpolygon.draw()
    }
  }
}
</script>

<style lang="scss">
.buildingArea {
  .drawpolygon {
    .dialog-content {
      height: 389px;
      padding: 0;
    }
  }

  .el-dialog {
    .el-dialog__body {
      padding-top: 0;

      .dialog-content {
        .el-form {
          padding: 25px 10px 0 10px;
          background-color: rgba(255, 255, 255, 0.07);

          .el-form-item {
            display: flex;
          }

          .el-form-item__content {
            width: calc(100% - 102px);
          }

          .el-form-item__label {
            width: 116px;
            font-weight: normal;
            padding: 0;
          }

          .floor {
            display: flex;
            align-items: center;
            color: #97c1ff;

            .el-input {
              width: 81px;
              margin-right: 6px;
            }

            .el-form-item__content {
              width: auto;
            }
          }

          .floorList {
            .el-form-item {
              margin-top: 16px;
              margin-bottom: 16px !important;
            }

            .el-form-item__content {
              width: 100%;
            }
          }
        }
      }

      .el-input__inner {
        color: #85a6d6;
        background-color: rgba(255, 255, 255, 0.1);
        border-color: transparent;
      }
    }
  }
}
</style>
