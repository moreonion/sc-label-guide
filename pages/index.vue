<template>
  <label-table :mo-table-data="tableData"></label-table>
</template>

<script>
  import axios from 'axios'
  import LabelTable from '../components/LabelTable.vue'

  export default {
    components: {LabelTable},
    async asyncData ({isServer, req, isDev, route}) {
      const protocol = isDev ? 'http' : 'https'
      let res = {data: []}

      const host = isServer ? req.headers.host : location.host

      try {
        res = await axios.get(`${protocol}://${host}/labels.json`)
      } catch (err) {
        console.error(JSON.stringify(err.message))
      }

      return {
        tableData: res.data
      }
    }
  }
</script>

<style>

</style>
