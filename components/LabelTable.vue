<template>
  <div class="cont">
    <div>
      <btn class="table-ctrl">Filters</btn>

      <search-input class="search-input" :search.sync="search"></search-input>

      <lang-select class="lang-select" :lang.sync="lang"></lang-select>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="column in moSelectedColumns" v-mo-toggle-orderby="colPathMap[column[0]]" :key="column[1]"
            :class="moColumnOrder(colPathMap[column[0]]) !== null ? 'mo-' + moColumnOrder(colPathMap[column[0]]) : ''">
            {{colNameMap[column[0]]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in moDisplayed">
          <td v-for="column in moSelectedColumns">
            <eval-circle v-if="colValMap[column[0]](row) >= 0 && colValMap[column[0]](row) <= 3"
              :value="colValMap[column[0]](row)">
            </eval-circle>
            <span v-else>{{colValMap[column[0]](row)}}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <el-pagination small layout="prev, pager, next"
      :page-size="limit" :total="moQueried.length" v-on:current-change="pageChange">
    </el-pagination>

    <table-legend></table-legend>

    <div class="last-row">
      <btn class="table-ctrl"><i class="el-icon-setting"></i> Customize Display</btn>
      <btn class="table-ctrl"><i class="el-icon-share"></i> Share it</btn>
    </div>
  </div>
</template>

<script>
  import {moLocalTable} from 'mo-vue-table'

  import Btn from './Btn.vue'
  import SearchInput from './SearchInput.vue'
  import LangSelect from './LangSelect.vue'
  import EvalCircle from './EvalCircle.vue'
  import TableLegend from './TableLegend.vue'

  export default {
    mixins: [moLocalTable],
    components: {
      'btn': Btn,
      'search-input': SearchInput,
      'lang-select': LangSelect,
      'eval-circle': EvalCircle,
      'table-legend': TableLegend
    },
    data: () => ({
      limit: 5,
      page: 1,
      search: '',
      lang: 'English',
      columns: ['Labels', 'Governance& Transparency', 'Environmental impact', 'Social impact'],
      selected: [['label', 0], ['govTrans', 1], ['envImpact', 2], ['scoImpact', 3]],
      colNameMap: {
        'label': 'Labels',
        'govTrans': 'Governance& Transparency',
        'envImpact': 'Environmental impact',
        'scoImpact': 'Social impact'
      },
      colValMap: {
        'label': row => row.label.name,
        'govTrans': row => row.govTrans,
        'envImpact': row => row.envImpact,
        'scoImpact': row => row.scoImpact
      },
      colPathMap: {
        'label': 'label.name',
        'govTrans': 'govTrans',
        'envImpact': 'envImpact',
        'scoImpact': 'scoImpact'
      }
    }),
    created: function () {
      // Init table state
      this.moSetSelectState(this.selected)
      this.moSetLimit(this.limit)
    },
    methods: {
      pageChange: function (page) {
        this.page = page
      }
    },
    computed: {
      offset: function () {
        return (this.page - 1) * this.limit
      }
    },
    watch: {
      offset: {
        handler: function () {
          console.log('Set offset')
          this.moSetOffset(this.offset)
        },
        immediate: true
      }
    }
  }
</script>

<style>
  .cont {
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20px;
  }

  .el-button, .el-input {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
  }

  .search-input {
    max-width: 200px;
  }

  .lang-select {
    float: right;
    margin-right: 0px;
    max-width: 100px;
  }

  table {
    border-spacing: 0px;
    border: 1px solid #D9DADB;
    margin-top: 15px;
  }

  table thead {
    background: #EFEFEF;
    color: #404040;
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
    width: 40%;
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

  .el-pagination {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .last-row {
    padding-top: 10px;
  }
</style>
