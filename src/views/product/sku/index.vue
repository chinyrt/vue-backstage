<template>
  <div>
    <el-card>
      <!-- table表格展示 -->
      <el-table style="width: 100%" border :stripe="true" :data="skuList">
        <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
        <el-table-column label="默认图片" width="150" align="center">
          <template slot-scope="{ row }">
            <el-image style="width: 80px; height: 80px" :src="row.skuDefaultImg"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="100" align="center"> </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="100" align="center"> </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-bottom"
              v-if="row.isSale === 1"
              @click="skuCancelSale(row)"
            ></el-button>
            <el-button size="mini" type="info" icon="el-icon-top" v-else @click="skuOnSale(row)"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateSku"></el-button>
            <el-button size="mini" type="info" icon="el-icon-info" @click="getSkuInfo(row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top: 10px"
        align="center"
        :current-page="page"
        :page-size="limit"
        :page-sizes="[6, 8, 10, 12]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- 抽屉效果 -->
      <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
        <el-row :gutter="20">
          <el-col :span="6">名称</el-col>
          <el-col :span="15">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">描述</el-col>
          <el-col :span="15">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">价格</el-col>
          <el-col :span="15">{{ skuInfo.price }}元</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="15">
            <el-tag type="success" v-for="attrValue in skuInfo.skuAttrValueList" :key="attrValue.id"
              >{{ attrValue.valueId }}-{{ attrValue.valueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="15">
            <el-carousel height="350px" style="border: 1px solid #ccc" :interval="2000">
              <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
                <el-image style="width: 100%; height: 100%" :src="img.imgUrl"></el-image>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 控制抽屉是否展示
      drawer: false,
      // 当前页
      page: 1,
      // 每页展示的数据条数
      limit: 8,
      // 总的数据条数
      total: 0,
      // 存储sku列表信息
      skuList: [],
      // 存储sku详情信息
      skuInfo: {}
    }
  },
  mounted() {
    // 组件挂在完毕获取sku列表数据
    this.getSkuList()
  },
  methods: {
    // 获取sku列表数据的方法
    async getSkuList(page = 1) {
      this.page = page
      // 向服务器发请求，获取数据
      let result = await this.$API.sku.reqSkuList(this.page, this.limit)
      // console.log(result)
      if (result.code === 200) {
        this.skuList = result.data.records
        this.total = result.data.total
      }
    },
    // 切换每页数据条数时的回调
    handleSizeChange(limit) {
      // console.log(`每页 ${val} 条`)
      this.limit = limit
      this.getSkuList()
    },
    // 切换当前页时的回调
    handleCurrentChange(page) {
      this.getSkuList(page)
    },
    // 上架
    async skuOnSale(row) {
      // console.log(row)
      let result = await this.$API.sku.reqSkuOnSale(row.id)
      if (result.code === 200) {
        this.$message.success('上架成功')
        row.isSale = 1
      }
    },
    // 下架
    async skuCancelSale(row) {
      let result = await this.$API.sku.reqSkuCancelSale(row.id)
      // console.log(result)
      if (result.code === 200) {
        this.$message.success('下架成功')
        row.isSale = 0
      }
    },
    // 修改sku
    updateSku() {
      this.$message('正在开发中......')
    },
    // 查看sku信息
    async getSkuInfo(row) {
      // 获取数据之前清空skuInfo，防止页面回显
      this.skuInfo = {}
      // 显示抽屉效果
      this.drawer = true
      // 获取数据
      let result = await this.$API.sku.reqGetSkuInfo(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>


// 轮播图样式
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  height: 10px;
  width: 10px;
  background-color: #ccc;
  border-radius: 50%;
}
</style>

// 抽屉样式
<style scoped>
.el-row {
  margin-bottom: 10px;
}
.el-row .el-col {
  margin-bottom: 10px;
}
.el-row .el-col-6 {
  margin-left: 20px;
  text-align: right;
  font-weight: bold;
  font-size: 20px;
}
.el-row .el-col-15 {
  font-size: 16px;
}
.el-tag {
  margin: 0 5px 5px 0;
}
</style>
