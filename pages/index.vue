<template>
  <label-table :moData="tableData" :moConfig="tableConfig" @encodeAsRouteQuery="encodeHandler"></label-table>
</template>

<script>
  import LabelTable from '../components/LabelTable.vue'

  import {LabelsRes} from '../lib/api/LabelsRes.js'
  import {_COLUMNS_, _OPERATORS_, _ROUTE_, _API_, _ORDERBY_} from '../config/config.js'

  import {debug as D} from '../lib/debug.js'

  import {
    decodeArray,
    decodeOrderBy,
    decodeQueryFactory
  } from '../lib/decode.js'

  import {
    encodeApiOrderBy,
    encodeApiQuery
  } from '../lib/encodeApi.js'

  import {
    encodeArray,
    encodeOrderBy
    // encodeQueryFactory
  } from '../lib/encode.js'

  export default {
    components: {LabelTable},
    async asyncData({route}) {
      // Decode route query parameters
      const {
        select: _encSelect,
        orderBy: _encOrderBy,
        orderDir: _encOrderDir,
        limit: _encLimit,
        page: _encPage,
        search: _encSearch
        // eq, gt, gte,lt, lte - Encialized operators may also be attached
      } = route.query

      let selected = _COLUMNS_.columns

      if(_encSelect) {
        // Given the selectable columns, decode selected columns from query parameters
        const queryColumns = decodeArray(_encSelect, _ROUTE_.queryDelim)
        selected = _COLUMNS_.columns.filter(selCol => queryColumns.find(col => col === selCol[0]))
      }

      const columnMap = _COLUMNS_.columnValueMap

      // Decode orderBy, fallback to 'asc' ordering when direction is not provided
      const orderBy = (_encOrderBy && _encOrderDir)
        ? decodeOrderBy(_encOrderBy, _encOrderDir, column => columnMap[column], _ORDERBY_.token.asc, _ROUTE_.queryDelim) : {}

      const _decodeQuery = decodeQueryFactory(
        encOp => _OPERATORS_.opEncMapRev[encOp],
        encColumn => columnMap[encColumn],
        (column, val) => _COLUMNS_.columnMeta[column].type === _COLUMNS_.types.RATING ? parseInt(val) : val,
        _ROUTE_.queryDelim,
        _ROUTE_.querySubDelim)

      const query = _OPERATORS_.ops.map(o => [o, _OPERATORS_.opEncMap[o]]).reduce((accum, [op, encOp]) => {
        const encOpVal = route.query[encOp]
        if(encOpVal) {
          Object.assign(accum, _decodeQuery(encOpVal, encOp))
        }
        return accum
      }, {})

      const search = _encSearch || ''
      const limit = _encLimit ? parseInt(_encLimit) : 5
      const page = _encPage ? parseInt(_encPage) : 1

      // Prepare API query params
      // select
      const qSelect = 'name,details,description,meets_criteria' // tmp select

      // where
      const qQuery = encodeApiQuery(query,
        col => _COLUMNS_.columnValueMapRev[col],
        op => _OPERATORS_.opEncApiMap[op])

      const qSearch = search.length > 0 ? {'name': search} : {}

      // orderby
      const qOrderBy = encodeApiOrderBy(orderBy, _API_.queryDelim, _API_.orderBy.token.asc, _API_.orderBy.token.desc)
      const qSort = qOrderBy.length > 0 ? qOrderBy : undefined

      const fetchParams = Object.assign({limit, page, sort: qSort, only: qSelect}, qQuery, qSearch)
      // Async fetch labels data
      let resp = null
      try {
        resp = await LabelsRes.fetch(fetchParams)
      } catch(err) {
        console.error(JSON.stringify(err.message))
      }

      return {
        tableData: resp.data,
        tableConfig: {
          lang: 'English',
          selected,
          query,
          search,
          orderBy,
          limit,
          page
        }
      }
    },
    methods: {
      encodeHandler: function(params, ignore) {
        D('ENCODE_HANDLER', params)

        if(ignore.select) {
          const encSelect = this.handleEncSelect(params)
          this.routerPush({select: encSelect}, ignore)
        } else if(ignore.query) {

        } else if(ignore.orderBy) {
          const [encOrderBy, encOrderDir] = this.handleEncOrderBy(params)

          this.routerPush({orderBy: encOrderBy, orderDir: encOrderDir}, ignore)
        } else if(ignore.search || ignore.page) {
          // can be directly pushed
          this.routerPush(params, ignore)
        }
      },
      handleEncSelect(selected) {
        return selected.length !== _COLUMNS_.columns.length
          ? encodeArray(selected.map(col => col[0]), _ROUTE_.queryDelim) : undefined
      },
      handleEncOrderBy(orderBy) {
        return encodeOrderBy(orderBy,
          col => _COLUMNS_.columnValueMapRev[col],
          _ROUTE_.queryDelim)
      },
      // handleEncQuery(query) {
      //   const encodeQuery = encodeQueryFactory(
      //     column => _COLUMNS_.columnValueMapRev[column],
      //     op => _OPERATORS_.opEncMap[op],
      //     _ROUTE_.queryDelim,
      //     _ROUTE_.querySubDelim)
      //
      //   return encodeQuery(query)
      // },
      routerPush(queryParams, ignore) {
        this.$router.push({name: 'index', query: this.assembleQueryParams(queryParams, ignore)})
      },
      assembleQueryParams(queryParams, ignore={}) {
        // Encialize state as route query params
        const prepQuery = {}

        if(!ignore.page) { Object.assign(prepQuery, {page: this.tableConfig.page}) }
        //
        if(!ignore.limit) { Object.assign(prepQuery, {limit: this.tableConfig.limit}) }
        //
        if(!ignore.search && this.tableConfig.search.length > 0) { Object.assign(prepQuery, {search: this.tableConfig.search}) }

        if(!ignore.oderBy) {
          const [encOrderBy, encOrderDir] = this.handleEncOrderBy(this.tableConfig.orderBy)
          Object.assign(prepQuery, {orderBy: encOrderBy, orderDir: encOrderDir})
        }

        if(!ignore.select) {
          const encSelect = this.handleEncSelect(this.tableConfig.selected)
          Object.assign(prepQuery, {select: encSelect})
        }
        //
        // if(!ignore.query) { Object.assign(prepQuery, this.handleEncQuery(this.query)) }

        return Object.assign(prepQuery, queryParams)
      }
    }
  }
</script>

<style>

</style>
