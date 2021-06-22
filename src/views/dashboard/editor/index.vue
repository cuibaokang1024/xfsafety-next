<template>
  <div class="home company">
    <!-- <div class="header"></div> -->
    <ul class="main company">
      <li
        v-for="item in itemList"
        :key="item.id"
        class="item"
        :class="item.classStatus ? 'item-status' : ''"
      >
        <component :is="item.name" />
      </li>
    </ul>
  </div>
</template>

<script>
import NewsNotice from './components/NewsNotice'
import StructureDanger from './components/StructureDanger'
import TodoList from './components/TodoList'
import Inspection from './components/Inspection'
import AcademicRecord from './components/AcademicRecord'
import WaterCameraTesting from './components/WaterCameraTesting'
import ElectricSmokeTesting from './components/ElectricSmokeTesting'
import GasInfotxTesting from './components/GasInfotxTesting'
import './style/index.scss'
export default {
  name: 'EnterpriseHome',
  components: {
    NewsNotice,
    StructureDanger,
    TodoList,
    Inspection,
    AcademicRecord,
    WaterCameraTesting,
    ElectricSmokeTesting,
    GasInfotxTesting
  },
  data() {
    return {
      itemList: [
        {
          id: '0',
          name: 'NewsNotice',
          classStatus: false
        },
        {
          id: '1',
          name: 'StructureDanger',
          classStatus: true
        },
        {
          id: '2',
          name: 'TodoList',
          classStatus: false
        },
        {
          id: '3',
          name: 'Inspection',
          classStatus: false
        },
        {
          id: '4',
          name: 'AcademicRecord',
          classStatus: true
        },
        {
          id: '5',
          name: 'WaterCameraTesting',
          classStatus: true
        },
        {
          id: '6',
          name: 'ElectricSmokeTesting',
          classStatus: true
        },
        {
          id: '7',
          name: 'GasInfotxTesting',
          classStatus: true
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
