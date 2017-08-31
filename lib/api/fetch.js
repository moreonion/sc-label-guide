import axios from 'axios'
import {_APIURL_} from './base.js'

export function fetchEndpoint(endpoint, params) {
  return axios.get(`${_APIURL_}/${endpoint}`, {params})
}
