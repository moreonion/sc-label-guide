<template>
  <label-table :moData="tableData" :moConfig="tableConfig"></label-table>
</template>

<script>
  import LabelTable from '../components/LabelTable.vue'

  import {LabelsRes} from '../lib/api/LabelsRes.js'
  import {_COLUMNS_, _OPERATORS_, _ROUTE_, _API_, _ORDERBY_} from '../config/config.js'

  import {
    decodeArray,
    decodeOrderBy,
    decodeQueryFactory
  } from '../lib/decode.js'

  import {
    encodeApiOrderBy,
    encodeApiQuery
  } from '../lib/encodeApi.js'

  export default {
    components: {LabelTable},
    async asyncData({route}) {
      // Deserialize route query parameters
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
        // Given the selectable columns, deserialize selected columns from query parameters
        const queryColumns = decodeArray(_encSelect, _ROUTE_.queryDelim)
        selected = _COLUMNS_.columns.filter(selCol => queryColumns.find(col => col === selCol[0]))
      }

      const columnMap = _COLUMNS_.columnValueMap

      // Deserialize orderBy, fallback to 'asc' ordering when direction is not provided
      const orderBy = (_encOrderBy && _encOrderDir)
        ? decodeOrderBy(_encOrderBy, _encOrderDir, column => columnMap[column], _ORDERBY_.token.asc, _ROUTE_.queryDelim) : []

      const _decodeQuery = decodeQueryFactory(
        serOp => _OPERATORS_.opEncMapRev[serOp],
        serColumn => columnMap[serColumn],
        (column, val) => _COLUMNS_.columnMeta[column].type === _COLUMNS_.types.RATING ? parseInt(val) : val,
        _ROUTE_.queryDelim,
        _ROUTE_.querySubDelim)

      const query = _OPERATORS_.ops.map(o => [o, _OPERATORS_.opEncMap[o]]).reduce((accum, [op, serOp]) => {
        const serOpVal = route.query[serOp]
        if(serOpVal) {
          Object.assign(accum, _decodeQuery(serOpVal, serOp))
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

      // Async fetch labels data
      let resp = null
      try {
        resp = await LabelsRes.fetch(Object.assign({limit, page, sort: qSort, only: qSelect}, qQuery, qSearch))
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
    created: function() {
      this.$on('serializeRouteQuery', query => {
        console.log('serializeRouteQuery')
      })
    }
  }
</script>

<style>

</style>
