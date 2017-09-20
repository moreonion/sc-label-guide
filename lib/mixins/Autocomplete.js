import {_COLUMNS_} from '../../config/columns.js'
import autocomplete from '../api/autocomplete.js'

export const moAutocomplete = {
  methods: {
    autocompleteHandlerFactory(column, syncParams) {
      const config = _COLUMNS_.columnMeta[column].autocomplete

      return (queryString) => {
        const postfetch = (data, query, mw) => {
          if(mw && mw.postfetch) {
            return mw.postfetch(data, query)
          } else {
            return data
          }
        }

        if(config === undefined) {
          Promise.resolve([])
        } else if(config.sync) {
          Promise.resolve(postfetch(config.sync(syncParams), queryString, config.middlewares))
        } else {
          let params = {query: queryString}

          const mw = config.middlewares
          if(mw && mw.prefetch) {
            params.query = mw.prefetch(queryString)
          }

          return autocomplete(config.async, params, config.endpoint, mw).then(suggestions => {
            return Promise.resolve(postfetch(suggestions))
          })
        }
      }
    }
  }
}
