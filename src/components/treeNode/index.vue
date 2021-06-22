<template>
  <div class="treenode-container">
    <el-tree
      v-if="!lazy"
      :data="treeData"
      node-key="id"
      :props="defaultProps"
      :check-on-click-node="true"
      :highlight-current="true"
      :default-expanded-keys="expandedKey"
      :empty-text="emptyText"
      @node-click="handleNodeClick"
    >
      <template v-slot="{ node, data }">
        <div class="custom-tree-node">
          <span
            class="el-tree-icon"
            :class="data.children ? node.expanded ? 'el-folder-opened-icon' : 'el-folder-icon' : 'el-document-icon'"
          />
          <span>{{ data.label }}</span>
        </div>
      </template>
    </el-tree>
    <el-tree
      v-else
      node-key="id"
      :lazy="lazy"
      :load="load"
      :props="defaultProps"
      :check-on-click-node="true"
      :empty-text="emptyText"
      :highlight-current="true"
      @node-click="handleNodeClick"
    >
      <template v-slot="{ node, data }">
        <div class="custom-tree-node">
          <span
            class="el-tree-icon"
            :class="data.hasChildren === '1' ? node.expanded ? 'el-folder-opened-icon' : 'el-folder-icon' : 'el-document-icon'"
          />
          <span :class="node.label">{{ node.label }}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script>
import './style/index.scss'

export default {
  name: 'TreeNode',
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    lazy: {
      type: Boolean,
      default: false
    },
    expandedKey: {
      type: Array,
      default: () => []
    },
    model: {
      type: String,
      default: 'default'
    },
    load: {
      type: Function,
      default: () => {}
    },
    emptyText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'hasChildren'
      }
    }
  },
  methods: {
    handleNodeClick (data, node) {
      if (this.model === 'childClick' && data.children) {
        return
      }
      this.$emit('handleNodeClick', data, node)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
