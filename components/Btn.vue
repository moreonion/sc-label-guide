<template>
  <el-button @click="btnClick"><slot></slot></el-button>
</template>

<script>
export default {
  methods: {
    btnClick: function () {
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>
