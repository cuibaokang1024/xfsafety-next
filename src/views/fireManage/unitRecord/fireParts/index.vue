<template>
  <section class="section-main">
    <!-- 搜索框 -->
    <div class="search-box">
      <SearchForm :form-option="searchFormOption" @search="handleFilter" />
    </div>
    <!-- 搜索框 -->
    <!-- 条件框 -->
    <div class="filter-box">
      <el-button class="add" @click="handleCreate('添加消防部位检测')">添加</el-button>
      <el-button class="edit" @click="handleEdit(multipleSelection, '修改消防部位检测')">修改</el-button>
      <el-button class="delect" @click="handleDelete(multipleSelection)">删除</el-button>
    </div>
    <!-- 条件框 -->
    <!-- 列表框 -->
    <div class="table-box">
      <BaseTable
        :loading="listLoading"
        :table-data="tableData"
        :table-config="tableConfig"
        :border="false"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button size="mini" type="primary" round @click="handleView(row, '查看消防重点部位')">查看</el-button>
            <el-button size="mini" type="success" round @click="handleEdit(row, '修改消防重点部位')">修改</el-button>
            <el-button size="mini" type="danger" round @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <div class="pagination-box">
      <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.page"
        v-model:limit="listQuery.pageSize"
      />
    </div>
    <!-- 列表框 -->
    <!-- 弹出框 -->
    <div class="dialog-container">
      <BaseForm
        ref="baseForm"
        width="1084px"
        :parent-instance="this"
        :form-option="formOption"
        :is-reset-form-flag="isResetFormFlag"
        @updateData="updateData"
        @createData="createData"
        @formHide="formHide"
      >
        <template v-slot:uploadFile>
          <upload-file
            ref="upload-file"
            :limit="4"
            :file-list="fileList"
            @uploadSuccess="uploadSuccess"
            @addDeleteFileList="addDeleteFileList"
            @removeFile="removeFile"
          />
        </template>
      </BaseForm>
    </div>
    <!-- 弹出框 -->
  </section>
</template>

<script>
import '../style/supervisionUnit.scss'
import formAction from '@/mixins/form.js'

import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'
import Pagination from '@/components/Pagination'
import BaseForm from '@/components/baseForm'
import UploadFile from '@/components/uploadFile'

export default {
  /* 消防重点部位 */
  name: 'FireParts',
  components: {
    SearchForm,
    BaseTable,
    Pagination,
    BaseForm,
    UploadFile
  },
  mixins: [formAction],
  data () {
    return {
      listLoading: false,
      listQuery: {
        name: '',
        position: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      searchFormOption: {
        config: [
          {
            type: 'select',
            label: '消防重点部位名称:',
            name: 'name',
            placeholder: '请选择消防重点部位名称',
            dataList: [
              {
                index: 1,
                text: '1'
              },
              {
                index: 2,
                text: '2'
              },
              {
                index: 3,
                text: '3'
              }
            ]
          },
          {
            type: 'select',
            label: '所在位置:',
            name: 'position',
            placeholder: '请选择所在位置',
            dataList: [
              {
                index: 1,
                text: '1'
              },
              {
                index: 2,
                text: '2'
              },
              {
                index: 3,
                text: '3'
              }
            ]
          },
          {
            type: 'select',
            label: '楼层:',
            name: 'floor',
            placeholder: '请选择楼层',
            dataList: [
              {
                index: 1,
                text: '1'
              },
              {
                index: 2,
                text: '2'
              },
              {
                index: 3,
                text: '3'
              }
            ]
          }
        ]
      },
      tableConfig: [
        {
          type: 'selection',
          width: '55'
        },
        {
          prop: 'name',
          label: '消防重点部位名称',
          align: 'left',
          width: ''
        },
        {
          prop: 'position',
          label: '所在位置',
          align: 'left',
          width: ''
        },
        {
          prop: 'floor',
          label: '所在楼层',
          align: 'left',
          width: ''
        },
        {
          prop: 'fireRisk',
          label: '火灾危险性',
          align: 'left',
          width: ''
        },
        {
          prop: 'fireRating',
          label: '耐火等级',
          align: 'left',
          width: ''
        }
      ],
      tableData: [
        {
          id: '78856',
          name: '安保部',
          position: '10086',
          floor: '安保健康委',
          fireRisk: 'A',
          fireRating: '道傅恒'
        },
        {
          id: '78857',
          name: '研发部',
          position: '10087',
          floor: '研发健康委',
          fireRisk: 'B',
          fireRating: '的官方的'
        }
      ],
      formOption: {
        config: [
          {
            label: '消防重点部位名称:',
            name: 'name',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '所属楼宇:',
            name: 'building',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '所在层数:',
            name: 'floor',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '具体位置:',
            name: 'position',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '建筑结构:',
            name: 'buildingStructure',
            type: 'select',
            labelWidth: '140px',
            dataList: [
              {
                index: 1,
                text: '1'
              },
              {
                index: 2,
                text: '2'
              },
              {
                index: 3,
                text: '3'
              }
            ]
          },
          {
            label: '所在高度:',
            name: 'height',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '消防电梯数:',
            name: 'height',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '使用性质:',
            name: 'height',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '安全出口数:',
            name: 'emergencyNum',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '疏散出口数:',
            name: 'evacuationNum',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '火灾危险性:',
            name: 'fireRisk',
            type: 'select',
            labelWidth: '140px',
            dataList: [
              {
                index: 1,
                text: '1'
              },
              {
                index: 2,
                text: '2'
              },
              {
                index: 3,
                text: '3'
              }
            ]
          },
          {
            label: '建筑面积:',
            name: 'area',
            type: 'text',
            labelWidth: '140px'
          },
          {
            label: '火种情况:',
            name: 'fireCondition',
            type: 'radio',
            labelWidth: '140px',
            dataList: [
              {
                index: 1,
                text: '有名火'
              },
              {
                index: 2,
                text: '无明火'
              }
            ]
          },
          {
            label: '耐火等级:',
            name: 'fireRating',
            type: 'radio',
            labelWidth: '140px',
            dataList: [
              {
                index: 1,
                text: '一级'
              },
              {
                index: 2,
                text: '二级'
              },
              {
                index: 3,
                text: '三级'
              },
              {
                index: 4,
                text: '四级'
              }
            ]
          },
          {
            label: '确立原因:',
            name: 'cause',
            type: 'checkbox',
            checkList: [],
            labelWidth: '140px',
            dataList: [
              {
                index: '1',
                text: '对安全消防有重大影响'
              },
              {
                index: '2',
                text: '发生火灾后对人员伤亡大'
              },
              {
                index: '3',
                text: '一旦发生火灾后损失大'
              },
              {
                index: '4',
                text: '已发生火灾'
              },
              {
                index: '5',
                text: '其他'
              }
            ],
            colspan: true
          },
          {
            label: '防火标志的设立情况:',
            name: 'firePrevention',
            type: 'radio',
            labelWidth: '140px',
            dataList: [
              {
                index: '1',
                text: '已设立'
              },
              {
                index: '2',
                text: '明显'
              },
              {
                index: '3',
                text: '不明显'
              },
              {
                index: '4',
                text: '未设立'
              }
            ],
            colspan: true
          },
          {
            label: '危化品:',
            name: 'dangerChemicals',
            type: 'checkbox',
            labelWidth: '140px',
            dataList: [
              {
                index: 1,
                text: '爆炸物'
              },
              {
                index: 2,
                text: '易燃固体'
              },
              {
                index: 3,
                text: '遇水放出易燃气体的物质或混合物'
              },
              {
                index: 4,
                text: '易燃气体'
              },
              {
                index: 5,
                text: '自反应物质或化合物'
              },
              {
                index: 6,
                text: '氧化性液体'
              }
            ],
            colspan: true
          },
          {
            type: 'slot',
            name: 'uploadFile',
            colspan: true
          }
        ],
        rules: {
          name: [
            {
              required: true,
              message: '请输入消防重点部位名称',
              trigger: 'blur'
            }
          ],
          building: [
            {
              required: true,
              message: '请输入所属楼宇',
              trigger: 'blur'
            }
          ],
          fireRisk: [
            {
              required: true,
              message: '请选择火灾危险性',
              trigger: 'blur'
            }
          ],
          fireRating: [
            {
              required: true,
              message: '请选择火灾危险性',
              trigger: 'blur'
            }
          ],
          cause: [
            {
              required: true,
              message: '请选择火灾危险性',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  methods: {
    // 查询函数
    handleFilter (data) {
      this.listQuery = { ...this.listQuery, ...data }
    },
    // 删除数据
    deleteData (data) {
      console.log(data)
    },
    // 更新数据
    updateData (data) {
      console.log(data)
    },
    // 新增数据
    createData (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
.formDialog
  .dialog-content
  .el-form
  .form-content
  .el-form-item:nth-last-child(2):nth-child(odd) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
