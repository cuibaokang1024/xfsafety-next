import { deletedFile } from '@/api/uploadFile'

export default {
  data() {
    return {
      isResetFormFlag: false,
      disabled: false,
      multipleSelection: [],
      formOption: {
        title: '',
        operationStatus: '',
        data: null,
        config: [],
        rules: {}
      },
      formLoading: true,
      resFlag: true, // 连续添加成功或失败标志
      submitStatus: 'success',
      id: '',
      deleteFileList: [],
      fileList: [],
      qrfileList: [],
      deleteQRFileList: []
    }
  },
  computed: {
    files() {
      const data = []
      this.fileList.forEach((item) => {
        data.push({
          fileId: item.fileId,
          groupName: item.groupName
        })
      })
      return data
    },
    qrFiles() {
      const data = []
      this.qrfileList.forEach((item) => {
        data.push({
          fileId: item.fileId,
          groupName: item.groupName
        })
      })
      return data
    }
  },
  methods: {
    // 表格选择checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增表单数据
    handleCreate(title) {
      this.disabled = false
      this.chkStandard = ''
      this.fileList = []
      this.qrfileList = []
      const operationStatus = 'create'
      this.formAction(title, operationStatus, {})
    },
    _deletedFile() {
      this.deleteFileList.forEach((deleteFile) => {
        const index = this.files.findIndex((file) => {
          return file.id || file.fileId === deleteFile
        })
        this.files.splice(index, 1)
      })
      deletedFile(this.deleteFileList)
    },
    _deletedQRFile() {
      this.deleteQRFileList.forEach((deleteFile) => {
        const index = this.qrFiles.findIndex((file) => {
          return file.id || file.fileId === deleteFile
        })
        this.qrFiles.splice(index, 1)
      })
      deletedFile(this.deleteQRFileList)
    },
    addDeleteFileList(file) {
      const id = file.fileId || file.id
      this.deleteFileList.push(id)
    },
    addDeleteRQFileList(file) {
      const id = file.fileId || file.id
      this.deleteQRFileList.push(id)
    },
    // 文件上传成功
    uploadSuccess(data) {
      this.files.push({
        fileId: data.id,
        groupName: 1,
        buildingPlanId: data.id
      })
    },
    uploadQRSuccess(data) {
      this.qrFiles.push({
        fileId: data.id,
        groupName: 1,
        buildingPlanId: data.id
      })
    },
    removeFile(data) {
      const index = this.files.findIndex((file) => {
        return file.id === data.id
      })
      this.files.splice(index, 1)
    },
    removeQRFile(data) {
      const index = this.qrFiles.findIndex((file) => {
        return file.id === data.id
      })
      this.qrFiles.splice(index, 1)
    },
    // 查看表单信息
    handleView(data, title) {
      this.disabled = true
      const operationStatus = 'view'
      this.formAction(title, operationStatus, data)
    },
    // 编辑表单信息
    handleEdit(data, title) {
      this.disabled = false
      const operationStatus = 'edit'
      if (Array.isArray(data)) {
        if (data.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
        } else if (data.length > 1) {
          this.$message({
            message: '只能选择一条数据!',
            type: 'warning'
          })
        } else {
          this.id = data[0].id
          this.formAction(title, operationStatus, data)
        }
      } else {
        this.id = data.id
        this.formAction(title, operationStatus, data)
      }
    },
    // 删除表单数据
    handleDelete(data) {
      if (Array.isArray(data) && data.length === 0) {
        this.$message({
          message: '请至少选择一条数据!',
          type: 'warning'
        })
        return false
      } else {
        this.$confirm('确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteData(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    formHide() {
      this.deleteFileList = []
      this.deleteQRFileList = []
    },
    // 表单操作
    async formAction(title, operationStatus, data) {
      this.formOption.title = title
      this.formOption.operationStatus = operationStatus
      this.$nextTick(() => {
        this.$refs.baseForm.show()
      })
      this.formOption.data = data
      if (operationStatus === 'edit' || operationStatus === 'view') {
        this.formLoading = true
        this.formOption.data = await this._getListInfo(data)
      }
      this.isResetFormFlag = !this.isResetFormFlag
      this.formLoading = false
    }
  }
}
