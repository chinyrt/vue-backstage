<template>
  <div>
    <!-- 
      :inline: 表示行内表单模式，一行可以放置多个表单元素
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cateForm" :disabled="!show">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cateForm.cateList1Id" @change="getCategory2List">
          <el-option :label="cl1.name" :value="cl1.id" v-for="cl1 in categorylist1" :key="cl1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cateForm.cateList2Id" @change="getCategory3List">
          <el-option :label="cl2.name" :value="cl2.id" v-for="cl2 in categorylist2" :key="cl2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cateForm.cateList3Id" @change="showCategory3List">
          <el-option :label="cl3.name" :value="cl3.id" v-for="cl3 in categorylist3" :key="cl3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 收集一级分类数据
      categorylist1: [],
      // 收集二级分类数据
      categorylist2: [],
      // 收集三级分类数据
      categorylist3: [],
      // 收集分类id
      cateForm: {
        // 一级分类id
        cateList1Id: '',
        // 二级分类id
        cateList2Id: '',
        // 三级分类id
        cateList3Id: ''
      }
    }
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.categorylist1 = result.data
      }
    },
    // 一级分类select选中时获取对应类别的二级分类数据
    async getCategory2List() {
      // 清除数据
      this.categorylist2 = []
      this.categorylist3 = []
      this.cateForm.cateList2Id = ''
      this.cateForm.cateList3Id = ''
      // 自定义事件传参：子组件给父组件传递一级分类id
      this.$emit('getCategoryId', this.cateForm.cateList1Id, 1)
      // 获取数据
      let result = await this.$API.attr.reqCategory2List(this.cateForm.cateList1Id)
      if (result.code === 200) {
        this.categorylist2 = result.data
      }
    },
    // 二级分类select选中时获取对应类别的三级分类数据
    async getCategory3List() {
      // 清除数据
      this.categorylist3 = []
      this.cateForm.cateList3Id = ''
      // 自定义事件传参：子组件给父组件传递二级分类id
      this.$emit('getCategoryId', this.cateForm.cateList2Id, 2)
      // 获取数据
      let result = await this.$API.attr.reqCategory3List(this.cateForm.cateList2Id)
      if (result.code === 200) {
        this.categorylist3 = result.data
      }
    },
    // 三级分类select选中时展示对应类别的分类数据
    async showCategory3List() {
      // 触发自定义事件，子组件向父组件传递三级分类id
      this.$emit('getCategoryId', this.cateForm.cateList3Id, 3)
    }
  },
  mounted() {
    // 组件挂载完毕，向服务器发起请求，获取一级分类数据
    this.getCategory1List()
  }
}
</script>

<style></style>
