<template>
  <div>
    <el-row :gutter="5">
      <el-col :xs="6" :sm="4"><el-button class="filters-btn" @click="queryDialogVisible = true">{{$tc('Basics.Filter', 2)}}</el-button></el-col>
      <el-col :xs="12" :sm="8"><el-input class="search-input" icon="search" :value="search" @input="searchChange"></el-input></el-col>
      <el-col :xs="6" :sm="{'span': 4, 'offset': 8}"><lang-select class="lang-select" :lang="lang" @langChange="langChange"></lang-select></el-col>
    </el-row>

    <!-- <pre>{{queryList}}</pre> -->
    <query-list :queryList="queryList"></query-list>

    <div class="table-wrapper">
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
    </div>
    <div class="noResults" v-show="moData.items.length === 0">{{$t('Texts.NoResults')}}</div>

    <el-pagination v-if="moData.items.length > 0" small layout="prev, pager, next"
     :total="moData.pages.total * moConfig.limit" :current-page="moConfig.page" :page-size="moConfig.limit" @current-change="pageChange">
    </el-pagination>

    <table-legend @click="bginfoDialogVisible = true"></table-legend>

    <div class="actions-row">
      <el-button @click="customizeDialogVisible = true">{{$t('Buttons.CustomizeTable')}}</el-button>
      <el-button @click="shareDialogVisible = true">{{$t('Buttons.Share')}}</el-button>
    </div>

    <query-dialog :visible.sync="queryDialogVisible" @close="queryDialogResult"
     :queryObj="extendedQuery" :selectedColumns="queryableSelectedColumns">
    </query-dialog>

    <info-dialog :visible.sync="infoDialogVisible" :label="infoDialogInput"></info-dialog>

    <bginfo-dialog :visible.sync="bginfoDialogVisible"></bginfo-dialog>

    <share-dialog :visible.sync="shareDialogVisible" :config="moConfig"></share-dialog>

    <customize-dialog :visible.sync="customizeDialogVisible" @close="customizeDialogResult" :selectedColumns="moConfig.selected">
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
  import {shrinkModel, extendModel} from '../lib/queryModel.js'
  import {LabelsRes} from '../lib/api/LabelsRes.js'
  import {moColumnHelpers} from '../lib/mixins/ColumnHelpers.js'

  import {SET_LANG} from '../store/mutation-types.js'

  import LangSelect from './LangSelect.vue'
  import TableLegend from './TableLegend.vue'

  import QueryDialog from './QueryDialog/QueryDialog.vue'
  import ShareDialog from './ShareDialog/ShareDialog.vue'
  import InfoDialog from './InfoDialog/InfoDialog.vue'
  import BgInfoDialog from './BgInfoDialog/BgInfoDialog.vue'
  import CustomizeDialog from './CustomizeDialog/CustomizeDialog.vue'
  import QueryList from './QueryList.vue'

  export default {
    props: ['moData', 'moConfig'],
    mixins: [moLocalTable, moColumnHelpers],
    components: {
      'query-list': QueryList,
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
    asyncComputed: {
      async extendedQuery() {
        const res = await extendModel(this.moConfig.query, this.lang)
        return res
      }
    },
    computed: {
      ...mapState(['lang']),
      offset() { return (this.moConfig.page - 1) * this.moConfig.limit },
      shrunkQuery() {
        if(this.extendedQuery !== null) {
          return shrinkModel(this.extendedQuery)
        } else {
          return {$and: []}
        }
      },
      queryList() {
        if(this.extendedQuery !== null) {
          const queryArr = queryObjToArr(this.extendedQuery, id, op => _OPERATORS_.opLabelMap[op])
          return queryArr.filter(q => q.op !== '$text')
        } else {
          return []
        }
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
      'moConfig.orderBy': { handler() { this.moTable.orderBy = this.moConfig.orderBy }, immediate: true },
      moOrder() { this.orderByChange() },
      shrunkQuery: { handler() { this.moSetWhereState(this.shrunkQuery) }, immediate: true },
      lang: {
        handler: function(language) {
          this.$i18n.locale = language
        },
        immediate: true
      }
    },
    methods: {
      async showInfoDialog(row, col) {
        const {data: {item}} = await LabelsRes.fetchId(row.id, {
          only: 'description,name,meets_criteria',
          include: 'meets_criteria.criterion.all',
          lang: this.lang
        })

        this.infoDialogInput = {row: item, col}
        this.infoDialogVisible = true
      },
      langChange: function(lang) {
        this.$store.commit(SET_LANG, lang)
        this.emitEncode({lang}, {lang: true})
      },
      searchChange: debounce(function(search) {
        this.search = search
        this.$emit(_EVENTS_.Index.fetch, search)
      }, 200),
      // Emit encode as route query params
      emitEncode: function(query, ignore) {
        this.$emit(_EVENTS_.Index.encodeAsRouteQuery, query, ignore)
      },
      customizeDialogResult(selected) { this.emitEncode(selected, {select: true}) },
      queryDialogResult(newQuery) { this.emitEncode(shrinkModel(newQuery), {query: true}) },
      orderByChange() { this.emitEncode(this.moTable.orderBy, {orderBy: true}) },
      pageChange(page) { this.emitEncode({page}, {page: true}) },
      imageApi: url => `${url}-/resize/x70/`
    }
  }
</script>

<style>
  .filters-btn {
    width: 100%;
  }

  .table-wrapper {
    overflow-y: scroll;
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

  .actions-row {
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
</style>
