<template>
  <div class="cont">
    <btn class="table-ctrl" btn-text="Filters"></btn>

    <div class="search-cont">
      <search-input :search.sync="search"></search-input>
    </div>

    <lang-select class="table-ctrl lang" :lang.sync="lang"></lang-select>

    <table>
      <thead>
        <tr>
          <th v-mo-toggle-orderby="column[0]" :key="column[1]" v-for="column in moSelectedColumns"
            :class="moColumnOrder(column[0]) !== null ? 'mo-' + moColumnOrder(column[0]) : ''">{{column[0]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in moDisplayed">
          <td  v-for="column in moSelectedColumns">
            {{colMap[column[0]](row)}}
          </td>
        </tr>
      </tbody>
    </table>

    <eval-circle value="1"></eval-circle>
    <eval-circle value="2"></eval-circle>
    <eval-circle value="3"></eval-circle>


    <btn class="table-ctrl" btn-text="Customize Display"></btn>

    <btn class="table-ctrl" btn-text="Share it"></btn>

  </div>
</template>

<script>
import {moLocalTable} from 'mo-vue-table'

import Btn from './Btn.vue'
import SearchInput from './SearchInput.vue'
import LangSelect from './LangSelect.vue'
import EvalCircle from './EvalCircle.vue'

export default {
  mixins: [moLocalTable],
  components: {
    'btn': Btn,
    'search-input': SearchInput,
    'lang-select': LangSelect,
    'eval-circle': EvalCircle
  },
  data: () => ({
    search: '',
    lang: 'English',
    columns: ['Labels', 'Governance& Transparency', 'Environmental impact', 'Social impact'],
    selected: [['label', 0], ['govTrans', 1], ['envImpact', 2], ['scoImpact', 3]],
    colMap: {
      'label': row => row.label.name,
      'govTrans': row => row.govTrans,
      'envImpact': row => row.envImpact,
      'scoImpact': row => row.scoImpact
    }
  }),
  created: function () {
    this.moSetSelectState(this.selected)
    this.moSetLimit(5)
  }
}
</script>

<style>
  .cont {
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20px;
  }

  .search-cont {
    display: inline-block;
  }

  .table-ctrl {
    margin-right: 10px;
  }

  .lang {
    float: right;
    margin-right: 0px;
  }

  table {
    border-spacing: 0px;
    border: 1px solid #D9DADB;
    margin-top: 15px;
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

  .mo-asc::after {
    content: '\25B2';
    font-size: 9px;
  }

  .mo-desc::after {
    content: '\25BC';
    font-size: 9px;
  }
</style>
