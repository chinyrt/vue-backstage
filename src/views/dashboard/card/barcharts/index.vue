<template>
  <div class="barcharts" ref="barcharts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarCharts',
  props: ['payTrend'],
  data() {
    return {
      barcharts: null,
      myPayTrend: []
    }
  },
  mounted() {
    // 创建实例
    this.barcharts = echarts.init(this.$refs.barcharts)
    // 配置数据
    let option = {
      xAxis: {
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: []
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    }
    // 显示图表
    this.barcharts.setOption(option)
  },
  watch: {
    payTrend(val) {
      this.myPayTrend = val
    },
    myPayTrend(val) {
      this.barcharts.setOption({
        series: [{ data: val }]
      })
    }
  }
}
</script>

<style scoped>
.barcharts {
  width: 100%;
  height: 100%;
}
</style>