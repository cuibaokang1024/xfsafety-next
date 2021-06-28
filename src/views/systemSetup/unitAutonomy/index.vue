<template>
  <div class="inspect-main">
    <div>
      <el-table
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#001647"
        :data="tableData"
        row-key="id"
        @row-click="handleCheck"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="菜单ID" />
        <el-table-column prop="name" label="菜单原名" />
        <el-table-column prop="name" label="菜单名称" :formatter="formatterName" />
        <el-table-column prop="parentName" label="上级菜单" />
        <el-table-column prop="icon" label="图标">
          <template v-slot="{ row }">
            <i :class="row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template v-slot="{ row }">
            <div class="type-btn" :style="{ borderColor: row.type === 1 ? '#00EAFF' : row.type === 0 ? '#0096f' : '#ffd800' }">{{ row.type | typeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序号" />
        <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-tooltip content="修改" placement="top">
              <el-button icon="el-icon-edit-outline" type="success" circle @click.stop="handleEdit(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="formDialog dark menuForm"
      v-model:visible="centerDialogVisible"
      center
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div class="menu-box">
        <span class="menu-type-box">请选择菜单类型：</span>
        <el-radio-group v-model="tabPosition" class="radio-group" style="margin-bottom: 30px;">
          <el-radio v-for="item in radioBtn" :key="item.value" class="radio-group-content" :disabled="item.disabled" :label="item.value" border>{{ item.label }}</el-radio>
        </el-radio-group>
        <keep-alive>
          <component :is="componentList" :ref="componentList" :disabled="disabled" @handleunitAutonomyList="handleunitAutonomyList" />
        </keep-alive>
      </div>
      <span name="footer" class="dialog-footer">
        <el-button class="close" @click="close()">取 消</el-button>
        <el-button v-if="!disabled" type="primary" class="submit" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import '../styles/index.scss'
import '@/components/baseForm/style/index.scss'
import { unitAutonomyList, menuRadioBtn, unitAutonomyDetail } from '@/api/menu'
import buttonCom from './button'
import dirCom from './dir'
import menuCom from './menu'

export default {
  name: 'MenuManagement',
  components: {
    buttonCom,
    menuCom,
    dirCom
  },
  filters: {
    typeName (data) {
      if (data === 0) {
        return '目录'
      } else if (data === 1) {
        return '菜单'
      } else {
        return '按钮'
      }
    }
  },
  data () {
    return {
      disabled: false,
      componentList: 'dirCom',
      title: '新增菜单',
      centerDialogVisible: false,
      tabPosition: 0,
      tableData: [],
      multipleSelection: [],
      flag: '',
      radioBtn: [],
      detail: {},
      listLoading: false
    }
  },
  created () {
    this._unitAutonomyList()
    this._menuRadioBtn()
  },
  methods: {
    _menuRadioBtn () {
      menuRadioBtn().then(res => {
        res.data.map(val => {
          val.value = Number(val.value)
          val.disabled = true
        })
        this.radioBtn = res.data
      })
    },
    _unitAutonomyList () {
      this.listLoading = true
      unitAutonomyList().then(res => {
        this.tableData = res.data
        this.listLoading = false
      })
    },
    judge (data, flag) {
      this._unitAutonomyDetail(data, flag)
    },
    handleEdit (row) {
      this.flag = 'update'
      this.judge(row, this.flag)
    },
    handleCheck (row) {
      this.flag = 'check'
      this.judge(row, this.flag)
    },
    _unitAutonomyDetail (data, flag) {
      unitAutonomyDetail({ id: data.id }).then(res => {
        this.title = flag === 'check' ? '查看菜单' : '修改菜单'
        this.changeTag(res.data.menu.type)
        this.detail = res.data.menu
        this.centerDialogVisible = true
        if (flag === 'check') {
          this.disabled = true
        } else {
          this.disabled = false
        }
        this.$nextTick(() => {
          for (const key in this.$refs[this.componentList].ruleForm) {
            this.$refs[this.componentList].ruleForm[key] = res.data.menu[key]
          }
          if (!this.$refs[this.componentList].ruleForm.alias) {
            this.$refs[this.componentList].ruleForm.alias = this.$refs[this.componentList].ruleForm.name
          }
        })
      })
    },
    submitBtn () {
      this.$refs[this.componentList].submit()
    },
    handleunitAutonomyList () {
      // this.$refs[this.componentList].clear()
      this.centerDialogVisible = false
      this.detail = {}
      this._unitAutonomyList()
    },
    changeTag (value) {
      this.tabPosition = value
      if (value === 0) {
        this.componentList = 'dirCom'
      } else if (value === 1) {
        this.componentList = 'menuCom'
      } else {
        this.componentList = 'buttonCom'
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    formatterName (row) {
      if (row.alias) {
        return row.alias
      } else {
        return row.name
      }
    },
    close () {
      this.$refs[this.componentList].clear()
      this.detail = {}
      this.centerDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.type-btn {
  border-width: 1px;
  border-style: solid;
  text-align: center;
  border-radius: 20px;
  width: 60px;
}
</style>
<style lang="scss">
.menuForm {
  .el-dialog {
    width: 850px;
  }
  .menu-box {
    min-height: 100%;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
  }
  .menu-type-box {
    display: block;
    color: white;
    margin-bottom: 15px;
  }
  .el-select {
    width: 100% !important;
  }
  .el-form-item {
    margin-bottom: 15px !important;
  }
  .is-checked {
    border: none;
    background: #2865F1;
    .el-radio__label {
      color: #fff;
    }
  }
  .radio-group {
    .el-radio {
        color: #fff;
        margin-right: 0;
        background: #1B439F;
        border: none;
    }
    .el-radio__input  {
      background: transparent !important;
    }
  }
  .el-dialog__footer {
    border-top: none;
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
      .el-button {
        border: none;
      }
      .submit {
        background: #006491;
        color: #fff;
      }
      .close {
        background: #A9C3FF;
        color: #001647;
      }
    }
}
</style>
