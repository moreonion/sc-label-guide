// import 'babel-polyfill'
import Vue from 'vue'
import LabelTable from '../../components/LabelTable.vue'
import fetchLabels from '../../lib/api/fetchLabels.js'
import {extendModel} from '../../lib/queryModel.js'

import '../../plugins/element-ui.js'
import '../../plugins/globalComponents.js'
import '../../plugins/mo-vue-table.js'
import {i18n} from '../../plugins/vue-i18n.js'

class MO {
  init({selected, query, search, orderBy, limit, page}, succCB, errCB) {
    fetchLabels(selected, query, search, orderBy, limit, page).then(succCB).catch(err => errCB(err))
  }

  async mount(selector, params, res, succCB, errCB) {
    const {query} = params
    try {
      const extendedQuery = await extendModel(query)
      debugger
      new Vue({
        i18n,
        components: {'label-table': LabelTable},
        render(h) {
          return h('label-table', {
            props: {
              moData: res.data,
              moConfig: {...params, lang: 'English', extendedQuery}
            }
          })
        }
      }).$mount(selector)
      succCB()
    } catch(err) {
      errCB(err)
    }
  }

  mountFetched(selector, params, succCB, errCB) {
    this.init(params, data => {
      this.mount(selector, params, data, succCB, errCB)
    }, errCB)
  }
}

// pass new MO sdk instance
const sdkInst = new MO()

window.moAsyncInit(sdkInst)
