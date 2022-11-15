<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <Detail title="总销售额" :count="`￥${listState.salesTotal}`">
          <template slot="charts">
            <span class="chart"
              >周同比<span>{{ listState.salesGrowthLastMonth }}</span></span
            >
            <i class="el-icon-caret-top"></i>
            <span class="chart"
              >日同比<span>{{ listState.salesGrowthLastDay }}</span></span
            >
            <i class="el-icon-caret-bottom"></i>
          </template>
          <template slot="footer">
            <span>日销售额￥ {{ listState.salesToday }}</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="访问量" :count="listState.visitTotal">
          <template slot="charts">
            <LineCharts :visitTrend="listState.visitTrend"></LineCharts>
          </template>
          <template slot="footer">
            <span>日访问量 {{ listState.visitToday }}</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="支付笔数" :count="listState.payTotal">
          <template slot="charts">
            <BarCharts :payTrend="listState.payTrend"></BarCharts>
          </template>
          <template slot="footer">
            <span>转化率{{ listState.payRate }}%</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="运营活动效果" :count="`${listState.activityRate}%`">
          <template slot="charts">
            <ProgressCharts :activityRate="listState.activityRate"></ProgressCharts>
          </template>
          <template slot="footer">
            <span
              >周同比<span class="foot">{{ listState.activityGrowthLastMonth }}%</span></span
            >
            <i class="el-icon-caret-top"></i>
            <span
              >日同比<span class="foot">{{ listState.activityGrowthLastDay }}%</span></span
            >
            <i class="el-icon-caret-bottom"></i>
          </template>
        </Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from '@/views/dashboard/card/detail'
import LineCharts from '@/views/dashboard/card/linecharts'
import BarCharts from '@/views/dashboard/card/barcharts'
import ProgressCharts from '@/views/dashboard/card/progresscharts'

import { mapState } from 'vuex'
export default {
  name: 'Card',
  components: { Detail, LineCharts, BarCharts, ProgressCharts },
  computed: {
    ...mapState({
      listState: state => state.home.list
    })
  }
}
</script>

<style scoped>
.chart,
.chart span {
  font-size: 14px;
}
.chart span,
.foot {
  margin-left: 10px;
}

.foote {
  margin: 0;
}
.el-icon-caret-top:before {
  color: red;
  margin-right: 10px;
}
.el-icon-caret-bottom:before {
  color: red;
}
</style>