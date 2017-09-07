import Vue from 'vue'

import '../../plugins/element-ui.js'
import '../../plugins/globalComponents.js'
import '../../plugins/mo-vue-table.js'
import {i18n} from '../../plugins/vue-i18n.js'

import LabelTable from '../../components/LabelTable.vue'
import {extendModel} from '../../lib/queryModel.js'

export default async function createApp(res, params, succCB, errcB) {
  try {
    const {query} = params
    const extendedQuery = await extendModel(query)

    succCB(new Vue({
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
    }))
  } catch(err) {
    errCB(err)
  }
}
