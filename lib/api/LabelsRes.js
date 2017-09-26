import axios from 'axios'
import qs from 'qs'

import {_APIURL_} from '../../config/api.js'

const url = `${_APIURL_}/labels`

export const LabelsRes = {
  fetch: params => {
    return axios.get(url, {
      params,
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  fetchId: (id, params) => {
    return axios.get(`${url}/${id}`, {params})
  }
}
