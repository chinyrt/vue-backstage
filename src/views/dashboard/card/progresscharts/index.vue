<template>
  <div class="progresscharts" ref="progresscharts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'ProgressCharts',
  props: ['activityRate'],
  data() {
    return {
      progressCharts: null,
      myActivityRate: ''
    }
  },
  mounted() {
    // 初识化echarts实例
    this.progressCharts = echarts.init(this.$refs.progresscharts)
    // 配置数据
    let option = {
      xAxis: {
        // 隐藏x轴
        show: false,
        // 坐标轴刻度最小值
        min: 0,
        // 坐标轴刻度最大值
        max: 100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        // 设置坐标轴类型: 均分
        type: 'category'
      },
      series: [
        {
          // 折线图
          type: 'bar',
          // 数据
          data: [this.myActivityRate],
          color: 'yellowgreen',
          // 设置柱状图的宽度
          barWidth: 10,
          // 是否显示柱条的背景色
          showBackground: true,
          // 设置柱状图的背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          // 设置图形上的文本标签
          label: {
            // 是否显示标签
            show: true,
            // 标签内容格式器
            formatter: '|',
            // 标签的位置
            position: 'right',
            // 标签的颜色
            color: 'yellowgreen'
          }
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
    this.progressCharts.setOption(option)
  },
  watch: {
    // 监听传过来的值
    activityRate: {
      immediate: true,
      handler(newVal) {
        this.myActivityRate = newVal
      }
    },
    myActivityRate() {
      this.progressCharts.setOption({
        series: [{ data: [this.myActivityRate] }]
      })
    }
  }
}
</script>

<style scoped>
.progresscharts {
  width: 100%;
  height: 100%;
}
</style>