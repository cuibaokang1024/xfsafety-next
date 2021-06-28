<template>
  <div class="form-box">
    <div class="miniFireStation-top">
      <div name="title" class="dialog-title">微型消防站</div>
      <div class="search-box">
        <SearchForm :form-option="searchFormOption" @search="handleFilter" />
      </div>
    </div>
    <div class="miniFireStation">
      <p>佛奥微积分奥世纪东方奥世纪东方啦kjf阿斯顿发斯蒂芬阿斯蒂芬手动阀无法阿斯顿发送到发违法阿斯蒂芬阿斯蒂芬阿法狗是个红色如果对方告诉对方个是大法官安抚阿萨法手动阀手动阀阿法违法电饭锅法规和水电费个是大法官是大法官是大法官是大法官是大法官是大法官是大法官是大法官是大法官是大法官是大法官是大法官爱发发啦sjd丽舍空间foe我就发开始的减肥了奥世纪东方啦asdjdsasd阿森纳大V卡技能水电费加啊我能发吗发送开发了快速</p>
      <div class="mini-box">
        <span>人员配备</span>
        <el-table
          :loading="listLoading"
          :data="tablePersonData"
        >
          <el-table-column
            prop="sort"
            label="序号"
          />
          <el-table-column
            prop="img"
            label="照片"
          >
            <template v-slot="{ row }">
              <img :src="row.img" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="department"
            label="职务"
          />
          <el-table-column
            prop="name"
            label="姓名"
          />
          <el-table-column
            prop="sex"
            label="性别"
          />
          <el-table-column
            prop="brith"
            label="出生日期"
          />
          <el-table-column
            prop="phone"
            label="联系电话"
          />
        </el-table>
      </div>
      <div class="mini-box">
        <span>消防器材装备</span>
        <BaseTable
          :loading="listLoading"
          :table-data="tableData"
          :table-config="tableConfig"
          :table-height="'100%'"
          :border="false"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/components/searchForm'
import BaseTable from '@/components/baseTable'

export default {
  components: {
    SearchForm,
    BaseTable
  },
  data () {
    return {
      listLoading: false,
      searchFormOption: {
        config: [
          {
            type: 'daterange',
            label: '档案时间:',
            name: 'userName',
            placeholder: '请选择'
          }
        ]
      },
      tableData: [
        {
          name: '倡导',
          areaName: '位置',
          address: '详细位置',
          concat: '联系人'
        }
      ],
      tableConfig: [
        {
          prop: 'name',
          label: '序号',
          align: 'left',
          width: ''
        },
        {
          prop: 'areaName',
          label: '器材类型',
          align: 'left',
          width: ''
        },
        {
          prop: 'address',
          label: '规格',
          align: 'left',
          width: ''
        },
        {
          prop: 'concat',
          label: '数量',
          align: 'left',
          width: ''
        }
      ],
      tablePersonData: [
        {
          sort: 1,
          img: '',
          department: '详细位置',
          name: '联系人',
          sex: '部门',
          brith: '2010-09-08',
          phone: '13543456545'
        }
      ]
    }
  },
  methods: {
    handleFilter (data) {
      // this.listQuery = { ...this.listQuery, ...data }
      // this._handlerUnitRecordList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .miniFireStation-top {
    display: flex;
    justify-content: space-between;
    .search-box {
      width: auto;
    }
  }
  .miniFireStation {
    flex: 1;
    overflow: auto;
    color: #fff;
    p {
      line-height: 28px;
      background: #112653;
      border-radius: 4px;
      padding: 10px 20px;
    }
    .mini-box {
      padding: 20px;
      background: #112653;
      border-radius: 4px;
      margin-bottom: 15px;
      >span {
        display: block;
        margin-bottom: 15px;
      }
      img {
        height: 50px;
        width: 50px;
      }
    }
  }
</style>
