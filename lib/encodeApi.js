import {_API_, _OPERATORS_, _ORDERBY_} from '../config/config.js'
import {getOperator, getColumn} from './query.js'
import {orderByObjToSortedArray} from './transformOrderBy.js'
import {id} from './fp.js'

/**
 * {name: ['asc', 1], govTrans: ['desc',0]} ->
 * `name,-govTrans`
 *
 * Supports delimiter customization
 * Supports order by direction token customization
 * Supports column mapping
 */
export function encodeApiOrderBy(orderBy, columnMap=id, delim=',', ascToken='', descToken='-', isAsc=dir => dir === 'asc') {
  return orderByObjToSortedArray(orderBy).reduce((accum, [column, dir]) => {
    if(accum.length > 0) {
      return isAsc(dir) ? `${accum}${delim}${ascToken}${columnMap(column)}` : `${accum}${delim}${descToken}${columnMap(column)}`
    } else {
      return isAsc(dir) ? `${ascToken}${columnMap(column)}` : `${descToken}${columnMap(column)}`
    }
  }, '')
}

/**
 * {$and:[{name:{$gte: 'UTZ'}}]} ->
 * {'name:gte': ['UTZ']}
 *
 * Supports column mapping
 * Supports operator mapping
 */
export function encodeApiQuery(query, columnMap=id, opMap=id, opDelim=':') {
  return query['$and'].reduce((accum, subQuery) => {
    const col = getColumn(subQuery)
    const querySpec = subQuery[col]
    const op = getOperator(querySpec)
    const mOp = opMap(op)
    const val = querySpec[op]

    const colEntry = `${columnMap(col)}${opDelim}${mOp}`

    if(accum[colEntry] === undefined) {
      accum[colEntry] = [val]
    } else {
      accum[colEntry].push(val)
    }

    return accum
  }, {})
}

export function defaultApiEncode(select, query, search, orderBy, limit, page) {
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
}
