<template>
  <div ref="content" class="dialog-content">
    <el-form ref="form" :model="ruleForm" :rules="rules" :disabled="disabled" label-width="100px">
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" :maxlength="5" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="目录别名" prop="alias">
          <el-input v-model="ruleForm.alias" :maxlength="64" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="目录原名" prop="name">
          <el-input v-model="ruleForm.name" disabled />
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import { unitAutonomyMenuSave } from '@/api/menu'
import { isOnlyNumber } from '@/utils'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
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
        alias: '',
        id: ''
      },
      rules: {
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }, { validator: chkNumber, trigger: 'blur' }],
        alias: [{ required: true, message: '请输入目录别名', trigger: 'blur' }]
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
          unitAutonomyMenuSave(this.ruleForm).then(res => {
            this.$emit('handleunitAutonomyList')
            this.$message({
              message: '修改目录成功',
              type: 'success'
            })
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
