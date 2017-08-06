<template>
  <div class="cont">
    <div>
      <el-button @click="filtersDialogVisible = true">Filters</el-button>

      <el-input class="search-input" icon="search" :value="search" @input="searchChange" @blur="serializeSearch"></el-input>

      <lang-select class="lang-select" :lang.sync="lang"></lang-select>
    </div>

    <table v-show="moDisplayed.length > 0">
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
    <div class="noResults" v-show="moDisplayed.length === 0">No results found for specified filters or search term!</div>

    <el-pagination v-if="moQueried.length > 0" small layout="prev, pager, next"
     :total="moQueried.length" :current-page="page" :page-size="limit"
     @current-change="pageChange">
    </el-pagination>

    <table-legend @click="bginfoDialogVisible = true"></table-legend>

    <div class="last-row">
      <el-button @click="customizeDialogVisible = true">Customize Display</el-button>
      <el-button @click="shareDialogVisible = true">Share it</el-button>
    </div>

    <!-- Filters Dialog -->
    <filters-dialog :visible.sync="filtersDialogVisible" @close="filtersDialogResult"
      :query="filterQuery" :selectedColumns="selected" :colNameMap="colNameMap" :colSpec="colSpec">
    </filters-dialog>

    <!-- Info Dialog -->
    <info-dialog :visible.sync="infoDialogVisible" :label="infoDialogInput"></info-dialog>

    <!-- Bg Info Dialog -->
    <bginfo-dialog :visible.sync="bginfoDialogVisible"></bginfo-dialog>

    <!-- Share Dialog -->
    <share-dialog :visible.sync="shareDialogVisible"></share-dialog>

    <!-- Customize Display Dialog -->
    <customize-dialog :visible.sync="customizeDialogVisible" @close="customizeDialogResult"
      :selectableColumns="selectable" :selectedColumns="selected" :colNameMap="colNameMap">
    </customize-dialog>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import {moLocalTable} from 'mo-vue-table'

  import LangSelect from './LangSelect.vue'
  import EvalCircle from './EvalCircle.vue'
  import TableLegend from './TableLegend.vue'

  import FiltersDialog from './FiltersDialog/FiltersDialog.vue'
  import ShareDialog from './ShareDialog/ShareDialog.vue'
  import InfoDialog from './InfoDialog/InfoDialog.vue'
  import BgInfoDialog from './BgInfoDialog/BgInfoDialog.vue'
  import CustomizeDialog from './CustomizeDialog/CustomizeDialog.vue'

  export default {
    mixins: [moLocalTable],
    components: {
      'lang-select': LangSelect,
      'eval-circle': EvalCircle,
      'table-legend': TableLegend,
      'filters-dialog': FiltersDialog,
      'share-dialog': ShareDialog,
      'info-dialog': InfoDialog,
      'bginfo-dialog': BgInfoDialog,
      'customize-dialog': CustomizeDialog
    },
    data () {
      const query = this.$route.query
      const selectable = [['label', 0], ['govTrans', 1], ['envImpact', 2], ['scoImpact', 3]]
      let selected = selectable
      if (query.select !== undefined) {
        const cols = query.select.split(',')
        selected = selectable.filter(s => cols.find(c => c === s[0]))
      }

      return {
        limit: query.limit === undefined ? 5 : parseInt(query.limit),
        page: query.page === undefined ? 1 : parseInt(query.page),
        search: query.search === undefined ? '' : query.search,
        selectable,
        selected,
        filterQuery: {},
        lang: 'English',
        columns: ['Label', 'Governance& Transparency', 'Environmental impact', 'Social impact'],
        colNameMap: {
          'label': 'Label',
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
        colSpec: {
          'label': 'text',
          'govTrans': 'rating',
          'envImpact': 'rating',
          'scoImpact': 'rating'
        },
        filtersDialogVisible: false,
        shareDialogVisible: false,
        infoDialogVisible: false,
        infoDialogInput: {},
        bginfoDialogVisible: false,
        customizeDialogVisible: false
      }
    },
    methods: {
      routerPush: function (query) {
        this.$router.push({name: 'index', query})
      },
      serializeArray: function (arr, f) {
        return arr.map(f).join(',')
      },
      serializeColumns: function (cols) {
        return this.serializeArray(cols, c => c[0])
      },
      assembleQuery: function (query) {
        const prepQuery = ['page', 'limit', 'search'].reduce((accum, val) => {
          if (this[val]) {
            accum[val] = this[val]
          }
          return accum
        }, {})

        if (this.selected.length !== this.selectable.length) {
          prepQuery.select = this.serializeColumns(this.selected)
        }

        return Object.assign({}, prepQuery, query)
      },
      showInfoDialog: function (row, col) {
        this.infoDialogInput = {row, col}
        this.infoDialogVisible = true
      },
      filtersDialogResult: function (newQuery) {
        this.filterQuery = newQuery
      },
      customizeDialogResult: function (projected) {
        this.routerPush(this.assembleQuery({select: this.serializeColumns(projected)}))
      },
      searchChange: debounce(function (search) {
        this.search = search
      }, 200),
      pageChange: function (page) {
        this.routerPush(this.assembleQuery({page}))
      },
      serializeSearch: function () {
        this.routerPush(this.assembleQuery({search: this.search}))
      }
    },
    computed: {
      offset: function () {
        return (this.page - 1) * this.limit
      },
      query: function () {
        // Perform case insenstive search on label name
        const searchQuery = {
          'label.name': {
            $text: {
              $search: this.search
            }
          }
        }

        return Object.assign({}, this.search.length > 0 ? searchQuery : {}, this.filterQuery)
      }
    },
    watch: {
      offset: {
        handler: function () {
          this.moSetOffset(this.offset)
        },
        immediate: true
      },
      limit: {
        handler: function () {
          this.moSetLimit(this.limit)
        },
        immediate: true
      },
      selected: {
        handler: function () {
          this.moSetSelectState(this.selected)
        },
        immediate: true
      },
      query: {
        handler: function () {
          this.moSetWhereState(this.query)
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
