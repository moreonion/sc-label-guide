import {_API_, _OPERATORS_, _ORDERBY_} from '../../config/config.js'
import {id} from '../fp.js'
import {encodeApiOrderBy, encodeApiQuery} from '../encodeApi.js'
import {LabelsRes} from './LabelsRes.js'

export default function fetchLabels(select, query, search, orderBy, limit, page) {
  // Prepare API query params
  // select
  const qSelect = 'name,hotspots,details,description,meets_criteria,resources,countries' // tmp select

  // where
  const qQuery = encodeApiQuery(query, id,
    op => _OPERATORS_.opEncApiMap[op], _API_.opDelim)

  if(search.length > 0) {
    qQuery[`name${_API_.opDelim}like`] = search
  }

  // orderby
  const qOrderBy = encodeApiOrderBy(orderBy, id,
    _API_.queryDelim, _API_.orderBy.token.asc, _API_.orderBy.token.desc,
    dir => dir === _ORDERBY_.token.asc)

  const qSort = qOrderBy.length > 0 ? qOrderBy : undefined

  const fetchParams = Object.assign({limit, page, sort: qSort, only: qSelect}, qQuery)

  return LabelsRes.fetch(fetchParams)
}
