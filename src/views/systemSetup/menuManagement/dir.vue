<template>
  <div ref="content" class="dialog-content">
    <el-form ref="form" :model="ruleForm" :rules="rules" :disabled="disabled" label-width="100px">
      <el-col :span="12">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="ruleForm.name" maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" :maxlength="5" />
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
import { menuDirSave, menuDirUpdate } from '@/api/menu'
import { isOnlyNumber } from '@/utils'

export default {
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
        Alias: '',
        remarks: '',
        id: ''
      },
      rules: {
        name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }, { validator: chkNumber, trigger: 'blur' }]
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
          menuDirSave(this.ruleForm).then(res => {
            this.$emit('handleMenuList')
            this.$message({
              message: '新建目录成功'
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
          menuDirUpdate(this.ruleForm).then(res => {
            this.$emit('handleMenuList')
            this.$message({
              type: 'success',
              message: '修改目录成功'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '修改目录失败'
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
