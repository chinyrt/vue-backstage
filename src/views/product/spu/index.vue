<template>
  <div>
    <el-card>
      <!-- 三级联动 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="isShowSpuList === 0"></CategorySelect>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 列表展示 -->
      <div v-show="isShowSpuList === 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!cateList3Id" @click="addSpu">添加SPU</el-button>
        <el-table border style="width: 100%; margin-top: 20px" :data="spuList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-tooltip effect="light" content="添加" placement="bottom">
                <el-button type="success" icon="el-icon-plus" size="small" @click="addSku(row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="修改" placement="bottom">
                <el-button type="warning" icon="el-icon-edit" size="small" @click="updateSpu(row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="查看sku列表" placement="bottom">
                <el-button type="info" icon="el-icon-info" size="small" @click="examineSku(row)"></el-button>
              </el-tooltip>
              <el-popconfirm title="这是一段内容确定删除吗？" style="margin-left: 10px" @confirm="deleteSpu(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="small"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-size="limit"
          :page-sizes="[5, 7, 9]"
          :total="total"
          align="center"
          style="margin-top: 10px"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- spu添加或修改表单展示 -->
      <SpuAddForm v-show="isShowSpuList === 1" ref="SpuAddOrUpdateForm" @toggleSpuList="toggleSpuList"></SpuAddForm>
      <!-- sku添加表单展示 -->
      <SkuAddForm v-show="isShowSpuList === 2" ref="SkuAddForm" @toggleToSpu="toggleToSpu"></SkuAddForm>
    </el-card>
    <!-- 打开嵌套表格的 Dialog -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
      <el-table style="width: 100%" :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
        <el-table-column prop="price" label="价格" width="width"> </el-table-column>
        <el-table-column prop="weight" label="重量" width="width"> </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <el-image style="width: 100px; height: 100px" :src="row.skuDefaultImg"></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuAddForm from './spuAddForm/index'
import SkuAddForm from './skuAddForm/index'
export default {
  name: 'Spu',
  components: { SpuAddForm, SkuAddForm },
  data() {
    return {
      // 当前页
      page: 1,
      // 每页展示的数据条数
      limit: 5,
      // 总的数据条数
      total: 0,
      // 收集列表数据
      spuList: [],
      // 一级分类id
      cateList1Id: '',
      // 二级分类id
      cateList2Id: '',
      // 三级分类id
      cateList3Id: '',
      // 表示是否展示属性列表，0： 展示列表，1：展示添加或修改页面，2：展示
      isShowSpuList: 0,
      // 控制sku列表显示与隐藏
      dialogTableVisible: false,
      // 存储spu列表的信息
      spu: {},
      // 查看sku列表信息时展示的sku信息
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 自定义事件(CategorySelect传值)：获取分类id的事件回调，cateListId为分类id，level为分类等级
    getCategoryId(cateListId, level) {
      if (level === 1) {
        this.cateList1Id = cateListId
        // 清除数据
        this.cateList2Id = ''
        this.cateList3Id = ''
      } else if (level === 2) {
        this.cateList2Id = cateListId
        this.cateList3Id = ''
      } else {
        this.cateList3Id = cateListId
        this.showPage()
      }
    },
    // 向服务器发请求，获取数据
    async showPage(page = 1) {
      this.page = page
      let result = await this.$API.spu.reqSpuList(this.page, this.limit, this.cateList3Id)
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 页面发生变化时触发，即切换页面时
    handleCurrentChange(page = 1) {
      this.page = page
      this.showPage()
    },
    // 切换每页展示的数据条数
    handleSizeChange(limit) {
      this.limit = limit
      this.showPage()
    },
    // 添加spu
    addSpu() {
      this.isShowSpuList = 1
      // 获取子组件并调用子组件方法
      this.$refs.SpuAddOrUpdateForm.initAddSpuData(this.cateList3Id)
    },
    // 修改spu
    updateSpu(row) {
      // 切换到修改界面
      this.isShowSpuList = 1
      // 获取子组件并调用子组件方法
      this.$refs.SpuAddOrUpdateForm.initUpdateSpuData(row)
    },
    // 自定义事件(SpuAddForm传值)：点击取消切换到spu列表展示页面
    toggleSpuList(n) {
      // 切换页面
      this.isShowSpuList = n
      // 获取页面最新的数据
      this.showPage(this.page)
    },
    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message.success('删除成功')
        this.showPage(this.spuList.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku的回调
    addSku(row) {
      // 切换到skuAddForm子组件页面
      this.isShowSpuList = 2
      // 调用子组件方法
      this.$refs.SkuAddForm.getData(this.cateList1Id, this.cateList2Id, row)
    },
    // 自定义事件(SkuAddForm传值)：点击取消切换到spu列表展示页面
    toggleToSpu(n) {
      this.isShowSpuList = n
    },
    // 查看sku列表的回调
    async examineSku(row) {
      this.dialogTableVisible = true
      // 获取数据之前清空数据并将loading值设为true
      this.loading = true
      this.skuList = []
      // 存储当前spu信息
      this.spu = row
      // 获取sku列表的信息
      let result = await this.$API.spu.reqGetSkuList(row.id)
      // console.log(result)
      if (result.code === 200) {
        this.skuList = result.data
        // 数据请求回来之后关闭loading效果
        this.loading = false
      }
    }
  }
}
</script>
