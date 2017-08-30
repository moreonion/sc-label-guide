import {_COLUMNS_} from '../../config/columns.js'
import autocomplete from '../api/autocomplete.js'

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

          autocomplete(config.async, params, config.endpoint).then(suggestions => {
            cb(postfetch(suggestions))
          })
          .catch(() => {
            cb([])
          })
        }
      }
    }
  }
}
