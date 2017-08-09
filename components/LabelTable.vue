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
        <eval-circle class="queryItem" :value="qlItem.right" v-if="colSpec[qlItem.left] === 'rating'"></eval-circle>
        <div class="queryItem" v-else>{{qlItem.right}}</div>
      </div>
    </div>

    <table v-show="moDisplayed.length > 0">
      <thead>
        <tr>
          <th v-for="column in moSelectedColumns" v-mo-toggle-orderby="colPathMap[column[0]]" :key="column[1]" :class="columnClass(column[0])">
            {{colNameMap[column[0]]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in moDisplayed">
          <td v-for="column in moSelectedColumns">
            <eval-circle v-if="colIsRating[column[0]]" :value="colValMap[column[0]](row)"></eval-circle>
            <span class="pointable" v-else-if="colHasInfo[column[0]]" @click="showInfoDialog(row, column[0])">
              <img class="logoImg" :src="row[column[0]].img">
              {{colValMap[column[0]](row)}}
            </span>
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
    <filters-dialog :visible.sync="queryDialogVisible" @close="queryDialogResult"
      :query="filterQuery" :selectedColumns="selected" :colNameMap="colNameMap" :colPathMap="colPathMap"
      :colSpec="colSpec">
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
    data() {
      // Deserialize route query parameters
      const {
        select: _serSelect,
        orderBy: _serOrderBy,
        orderDir: _serOrderDir,
        limit: _serLimit,
        page: _serPage,
        search: _serSearch,
        eq: _serEq,
        gt: _serGt,
        gte: _serGte,
        lt: _serLt,
        lte: _serLte
      } = this.$route.query

      // Given the selectable columns, deserialize selected columns from query parameters
      const selectable = [['label', 0], ['govTrans', 1], ['envImpact', 2], ['scoImpact', 3]]

      let selected = selectable

      if(_serSelect) {
        const queryColumns = deserializeArray(_serSelect)
        selected = selectable.filter(selCol => queryColumns.find(col => col === selCol[0]))
      }

      const colPathMap = {
        'label': 'label.name',
        'govTrans': 'govTrans',
        'envImpact': 'envImpact',
        'scoImpact': 'scoImpact'
      }

      // Deserialize orderBy, fallback to 'asc' ordering when direction is not provided
      const orderBy = (_serOrderBy && _serOrderDir) ? deserializeOrderBy(_serOrderBy, _serOrderDir, field => colPathMap[field], 'asc') : []

      const serOpMap = {
        'eq': '$eq',
        'gt': '$gt',
        'gte': '$gte',
        'lt': '$lt',
        'lte': '$lte'
      }

      const colSpec = {
        'label': 'text',
        'govTrans': 'rating',
        'envImpact': 'rating',
        'scoImpact': 'rating'
      }

      const deserializeQuery = deserializeQueryFactory(
        serOp => serOpMap[serOp],
        serField => colPathMap[serField],
        (field, val) => colSpec[field] === 'rating' ? parseInt(val) : val)

      const eq = _serEq ? deserializeQuery(_serEq, 'eq') : {}
      const gt = _serGt ? deserializeQuery(_serGt, 'gt') : {}
      const gte = _serGte ? deserializeQuery(_serGte, 'gte') : {}
      const lt = _serLt ? deserializeQuery(_serLt, 'lt') : {}
      const lte = _serLte ? deserializeQuery(_serLte, 'lte') : {}

      return {
        // Basic table data
        lang: 'English',
        selectable,
        // Paramterizable by router query
        limit: _serLimit ? parseInt(_serLimit) : 5,
        page: _serPage ? parseInt(_serPage) : 1,
        orderBy,
        search: _serSearch || '',
        filterQuery: Object.assign(eq, gt, gte, lt, lte),
        selected,
        // Column meta data
        colHasInfo: {
          'label': true
        },
        colIsRating: {
          'govTrans': true,
          'envImpact': true,
          'scoImpact': true
        },
        colSpec,
        // Mapping data
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
        colPathMap,
        colPathMapRev: {
          'label.name': 'label',
          'govTrans': 'govTrans',
          'envImpact': 'envImpact',
          'scoImpact': 'scoImpact'
        },
        opMapRev: {
          '$eq': 'is',
          '$gt': '>',
          '$gte': '>=',
          '$lt': '<',
          '$lte': '<=',
          '$text': '$text'
        },
        serOpMapRev: {
          '$eq': 'eq',
          '$gte': 'gte',
          '$gt': 'gt',
          '$lte': 'lte',
          '$lt': 'lt'
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
      offset() { return (this.page - 1) * this.limit },
      completeQuery() {
        // Perform case insenstive search on label name
        const searchQuery = {'label.name': {$text: {$search: this.search}}}
        return this.search.length > 0 ? Object.assign(searchQuery, this.filterQuery) : this.filterQuery
      },
      queryList() {
        const queryArr = queryObjToArr(this.completeQuery,
          field => this.colPathMapRev[field],
          op => this.opMapRev[op])

        return queryArr.filter(q => q.op !== '$text')
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
            this.moOrder[0].map(field => this.colPathMapRev[field]),
            this.moOrder[1]]) : {}
      },
      queryDialogResult(newQuery) {
        this.routerPush(Object.assign(this.handleSerQuery(newQuery), {page: 1}), {query: true})
      },
      handleSerQuery(query) {
        const serializeQuery = serializeQueryFactory(
          field => this.colPathMapRev[field],
          op => this.serOpMapRev[op])

        return serializeQuery(query)
      },
      customizeDialogResult(selected) {
        this.routerPush(this.handleSerSelect(selected), {select: true})
      },
      handleSerSelect(selected) {
        return selected.length !== this.selectable.length ? {select: serializeArray(selected.map(col => col[0]))} : undefined
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

        if(!ignore.query) { Object.assign(prepQuery, this.handleSerQuery(this.filterQuery)) }

        return Object.assign(prepQuery, queryParams)
      },
      columnClass(column) {
        const dir = this.moColumnOrder(this.colPathMap[column])
        return dir !== null ? [`mo-${dir}`] : []
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
