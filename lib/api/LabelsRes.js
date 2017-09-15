import axios from 'axios'
import qs from 'qs'

import {_APIURL_} from '../../config/api.js'

const url = `${_APIURL_}/labels`

export const LabelsRes = {
  fetch: params => axios.get(url, {
    params,
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
