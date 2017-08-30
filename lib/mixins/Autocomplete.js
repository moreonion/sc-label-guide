import axios from 'axios'

import {_APIURL_} from '../api/base.js'
import {_COLUMNS_} from '../../config/columns.js'

export const moAutocomplete = {
  methods: {
    autocompleteHandlerFactory(column) {
      const config = _COLUMNS_.columnMeta[column].autocomplete

      return (queryString, cb) => {
        if(config === undefined) {
          cb([])
        } else if(config.sync) {
          // TODO: prefetch
          cb(config.sync)
        } else {
          let params = {}

          const mw = config.middlewares
          if(mw && mw.prefetch) {
            params = mw.prefetch(queryString)
          }

          axios.get(`${_APIURL_}/${config.async}`, {params}).then(res => {
            if(mw && mw.postfetch) {
              cb(mw.postfetch(res))
            } else {
              cb(res.data)
            }
          }).catch(err => {
            if(err) cb([])
            else cb([])
          })
        }
      }
    }
  }
}
