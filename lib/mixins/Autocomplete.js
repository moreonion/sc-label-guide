import {_COLUMNS_} from '../../config/columns.js'
import autocomplete from '../api/autocomplete.js'

export const moAutocomplete = {
  methods: {
    autocompleteHandlerFactory(column, syncParams) {
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
          cb(postfetch(config.sync(syncParams), queryString, config.middlewares))
        } else {
          let params = {query: queryString}

          const mw = config.middlewares
          if(mw && mw.prefetch) {
            params.query = mw.prefetch(queryString)
          }

          autocomplete(config.async, params, config.endpoint, mw).then(suggestions => {
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
