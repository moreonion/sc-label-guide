import axios from 'axios'

import {_APIURL_} from '../api/base.js'
import {_COLUMNS_} from '../../config/columns.js'

export const moAutocomplete = {
  methods: {
    autocompleteHandlerFactory(column) {
      const config = _COLUMNS_.columnMeta[column].autocomplete

      return (queryString, cb) => {
        const postfetch = (data, query, mw) => {
          if(mw && mw.postfetch) {
            return mw.postfetch(data, query)
          } else {
            return data
          }
        }

        if(config === undefined) {
          cb([])
        } else if(config.sync) {
          cb(postfetch(config.sync, queryString, config.middlewares))
        } else {
          let params = {}

          const mw = config.middlewares
          if(mw && mw.prefetch) {
            params = mw.prefetch(queryString)
          }

          axios.get(`${_APIURL_}/${config.async}`, {params}).then(res => {
            cb(postfetch(res.data, queryString, mw))
          }).catch(err => {
            if(err) cb([])
            else cb([])
          })
        }
      }
    }
  }
}
