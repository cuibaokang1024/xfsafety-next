<template>
  <div ref="content" class="dialog-content">
    <el-form ref="form" :model="ruleForm" :rules="rules" :disabled="disabled" label-width="100px">
      <el-col :span="12">
        <el-form-item label="按钮名称" prop="name">
          <el-input v-model="ruleForm.name" maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" :maxlength="5" />
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
        <el-form-item label="图标" prop="icon">
          <el-input v-model="ruleForm.icon" maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="授权标识" prop="permission">
          <el-input v-model="ruleForm.permission" maxlength="100" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="ruleForm.remark"
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
import { menuBtnSave, menuBtnUpdate } from '@/api/menu'
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
        Alias: '',
        icon: '',
        remarks: '',
        id: '',
        permission: ''
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
        name: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }, { validator: chkNumber, trigger: 'blur' }],
        parentName: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入授权标识', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入图标', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.ruleForm.sort) {
            this.ruleForm.sort = Number(this.ruleForm.sort)
          }
          menuBtnSave(this.ruleForm).then(res => {
            this.$emit('handleMenuList')
            this.$message({
              message: '新建按钮成功',
              type: 'success'
            })
          })
        }
      })
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.ruleForm.sort) {
            this.ruleForm.sort = Number(this.ruleForm.sort)
          }
          if (this.detail.id) {
            this.ruleForm.id = this.detail.id
          }
          menuBtnUpdate(this.ruleForm).then(res => {
            this.$emit('handleMenuList')
            this.$message({
              message: '修改按钮成功',
              type: 'success'
            })
          })
        } else {
          this.$message({
            message: '修改目录失败',
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
