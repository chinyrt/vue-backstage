<template>
  <div class="observe">
    <el-row :gutter="10">
      <el-col :span="12">
        <Hotbot></Hotbot>
      </el-col>
      <el-col :span="12">
        <Sort></Sort>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Hotbot from './hotbot'
import Sort from './sort'
export default {
  name: 'Observe',
  components: { Hotbot, Sort }
}
</script>

<style>
</style>