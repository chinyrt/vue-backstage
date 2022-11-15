<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from '@/views/dashboard/card'
import Sale from '@/views/dashboard/sale'
import Observe from '@/views/dashboard/observe'
export default {
  name: 'Dashboard',
  components: { Card, Sale, Observe },
  mounted() {
    this.list = this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>
</style>
