<template>
  <div class="treeSelect">
    <div v-if="showSelect" class="select-wrapper">
      <el-select
        :value="value"
        :disabled="disabled"
        :popper-append-to-body="false"
        placeholder="请选择"
        @focus="show"
      >
        <el-option v-if="value !== -1" :label="label" :value="value" />
        <el-option v-else label="请选择" :value="-1" />
      </el-select>
      <el-button
        name="append"
        class="select-btn"
        icon="el-icon-search"
        @click="show"
      />
    </div>
    <el-dialog
      v-if="dialogTreeVisible"
      class="dark"
      v-model:visible="dialogTreeVisible"
      :append-to-body="true"
      width="350px"
    >
      <div name="title" class="dialog-title">{{ treeSelectOption.title }}</div>
      <div class="dialog-content">
        <el-tree
          ref="tree"
          v-loading="loading"
          class="el-tree-dark"
          node-key="id"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#001647"
          :show-checkbox="checkbox"
          :default-checked-keys="defaultList"
          :data="treeData"
          :props="defaultProps"
          :load="loadNode"
          :lazy="true"
          :check-strictly="true"
          @node-click="handleNodeClick"
        />
      </div>
      <div name="footer" class="dialog-footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="submitData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { getTreeData } from '@/api/treeData'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TreeSelect',
  props: {
    disabled: {
      type: Boolean,
      defaulet: false
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Number, String],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    level: {
      type: String,
      default: ''
    },
    treeSelectOption: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dialogTreeVisible: false,
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'hasChildren'
      },
      treeData: [],
      defaultList: [],
      selectData: ''
    }
  },
  computed: {
    ...mapState({
      detailData: (state) => state.user.detailData
    }),
    ...mapGetters(['isCentralOffice'])
  },
  methods: {
    _getTreeData (resolve) {
      const request = this.treeSelectOption.request
      if (!request) {
        this.loading = false
        return false
      }
      const url = request.url
      const params = request.params
      getTreeData(url, params)
        .then((response) => {
          if (response.code === 200) {
            resolve(
              response.data.map((data) => {
                return {
                  ...data,
                  hasChildren: data.hasChildren !== '1' && !data.children
                }
              })
            )
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    _getLoadTreeData (node, resolve) {
      const request = this.treeSelectOption.request
      if (!request) {
        this.loading = false
        return false
      }
      const url = request.url
      const params = {}
      params[request.params.para] = node.data.id
      getTreeData(url, params)
        .then((response) => {
          if (response.code === 200) {
            resolve(
              response.data.map((data) => {
                return {
                  ...data,
                  hasChildren: data.hasChildren !== '1' && !data.children
                }
              })
            )
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        this._getTreeData(resolve)
      } else if (node.data.children) {
        resolve(
          node.data.children.map((data) => {
            return {
              ...data,
              hasChildren: data.hasChildren !== '1' && !data.children
            }
          })
        )
      } else {
        this._getLoadTreeData(node, resolve)
      }
    },
    hide () {
      this.dialogTreeVisible = false
    },
    show () {
      if (this.disabled) {
        return false
      }
      if (this.checkbox) {
        this.$nextTick(() => {
          this.defaultList = this.value.split(',')
        })
      }
      this.dialogTreeVisible = true
    },
    handleNodeClick (data, node) {
      this.selectData = {
        id: data.id,
        label: data.label,
        level: data.value
      }
    },
    submitData () {
      if (this.checkbox) {
        const value = this.$refs.tree.getCheckedNodes().map((item) => {
          return item.id
        })
        const label = this.$refs.tree.getCheckedNodes().map((item) => {
          return item.label
        })
        this.$emit('update:value', value.join(','))
        this.$emit('update:label', label.join(','))
      } else {
        if (this.selectData.id && this.selectData.label) {
          this.$emit('update:value', this.selectData.id)
          this.$emit('update:label', this.selectData.label)
          this.$emit('update:level', this.selectData.level)
        }
      }
      this.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.treeSelect {
  .select-wrapper {
    position: relative;
    width: 100%;

    .select-btn {
      position: absolute;
      right: 0;
      top: 0px;
      border: none;
      font-weight: bold;
      color: #97c1ff;
      background: #00479d;
      border: 1px solid #00479d;
    }
  }

  .dialog-content {
    height: 150px;
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
.el-tree-dark {
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  background: transparent;

  .el-loading-mask {
    background: transparent;
  }

  .el-tree-node {
    .el-tree-node__expand-icon:not(.is-leaf) {
      color: #029fec !important;
    }

    .el-tree-node__label {
      color: #97c1ff !important;
    }
  }

  .el-tree-node:focus > .el-tree-node__content {
    background: rgba(255, 255, 255, 0.07);
  }

  .el-tree-node__content:hover {
    background: transparent;
  }
}
</style>
