<template>
  <label-table :moData="tableData" :moConfig="tableConfig"></label-table>
</template>

<script>
  import LabelTable from '../components/LabelTable.vue'

  import {LabelsRes} from '../lib/api/LabelsRes.js'
  import {_COLUMNS_, _OPERATORS_, _ROUTE_, _API_} from '../config/config.js'

  import {
    deserializeArray,
    deserializeOrderBy,
    deserializeQueryFactory
  } from '../lib/deserialize.js'

  import {
    serializeApiOrderBy,
    serializeApiQuery
  } from '../lib/serializeApi.js'

  export default {
    components: {LabelTable},
    async asyncData({route}) {
      // Deserialize route query parameters
      const {
        select: _serSelect,
        orderBy: _serOrderBy,
        orderDir: _serOrderDir,
        limit: _serLimit,
        page: _serPage,
        search: _serSearch
        // eq, gt, gte,lt, lte - Serialized operators may also be attached
      } = route.query

      let selected = _COLUMNS_.columns

      if(_serSelect) {
        // Given the selectable columns, deserialize selected columns from query parameters
        const queryColumns = deserializeArray(_serSelect, _ROUTE_.queryDelim)
        selected = _COLUMNS_.columns.filter(selCol => queryColumns.find(col => col === selCol[0]))
      }

      const columnMap = _COLUMNS_.columnValueMap

      // Deserialize orderBy, fallback to 'asc' ordering when direction is not provided
      const orderBy = (_serOrderBy && _serOrderDir)
        ? deserializeOrderBy(_serOrderBy, _serOrderDir, column => columnMap[column], 'asc', _ROUTE_.queryDelim) : []

      const _deserializeQuery = deserializeQueryFactory(
        serOp => _OPERATORS_.opSerMapRev[serOp],
        serColumn => columnMap[serColumn],
        (column, val) => _COLUMNS_.columnMeta[column].type === _COLUMNS_.types.RATING ? parseInt(val) : val,
        _ROUTE_.queryDelim,
        _ROUTE_.querySubDelim)

      const query = _OPERATORS_.ops.map(o => [o, _OPERATORS_.opSerMap[o]]).reduce((accum, [op, serOp]) => {
        const serOpVal = route.query[serOp]
        if(serOpVal) {
          Object.assign(accum, _deserializeQuery(serOpVal, serOp))
        }
        return accum
      }, {})

      const search = _serSearch || ''
      const limit = _serLimit ? parseInt(_serLimit) : 5
      const page = _serPage ? parseInt(_serPage) : 1

      console.log(JSON.stringify(query))

      // Prepare API query params
      // select
      const qSelect = 'name,details,description,meets_criteria' // tmp select

      // where
      const qQuery = serializeApiQuery(query,
        col => _COLUMNS_.columnValueMapRev[col],
        op => _OPERATORS_.opSerApiMap[op])

      const qSearch = search.length > 0 ? {'name': search} : {}

      // orderby
      const qOrderBy = serializeApiOrderBy(orderBy, _API_.queryDelim, _API_.orderBy.token.asc, _API_.orderBy.token.desc)
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
