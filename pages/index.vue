<template>
  <label-table :moData="tableData" :moConfig="tableConfig"></label-table>
</template>

<script>
  import LabelTable from '../components/LabelTable.vue'

  import {LabelsRes} from '../lib/api/LabelsRes.js'
  import {_COLUMNS_, _OPERATORS_, _ROUTE_} from '../config/config.js'

  import {
    deserializeArray,
    deserializeOrderBy,
    deserializeQueryFactory
  } from '../lib/deserialize.js'

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

      // Async fetch labels data
      let resp = null
      try {
        resp = await LabelsRes.fetch()
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
