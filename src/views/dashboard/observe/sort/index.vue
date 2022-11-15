<template>
  <el-card>
    <div class="sort-header" slot="header">
      <span>销售额类别占比</span>
      <el-radio-group v-model="salesort">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="sort-content">
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Sort',
  data() {
    return {
      salesort: '全部渠道',
      myCharts: null,
      onLineList: [],
      shopLists: []
    }
  },
  mounted() {
    // 初始化实例
    this.myCharts = echarts.init(this.$refs.charts)
    // 配置数据并显示图表
    this.myCharts.setOption({
      title: {
        text: 'Search Engine',
        subtext: 1048,
        left: 'center',
        top: 'middle'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    // 给图表绑定鼠标事件
    this.myCharts.on('mouseover', params => {
      const { name, value } = params
      this.myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })

    this.$store.getters.getOnline
  },
  computed: {
    ...mapState({ saleList: state => state.home.saleRank }),
    ...mapGetters(['getOnline']),
    // // 获取线上销售数据
    getOnLine() {
      let nameArr = []
      let valueArr = []

      let obj = JSON.parse(JSON.stringify(this.saleList.online))
      obj.name.forEach(item => nameArr.push(item))
      obj.value.forEach(item => valueArr.push(item))

      for (let i = 0; i < nameArr.length; i++) {
        this.onLineList.push({
          name: nameArr[i],
          value: valueArr[i]
        })
      }
    },
    // 获取门店销售数据
    getShop() {
      let nameArr = []
      let valueArr = []
      let obj = JSON.parse(JSON.stringify(this.saleList.shop))
      obj.name.forEach(item => nameArr.push(item))
      obj.value.forEach(item => valueArr.push(item))

      for (let i = 0; i < nameArr.length; i++) {
        this.shopLists.push({
          name: nameArr[i],
          value: valueArr[i]
        })
      }
    }
  },
  watch: {
    salesort(val) {
      if (val === '线上') {
        if (this.onLineList !== []) {
          console.log(this.onLineList)
          this.myCharts.setOption({ series: [{ data: this.onLineList }] })
        }
      } else {
        this.myCharts.setOption({ series: [{ data: this.shopLists }] })
      }
    }
  }
}
</script>

<style scoped>
.sort-header {
  /* padding: 10px 0%; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card >>> .el-card__body {
  padding: 0;
}
.sort-content {
  border-top: 1px solid #eee;
}

.charts {
  width: 100%;
  height: 400px;
}
</style>