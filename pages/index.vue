<template>
  <div class="cont">
    <label-table :moData="tableData" :moConfig="tableConfig" @encodeAsRouteQuery="encodeHandler" @fetch="fetchData"></label-table>
  </div>
</template>

<script>
  // import D from '../lib/debug.js'
  import {mapState} from 'vuex'

  import LabelTable from '../components/LabelTable.vue'

  import {
    _COLUMNS_, _OPERATORS_, _ROUTE_, _ORDERBY_
  } from '../config/config.js'

  import {
    decodeArray, decodeOrderBy, decodeQueryFactory
  } from '../lib/decode.js'

  import fetchLabels from '../lib/api/fetchLabels.js'

  import {Validation} from '../lib/validation.js'

  import {extendModel} from '../lib/queryModel.js'

  import {
    handleEncSelect, handleEncOrderBy, handleEncQuery
  } from '../lib/handleEncode.js'

  export default {
    components: {LabelTable},
    validate({query}) {
      for(const key in query) {
        const validate = Validation[key]
        if(validate && query[key] !== undefined) {
          const valid = validate(query, query[key])
          if(!valid) {
            return false
          }
        }
      }
      return true
    },
    async asyncData({app, route, store}) {
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

      let selected = _COLUMNS_.columns.filter(([c, _]) => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[c]].isDefaultSelected)

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
          accum.$and = Array.concat(accum.$and, _decodeQuery(encOpVal, encOp).$and)
        }
        return accum
      }, {$and: []})

      const search = _encSearch || ''
      const limit = _encLimit ? parseInt(_encLimit) : 5
      const page = _encPage ? parseInt(_encPage) : 1

      // Async fetch labels data and route query models
      const fetchPromises = [fetchLabels(selected, query, search, orderBy, limit, page), extendModel(query, store.state.lang)]

      const [resp, extendedQuery] = await Promise.all(fetchPromises)

      return {
        tableData: resp.data,
        tableConfig: {
          selected,
          query,
          extendedQuery,
          search,
          orderBy,
          limit,
          page
        }
      }
    },
    computed: {
      ...mapState(['lang', 'detectedLang'])
    },
    methods: {
      async fetchData(search) {
        const def = this.tableConfig
        try {
          const resp = await fetchLabels(def.selected, def.query, search, def.orderBy, def.limit, 1)
          this.tableConfig.search = search
          this.tableData = resp.data
        } catch(err) {
          console.error(JSON.stringify(err.message))
        }
      },
      encodeHandler: function(params, ignore) {
        if(ignore.select) {
          const encSelect = handleEncSelect(params)
          this.routerPush({select: encSelect}, ignore)
        } else if(ignore.query) {
          const encQuery = handleEncQuery(params)
          this.routerPush(Object.assign(encQuery, {page: 1}), ignore)
        } else if(ignore.orderBy) {
          const [encOrderBy, encOrderDir] = handleEncOrderBy(params)
          this.routerPush({orderBy: encOrderBy, orderDir: encOrderDir}, ignore)
        } else if(ignore.search) {
          this.routerPush(Object.assign(params, {page: 1}), ignore)
        } else if(ignore.page) {
          // can be directly pushed
          this.routerPush(params, ignore)
        } else if(ignore.lang) {
          if(this.lang !== this.detectedLang) {
            this.routerPush(params, ignore)
          } else {
            this.routerPush({}, {lang: true})
          }
        }
      },
      routerPush(queryParams, ignore={}) {
        this.$router.push({name: 'index', query: this.assembleQueryParams(queryParams, ignore)})
      },
      assembleQueryParams(queryParams, ignore={}) {
        // Encode state as route query params
        const prepQuery = {}

        if(!ignore.page) { Object.assign(prepQuery, {page: this.tableConfig.page}) }

        if(!ignore.limit) { Object.assign(prepQuery, {limit: this.tableConfig.limit}) }

        if(!ignore.lang && this.lang !== this.detectedLang) { Object.assign(prepQuery, {lang: this.lang}) }

        if(!ignore.search && this.tableConfig.search.length > 0) {
          Object.assign(prepQuery, {search: this.tableConfig.search})
        }

        if(!ignore.oderBy) {
          const [encOrderBy, encOrderDir] = handleEncOrderBy(this.tableConfig.orderBy)
          Object.assign(prepQuery, {orderBy: encOrderBy, orderDir: encOrderDir})
        }

        if(!ignore.select) {
          const encSelect = handleEncSelect(this.tableConfig.selected)
          Object.assign(prepQuery, {select: encSelect})
        }

        if(!ignore.query) {
          const encQuery = handleEncQuery(this.tableConfig.query)
          Object.assign(prepQuery, encQuery)
        }

        return Object.assign(prepQuery, queryParams)
      }
    }
  }
</script>

<style>
  .cont {
    padding: 20px;
    margin: 0 auto;
    margin-top: 20px;
  }
</style>
