<template>
  <el-dialog
    v-if="dialogVisible"
    class="formDialog dark"
    :title="formOption.title"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :visible.sync="dialogVisible"
    :width="formOption.width || width"
    :height="height"
    @close="close"
  >
    <div slot="title" class="dialog-title">{{ formOption.title }}</div>
    <div
      ref="content"
      v-loading="formLoading"
      :style="`height:${height}`"
      class="dialog-content"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#001647"
    >
      <el-form
        v-if="!formLoading"
        ref="form"
        :inline="true"
        :rules="formOption.rules"
        :disabled="disabled"
        :model="formModel"
        :status-icon="true"
        label-width="80px"
      >
        <form-items
          ref="formItems"
          :form-model.sync="formModel"
          :form-config="formOption.config"
        >
          <template v-for="item in slotList" v-slot:[item.name]>
            <slot :name="item.name" />
          </template>
        </form-items>
        <slot />
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-row v-if="additionStatus">
        <el-checkbox v-model="additionValue">是否连续添加</el-checkbox>
      </el-row>
      <el-button class="close" @click="hide()">关 闭</el-button>
      <el-button
        v-if="showConfirm"
        class="confirm"
        type="primary"
        @click="
          formOption.operationStatus === 'create' ? createData() : updateData()
        "
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import './style/index.scss'
import FormItems from './formItems'
export default {
  components: {
    FormItems
  },
  props: {
    // 表单配置项
    formOption: {
      type: Object,
      default: () => {}
    },
    // 是否更新表单数据
    isResetFormFlag: {
      type: Boolean,
      default: false
    },
    formLoading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '830px'
    },
    watchs: {
      // 遍历watchs监听属性改变触发dataChange事件，若需要监听某个或多个属性的变化改变其他属性值
      type: Array,
      default: () => []
    },
    submitStatus: {
      type: String,
      default: 'success'
    },
    height: {
      type: String,
      default: '389px'
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    additionFlag: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      additionValue: false,
      resFlag: true,
      loading: true,
      formModel: {}
    }
  },
  computed: {
    // 是否可编辑
    disabled() {
      return this.formOption.operationStatus.indexOf('view') !== -1
    },
    // 是否显示确认按钮
    showConfirm() {
      return this.formOption.operationStatus !== 'view'
    },
    additionStatus() {
      return this.additionFlag && this.formOption.operationStatus === 'create'
    },
    resCode() {
      return this.resFlag
    },
    // 自定义插槽
    slotList() {
      return this.formOption.config.filter((item, index) => {
        return item.type === 'slot'
      })
    }
  },
  watch: {
    isResetFormFlag() {
      this.formModelProcess()
    }
  },
  methods: {
    formModelProcess() {
      const formObj = {}
      this.formOption.config.forEach((e) => {
        const nameVal = e.name
        const treeSelect = e.treeSelectOption
        if (e.type === 'slot') {
          return
        }
        if (!nameVal) {
          console.error('[oa form warn]: 存在未配置name或者name为空的表单项')
          return
        }
        if (treeSelect) {
          formObj[treeSelect.name] = this.formOption.data[treeSelect.name]
        }
        if (
          typeof this.formOption.data[nameVal] !== 'number' &&
          typeof e.defaultValue === 'number'
        ) {
          this.formOption.data[nameVal] = e.dataList[0].index
        }
        formObj[nameVal] = this.checkValue(this.formOption.data[nameVal])
          ? this.formOption.data[nameVal]
          : this.getItemDefaultValue(e)
      })
      this.formModel = Object.assign({}, formObj)
    },
    // 值为空判断
    checkValue(val) {
      return val || val === 0
    },
    // 默认值
    getItemDefaultValue(item) {
      return item.value
        ? item.value
        : item.type === 'checkbox'
          ? []
          : item.type === 'number'
            ? undefined
            : null
    },
    hide() {
      // 清空校验
      // this.$refs.form.clearValidate()
      this.dialogVisible = false
      this.$emit('formHide')
    },
    close() {
      this.$emit('formHide')
    },
    show() {
      this.dialogVisible = true
      if (this.watchs.length) {
        this.watchs.forEach((item) => {
          this.$watch(`formModel.${item}`, function() {
            this.$emit('dataChange', this.formModel)
          })
        })
      }
    },
    // 新增表单数据
    createData() {
      this.submitData('createData')
    },
    // 更新表单数据
    updateData() {
      this.submitData('updateData')
    },
    validateField(val) {
      this.$refs.form.validateField(val)
    },
    submitData(operationName) {
      this.$refs.formItems.submitData()
      const data = Object.assign({}, this.formModel)
      // 表单校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit(operationName, data, (val) => {
            if (val) {
              this.formModel = {}
            }
          })
          this.$nextTick(() => {
            if (this.submitStatus === 'success') {
              // 如果有自定义校验不通过或者提交失败则不隐藏表单
              if (!this.additionValue) {
                this.hide()
              }
            } else {
              return
            }
          })
        } else {
          return
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
