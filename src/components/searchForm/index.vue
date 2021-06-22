<script type="text/javascript">
import TreeSelect from '@/components/treeSelect'
import UnitSelect from '@/components/UnitSelect'

export default {
  name: 'SearchForm',
  components: {
    TreeSelect,
    UnitSelect
  },
  props: {
    formOption: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultStyle: '',
      formModel: {},
      treeSelectOption: {
        title: '',
        request: {},
        model: ''
      }
    }
  },
  mounted () {
    this.formModelProcess()
  },
  methods: {
    handleFilter () {
      this.$emit('search', { ...this.formModel, page: 1, limit: 10 })
    },
    handleDateChange () {
      this.$emit('dateChange', this.formModel)
    },
    reset () {
      this.$emit('reset')
      this.formModelProcess()
    },
    getSearchQuery () {
      return this.formModel
    },
    formModelProcess () {
      const formObj = {}
      this.getFormItems().forEach(e => {
        const nameVal = e.name
        const treeSelect = e.treeSelectOption
        if (!nameVal) {
          console.error('[oa form warn]: 存在未配置name或者name为空的表单项')
          return
        }
        if (treeSelect) {
          formObj[treeSelect.name] = ''
        }
        formObj[nameVal] = ''
        if (typeof e.defaultValue === 'number') {
          formObj[nameVal] = e.dataList[e.defaultValue].value
        }
      })
      this.formModel = Object.assign({}, formObj)
    },
    getFormItems () {
      return this.formOption.config || []
    },
    // 生成设备单位设置
    generateUnitSelect (item) {
      return (
        <unit-select
          value={this.formModel[item.name]}
          {...{
            on: {
              'update:value': val => (this.formModel[item.name] = val)
            }
          }}
          label={this.formModel[item.unit]}
          {...{
            on: {
              'update:label': val => (this.formModel[item.unit] = val)
            }
          }}
        />
      )
    },
    // 生成列表
    generateList (itemObj) {
      const itemEle = []
      for (let index = 0; index < itemObj.dataList.length; index++) {
        const item = itemObj.dataList[index]
        switch (itemObj.type) {
          // 下拉菜单
          case 'select':
            itemEle.push(
              <el-option
                key={item.value}
                label={item.label}
                value={item.value}
              ></el-option>
            )
            break
          // 多选框
          case 'checkbox':
            itemEle.push(
              <el-checkbox label={item.index}>{item.text}</el-checkbox>
            )
            break
          // 单选框
          case 'radio':
            itemEle.push(<el-radio label={item.index}>{item.text}</el-radio>)
            break
        }
      }
      return itemEle
    },
    // 生成下拉菜单
    generateSelect (item) {
      return (
        <el-select
          v-model={this.formModel[item.name]}
          placeholder={item.placeholder}
          clearable={true}
          style={item.style || this.defaultStyle}
        >
          {this.generateList(item)}
        </el-select>
      )
    },
    // 生成树形结构选择框
    generateTreeSelect (item) {
      return (
        // eslint-disable-next-line no-return-assign
        <div>
          <tree-select
            treeSelectOption={item.treeSelectOption}
            value={this.formModel[item.name]}
            {...{
              on: { 'update:value': val => (this.formModel[item.name] = val) }
            }}
            label={this.formModel[item.treeSelectOption.name]}
            {...{
              on: {
                'update:label': val =>
                  (this.formModel[item.treeSelectOption.name] = val)
              }
            }}
          />
        </div>
      )
    },
    // 生成多选框
    generateCheckbox (item) {
      return (
        <el-checkbox-group v-model={this.formModel[item.name]}>
          {this.generateList(item)}
        </el-checkbox-group>
      )
    },
    // 生成单选
    generateRadio (item) {
      return (
        <div class='oa-form-item'>
          <el-radio-group v-model={this.formModel[item.name]}>
            {this.generateList(item)}
          </el-radio-group>
        </div>
      )
    },
    // 生成日期选择器
    generateDate (item) {
      return (
        <el-date-picker
          v-model={this.formModel[item.name]}
          type={item.type}
          picker-options={item.pickerOptions || {}}
          value-format={item.valueFormat || 'yyyy-MM-dd'}
          placeholder={item.placeholder || '请选择日期'}
          range-separator='——'
          start-placeholder='开始日期'
          end-placeholder='结束日期'
          {...{
            on: {
              change: this.handleDateChange
            }
          }
          }
        />
      )
    },
    // 生成日期和时间范围选择器
    generateRangeDate (item) {
      return (
        <el-date-picker
          v-model={this.formModel[item.name]}
          type={item.type}
          value-format={item.valueFormat || 'yyyy-MM-dd'}
          range-separator='——'
          start-placeholder='开始日期'
          end-placeholder='结束日期'
        ></el-date-picker>
      )
    },
    // 生成输入框
    generateInput (item) {
      return (
        <el-input
          v-model={this.formModel[item.name]}
          type={item.type}
          placeholder={item.placeholder}
          style={item.style || this.defaultStyle}
          maxlength={item.maxlength}
        ></el-input>
      )
    },
    generateSlot (item) {
      const name = item.name
      return <div>{this.$slots[name]}</div>
    },
    generateFormItems (items = []) {
      const ele = []
      items.forEach(item => {
        let itemEle = ''
        switch (item.type) {
          // 生成设备单位设置
          case 'unitSelect':
            itemEle = this.generateUnitSelect(item)
            break
          // 下拉菜单
          case 'select':
            itemEle = this.generateSelect(item)
            break
          // 树形结构选择器
          case 'treeSelect':
            itemEle = this.generateTreeSelect(item)
            break
          // 多选框
          case 'checkbox':
            itemEle = this.generateCheckbox(item)
            break
          // 单选框
          case 'radio':
            itemEle = this.generateRadio(item)
            break
          case 'slot':
            itemEle = this.generateSlot(item)
            break
          // 日期选择框
          case 'date':
            itemEle = this.generateDate(item)
            break
          // 日期时间选择框
          case 'datetime':
            itemEle = this.generateDate(item)
            break
          // 双选日期选择框
          case 'daterange':
            itemEle = this.generateDate(item)
            break
          case 'datetimerange':
            itemEle = this.generateRangeDate(item)
            break
          // 输入框
          default:
            itemEle = this.generateInput(item)
            break
        }
        ele.push(
          <el-form-item
            label={item.label}
            prop={item.name}
            label-width={item.labelWidth}
          >
            {itemEle}
          </el-form-item>
        )
      })
      return ele
    }
  },
  render (h) {
    let ele = []
    ele = this.generateFormItems(this.formOption.config)
    return (
      <el-form
        disabled={this.disabled}
        inline={true}
        ref={this.formOption.name}
        rules={this.formOption.rules}
        v-model={this.formModel}
        label-position='left'
        class='search-form'
      >
        {ele}
        <el-button
          class='search-btn'
          type='primary'
          icon='el-icon-search'
          onClick={this.handleFilter}
        >
          查询
        </el-button>
        <el-button
          class='search-btn'
          type='primary'
          icon='el-icon-refresh-left'
          onClick={this.reset}
        >
          重置
        </el-button>
      </el-form>
    )
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  align-items: center;

  .el-button {
    padding: 7px 12px;
  }

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
.search-form {
  .el-form-item__label {
    color: #97c1ff;
    font-size: 14px;
  }

  .el-input {
    width: 152px !important;
  }

  .el-range-editor {
    min-height: 32px !important;
    padding: 0;
    padding-left: 8px;
    margin-bottom: 4px;

    .el-input__icon {
      margin-top: 3px;
    }

    .el-range-separator{
      color: #97c1ff;
      line-height: 32px;
    }

    .el-range-input {
      color: #97c1ff !important;
      background: transparent;
    }

    .el-range__close-icon{
      display: none;
    }
  }

  .el-input__inner {
    height: 30px !important;
    color: #97c1ff;
    font-size: 14px;
    border: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
