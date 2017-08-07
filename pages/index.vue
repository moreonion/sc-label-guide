<template>
  <label-table :mo-table-data="tableData"></label-table>
</template>

<script>
  import axios from 'axios'
  import LabelTable from '../components/LabelTable.vue'

  // const labels = [
  //   {name: 'RSPO', img: 'logos/RSPO.png'},
  //   {name: 'EU Organic', img: 'logos/EU.jpg'},
  //   {name: 'Fairtrade', img: 'logos/Fairtrade.png'},
  //   {name: 'UTZ', img: 'logos/UTZ.png'}
  // ]
  //
  // const rndLabel = () => labels[Math.floor(Math.random() * labels.length)]
  // const rndRating = () => Math.ceil(Math.random() * 3)
  //
  // const genTableData = num => {
  //   const res = []
  //   for (let i = 0; i < num; i++) {
  //     res.push({
  //       label: rndLabel(),
  //       govTrans: rndRating(),
  //       envImpact: rndRating(),
  //       scoImpact: rndRating()
  //     })
  //   }
  //   return res
  // }

  export default {
    components: {
      LabelTable
    },
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
