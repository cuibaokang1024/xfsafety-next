<template>
  <div class="upload-file">
    <el-upload
      ref="upload"
      class="upload-demo"
      action="Fake Action"
      :accept="accept"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-success="handleSuccess"
      :before-remove="beforeRemove"
      :with-credentials="true"
      :multiple="multiple"
      :limit="limit"
      :list-type="listType"
      :data="{ id: 1 }"
      :disabled="disabled"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{ `只能上传${accept}文件，且不超过${fileSize}MB` }}</div>
    </el-upload>
    <el-dialog class="dark" width="500px" :append-to-body="true" :visible.sync="dialogVisible">
      <img width="100%" height="auto" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile, deletedFile } from '@/api/uploadFile'
import { handlerDownload } from '@/api/office'
import download from '@/utils/fileDownload'
export default {
  props: {
    limit: {
      type: Number,
      default: 5
    },
    fileList: {
      type: Array,
      default: () => []
    },
    isDownload: {
      type: Boolean,
      default: false
    },
    isDialog: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    officeId: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number,
      default: 5
    },
    accept: {
      type: String,
      default: '.jpg,.jpeg,.png'
    },
    delFlag: {
      // 删除文件的标识（默认为id，如果需要文件全部信息传file）
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {},
  methods: {
    // 上传成功钩子
    handleSuccess(res, file, fileList) {
      this.$emit('uploadSuccess', res.data)
    },
    // 上传失败的钩子
    handleError(err, file, fileList) {
      if (err.code !== 200) {
        this.$message({
          message: err.message || '上传失败',
          type: 'warning'
        })
      }
    },
    formHide() {
      this.deleteFileList = []
      this.$emit('formHide')
    },
    handleRemove(file, fileList) {
      this.$emit('handleRemove', file)
    },
    handlePreview(file) {
      if (this.isDownload) {
        handlerDownload({ fileId: file.fileId }).then((res) => {
          console.log(res)
          download(res.data, file.name)
        })
      } else if (file.url) {
        this.dialogImageUrl = file.url
        if (this.isDialog) {
          this.dialogVisible = true
        }
      }
    },
    beforeUpload(file) {
      const filesType = this.accept.split(',')
      const fileNameType = `.${file.name.split('.').pop().toLowerCase()}`
      console.log('上传文件的后缀', fileNameType, filesType.indexOf(fileNameType))
      if (filesType.indexOf(fileNameType) === -1) {
        this.$message({
          message: `请上传${this.accept}类型的文件`,
          type: 'error'
        })
        this.$refs.upload.clearFiles()
        return filesType
      }
      const isSize = file.size / 1024 / 1024 < this.fileSize
      if (!isSize) {
        this.$message({
          message: `上传文件大小不能超过 ${this.fileSize}MB!`,
          type: 'error'
        })
        return isSize
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定删除 ${file.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (file.fileId || file.id) {
          this.$emit('addDeleteFileList', file)
        } else if (file.response) {
          const id = [file.response.data.id]
          this.$emit('removeFile', file.response.data)
          deletedFile(id)
        }
      })
    },
    httpRequest(params) {
      const file = new FormData()
      file.append('file', params.file)
      file.append('FileName', params.file.name)
      if (this.officeId) {
        file.append('officeId', this.officeId)
      }
      return uploadFile(file)
    }
  }
}
</script>

<style lang="scss">
.upload-file {
  .el-upload--picture-card,
  .el-upload-list--picture-card .el-upload-list__item {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .el-upload__tip {
    color: #97c1ff;
  }
}
</style>
