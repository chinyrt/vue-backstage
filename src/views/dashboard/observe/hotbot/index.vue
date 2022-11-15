<template>
  <el-card>
    <div class="hotbot-header" slot="header">
      <span>线上热门搜索</span>
      <!-- <i class="el-icon-more"></i> -->
      <el-dropdown>
        <span><i class="el-icon-more"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(tl, index) in listState.searchHot" :key="index">{{ tl }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="hotbot-content">
      <el-row :gutter="10">
        <el-col :span="12">
          <HotbotCharts title="搜索用户数" :getUserList="getUserList"></HotbotCharts>
        </el-col>
        <el-col :span="12">
          <HotbotCharts title="个人搜索次数" :getAvgList="getAvgList"></HotbotCharts>
        </el-col>
      </el-row>
    </div>
    <div class="hotbot-footer">
      <el-table style="width: 100%" border :data="getData">
        <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
        <el-table-column prop="word" label="搜索关键字" width="180"> </el-table-column>
        <el-table-column prop="user" label="用户数" sortable> </el-table-column>
        <el-table-column prop="count" label="周涨幅" sortable> </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px"
        :current-page="page"
        :page-size="limit"
        layout="->, prev, pager, next"
        :total="30"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import HotbotCharts from './hotbotcharts'
import { mapState } from 'vuex'
export default {
  name: 'Hotbot',
  components: { HotbotCharts },
  data() {
    return {
      // 当前页
      page: 1,
      // 每页展示的数据条数
      limit: 3,
      // 表格数据
      tableList: []
    }
  },
  computed: {
    // 获取state数据
    ...mapState({
      listState: state => state.home.list,
      list: state => state.home.tableList
    }),
    // 处理table表格的数据
    getData() {
      this.tableList = JSON.parse(JSON.stringify(this.list))
      return this.tableList.filter((item, index) => {
        if (this.page === 1) return index < this.limit
        return index < this.page * this.limit && index >= (this.page - 1) * this.limit
      })
    },
    // 处理搜索用户数据
    getUserList() {
      let arr = []
      this.tableList.forEach(item => {
        arr.push(item.user)
      })
      return arr
    },
    // 处理个人搜索数据
    getAvgList() {
      let arr = []
      this.tableList.forEach(item => {
        arr.push(item.count)
      })
      return arr
    }
  },
  methods: {
    // 按照当前页展示对应数据
    handleCurrentChange(page) {
      this.page = page
    }
  }
}
</script>

<style scoped>
.hotbot-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  align-items: center;
}
.el-card >>> .el-card__body {
  padding-top: 0;
}
.hotbot-content {
  border-top: 1px solid #eee;
  margin-bottom: 15px;
}
</style>