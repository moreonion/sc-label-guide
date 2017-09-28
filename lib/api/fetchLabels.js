import {LabelsRes} from './LabelsRes.js'
import {defaultApiEncode} from '../encodeApi.js'

export default function fetchLabels(select, query, search, orderBy, limit, page, lang) {
  const fetchParams = defaultApiEncode(select, query, search, orderBy, limit, page, lang)
  return LabelsRes.fetch(fetchParams)
}
