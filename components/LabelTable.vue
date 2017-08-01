<template>
  <table>
    <thead>
      <tr><th v-for="column in columns">{{column}}</th></tr>
    </thead>
    <tbody>
      <tr v-for="row in moQueried">
        <td v-for="column in columns">{{colMap[column](row)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {moLocalTable} from 'mo-vue-table'

export default {
  mixins: [moLocalTable],
  data: () => ({
    columns: ['Labels', 'Governance & Transparency', 'Environmental impact', 'Social impact'],
    colMap: {
      'Labels': row => row.label.name,
      'Governance & Transparency': row => row.govTrans,
      'Environmental impact': row => row.envImpact,
      'Social impact': row => row.scoImpact
    }
  })
}
</script>

<style>

</style>
