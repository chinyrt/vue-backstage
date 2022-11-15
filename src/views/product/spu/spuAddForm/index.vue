<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spuData">
      <el-form-item label="SPU名称">
        <el-input width="width" placeholder="SPU名称" v-model="spuData.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuData.tmId">
          <el-option :label="tmd.name" :value="tmd.id" v-for="tmd in tradeMarkData" :key="tmd.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spuData.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/upload"
          list-type="picture-card"
          :file-list="spuImage"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSucess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="saleAtrr">
          <el-option :label="sa.name" :value="sa" v-for="sa in unSelectSaleAttr" :key="sa.id"></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 5px"
          :disabled="!saleAtrr"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table border style="width: 100%; margin-top: 10px" :data="spuData.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150"> </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
                v-model.trim="row.inputValue"
                v-if="row.inputVisible"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ $index }">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteSaleAttr($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="goSpuListshow">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuAddForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu信息
      spuData: {
        category3Id: 0, // 三级分类id
        description: '', // spu描述
        spuName: '', // spu名称
        tmId: '', // 品牌id
        // spu图片
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],
        // 属性值列表
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      // 品牌信息
      tradeMarkData: [],
      // spu图片
      spuImage: [],
      // 销售属性
      spuMarket: [],
      // 销售属性id
      saleAtrr: ''
    }
  },
  methods: {
    // 照片墙删除某张图片时触发
    // file: 代表删除的那张图片; fileList: 剩余的图片
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.spuData.spuImageList = fileList
      // this.spuImage = fileList
    },
    // spu图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件上传成功时触发
    handleSucess(response, file, fileList) {
      this.spuImage = fileList
    },
    // 添加销售属性值
    addSaleAttrValue(row) {
      // 添加响应式数据: inputVisible: 控制input与button的切换，inputValue: 收集输入的属性值数据
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 添加销售属性值后，输入框失去焦点时的回调
    handleInputConfirm(row) {
      // 新增的属性值不能重复
      let flag = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === row.inputValue)
      if (flag) return this.$message.warning('不能重复添加相同的属性值')

      // 切换到button
      row.inputVisible = false
      // 新增的属性值不能为空
      if (row.inputValue === '') return
      // 保存新增的属性值
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: row.inputValue,
        spuId: this.spuData.id
      })
    },
    // 触发自定义事件：切换到spu列表展示页面
    goSpuListshow() {
      this.$emit('toggleSpuList', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 修改时初始化spu
    async initUpdateSpuData(row) {
      console.log(row)
      // 获取某个spu的信息
      let spuResult = await this.$API.spu.reqGetSpuMsg(row.id)
      if (spuResult.code === 200) {
        this.spuData = spuResult.data
      }
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqGetTrademarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkData = tradeMarkResult.data
      }
      // 获取spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id)
      if (spuImageResult.code === 200) {
        let arr = spuImageResult.data
        arr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImage = arr
      }
      // 获取平台全部的销售属性
      let spuMarketResult = await this.$API.spu.reqBaseSaleAttrList()
      if (spuMarketResult.code === 200) {
        this.spuMarket = spuMarketResult.data
      }
    },
    // 添加spu时初始化
    async initAddSpuData(cateList3Id) {
      // 获取cateList3Id
      this.spuData.category3Id = cateList3Id
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqGetTrademarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkData = tradeMarkResult.data
      }
      // 获取平台全部的销售属性
      let spuMarketResult = await this.$API.spu.reqBaseSaleAttrList()
      if (spuMarketResult.code === 200) {
        this.spuMarket = spuMarketResult.data
      }
    },
    // 添加销售属性
    addSaleAttr() {
      // 添加一个销售属性
      this.spuData.spuSaleAttrList.push({
        baseSaleAttrId: this.saleAtrr.id,
        saleAttrName: this.saleAtrr.name,
        spuSaleAttrValueList: []
      })
      // 重新计算剩下的销售属性
      this.saleAtrr = ''
    },
    // 删除销售属性
    deleteSaleAttr(index) {
      this.spuData.spuSaleAttrList.splice(index, 1)
    },
    // 添加或者更新spu的回调
    async addOrUpdateSpu() {
      // 整理图片数据
      this.spuData.spuImageList = this.spuImage.map(item => {
        return {
          uid: item.uid,
          imgName: item.name,
          imgUrl: item.imgUrl ? item.imgUrl : item.response.data
        }
      })
      // 向服务器发送请求保存数据
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuData)
      // console.log(result)
      if (result.code === 200) {
        this.$message.success('保存成功')
        // 通知父组件切换页面
        this.goSpuListshow()
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    // 计算还未选择的销售属性
    unSelectSaleAttr() {
      return this.spuMarket.filter(item => {
        return this.spuData.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  }
}
</script>

<style>
/* tag标签 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
