import uniq from 'lodash.uniq'

import {_API_, _OPERATORS_, _COLUMNS_, _ORDERBY_} from '../config/config.js'
import {getOperator, getColumn} from './query.js'
import {orderByObjToSortedArray} from './transformOrderBy.js'
import {id} from './fp.js'
import {isListOperator} from './operator.js'

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
export function encodeApiQuery(query, columnMap=id, opMap=id, opDelim=':', listDelim=',') {
  const encodeExpr = (val, op) => isListOperator(op) ? val.join(listDelim) : val

  return query['$and'].reduce((accum, subQuery) => {
    const col = getColumn(subQuery)
    const querySpec = subQuery[col]
    const op = getOperator(querySpec)
    const mapOp = opMap(op)
    const val = querySpec[op]
    const mapCol = columnMap(col)

    const colEntry = `${mapCol}${opDelim}${mapOp}`

    if(accum[colEntry]) {
      accum[colEntry] = accum[colEntry].push(encodeExpr(val, op))
    } else {
      accum[colEntry] = [encodeExpr(val, op)]
    }
    return accum
  }, {})
}

/**
 * [['name', 0], ['social', 1]] ->
 * [['name', 'logo', 'details], []]
 */
export function encodeApiSelect(select, delim=',') {
  const [selectArr, includeArr] = select.reduce((accum, [name]) => {
    const _spec = _COLUMNS_.columnApiProj[name]
    accum[0] = accum[0].concat(_spec.only)
    accum[1] = accum[1].concat(_spec.include)
    return accum
  }, [[], []])

  const encSelect = uniq(selectArr).join(delim)
  const encInclude = uniq(includeArr).join(delim)

  return [encSelect, encInclude]
}

export function defaultApiEncode(select, query, search, orderBy, limit, page) {
  const [qSelect, qInclude] = encodeApiSelect(select, _API_.listDelim)

  // where
  const qQuery = encodeApiQuery(query, id,
    op => _OPERATORS_.opEncApiMap[op], _API_.opDelim, _API_.listDelim)

  if(search.length > 0) {
    qQuery[`name${_API_.opDelim}like`] = search
  }

  // orderby
  const qOrderBy = encodeApiOrderBy(orderBy, id,
    _API_.queryDelim, _API_.orderBy.token.asc, _API_.orderBy.token.desc,
    dir => dir === _ORDERBY_.token.asc)

  const qSort = qOrderBy.length > 0 ? qOrderBy : undefined

  return Object.assign({
    limit,
    page,
    sort: qSort,
    only: qSelect.length === 0 ? undefined : qSelect,
    include: qInclude.length === 0 ? undefined: qInclude
  }, qQuery)
}
