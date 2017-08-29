<template>
  <el-autocomplete
    class="inline-input"
    v-model="state1"
    :fetch-suggestions="querySearch"
    placeholder="Please Input"
    @select="handleSelect">
  </el-autocomplete>
</template>

<script>
export default {
  methods: {
    querySearch(queryString, cb) {
      cb([1,2,3])
    }
  }
}
</script>

<style>

</style>
