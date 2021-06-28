<template>
  <div ref="content" class="dialog-content">
    <el-form ref="form" class="menuFormBox" :model="ruleForm" :disabled="disabled" :rules="rules" label-width="130px">
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm.name" :maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="上级菜单" prop="parentName">
          <tree-select
            :value.sync="ruleForm.parentId"
            :label.sync="ruleForm.parentName"
            :tree-select-option="treeSelectOption"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单path" prop="href">
          <el-input v-model="ruleForm.href" maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单target" prop="target">
          <el-input v-model="ruleForm.target" maxlength="200" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单component" prop="component">
          <el-input v-model="ruleForm.component" maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" :maxlength="5" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单是否显示在左侧" prop="hidden">
          <el-radio-group v-model="ruleForm.hidden">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否缓存" prop="nocache">
          <el-radio-group v-model="ruleForm.nocache">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="授权标识" prop="permission">
          <el-input v-model="ruleForm.permission" maxlength="100" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否隐藏tag" prop="invisibleTag">
          <el-radio-group v-model="ruleForm.invisibleTag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="图标" prop="icon">
          <el-input v-model="ruleForm.icon" maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注信息" prop="remarks">
          <el-input
            v-model="ruleForm.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import TreeSelect from '@/components/treeSelect'
import { menuMenuSave, menuMenuUpdate } from '@/api/menu'
import { isOnlyNumber } from '@/utils'

export default {
  components: {
    TreeSelect
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var chkNumber = (rule, value, callback) => {
      if (value === 0) {
        callback()
      } else {
        if (isOnlyNumber(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: {
        name: '',
        sort: '',
        parentId: '',
        parentName: '',
        href: '',
        Alias: '',
        target: '',
        icon: '',
        remarks: '',
        component: '',
        hidden: 0,
        invisibleTag: 0,
        nocache: 1,
        permission: '',
        id: ''
      },
      treeSelectOption: {
        title: '选择上级菜单',
        name: 'areaName',
        request: {
          url: `system/sys/menu/sysMenulist`,
          params: {}
        }
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        href: [{ required: true, message: '请输入菜单path', trigger: 'blur' }],
        target: [{ required: true, message: '请输入菜单name', trigger: 'blur' }],
        component: [{ required: true, message: '请输入菜单component', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入授权标识', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { validator: chkNumber, trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请输入图标', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (this.ruleForm.sort) {
          this.ruleForm.sort = Number(this.ruleForm.sort)
        }
        if (valid) {
          menuMenuSave(this.ruleForm).then(res => {
            this.$emit('handleMenuList')
            this.$message({
              message: '新建菜单成功',
              type: 'success'
            })
          })
        }
      })
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (this.ruleForm.sort) {
          this.ruleForm.sort = Number(this.ruleForm.sort)
        }
        if (this.detail.id) {
          this.ruleForm.id = this.detail.id
        }
        if (valid) {
          menuMenuUpdate(this.ruleForm).then(res => {
            this.$emit('handleMenuList')
            this.$message({
              message: '修改菜单成功',
              type: 'success'
            })
          })
        } else {
          this.$message({
            message: '修改菜单失败',
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss">
.menuFormBox {
  .is-checked {
    background: transparent !important;
  }
  .el-form-item__content {
    width: calc(100% - 130px) !important;
  }
}
</style>
