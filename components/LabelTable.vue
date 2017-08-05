<template>
  <div class="cont">
    <el-row :gutter="10">
      <el-col :xs="8" :sm="4">
        <btn class="table-ctrl">Filters</btn>
      </el-col>

      <el-col :xs="8" :sm="12">
        <search-input :search.sync="search"></search-input>
      </el-col>

      <el-col :xs="8" :sm="{offset:2, span:6}">
        <lang-select class="table-ctrl lang" :lang.sync="lang"></lang-select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
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
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-pagination small layout="prev, pager, next" :page-size="limit" :total="moQueried.length" v-on:current-change="pageChange"></el-pagination>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <table-legend></table-legend>
      </el-col>
    </el-row>

    <el-row class="last-row">
      <el-col :xs="14" :sm="9">
        <btn class="table-ctrl"><i class="el-icon-setting"></i> Customize Display</btn>
      </el-col>
      <el-col :xs="10" :sm="8">
        <btn class="table-ctrl"><i class="el-icon-share"></i> Share it</btn>
      </el-col>
    </el-row>
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
    colMap: {
      'label': row => row.label.name,
      'govTrans': row => row.govTrans,
      'envImpact': row => row.envImpact,
      'scoImpact': row => row.scoImpact
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

  .table-ctrl {
    margin-right: 10px;
  }

  .lang {
    margin-right: 0px;
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

  .el-pagination {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .last-row {
    padding-top: 10px;
  }
</style>
