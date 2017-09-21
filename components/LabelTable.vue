<template>
  <div>
    <div>
      <el-button @click="queryDialogVisible = true">{{$tc('Basics.Filter', 2)}}</el-button>

      <el-input class="search-input" icon="search" :value="search" @input="searchChange" @blur="searchBlur"></el-input>

      <lang-select class="lang-select" :lang="lang" @langChange="langChange"></lang-select>
    </div>

    <!-- <pre>{{queryList}}</pre> -->

    <div class="queryList">
      <div class="queryStr" :key="index" v-for="(qlItem, index) in queryList">
        <div class="queryItem">{{columnLabel(qlItem.left)}} </div> <div class="queryItem">{{opLabel(qlItem.op, lang)}} </div>
        <template v-if="isListOperator(qlItem.op)">
          <span :key="index" v-for="(val, index) in qlItem.right">
            <eval-circle v-if="columnIsRating(qlItem.left)" class="queryItem" :value="projectValue(qlItem.left, val)"></eval-circle>
            <div v-else class="queryItem"><el-tag type="gray">{{projectLabel(qlItem.left, val)}}</el-tag></div>
          </span>
        </template>
        <template v-else>
          <eval-circle v-if="columnIsRating(qlItem.left)" class="queryItem" :value="projectValue(qlItem.left, qlItem.right)"></eval-circle>
          <div v-else class="queryItem"><el-tag type="gray">{{projectLabel(qlItem.left, qlItem.right)}}</el-tag></div>
        </template>
      </div>
    </div>

    <table v-show="moData.items.length > 0">
      <thead>
        <tr>
          <template v-for="column in mappedSelectedColumns">
            <template v-if="columnIsSortable(column[0])">
              <th :key="column[1]" :class="columnClass(column[0])" v-mo-toggle-orderby="column[0]">{{columnLabel(column[0], lang)}}</th>
            </template>
            <template v-else>
              <th :key="column[1]" :class="columnClass(column[0])">{{columnLabel(column[0], lang)}}</th>
            </template>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(row, index) in moData.items">
          <td :key="colIndex" v-for="(column, colIndex) in mappedSelectedColumns">
            <eval-circle v-if="columnIsRating(column[0])" :value="columnValue(row, column[0])"></eval-circle>
            <span class="pointable" v-else-if="columnHasInfo(column[0])" @click="showInfoDialog(row, column[0])">
              <img v-if="row.logo" class="logoImg" :src="imageApi(row.logo)">
              {{columnValue(row, column[0])}}
            </span>
            <span v-else-if="columnIsList(column[0])">
              <span :key="index" v-for="(li, index) in columnValue(row, column[0])">
                <span v-if="index < columnValue(row, column[0]).length-1">{{projectItemLabel(column[0], li)}}, </span>
                <span v-else>{{projectItemLabel(column[0], li)}}</span>
              </span>
            </span>
            <span v-else>{{columnValue(row, column[0])}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="noResults" v-show="moData.items.length === 0">{{$t('Texts.NoResults')}}</div>

    <el-pagination v-if="moData.items.length > 0" small layout="prev, pager, next"
     :total="moData.pages.total * moConfig.limit" :current-page="moConfig.page" :page-size="moConfig.limit" @current-change="pageChange">
    </el-pagination>

    <table-legend @click="bginfoDialogVisible = true"></table-legend>

    <div class="last-row">
      <el-button @click="customizeDialogVisible = true">{{$t('Buttons.CustomizeTable')}}</el-button>
      <el-button @click="shareDialogVisible = true">{{$t('Buttons.Share')}}</el-button>
    </div>

    <!-- Filters Dialog -->
    <query-dialog :visible.sync="queryDialogVisible" @close="queryDialogResult"
     :queryObj="moConfig.extendedQuery" :selectedColumns="queryableSelectedColumns">
    </query-dialog>

    <!-- Info Dialog -->
    <info-dialog :visible.sync="infoDialogVisible" :label="infoDialogInput"></info-dialog>

    <!-- Bg Info Dialog -->
    <bginfo-dialog :visible.sync="bginfoDialogVisible"></bginfo-dialog>

    <!-- Share Dialog -->
    <share-dialog :visible.sync="shareDialogVisible" :config="moConfig"></share-dialog>

    <!-- Customize Display Dialog -->
    <customize-dialog :visible.sync="customizeDialogVisible" @close="customizeDialogResult"
      :selectedColumns="moConfig.selected">
    </customize-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import debounce from 'lodash.debounce'
  import {moLocalTable} from 'mo-vue-table'

  import {
    _OPERATORS_, _COLUMNS_, _ORDERBY_, _EVENTS_
  } from '../config/config.js'

  import {id} from '../lib/fp.js'
  import {queryObjToArr} from '../lib/transformQuery.js'

  import LangSelect from './LangSelect.vue'
  import TableLegend from './TableLegend.vue'

  import QueryDialog from './QueryDialog/QueryDialog.vue'
  import ShareDialog from './ShareDialog/ShareDialog.vue'
  import InfoDialog from './InfoDialog/InfoDialog.vue'
  import BgInfoDialog from './BgInfoDialog/BgInfoDialog.vue'
  import CustomizeDialog from './CustomizeDialog/CustomizeDialog.vue'

  import {shrinkModel} from '../lib/queryModel.js'

  import {SET_LANG} from '../store/mutation-types.js'

  import {isListOperator} from '../lib/operator.js'

  export default {
    props: ['moData', 'moConfig'],
    mixins: [moLocalTable],
    components: {
      'lang-select': LangSelect,
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
        search: this.moConfig.search,
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
      ...mapState(['lang']),
      offset() { return (this.moConfig.page - 1) * this.moConfig.limit },
      completeQuery() {
        // Perform case insenstive search on label name
        const searchQuery = {'label.name': {$text: {$search: this.moConfig.search}}}
        return this.search.length > 0 ? Object.assign(searchQuery, this.moConfig.extendedQuery) : this.moConfig.extendedQuery
      },
      shrunkQuery() {
        return shrinkModel(this.completeQuery)
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
      'moConfig.offset': { handler() { this.moSetOffset(this.moConfig.offset) }, immediate: true },
      'moConfig.limit': { handler() { this.moSetLimit(this.moConfig.limit) }, immediate: true },
      'moConfig.selected': { handler() { this.moSetSelectState(this.moConfig.selected) }, immediate: true },
      shrunkQuery: { handler() { this.moSetWhereState(this.shrunkQuery) }, immediate: true },
      'moConfig.orderBy': { handler() { this.moTable.orderBy = this.moConfig.orderBy }, immediate: true },
      moOrder() { this.orderByChange() },
      lang(language) {
        this.$i18n.locale = language
      }
    },
    methods: {
      isListOperator(op) {
        return isListOperator(_OPERATORS_.opLabelMapRev[op])
      },
      showInfoDialog(row, col) {
        this.infoDialogInput = {row, col}
        this.infoDialogVisible = true
      },
      langChange: function(lang) {
        this.$store.commit(SET_LANG, lang)
        this.emitEncode({lang}, {lang: true})
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
      queryDialogResult(newQuery) { this.emitEncode(shrinkModel(newQuery), {query: true}) },
      searchBlur() { this.emitEncode({search: this.search.length > 0 ? this.search : undefined}, {search: true}) },
      orderByChange() { this.emitEncode(this.moTable.orderBy, {orderBy: true}) },
      pageChange(page) { this.emitEncode({page}, {page: true}) },
      // Helper methods on columns
      projectLabel(column, model) {
        const cModel = this.columnMeta(column).model
        return model[cModel.projectLabel]
      },
      projectValue(column, model) {
        const cModel = this.columnMeta(column).model
        return model[cModel.projectValue]
      },
      projectItemLabel(column, li) {
        const model = this.columnMeta(column)
        return model.projectItemLabel(li)
      },
      columnClass(column) {
        const dir = this.moColumnOrder(column)
        return dir !== null ? [`mo-${dir}`] : []
      },
      columnLabel(column, lang) {
        return this.$i18n.t(_COLUMNS_.columnLabelMap[column], lang)
      },
      opLabel(op, lang) {
        return this.$i18n.t(op, lang)
      },
      columnValue: (row, column) => _COLUMNS_.columnValFuncMap[column](row),
      columnMapRev: column => _COLUMNS_.columnValueMapRev[column],
      columnMeta: column => _COLUMNS_.columnMeta[column],
      columnIsRating(column) {
        return this.columnMeta(column).type === _COLUMNS_.types.RATING
      },
      columnHasInfo(column) {
        return this.columnMeta(column).hasInfo
      },
      columnIsSortable(column) {
        return this.columnMeta(column).isSortable
      },
      columnIsList(column) {
        return this.columnMeta(column).type === _COLUMNS_.types.LIST
      },
      imageApi(url) {
        return `${url}-/resize/x70/`
      }
    }
  }
</script>

<style>
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
    margin-top: 2px;
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
    max-width: 70px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .checkbox.el-checkbox {
    display: block;
    margin-left: 0px;
    margin-bottom: 10px;
  }
</style>
