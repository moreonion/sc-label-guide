import {_COLUMNS_} from '../../config/columns.js'
import autocomplete from '../api/autocomplete.js'

export const moAutocomplete = {
  methods: {
    autocompleteHandlerFactory(column, params) {
      const config = _COLUMNS_.columnMeta[column].autocomplete

      return queryString => {
        const postfetch = (data, query, mw) => {
          if(mw && mw.postfetch) {
            return mw.postfetch(data, query)
          } else {
            return data
          }
        }

        if(config === undefined) {
          return Promise.resolve([])
        } else if(config.sync) {
          return Promise.resolve(postfetch(config.sync(params), queryString, config.middlewares))
        } else {
          let _params = {query: queryString}

          const mw = config.middlewares
          if(mw && mw.prefetch) {
            _params.query = mw.prefetch(queryString)
          }

          return autocomplete(config.async(params), _params, config.endpoint, mw).then(suggestions => {
            return Promise.resolve(postfetch(suggestions))
          })
        }
      }
    }
  }
}
