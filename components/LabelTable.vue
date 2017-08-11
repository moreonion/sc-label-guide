<template>
  <div class="cont">
    <div>
      <el-button @click="queryDialogVisible = true">Filters</el-button>

      <el-input class="search-input" icon="search" :value="search" @input="searchChange" @blur="searchBlur"></el-input>

      <lang-select class="lang-select" :lang.sync="lang"></lang-select>
    </div>

    <div class="queryList">
      <div class="queryStr" v-for="qlItem in queryList">
        <div class="queryItem">{{colNameMap[qlItem.left]}} </div> <div class="queryItem">{{qlItem.op}} </div>
        <eval-circle class="queryItem" :value="qlItem.right" v-if="columnIsRating(qlItem.left)"></eval-circle>
        <div class="queryItem" v-else>{{qlItem.right}}</div>
      </div>
    </div>

    <table v-show="moDisplayed.length > 0">
      <thead>
        <tr>
          <th v-for="column in mappedSelectedColumns" :key="column[1]" :class="columnClass(column[0])"
            v-mo-toggle-orderby="column[0]">{{colNameMap[column[0]]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in moDisplayed">
          <td v-for="column in mappedSelectedColumns">
            <eval-circle v-if="columnIsRating(column[0])" :value="columnValue(row, column[0])"></eval-circle>
            <span class="pointable" v-else-if="columnHasInfo(column[0])" @click="showInfoDialog(row, column[0])">
              <img class="logoImg" :src="row[columnMapRev[column[0]]].img">
              {{columnValue(row, column[0])}}
            </span>
            <span v-else>{{columnValue(row, column[0])}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="noResults" v-show="moDisplayed.length === 0">No results found for specified filters or search term!</div>

    <el-pagination v-if="moQueried.length > 0" small layout="prev, pager, next"
     :total="moQueried.length" :current-page="page" :page-size="limit" @current-change="pageChange">
    </el-pagination>

    <table-legend @click="bginfoDialogVisible = true"></table-legend>

    <div class="last-row">
      <el-button @click="customizeDialogVisible = true">Customize Display</el-button>
      <el-button @click="shareDialogVisible = true">Share it</el-button>
    </div>

    <!-- Filters Dialog -->
    <query-dialog :visible.sync="queryDialogVisible" @close="queryDialogResult"
      :queryObj="query" :selectedColumns="mappedSelectedColumns" :colNameMap="colNameMap"
      :columnMeta="columnMeta">
    </query-dialog>

    <!-- Info Dialog -->
    <info-dialog :visible.sync="infoDialogVisible" :label="infoDialogInput"></info-dialog>

    <!-- Bg Info Dialog -->
    <bginfo-dialog :visible.sync="bginfoDialogVisible"></bginfo-dialog>

    <!-- Share Dialog -->
    <share-dialog :visible.sync="shareDialogVisible"></share-dialog>

    <!-- Customize Display Dialog -->
    <customize-dialog :visible.sync="customizeDialogVisible" @close="customizeDialogResult"
      :selectableColumns="selectableColumns" :selectedColumns="selected" :colNameMap="colNameMap">
    </customize-dialog>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import {moLocalTable} from 'mo-vue-table'

  import {_OPERATORS_, _COLUMNS_} from '../config/config.js'

  import {id} from '../lib/fp.js'

  import {
    deserializeArray,
    deserializeOrderBy,
    deserializeQueryFactory
  } from '../lib/deserialize.js'

  import {
    serializeArray,
    serializeOrderBy,
    serializeQueryFactory
  } from '../lib/serialize.js'

  import {queryObjToArr} from '../lib/queryTransform.js'

  import LangSelect from './LangSelect.vue'
  import EvalCircle from './EvalCircle.vue'
  import TableLegend from './TableLegend.vue'

  import QueryDialog from './QueryDialog/QueryDialog.vue'
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
      'query-dialog': QueryDialog,
      'share-dialog': ShareDialog,
      'info-dialog': InfoDialog,
      'bginfo-dialog': BgInfoDialog,
      'customize-dialog': CustomizeDialog
    },
    data() {
      // Deserialize route query parameters
      const {
        select: _serSelect,
        orderBy: _serOrderBy,
        orderDir: _serOrderDir,
        limit: _serLimit,
        page: _serPage,
        search: _serSearch
        // eq, gt, gte,lt, lte - Serialized operators may also be attached
      } = this.$route.query

      const columnMap = {
        'label': 'label.name',
        'govTrans': 'govTrans',
        'envImpact': 'envImpact',
        'socImpact': 'socImpact'
      }

      let selected = _COLUMNS_.columns

      if(_serSelect) {
        // Given the selectable columns, deserialize selected columns from query parameters
        const _queryColumns = deserializeArray(_serSelect)
        selected = _COLUMNS_.columns.filter(selCol => _queryColumns.find(col => columnMap[col] === selCol[0]))
      }

      // Deserialize orderBy, fallback to 'asc' ordering when direction is not provided
      const orderBy = (_serOrderBy && _serOrderDir)
        ? deserializeOrderBy(_serOrderBy, _serOrderDir, column => columnMap[column], 'asc') : []

      const columnMeta = {
        'label.name': {type: 'text', hasInfo: true},
        'govTrans': {type: 'rating'},
        'envImpact': {type: 'rating'},
        'socImpact': {type: 'rating'}
      }

      const _deserializeQuery = deserializeQueryFactory(
        serOp => _OPERATORS_.opSerMapRev[serOp],
        serColumn => columnMap[serColumn],
        (column, val) => columnMeta[column].type === 'rating' ? parseInt(val) : val)

      const query = _OPERATORS_.ops.map(o => [o, _OPERATORS_.opSerMap[o]]).reduce((accum, [op, serOp]) => {
        const serOpVal = this.$route.query[serOp]
        if(serOpVal) {
          Object.assign(accum, _deserializeQuery(serOpVal, serOp))
        }
        return accum
      }, {})

      return {
        // Basic table data
        lang: 'English',
        // Paramterizable by router query
        limit: _serLimit ? parseInt(_serLimit) : 5,
        page: _serPage ? parseInt(_serPage) : 1,
        orderBy,
        search: _serSearch || '',
        query,
        selected,
        // Column meta data
        columnMeta,
        // Mapping data
        colNameMap: {
          'label.name': 'Label',
          'govTrans': 'Governance& Transparency',
          'envImpact': 'Environmental impact',
          'socImpact': 'Social impact'
        },
        colValMap: {
          'label.name': row => row.label.name,
          'govTrans': row => row.govTrans,
          'envImpact': row => row.envImpact,
          'socImpact': row => row.socImpact
        },
        columnMap,
        columnMapRev: {
          'label.name': 'label',
          'govTrans': 'govTrans',
          'envImpact': 'envImpact',
          'socImpact': 'socImpact'
        },
        // Dialog visibility and data
        queryDialogVisible: false,
        shareDialogVisible: false,
        infoDialogVisible: false,
        infoDialogInput: {},
        bginfoDialogVisible: false,
        customizeDialogVisible: false
      }
    },
    computed: {
      selectableColumns: () => _COLUMNS_.columns,
      offset() { return (this.page - 1) * this.limit },
      completeQuery() {
        // Perform case insenstive search on label name
        const searchQuery = {'label.name': {$text: {$search: this.search}}}
        return this.search.length > 0 ? Object.assign(searchQuery, this.query) : this.query
      },
      queryList() {
        const queryArr = queryObjToArr(this.completeQuery, id, op => _OPERATORS_.opLabelMap[op])
        return queryArr.filter(q => q.op !== '$text')
      },
      mappedSelectedColumns() {
        return this.moSelectedColumns.map(([col, colIndx]) => [this.columnMap[col], colIndx])
      }
    },
    watch: {
      offset: { handler() { this.moSetOffset(this.offset) }, immediate: true },
      limit: { handler() { this.moSetLimit(this.limit) }, immediate: true },
      selected: { handler() { this.moSetSelectState(this.selected) }, immediate: true },
      completeQuery: { handler() { this.moSetWhereState(this.completeQuery) }, immediate: true },
      orderBy: { handler() { this.moTable.orderBy = this.orderBy }, immediate: true },
      moOrder() { this.orderByChange() }
    },
    methods: {
      columnClass(column) {
        const dir = this.moColumnOrder(column)
        return dir !== null ? [`mo-${dir}`] : []
      },
      columnValue(row, column) {
        return this.colValMap[column](row)
      },
      columnIsRating(column) {
        return this.columnMeta[column].type === 'rating'
      },
      columnHasInfo(column) {
        return this.columnMeta[column].hasInfo
      },
      showInfoDialog(row, col) {
        this.infoDialogInput = {row, col}
        this.infoDialogVisible = true
      },
      searchChange: debounce(function(search) {
        this.page = 1
        this.search = search
      }, 200),
      searchBlur() { this.routerPush(this.handleSerSearch(), {search: true}) },
      handleSerSearch() {
        return {search: this.search.length > 0 ? this.search : undefined}
      },
      pageChange(page) { this.routerPush({page}, {page: true}) },
      orderByChange() { this.routerPush(this.handleSerOrderBy(), {orderBy: true}) },
      handleSerOrderBy() {
        return this.moOrder.length > 0
          ? serializeOrderBy([
            this.moOrder[0].map(field => this.columnMapRev[field]),
            this.moOrder[1]]) : {}
      },
      queryDialogResult(newQuery) {
        this.routerPush(Object.assign(this.handleSerQuery(newQuery), {page: 1}), {query: true})
      },
      handleSerQuery(query) {
        const serializeQuery = serializeQueryFactory(
          field => this.columnMapRev[field],
          op => _OPERATORS_.opSerMap[op])

        return serializeQuery(query)
      },
      customizeDialogResult(selected) {
        this.routerPush(this.handleSerSelect(selected), {select: true})
      },
      handleSerSelect(selected) {
        return selected.length !== this.selectableColumns.length ? {select: serializeArray(selected.map(col => col[0]))} : undefined
      },
      routerPush(queryParams, ignore) {
        this.$router.push({name: 'index', query: this.assembleQueryParams(queryParams, ignore)})
      },
      assembleQueryParams(queryParams, ignore={}) {
        // Serialize state as route query params
        const prepQuery = {}

        if(!ignore.page) { prepQuery.page = this.page }

        if(!ignore.limit) { prepQuery.limit = this.limit }

        if(!ignore.search) { Object.assign(prepQuery, this.handleSerSearch()) }

        if(!ignore.oderBy) { Object.assign(prepQuery, this.handleSerOrderBy()) }

        if(!ignore.select) { Object.assign(prepQuery, this.handleSerSelect(this.selected)) }

        if(!ignore.query) { Object.assign(prepQuery, this.handleSerQuery(this.query)) }

        return Object.assign(prepQuery, queryParams)
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

  .queryList {
    transform: scale(0.8);
    transform-origin: top left;
  }

  .queryStr {
    display: flex;
    align-items: center;
  }

  .queryItem {
    margin-left: 2px;
    margin-right: 2px;
  }

  table {
    width: 100%;
    border-spacing: 0px;
    border: 1px solid #D9DADB;
    margin-top: 5px;
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
    height: 100px;
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

  .logoImg {
    max-width: 50px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .checkbox.el-checkbox {
    display: block;
    margin-left: 0px;
    margin-bottom: 10px;
  }
</style>
