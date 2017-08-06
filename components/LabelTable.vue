<template>
  <div class="cont">
    <div>
      <el-button @click="filtersDialogVisible = true">Filters</el-button>

      <search-input class="search-input" :search.sync="search"></search-input>

      <lang-select class="lang-select" :lang.sync="lang"></lang-select>
    </div>

    <table v-if="moDisplayed.length > 0">
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
            <eval-circle v-if="colIsRating[column[0]]" :value="colValMap[column[0]](row)"></eval-circle>
            <span class="pointable" v-else-if="colHasInfo[column[0]]" @click="showInfoDialog(row, column[0])">{{colValMap[column[0]](row)}}</span>
            <span v-else>{{colValMap[column[0]](row)}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="noResults" v-else>No results found for specified filters!</div>

    <el-pagination v-if="moQueried.length > 0" small layout="prev, pager, next"
      :page-size="limit" :total="moQueried.length" v-on:current-change="pageChange">
    </el-pagination>

    <table-legend @click="dialog['bgInfo'].visible = true"></table-legend>
{{shareDialogVisible}}
    <div class="last-row">
      <el-button @click="dialog['customize'].visible = true">Customize Display</el-button>
      <el-button @click="shareDialogVisible = true">Share it</el-button>
    </div>

    <!-- Share Dialog -->
    <share-dialog :visible.sync="shareDialogVisible"></share-dialog>

    <!-- Info Dialog -->
    <el-dialog :visible.sync="dialog['info'].visible">
      <span slot="title">Criteria this label has</span>
      <pre>{{dialog['info'].props.value}}</pre>
      <span slot="footer">
        <el-button @click="hideInfoDialog">Close</el-button>
      </span>
    </el-dialog>

    <!-- Bg Info Dialog -->
    <el-dialog :visible.sync="dialog['bgInfo'].visible">
      <span slot="title">How does the scoring work?</span>
      <h1>Header</h1>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
         tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
         vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
         no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
         consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
         dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
        dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.</p>
      <h2>Subheader</h2>
      <p>
        Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </p>
      <span slot="footer">
        <el-button @click="dialog['bgInfo'].visible = false">Close</el-button>
      </span>
    </el-dialog>

    <!-- Customize Display Dialog -->
    <el-dialog :visible.sync="dialog['customize'].visible">
      <span slot="title">Columns to show</span>
      <el-checkbox-group v-model="dialog['customize'].data.columns" :min="1">
        <el-checkbox class="checkbox" :key="column[1]" v-for="column in selectable" :label="column[0]">{{colNameMap[column[0]]}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer">
        <el-button @click="dialog['customize'].visible = false">Close</el-button>
        <el-button @click="projectColumns(dialog['customize'].data.columns)" type="primary">Apply</el-button>
      </span>
    </el-dialog>

    <!-- Filters Dialog -->
    <filters-dialog :visible.sync="filtersDialogVisible" @close="filtersDialogResult"
      :query="query" :selectedColumns="selected" :colNameMap="colNameMap">
    </filters-dialog>
  </div>
</template>

<script>
  import {moLocalTable} from 'mo-vue-table'

  import SearchInput from './SearchInput.vue'
  import LangSelect from './LangSelect.vue'
  import EvalCircle from './EvalCircle.vue'
  import TableLegend from './TableLegend.vue'
  import FiltersDialog from './FiltersDialog/FiltersDialog.vue'
  import ShareDialog from './ShareDialog/ShareDialog.vue'

  export default {
    mixins: [moLocalTable],
    components: {
      'search-input': SearchInput,
      'lang-select': LangSelect,
      'eval-circle': EvalCircle,
      'table-legend': TableLegend,
      'filters-dialog': FiltersDialog,
      'share-dialog': ShareDialog
    },
    data: () => ({
      limit: 5,
      page: 1,
      search: '',
      query: {},
      lang: 'English',
      columns: ['Labels', 'Governance& Transparency', 'Environmental impact', 'Social impact'],
      selectable: [['label', 0], ['govTrans', 1], ['envImpact', 2], ['scoImpact', 3]],
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
      },
      colHasInfo: {
        'label': true
      },
      colIsRating: {
        'govTrans': true,
        'envImpact': true,
        'scoImpact': true
      },
      filtersDialogVisible: false,
      shareDialogVisible: false,
      dialog: {
        'info': {
          visible: false,
          props: {
            value: null
          },
          data: {}
        },
        'bgInfo': {
          visible: false,
          data: {}
        },
        'customize': {
          visible: false,
          data: {
            columns: []
          }
        }
      }
    }),
    created: function () {
      // Init table state
      this.moSetSelectState(this.selected)
      this.moSetLimit(this.limit)

      this.selected.forEach(c => this.dialog['customize'].data.columns.push(c[0]))
    },
    methods: {
      pageChange: function (page) {
        this.page = page
      },
      showInfoDialog: function (row, col) {
        this.dialog['info'].props.value = {row, col}
        this.dialog['info'].visible = true
      },
      hideInfoDialog: function () {
        this.dialog['info'].visible = false
        this.dialog['info'].props.value = null
      },
      projectColumns: function (cols) {
        this.selected = this.selectable.filter(col => cols.find(c => c === col[0]) !== undefined)
        this.dialog['customize'].visible = false
      },
      filtersDialogResult: function (newQuery) {
        this.query = newQuery
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
      },
      selected: function () {
        this.moSetSelectState(this.selected)
      },
      query: function () {
        this.moSetWhereState(this.query)
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
    width: 100%;
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
    padding: 20px 10px;
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

  .noResults {
    padding: 20px;
  }

  .el-pagination {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .last-row {
    padding-top: 10px;
  }

  .pointable {
    cursor: pointer;
  }

  .checkbox.el-checkbox {
    display: block;
    margin-left: 0px;
    margin-bottom: 10px;
  }
</style>
