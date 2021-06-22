<script type="text/javascript">
import UnitSelect from '@/components/UnitSelect'
import TreeSelect from '@/components/treeSelect'
import CodeSelect from '@/components/CodeSelect'
import MapSelect from '@/components/MapSelect'
import AlarmRecord from '@/components/alarmRecord'
import UserSelect from '@/components/UserWSelect'

export default {
  name: 'FormItems',
  components: {
    TreeSelect,
    UnitSelect,
    CodeSelect,
    UserSelect,
    MapSelect,
    AlarmRecord
  },
  props: {
    formModel: {
      type: Object,
      default: () => {}
    },
    formConfig: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      defaultStyle: 'width: 220px',
      dialogVisible: false
    }
  },
  methods: {
    submitData () {
      this.$emit('update:formModel', this.formModel)
    },
    handleDateChange () {
      this.$emit('dateChange', this.formModel)
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
          disabled={item.disabled}
          clearable={true}
          {...{
            on: {
              change: (val) => this.$emit('handleAgentList', val)
            }
          }}
        >
          {this.generateList(item)}
        </el-select>
      )
    },
    // 生成单位选择
    generateUnitSelect (item) {
      return (
        <unit-select
          value={this.formModel[item.name]}
          label={this.formModel[item.treeSelectOption.name]}
          isAgent={item.isAgent}
          disabled={item.disabled}
          {...{
            on: {
              'update:value': (val) => (this.formModel[item.name] = val)
            }
          }}
          {...{
            on: {
              'update:label': (val) =>
                (this.formModel[item.treeSelectOption.name] = val)
            }
          }}
        />
      )
    },
    // 生成人员选择
    generateUserSelect (item) {
      return (
        <user-select
          value={this.formModel[item.name]}
          label={this.formModel[item.treeSelectOption.name]}
          {...{
            on: {
              'update:value': (val) => (this.formModel[item.name] = val)
            }
          }}
          {...{
            on: {
              'update:label': (val) =>
                (this.formModel[item.treeSelectOption.name] = val)
            }
          }}
        />
      )
    },
    // 生成设备注册列表
    generateCodeSelect (item) {
      return (
        <code-select
          value={this.formModel[item.name]}
          {...{
            on: {
              'update:value': (val) => (this.formModel[item.name] = val)
            }
          }}
        />
      )
    },
    // 生成树形结构选择框
    generateTreeSelect (item) {
      return (
        // eslint-disable-next-line no-return-assign
        <div class={item.disabled}>
          <tree-select
            disabled={item.disabled}
            checkbox={item.checkbox}
            value={this.formModel[item.name]}
            {...{
              on: {
                'update:value': (val) => (this.formModel[item.name] = val)
              }
            }}
            label={this.formModel[item.treeSelectOption.name]}
            {...{
              on: {
                'update:label': (val) =>
                  (this.formModel[item.treeSelectOption.name] = val)
              }
            }}
            treeSelectOption={item.treeSelectOption}
          />
        </div>
      )
    },
    // 生成地图选择
    generateMapSelect (item) {
      return (
        <div>
          <map-select
            lnglat={this.formModel[item.name]}
            {...{
              on: {
                'update:position': (val) => (this.formModel[item.name] = val)
              }
            }}
            addr={this.formModel[item.treeSelectOption.name]}
            {...{
              on: {
                'update:address': (val) =>
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
          <el-radio-group
            disabled={item.disabled}
            v-model={this.formModel[item.name]}
          >
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
          value-format={item.valueFormat || 'yyyy-MM-dd'}
          placeholder='选择日期'
          picker-options={item.pickerOptions ? item.pickerOptions : this.handlePickerOption(this.formModel[item.picker], item.range)}
          {...{
            on: {
              change: this.handleDateChange
            }
          }
          }
        />
      )
    },
    handlePickerOption (date, range) {
      return {
        disabledDate (time) {
          if (date) {
            if (range === 'start') {
              return time.getTime() > new Date(date)
            } else {
              return time.getTime() < new Date(date)
            }
          }
        }
      }
    },
    // 生成输入域
    generateTextArea (item) {
      return (
        <el-input
          type={item.type}
          maxlength={item.maxlength}
          v-model={this.formModel[item.name]}
        />
      )
    },
    // 生成颜色选择器
    generateColor (item) {
      return <el-color-picker v-model={this.formModel[item.name]} show-alpha />
    },
    // 生成输入框
    generateInput (item) {
      return (
        <el-input
          v-model={this.formModel[item.name]}
          type={item.type}
          disabled={item.disabled}
          autosize={item.autosize}
          precision={item.precision}
          maxlength={item.maxlength}
          placeholder={item.placeholder}
        ></el-input>
      )
    },
    // 生成数字输入框
    generateInputNumber (item) {
      return (
        <el-input-number
          v-model={this.formModel[item.name]}
          type={item.type}
          min={item.min}
          max={item.max}
          controls={false}
          disabled={item.disabled}
          autosize={item.autosize}
          precision={item.precision || 0}
          maxlength={item.maxlength}
          placeholder={item.placeholder}
        ></el-input-number>
      )
    },
    generateSlot (item) {
      return <div>{this.$slots[item.name]}</div>
    },
    generateFormItems (items = []) {
      const ele = []
      items.forEach((item) => {
        let itemEle = ''
        switch (item.type) {
          // 下拉菜单
          case 'select':
            itemEle = this.generateSelect(item)
            break
          // 生成单位选择
          case 'unitSelect':
            itemEle = this.generateUnitSelect(item)
            break
          // 生成人员选择
          case 'userSelect':
            itemEle = this.generateUserSelect(item)
            break
          // 生成设备注册列表
          case 'codeSelect':
            itemEle = this.generateCodeSelect(item)
            break
          // 树形结构选择器
          case 'treeSelect':
            itemEle = this.generateTreeSelect(item)
            break
          // 树形地图选择
          case 'mapSelect':
            itemEle = this.generateMapSelect(item)
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
          // 日期选择框
          case 'datetime':
            itemEle = this.generateDate(item)
            break
          // 颜色选择框
          case 'colorSelect':
            itemEle = this.generateColor(item)
            break
          // 输入域
          case 'textarea':
            itemEle = this.generateTextArea(item)
            break
          case 'number':
            itemEle = this.generateInputNumber(item)
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
            style={item.colspan ? 'flex: 0 1 100%;' : ''}
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
    const ele = this.generateFormItems(this.formConfig)
    return <div class='form-content'>{ele}</div>
  }
}
</script>

<style lang="scss" scoped>
</style>
