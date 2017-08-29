<template>
  <div class="cont">
    <div>
      <el-button @click="queryDialogVisible = true">Filters</el-button>

      <el-input class="search-input" icon="search" :value="search" @input="searchChange" @blur="searchBlur"></el-input>

      <lang-select class="lang-select" :lang.sync="lang"></lang-select>
    </div>

    <!-- <pre>{{search}}</pre> -->

    <div class="queryList">
      <div class="queryStr" v-for="qlItem in queryList">
        <div class="queryItem">{{columnLabel(qlItem.left)}} </div> <div class="queryItem">{{qlItem.op}} </div>
        <eval-circle class="queryItem" :value="qlItem.right" v-if="columnIsRating(qlItem.left)"></eval-circle>
        <div class="queryItem" v-else>{{qlItem.right}}</div>
      </div>
    </div>

    <table v-show="moData.items.length > 0">
      <thead>
        <tr>
          <template v-for="column in mappedSelectedColumns">
            <template v-if="columnIsSortable(column[0])">
              <th :key="column[1]" :class="columnClass(column[0])" v-mo-toggle-orderby="column[0]">{{columnLabel(column[0])}}</th>
            </template>
            <template v-else>
              <th :key="column[1]" :class="columnClass(column[0])">{{columnLabel(column[0])}}</th>
            </template>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in moData.items">
          <td v-for="column in mappedSelectedColumns">
            <eval-circle v-if="columnIsRating(column[0])" :value="columnValue(row, column[0])"></eval-circle>
            <span class="pointable" v-else-if="columnHasInfo(column[0])" @click="showInfoDialog(row, column[0])">
              <img v-if="row.logo" class="logoImg" :src="row.logo">
              {{columnValue(row, column[0])}}
            </span>
            <span v-else-if="columnIsList(column[0])">
              <span :key="li.id" v-for="(li, index) in columnValue(row, column[0])">
                <span v-if="index < columnValue(row, column[0]).length-1">{{li.name}}, </span>
                <span v-else>{{li.name}}</span>
              </span>
            </span>
            <span v-else>{{columnValue(row, column[0])}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="noResults" v-show="moData.items.length === 0">No results found for specified filters or search term!</div>

    <el-pagination v-if="moData.items.length > 0" small layout="prev, pager, next"
     :total="moData.pages.total * limit" :current-page="page" :page-size="limit" @current-change="pageChange">
    </el-pagination>

    <table-legend @click="bginfoDialogVisible = true"></table-legend>

    <div class="last-row">
      <el-button @click="customizeDialogVisible = true">Customize Display</el-button>
      <el-button @click="shareDialogVisible = true">Share it</el-button>
    </div>

    <!-- Filters Dialog -->
    <query-dialog :visible.sync="queryDialogVisible" @close="queryDialogResult"
     :queryObj="query" :selectedColumns="queryableSelectedColumns">
    </query-dialog>

    <!-- Info Dialog -->
    <info-dialog :visible.sync="infoDialogVisible" :label="infoDialogInput"></info-dialog>

    <!-- Bg Info Dialog -->
    <bginfo-dialog :visible.sync="bginfoDialogVisible"></bginfo-dialog>

    <!-- Share Dialog -->
    <share-dialog :visible.sync="shareDialogVisible"></share-dialog>

    <!-- Customize Display Dialog -->
    <customize-dialog :visible.sync="customizeDialogVisible" @close="customizeDialogResult"
      :selectedColumns="selected">
    </customize-dialog>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import {moLocalTable} from 'mo-vue-table'

  import {
    _OPERATORS_, _COLUMNS_, _ORDERBY_, _EVENTS_
  } from '../config/config.js'

  import {id} from '../lib/fp.js'
  import {queryObjToArr} from '../lib/transformQuery.js'

  import LangSelect from './LangSelect.vue'
  import EvalCircle from './EvalCircle.vue'
  import TableLegend from './TableLegend.vue'

  import QueryDialog from './QueryDialog/QueryDialog.vue'
  import ShareDialog from './ShareDialog/ShareDialog.vue'
  import InfoDialog from './InfoDialog/InfoDialog.vue'
  import BgInfoDialog from './BgInfoDialog/BgInfoDialog.vue'
  import CustomizeDialog from './CustomizeDialog/CustomizeDialog.vue'

  export default {
    props: ['moData', 'moConfig'],
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
    created: function() {
      this.moTable.config.orderBy.token = _ORDERBY_.token
    },
    data() {
      return {
        lang: this.moConfig.lang,
        selected: this.moConfig.selected,
        query: this.moConfig.query,
        search: this.moConfig.search,
        orderBy: this.moConfig.orderBy,
        limit: this.moConfig.limit,
        page: this.moConfig.page,
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
        return this.search.length > 0 ? Object.assign(searchQuery, this.query) : this.query
      },
      queryList() {
        const queryArr = queryObjToArr(this.completeQuery, id, op => _OPERATORS_.opLabelMap[op])
        return queryArr.filter(q => q.op !== '$text')
      },
      mappedSelectedColumns() {
        return this.moSelectedColumns.map(([col, colIndx]) => [_COLUMNS_.columnValueMap[col], colIndx])
      },
      queryableSelectedColumns() {
        return this.mappedSelectedColumns.filter(c => _COLUMNS_.columnMeta[c[0]].isQueryable)
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
        this.search = search
        this.$emit(_EVENTS_.Index.fetch, search)
      }, 1000),
      // Emit encode as route query params
      emitEncode: function(query, ignore) {
        this.$emit(_EVENTS_.Index.encodeAsRouteQuery, query, ignore)
      },
      customizeDialogResult(selected) { this.emitEncode(selected, {select: true}) },
      queryDialogResult(newQuery) { this.emitEncode(newQuery, {query: true}) },
      searchBlur() { this.emitEncode({search: this.search.length > 0 ? this.search : undefined}, {search: true}) },
      orderByChange() { this.emitEncode(this.moTable.orderBy, {orderBy: true}) },
      pageChange(page) { this.emitEncode({page}, {page: true}) },
      // Helper methods on columns
      columnClass(column) {
        const dir = this.moColumnOrder(column)
        return dir !== null ? [`mo-${dir}`] : []
      },
      columnLabel: column => _COLUMNS_.columnLabelMap[column],
      columnValue: (row, column) => _COLUMNS_.columnValFuncMap[column](row),
      columnIsRating: column => _COLUMNS_.columnMeta[column].type === _COLUMNS_.types.RATING,
      columnHasInfo: column => _COLUMNS_.columnMeta[column].hasInfo,
      columnMapRev: column => _COLUMNS_.columnValueMapRev[column],
      columnIsSortable: column => _COLUMNS_.columnMeta[column].isSortable,
      columnIsList: column => _COLUMNS_.columnMeta[column].type === _COLUMNS_.types.LIST
    }
  }
</script>

<style>
  .cont {
    padding: 10px;
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
