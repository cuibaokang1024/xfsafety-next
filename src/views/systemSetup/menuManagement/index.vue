<template>
  <div class="inspect-main">
    <div class="filter-box">
      <el-button class="add" @click="handleCreate()">添加</el-button>
    </div>
    <div class="table-box" style="height: 100%">
      <el-table
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#001647"
        :data="tableData"
        :height="'100%'"
        row-key="id"
        @row-click="handleCheck"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="菜单名称" />
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
        <el-table-column prop="path" label="菜单URL" />
        <el-table-column prop="permission" label="授权标识" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-tooltip content="修改" placement="top">
              <el-button icon="el-icon-edit-outline" type="success" circle @click.stop="handleEdit('update',row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button icon="el-icon-delete" type="danger" circle @click.stop="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="formDialog dark menuForm"
      v-model:visible="centerDialogVisible"
      center
      @close="close()"
    >
      <div name="title" class="dialog-title">{{ title }}</div>
      <div class="menu-box">
        <span class="menu-type-box">请选择菜单类型：</span>
        <el-radio-group v-model="tabPosition" class="radio-group" style="margin-bottom: 30px;" @change="changeTag">
          <el-radio v-for="item in radioBtn" :key="item.value" class="radio-group-content" :disabled="item.disabled" :label="item.value" border>{{ item.label }}</el-radio>
        </el-radio-group>
        <keep-alive>
          <div>
            <buttonCom v-show="componentList === 'buttonCom'" ref="buttonCom" :detail="detail" :disabled="disabled" @handleMenuList="handleMenuList" />
            <dirCom v-show="componentList === 'dirCom'" ref="dirCom" :detail="detail" :disabled="disabled" @handleMenuList="handleMenuList" />
            <menuCom v-show="componentList === 'menuCom'" ref="menuCom" :detail="detail" :disabled="disabled" @handleMenuList="handleMenuList" />
          </div>
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
import { menuList, menuRadioBtn, menuDetail, menuDelete } from '@/api/menu'
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
      title: '新建菜单',
      centerDialogVisible: false,
      tabPosition: 0,
      tableData: [],
      multipleSelection: [],
      radioBtn: [],
      detail: {},
      listLoading: false
    }
  },
  created () {
    this._menuList()
    this._menuRadioBtn()
  },
  methods: {
    _menuRadioBtn () {
      menuRadioBtn().then(res => {
        res.data.map(val => {
          val.value = Number(val.value)
          val.disabled = false
        })
        this.radioBtn = res.data
      })
    },
    _menuList () {
      this.listLoading = true
      menuList().then(res => {
        this.tableData = res.data
        this.listLoading = false
      })
    },
    handleCreate () {
      this.title = '新建菜单'
      this.centerDialogVisible = true
      this.disabled = false
      this.radioBtn.map(val => {
        val.disabled = false
      })
      this.changeTag(0)
    },
    judge (flag, data) {
      this._menuDetail(data, flag)
    },
    handleEdit (flag, data) {
      this.judge(flag, data)
    },
    handleCheck (row) {
      this.judge('check', row)
    },
    _menuDetail (data, flag) {
      menuDetail({ id: data.id }).then(res => {
        this.title = flag === 'check' ? '查看菜单' : '修改菜单'
        this.changeTag(res.data.menu.type)
        if (res.data.menu.parentId === '10000') {
          res.data.menu.parentId = ''
        }
        this.detail = res.data.menu
        this.centerDialogVisible = true
        if (flag) {
          if (flag === 'check') {
            this.disabled = true
          } else {
            this.disabled = false
          }
          this.radioBtn.map(val => {
            val.disabled = true
          })
        } else {
          this.disabled = false
          this.radioBtn.map(val => {
            val.disabled = false
          })
        }
        this.$nextTick(() => {
          for (const key in this.$refs[this.componentList].ruleForm) {
            this.$refs[this.componentList].ruleForm[key] = res.data.menu[key]
          }
        })
      })
    },
    // 删除表单数据
    handleDelete (data) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let list = []
          if (Array.isArray(data)) {
            data.forEach(item => {
              list.push(item.id)
            })
          } else {
            list = [data.id]
          }
          menuDelete(list).then(res => {
            if (res.msg === 'ok') {
              this.$message({
                type: 'success',
                message: '删除菜单成功'
              })
              this._menuList()
            } else {
              this.$message({
                type: 'error',
                message: '删除菜单失败'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitBtn () {
      if (this.detail.id) {
        this.$refs[this.componentList].update()
      } else {
        this.$refs[this.componentList].submit()
      }
    },
    handleMenuList () {
      this.close()
      this._menuList()
    },
    changeTag (value, flag) {
      this.tabPosition = value
      if (value === 0) {
        this.componentList = 'dirCom'
      } else if (value === 1) {
        this.componentList = 'menuCom'
      } else {
        this.componentList = 'buttonCom'
      }
      this.$nextTick(() => {
        if (this.title === '新建菜单') {
          this.$refs[this.componentList].ruleForm.parentId = ''
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    close () {
      const arrType = ['buttonCom', 'dirCom', 'menuCom']
      arrType.map(item => {
        this.$refs[item].clear()
      })
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
