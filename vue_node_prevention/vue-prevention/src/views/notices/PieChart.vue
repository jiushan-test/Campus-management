<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/views/dashboard/admin/components/mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    readNum: {
      type: Number,
      default: 0
    },
    unreadNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 设置echart主题
      this.chart = echarts.init(this.$el, 'macarons')
      // 配置
      this.chart.setOption({
        title: {
          text: '通知阅读情况',
          left: 'center'
        },
        // 鼠标经过饼图提示
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 下方显示的说明
        legend: {
          left: 'center',
          bottom: '10',
          data: ['已读人数', '未读人数']
        },
        series: [
          {
            name: '通知阅读情况',
            type: 'pie',
            // roseType: 'radius',
            radius: '50%',
            // 中心位置
            center: ['50%', '45%'],
            data: [
              { value: this.readNum, name: '已读人数' },
              { value: this.unreadNum, name: '未读人数' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
