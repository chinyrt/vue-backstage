<template>
  <div class="charts" ref="charts">
    <!-- {{ histitle }} -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  name: 'HistogramCharts',
  props: ['title'],
  data() {
    return {
      // 实例对象
      histogramCharts: null,
      myTitle: ''
    }
  },
  mounted() {
    // 初始化实例
    this.histogramCharts = echarts.init(this.$refs.charts)
    // 配置数据
    let option = {
      title: {
        text: this.myTitle + '趋势',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    }
    // 显示图表
    this.histogramCharts.setOption(option)
  },
  // 监视属性
  watch: {
    // 监视父组件传过来的title
    title: {
      // 初始时执行一次
      immediate: true,
      // 值发生变化执行
      handler(newVal) {
        this.myTitle = newVal
      }
    },
    // 监视data里的标题
    myTitle() {
      this.histogramCharts.setOption({
        title: {
          text: this.myTitle + '趋势'
        },
        xAxis: {
          data: this.myTitle === '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
        },
        series: {
          data: this.myTitle === '销售额' ? this.listState.orderFullYear : this.listState.userFullYear
        }
      })
    },
    // 初始化显示图表
    listState() {
      this.histogramCharts.setOption({
        xAxis: {
          data: this.listState.orderFullYearAxis
        },
        series: {
          data: this.listState.orderFullYear
        }
      })
    }
  },
  computed: {
    // 获取mock的数据
    ...mapState({
      listState: state => state.home.list
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 300px;
}
</style>