import axios from 'axios'
import {_APIURL_} from './base.js'

export function fetchArrayFactory(endpoint='labels') {
  const url = `${_APIURL_}/${endpoint}`

  return function fetchArray(idArr=[]) {
    const apiPromises = idArr.map(id => axios.get(`${url}/${id}`))
    return Promise.all(apiPromises)
  }
}
