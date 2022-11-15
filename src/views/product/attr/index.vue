<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="isShowAttrList"></CategorySelect>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 数据展示页面解构 -->
      <div v-show="isShowAttrList">
        <el-button type="primary" icon="el-icon-plus" :disabled="!cateList3Id" @click="isShowAttrList = false"
          >添加属性</el-button
        >
        <el-table border style="width: 100%; margin-top: 10px" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180"> </el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                style="margin-right: 10px"
                size="small"
                v-for="attrVal in row.attrValueList"
                :key="attrVal.id"
                >{{ attrVal.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="{ row }">
              <el-button type="warning" size="small" icon="el-icon-edit" @click="updateAttrValue(row)"></el-button>
              <el-button type="danger" size="small" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加||修改页面结构 -->
      <div v-show="!isShowAttrList">
        <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model.trim="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @mousedown.native="clearAttrValue">取消</el-button>
        <el-table border style="width: 100%; margin: 10px 0" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row }">
              <el-input
                ref="inputRef"
                size="mini"
                placeholder="请输入属性值名称"
                v-model.trim="row.valueName"
                v-if="row.flag"
                @blur="toggleBar(row)"
                @keyup.native.enter="$event.target.blur"
              ></el-input>
              <span v-else @click="toggleFlag(row)" style="display: block; height: 23px">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <!-- 删除操作 -->
            <template slot-scope="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @confirm="deleteAttrValue($index)">
                <el-button type="danger" size="small" icon="el-icon-delete" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="AddOrUpdateAttr" :disabled="attrInfo.attrValueList.length === 0"
          >保存</el-button
        >
        <el-button @mousedown.native="clearAttrValue">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入深拷贝
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      // 一级分类id
      cateList1Id: '',
      // 二级分类id
      cateList2Id: '',
      // 三级分类id
      cateList3Id: '',
      // 平台属性
      attrList: [],
      // 表示是否展示属性列表
      isShowAttrList: true,
      // 收集新增属性或修改属性
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [], // 属性值
        categoryId: '', // 三级分类id
        categoryLevel: 3 // 区分分类等级的，三级分类
      }
    }
  },
  methods: {
    // 自定义事件：获取分类id的事件回调，cateListId为分类id，level为分类等级
    getCategoryId(cateListId, level) {
      // 一级分类
      if (level === 1) {
        this.cateList1Id = cateListId
        // 清除数据
        this.cateList2Id = ''
        this.cateList3Id = ''
      }
      // 二级分类
      else if (level === 2) {
        this.cateList2Id = cateListId
        // 清除数据
        this.cateList3Id = ''
      }
      // 三级分类
      else {
        this.cateList3Id = cateListId
        // 当三级分类获取成功时，向服务器发起请求，获取数据
        this.showPage()
      }
    },
    // 向服务器发起请求，展示页面
    async showPage() {
      let result = await this.$API.attr.reqAttrList(this.cateList1Id, this.cateList2Id, this.cateList3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
      this.isShowAttrList = true
    },
    // 添加属性值的回调
    addAttrValue() {
      // 添加属性
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true // 用于控制input与span的切换
      })
      // 点击添加属性值时input框渲染成功后自动获取焦点
      this.$nextTick(() => {
        this.$refs.inputRef.focus()
      })
    },
    // input框切换为span
    toggleBar(row) {
      // 判断输入的值不能为空
      if (row.valueName === '') {
        return this.$message.warning('输入的属性值不能为空！')
      }
      // 判断输入的值是否重复
      let result = this.attrInfo.attrValueList.some(item => {
        // 判断排除自身
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (result) {
        this.$message.warning('不能添加重复的属性值')
        this.$refs.inputRef.focus()
        return
      }
      // input切换到span
      row.flag = false
    },
    // span切换为input框
    toggleFlag(row) {
      row.flag = true
      // 从span切换到input框时自动获取焦点
      this.$nextTick(() => {
        this.$refs.inputRef.focus()
      })
    },
    // 取消时清除添加页面的输入的数据
    clearAttrValue() {
      // 切换页面
      this.isShowAttrList = true
      // 清除数据
      this.attrInfo.attrName = ''
      this.attrInfo.attrValueList = []
      this.attrInfo.categoryId = this.cateList3Id
    },
    // 修改属性值信息回调
    updateAttrValue(row) {
      // 切换页面
      this.isShowAttrList = false
      // 使用cloneDeep进行深拷贝
      this.attrInfo = cloneDeep(row)
      // 遍历每条属性值数据，添加flag响应式属性
      this.attrInfo.attrValueList.forEach(item => {
        // 响应式数据需要使用 set() 添加
        this.$set(item, 'flag', false)
      })
    },
    // 气泡确认框的回调，即删除属性值列表的属性值
    deleteAttrValue(index) {
      // console.log(index)
      // 删除选中的属性值
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮：向服务器提交添加或者更新属性的回调
    async AddOrUpdateAttr() {
      // 整理属性，添加的空的属性值不能提交到服务器
      // flag字段不能提交给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 将属性值不为空的过滤出来
        if (item.valueName !== '') {
          // 删除flag字段
          delete item.flag
          return true
        }
      })
      try {
        // 将整理好的属性提交到服务器
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        if (result.code === 200) {
          // 切换到展示页面
          this.isShowAttrList = true
          // 提示消息
          this.$message.success('保存成功')
          // 提交成功后重新渲染页面
          this.showPage()
        }
      } catch (error) {
        // 保存失败之后再次遍历属性添加flag
        // 遍历每条属性值数据，添加flag响应式属性
        this.attrInfo.attrValueList.forEach(item => {
          // 响应式数据需要使用 set() 添加
          this.$set(item, 'flag', false)
        })
      }
    }
  }
}
</script>

<style></style>
