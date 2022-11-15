<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" :min="0" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input type="number" placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item style="margin-bottom: 5px" :label="attr.attrName" v-for="attr in spuAttrList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrObj">
              <el-option
                :label="attrValue.valueName"
                :value="{ attrId: attr.id, valueId: attrValue.id }"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrObj">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="{ saleAttrId: saleAttr.id, saleAttrValueId: saleAttrValue.id }"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" width="80" type="selection" align="center"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <el-image style="width: 100px; height: 100px" :src="row.imgUrl"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"> </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" v-if="row.isDefault === 0" @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button size="small" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSku">保存</el-button>
        <el-button @click="goSpuListshow">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuAddForm',
  data() {
    return {
      // 平台属性
      spuAttrList: [],
      // 销售属性
      spuSaleAttrList: [],
      // spu图片
      spuImageList: [],
      // spu名称
      spuName: '',
      // 收集sku信息
      skuInfo: {
        // 父组件传的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 表单双向数据绑定收集的数据
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        // 自己书写收集的数据
        // 设置默认图片
        skuDefaultImg: '',
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // }
        ],
        // 图片信息
        skuImageList: [
          // {
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   spuImgId: 0
          // }
        ]
      },
      // 临时存储收集的图片信息
      imgList: []
    }
  },
  methods: {
    // 获取skuForm基本的数据，三个请求
    async getData(category1Id, category2Id, spu) {
      // console.log(category1Id, category2Id, spu)
      // 收集父组件传的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spuName = spu.spuName
      // 获取平台属性数据: this.$API.attr.reqAttrList(category1Id, category2Id, spu.category3Id)
      // 获取销售属性: this.$API.sku.reqSpuSqleAttrList(spu.id)
      // 获取spu图片: this.$API.spu.reqSpuImageList(spu.id)
      Promise.all([
        this.$API.attr.reqAttrList(category1Id, category2Id, spu.category3Id),
        this.$API.spu.reqSpuSqleAttrList(spu.id),
        this.$API.spu.reqSpuImageList(spu.id)
      ]).then(values => {
        // console.log(values)
        if (values[0].code === 200) {
          this.spuAttrList = values[0].data
        }
        if (values[1].code === 200) {
          this.spuSaleAttrList = values[1].data
        }
        if (values[2].code === 200) {
          let imgArr = values[2].data
          imgArr.forEach(item => {
            item.isDefault = 0
          })
          this.spuImageList = imgArr
        }
      })
    },
    // 点击取消按钮返回spu展示页面
    goSpuListshow() {
      // 通知父组件切换展示的页面
      this.$emit('toggleToSpu', 0)
      // 清除数据（数据回显问题）
      Object.assign(this._data, this.$options.data())
    },
    // 当选择项发生变化时会触发该事件：table表格复选框点击
    handleSelectionChange(val) {
      // console.log(val)
      this.imgList = val
    },
    // 点击设置默认值
    changeDefault(row) {
      // 遍历每个对象，将每个图片改为设为默认状态
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 将点击的这张图片的设为默认
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 保存按钮：添加sku信息
    async addSku() {
      // 整理发送给服务器的数据
      // 平台属性
      this.spuAttrList.forEach(item => {
        if (item.attrObj) {
          // console.log(item.attrObj)
          this.skuInfo.skuAttrValueList.push(item.attrObj)
        }
      })
      // 销售属性
      this.spuSaleAttrList.forEach(item => {
        if (item.saleAttrObj) {
          this.skuInfo.skuSaleAttrValueList.push(item.saleAttrObj)
        }
      })
      // 图片信息
      this.skuInfo.skuImageList = this.imgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 提交整理好的数据
      let result = await this.$API.spu.reqAddSku(this.skuInfo)
      if (result.code === 200) {
        this.$message.success('添加成功')
        // 清除数据（数据回显问题）
        Object.assign(this._data, this.$options.data())
        // 通知父组件切换展示的页面
        this.$emit('toggleToSpu', 0)
      }
    }
  }
}
</script>

<style></style>
