import Vue from 'vue'

import '../../plugins/element-ui.js'
import '../../plugins/globalComponents.js'
import '../../plugins/mo-vue-table.js'
import '../../plugins/vue-async-computed.js'
import {getI18nInst} from '../../plugins/vue-i18n.js'
import LabelTable from '../../components/LabelTable.vue'
import {extendModel} from '../../lib/queryModel.js'
import fetchLabels from '../../lib/api/fetchLabels.js'
import detectLang from '../../lib/detectLang.js'
import {SET_LANG, SET_DETECTED_LANG} from '../../store/mutation-types.js'

import pluginVuex from './pluginVuex'

const store = pluginVuex(Vue)

// TODO: find best locale
const WrapperAppFactory = (res, params, lang) => (new Vue({
  i18n: getI18nInst(lang),
  store,
  components: {'label-table': LabelTable},
  data() {
    store.commit(SET_LANG, lang)
    store.commit(SET_DETECTED_LANG, lang)

    return {
      tableData: res.data,
      tableConfig: {...params}
    }
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
              const extQuery = await extendModel(params, this.$store.state.lang)
              newConfig = {...c, query: params, extendedQuery: extQuery}
            } else if(overwrite.orderBy) {
              newConfig = {...c, orderBy: params}
            } else if(overwrite.page) {
              newConfig = {...c, page: params.page}
            } else if(overwrite.lang) {
              // TODO: lang param for API call
              newConfig = {...c}
            }

            const {
              selected, query,
              orderBy, limit, page
            } = newConfig

            const res = await fetchLabels(selected, query, this.tableConfig.search, orderBy, limit, page)
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
  const lang = detectLang()
  const language = lang.language || lang
  return WrapperAppFactory(res, params, language)
}
