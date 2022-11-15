<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <!-- 头部左侧 -->
        <div class="tab">
          <el-tabs v-model="activeName">
            <el-tab-pane label="销售额" name="sale"> </el-tab-pane>
            <el-tab-pane label="访问量" name="visits"></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 头部右侧 -->
        <div class="clearfix-right">
          <span @click="getToday">今日</span>
          <span @click="getWeek">本周</span>
          <span @click="getMonth">本月</span>
          <span @click="getYear">本年</span>
          <el-date-picker
            class="date"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="date"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="content">
        <!-- 内容主体 -->
        <el-row :gutter="10">
          <el-col :span="18">
            <HistogramCharts :title="title"></HistogramCharts>
          </el-col>
          <el-col :span="6">
            <p>门店{{ title }}排名</p>
            <!-- 销售额 -->
            <ul v-if="activeName === 'sale'">
              <li v-for="(item, index) in listState.orderRank" :key="index">
                <p>
                  <span :class="index < 3 ? 'sign' : ''">{{ item.no }}</span>
                  <span>{{ item.name }}</span>
                </p>
                <p>{{ item.money }}</p>
              </li>
            </ul>
            <!-- 访问量 -->
            <ul v-else>
              <li v-for="(item, index) in listState.userRank" :key="index">
                <p>
                  <span :class="index < 3 ? 'sign' : ''">{{ item.no }}</span>
                  <span>{{ item.name }}</span>
                </p>
                <p>{{ item.money }}</p>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import HistogramCharts from '@/views/dashboard/sale/histogramcharts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'Sale',
  components: { HistogramCharts },
  data() {
    return {
      // 用来切换标题
      activeName: 'sale',
      // 收集日历的数据
      date: []
      // listState: this.listState
    }
  },
  methods: {
    // 获取当天
    getToday() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 获取本周
    getWeek() {
      const Monday = dayjs().day(1).format('YYYY-MM-DD')
      const Sunday = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [Monday, Sunday]
    },
    // 获取本月
    getMonth() {
      const firstDay = dayjs().startOf('month').format('YYYY-MM-DD')
      const lastDay = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [firstDay, lastDay]
    },
    // 获取本年
    getYear() {
      const firstDay = dayjs().startOf('year').format('YYYY-MM-DD')
      const lastDay = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [firstDay, lastDay]
    }
  },
  computed: {
    // 计算标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    // 获取mock数据
    ...mapState({
      listState: state => state.home.list
    })
  }
}
</script>

<style>
.el-card__header {
  border-bottom: none;
  padding: 10px 20px;
}

.el-tabs__nav-wrap::after {
  height: 1px;
}
</style>

<style scoped>
.tab {
  width: 100%;
  font-size: 18px;
}

/* 头部右侧样式 */
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.clearfix-right {
  position: absolute;
  right: 0;
}
.clearfix-right span {
  margin: 0 10px;
  font-size: 16px;
}
.clearfix-right .date {
  width: 230px !important;
  margin-left: 20px;
}
/* 头部右侧hover */
.clearfix-right span:hover {
  cursor: pointer;
  color: blueviolet;
}

/* 内容主题右侧样式 */
.el-row {
  padding-top: 15px;
}
.content p {
  margin: 0;
  font-size: 16px;
}

ul {
  padding: 0;
}
ul li {
  margin: 20px 0;
}
ul li,
ul li p {
  display: flex;
  justify-content: space-between;
  list-style: none;
}
ul li p:nth-child(2) {
  width: 25%;
}

p span:nth-child(1) {
  margin-left: 5px;
  margin-right: 30px;
  width: 18px;
  height: 18px;
  text-align: center;
  font-size: 16px;
}
.sign {
  background-color: black;
  color: #fff;
  border-radius: 50%;
}
</style>