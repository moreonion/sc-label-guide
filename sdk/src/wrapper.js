import Vue from 'vue'

import '../../plugins/element-ui.js'
import '../../plugins/globalComponents.js'
import '../../plugins/mo-vue-table.js'
import {i18n} from '../../plugins/vue-i18n.js'

import LabelTable from '../../components/LabelTable.vue'
import {extendModel} from '../../lib/queryModel.js'
import fetchLabels from '../../lib/api/fetchLabels.js'

export default async function createApp(res, params, succCB, errcB) {
  try {
    const {query} = params
    const extendedQuery = await extendModel(query)

    succCB(new Vue({
      i18n,
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
            encodeAsRouteQuery: async function handleFetch(params, ignore) {
              const c = this.tableConfig

              try {
                let newConfig = null

                if(ignore.select) {
                  newConfig = {...c, selected: params}
                } else if(ignore.query) {
                  const extQuery = await extendModel(params)
                  newConfig = {...c, query: params, extendedQuery: extQuery}
                } else if(ignore.orderBy) {
                  newConfig = {...c, orderBy: params}
                } else if(ignore.search) {
                  newConfig = {...c, search: params}
                } else if(ignore.page) {
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
                console.error(JSON.stringify(err.message))
              }
            }.bind(this),
            fetch: async function handleFetch(params) {
              const c = this.moConfig
              try {
                const {
                  selected = c.selected,
                  query = c.query,
                  search = c.search,
                  orderBy = c.orderBy,
                  limit = c.limit,
                  page = c.page
                } = params

                const res = await fetchLabels(selected, query, search, orderBy, limit, page)
                this.moData = res.data
              } catch(err) {
                console.error(JSON.stringify(err.message))
              }
            }
          }
        })
      }
    }))
  } catch(err) {
    errCB(err)
  }
}
