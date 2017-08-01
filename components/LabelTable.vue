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
    columns: ['Labels', 'Governance& Transparency', 'Environmental impact', 'Social impact'],
    colMap: {
      'Labels': row => row.label.name,
      'Governance& Transparency': row => row.govTrans,
      'Environmental impact': row => row.envImpact,
      'Social impact': row => row.scoImpact
    }
  })
}
</script>

<style>
  table {
    border-spacing: 0px;
    border: 1px solid #D9DADB;
    max-width: 500px;
    margin: 0 auto;
  }

  table thead {
    background: #EFEFEF;
    font-color: #404040;
    font-size: 10px;
    text-align: left
  }

  table th {
    padding: 20px;
    border-bottom: 1px solid #D9DADB;
  }

  table th:not(:last-child), table td:not(:last-child) {
    border-right: 1px solid #D9DADB;
  }

  table th:first-child {
    width: 50%;
  }

  table td {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #D9DADB;
  }

  table tr:last-child td {
    border-bottom: none;
  }

  table td:first-child {
    text-align: left;
  }
</style>
