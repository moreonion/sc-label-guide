import Vue from 'vue'

import '../../plugins/element-ui.js'
import '../../plugins/globalComponents.js'
import '../../plugins/mo-vue-table.js'
import {getI18nInst} from '../../plugins/vue-i18n.js'

import LabelTable from '../../components/LabelTable.vue'
import {extendModel} from '../../lib/queryModel.js'
import fetchLabels from '../../lib/api/fetchLabels.js'

// TODO: find best locale
const WrapperAppFactory = (res, params, extendedQuery) => (new Vue({
  i18n: getI18nInst('en'),
  components: {'label-table': LabelTable},
  data: {
    tableData: res.data,
    tableConfig: {...params, lang: 'English', extendedQuery}
  },
  render: function(h) {
    return h('label-table', {
      props: {
        moData: this.tableData,
        moConfig: this.tableConfig
      },
      on: {
        encodeAsRouteQuery: async function handleFetch(params, overwrite) {
          const c = this.tableConfig

          try {
            let newConfig = null

            if(overwrite.select) {
              newConfig = {...c, selected: params}
            } else if(overwrite.query) {
              const extQuery = await extendModel(params)
              newConfig = {...c, query: params, extendedQuery: extQuery}
            } else if(overwrite.orderBy) {
              newConfig = {...c, orderBy: params}
            } else if(overwrite.search) {
              newConfig = {...c, search: params}
            } else if(overwrite.page) {
              newConfig = {...c, page: params.page}
            }

            const {
              selected, query, search,
              orderBy, limit, page
            } = newConfig

            const res = await fetchLabels(selected, query, search, orderBy, limit, page)
            this.tableData = res.data
            this.tableConfig = newConfig
          } catch(err) {
            console.error(JSON.stringify(err))
          }
        }.bind(this),
        fetch: async function handleFetch(search) {
          try {
            const {
              selected, query, orderBy,
              limit, page
            } = this.tableConfig

            const newConfig = {...this.tableConfig, search}

            const res = await fetchLabels(selected, query, search, orderBy, limit, page)
            this.tableData = res.data
            this.tableConfig = newConfig
          } catch(err) {
            console.error(JSON.stringify(err.message))
          }
        }.bind(this)
      }
    })
  }
}))

export default async function createApp(res, params) {
  const {query} = params
  const extendedQuery = await extendModel(query)
  return WrapperAppFactory(res, params, extendedQuery)
}
