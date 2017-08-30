import axios from 'axios'
import {_APIURL_} from './base.js'
import {AutocompleteTypes} from '../../config/api.js'

const defaultConfig = {
  type: AutocompleteTypes.DEFAULT,
  minResults: 10,
  limit: 20
}

export default function autocomplete(endpoint, config=defaultConfig) {
  // axios.get(`${_APIURL_}/${config.async}`, {params}).then(res => {
  //   cb(postfetch(res.data, queryString, mw))
  // }).catch(err => {
  //   if(err) cb([])
  //   else cb([])
  // })
}
