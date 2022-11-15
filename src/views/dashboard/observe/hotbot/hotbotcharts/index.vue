<template>
  <div class="hotbotcharts">
    <div class="charts-header">
      <span>{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="charts-main">
      <span>{{ title === '搜索用户数' ? listState.salesTotal : listState.searchAvg }}</span>
      <span>{{ title === '搜索用户数' ? listState.searchTotalGrowth : listState.searchAvgGrowth }}</span>
      <i class="el-icon-caret-top" v-if="title === '搜索用户数'"></i>
      <i class="el-icon-caret-bottom" v-else></i>
    </div>
    <div class="charts-fooetr">
      <div class="hotbot-charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  name: 'HotbotCharts',
  props: ['title', 'getUserList', 'getAvgList'],
  data() {
    return {
      list: [],
      myCharts: null
    }
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
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
    })
  },
  computed: {
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch: {
    // 搜索用户折线图
    getUserList(val) {
      this.myCharts.setOption({
        series: [
          {
            data: val
          }
        ]
      })
    },
    // 个人搜索折线图
    getAvgList(val) {
      this.myCharts.setOption({
        series: [
          {
            data: val
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.hotbotcharts {
  margin-top: 30px;
}
.charts-header span {
  color: rgb(134, 134, 134);
}
.el-icon-info::before {
  color: #ddd;
  margin-left: 10px;
}

.charts-main {
  margin: 20px 0;
}
.charts-main span:nth-child(1) {
  font-size: 24px;
  margin-right: 20px;
}
.charts-main span:nth-child(2) {
  font-size: 16px;
  color: rgb(141, 141, 141);
}
.el-icon-caret-top::before {
  color: red;
}
.el-icon-caret-bottom::before {
  color: red;
}

.hotbot-charts {
  width: 100%;
  height: 50px;
}
</style>