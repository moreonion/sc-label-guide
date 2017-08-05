<template>
  <label-table :mo-table-data="tableData"></label-table>
</template>

<script>
import LabelTable from '../components/LabelTable.vue'

const labelNames = ['RSPO', 'EU Organic', 'Fairtrade', 'UTZ']
const rndLabelName = () => labelNames[Math.floor(Math.random() * (labelNames.length - 1))]
const rndLabel = () => ({name: rndLabelName(), img: null})
const rndRating = () => Math.ceil(Math.random() * 3)

const genTableData = num => {
  const res = []
  for (let i = 0; i < num; i++) {
    res.push({
      label: rndLabel(),
      govTrans: rndRating(),
      envImpact: rndRating(),
      scoImpact: rndRating()
    })
  }
  return res
}

export default {
  components: {
    LabelTable
  },
  asyncData: () => ({
    tableData: genTableData(200)
  })
}
</script>

<style>

</style>
