import axios from 'axios'

import {_APIURL_} from './base.js'

const url = `${_APIURL_}/labels`

export const LabelsRes = {
  fetch: params => axios.get(url, {params})
}
