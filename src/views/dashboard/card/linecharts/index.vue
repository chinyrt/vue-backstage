<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineCard',
  props: ['visitTrend'],
  data() {
    return {
      lineCharts: null,
      myVisitTrend: []
    }
  },
  mounted() {
    // 初识化echarts实例
    this.lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    let option = {
      xAxis: {
        // 设置坐标轴类型
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      series: [
        {
          // 折线图
          type: 'line',
          // 数据
          data: [],
          // 设置拐点的样式
          itemStyle: {
            opacity: 0
          },
          // 区域填充样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#7390e8' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          // 设置平滑曲线
          smooth: true
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
    this.lineCharts.setOption(option)
  },
  watch: {
    visitTrend(newVal) {
      // console.log(newVal)
      this.myVisitTrend = newVal
    },
    myVisitTrend(newVal) {
      this.lineCharts.setOption({
        series: [{ data: newVal }]
      })
    }
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>