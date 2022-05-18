<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" :data1="data1" :data2="data2" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :name="name1" :data="data3" :text="text1" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :name="name2" :data="data4" :text="text2" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [10000, 12000, 16100, 13400, 10500, 16000, 16500],
    actualData: [12000, 8200, 9100, 8000, 7000, 8888, 6666]
  },
  messages: {
    expectedData: [12000, 10200, 12000, 15000, 10600, 10300, 10400],
    actualData: [10800, 10600, 10000, 10600, 10450, 8800, 10000]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      name1: '疫苗接种比例',
      name2: '确诊人数比例',
      text1: '疫苗接种情况',
      text2: '确诊人数情况',
      data1: '广州每日核酸检测情况',
      data2: '华工每日核酸检测情况',
      data3: [
        { value: 4000, name: '荔湾区' },
        { value: 3000, name: '白云区' },
        { value: 3500, name: '海珠区' },
        { value: 2888, name: '黄浦区' },
        { value: 3333, name: '番禺区' },
        { value: 2000, name: '天河区' }
      ],
      data4: [
        { value: 32, name: '荔湾区' },
        { value: 24, name: '白云区' },
        { value: 14, name: '海珠区' },
        { value: 10, name: '黄浦区' },
        { value: 9, name: '番禺区' },
        { value: 1, name: '天河区' }
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {
      if (type === 'newVisitis') {
        this.data1 = '广州每日核酸检测情况'
        this.data2 = '华工每日核酸检测情况'
      }
      if (type === 'messages') {
        this.data1 = '广州每日健康表填报情况'
        this.data2 = '华工每日健康表填报情况'
      }
      if (type === 'purchases') {
        this.data1 = '广州每日高危人数情况'
        this.data2 = '华工每日高危人数情况'
      }
      if (type === 'shoppings') {
        this.data1 = '广州每日经过高危地区人数情况'
        this.data2 = '华工每日经过高危地区人数情况'
      }
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
