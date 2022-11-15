<template>
  <div>
    <el-button type="primary" style="margin-bottom: 10px" @click="updateDialogFormVisible">添加</el-button>
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"> </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button type="warning" icon="el-icon-edit" size="small" @click="updateTradeMrak(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteTradeMrak(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      :current-page //当前第几页
      :page-size //每页展示的数据条数
      :total //总的数据条数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
     -->
    <el-pagination
      style="margin-top: 10px"
      align="center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[4, 6, 8]"
      :total="total"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getTradeMarkList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 对话框 -->
    <!-- 
      :visible.sync：控制对话框显示与隐藏
      label-width：控制元素的宽
      :model：收集表单数据
     -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 
        Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
       -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="120px" prop="tmName">
          <el-input autocomplete="off" v-model.trim="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="120px" prop="logoUrl">
          <!-- 
            action: 上传文件的地址
            :on-success: 可以检测文件是否上传成功，上传成功会执行一次
            :before-upload: 图片上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 当前页
      page: 1,
      // 每页展示的数据条数
      limit: 4,
      // 总的数据条数
      total: 0,
      // 列表展示数据
      list: [],
      // 控制对话框的值
      dialogFormVisible: false,
      // 图片上传
      imageUrl: '',
      // 收集品牌form表单数据
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请选择需要上传的图片' }]
      }
    }
  },
  methods: {
    // 获取列表数据
    async getTradeMarkList(page = 1) {
      this.page = page
      let result = await this.$API.trademark.reqTradeMarkList(this.page, this.limit)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 分页器某一页需要展示的数据条数发生变化时触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getTradeMarkList()
    },
    // 显示对话框并清除
    updateDialogFormVisible() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 图片上传成功执行一次
    handleAvatarSuccess(res, file) {
      // 用户上传的服务器一般是cdn，返回给前端一个url
      // res: 上传成功之后element-UI服务器返回前端的数据
      // file: 上传成功后服务器返回前端的数据
      this.tmForm.logoUrl = res.data
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传之前执行
    beforeAvatarUpload(file) {
      // 判断上传图片的格式
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      // 判断上传图片的大小
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 修改品牌信息
    updateTradeMrak(value) {
      // console.log(value)
      // 修改数据之前将
      this.tmForm = { ...value }

      this.dialogFormVisible = true
    },
    // 添加或者修改品牌
    addOrUpdateTradeMark() {
      // 执行添加之前判断表单验证是否通过
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          this.dialogFormVisible = false
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          // console.log(result)
          if (result.code === 200) {
            this.$message.success(this.tmForm.id ? '修改品牌成功！' : '添加品牌成功！')
            // 重新渲染页面之前判断当前处于哪个页面
            this.getTradeMarkList(this.tmForm.id ? this.page : 1)
          }
        } else {
          return false
        }
      })
    },
    // 删除品牌数据
    deleteTradeMrak(value) {
      // console.log(value)
      // this.$API.trademark.reqDeleteTradeMark(value.id)
      this.$confirm(`是否确认删除${value.tmName}品牌`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 向服务器端发送请求，删除服务器端的数据
          let result = await this.$API.trademark.reqDeleteTradeMark(value.id)
          if (result.code === 200) {
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 重新渲染页面
            this.getTradeMarkList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  // 挂载时执行
  mounted() {
    this.getTradeMarkList()
  }
}
</script>

<style>
/* 图片上传 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
