import axios from 'axios'
import {_APIURL_} from './base.js'
import {AutocompleteTypes} from '../../config/api.js'
import {id} from '../fp.js'

const defaultConfig = {
  type: AutocompleteTypes.DEFAULT,
  minResults: 5,
  maxResults: 10,
  limit: 20
}

const defaultMiddleware = {
  postfetch: id
}

function fetchSuggestions(endpoint, params) {
  return axios.get(`${_APIURL_}/${endpoint}`, {params})
}

async function emulateAutocomplete(endpoint, params, config, middleware, results = []) {
  const res = await fetchSuggestions(endpoint, params, config.async)
  const data = middleware.postfetch(res, params)
  const accum = results.concat(data)

  if(accum.length < config.minResults && params.page < middleware.totalPages(res)) {
    return emulateAutocomplete(endpoint, {...params, page: params.page+1}, config, middleware, accum)
  } else {
    return accum.slice(0, config.maxResults)
  }
}

export default function autocomplete(endpoint, paramsIn, configIn=defaultConfig, middlewareIn=defaultMiddleware) {
  const config = {...defaultConfig, ...configIn}
  const params = {...paramsIn, offset: 0, page: 1, limit: config.limit}
  const middleware = {...defaultMiddleware, ...middlewareIn}

  switch(config.type) {
    case AutocompleteTypes.EMULATED:
      return emulateAutocomplete(endpoint, params, config, middleware, [])
    case AutocompleteTypes.DEFAULT:
    default:
      return middleware.postfetch(fetchSuggestions(endpoint, {...params, limit: config.maxResults}))
  }
}
