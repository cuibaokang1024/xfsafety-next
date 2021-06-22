<template>
  <el-tabs v-model="activeName" style="margin-top:15px;width: 760px;" type="border-card">
    <el-button
      size="mini"
      type="success"
      @click="addFile()"
    >新增</el-button>
    <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
      <keep-alive>
        <el-table
          :data="_fileData[activeName]"
          style="width: 100%"
          border
        >
          <el-table-column
            label="文件路径"
          >
            <template slot-scope="scope">
              <el-upload
                ref="upload0"
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-remove="handleRemove"
                :on-success="(res, file)=>{ return handleSuccess(res, file, scope.$index)}"
                :before-remove="beforeRemove"
                multiple
                :limit="limit"
                :accept="fileType"
                :on-exceed="handleExceed"
                :file-list="scope.row.fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="文件名" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fileName" placeholder="请输入内容" />
            </template>
          </el-table-column>
          <el-table-column label="" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script type="text/javascript">
import { deepClone } from '@/utils/index'
export default {
  name: 'AddFile',
  props: {
    activeName: {
      type: String,
      default: ''
    },
    tabMapOptions: {
      type: Array,
      default: () => []
    },
    fileData: {
      type: Object,
      default: () => {}
    },
    createdTimes: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 3
    },
    fileType: {
      type: String,
      default: 'image/*'
    }
  },
  data() {
    return {
      input: ''
    }
  },
  computed: {
    _fileData() {
      return deepClone(this.fileData)
    }
  },
  methods: {
    addFile() {
      const index = this._fileData[this.activeName].length
      const list = {
        id: index,
        fileList: [],
        fileName: ''
      }
      this._fileData[this.activeName].push(list)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // handleSuccess(response, file, fileList) {
    //   console.log(fileList)
    // },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(res, file, index) {
      const fileInfo = {
        name: file.name,
        url: file.url
      }
      this.$emit('uploadCompleted', fileInfo, index)
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
