import reduce from 'lodash.reduce'

import {_COLUMNS_, _ORDERBY_} from '../config/config.js'
import {getOperator} from './transformQuery.js'
import {id} from './fp.js'

// Helper functions
const mapCol = col => _COLUMNS_.columnValueMapRev[col]
const isAsc = dir => dir === _ORDERBY_.token.asc

/**
 * {name: ['asc', 1], govTrans: ['desc',0]} ->
 * `name,-govTrans`
 *
 * Allows specification of asc and desc tokens (default: '', '-').
 * Applies configured column mapping.
 * Uses configured asc token to determine direction of argument orderBy object
 */
export function encodeApiOrderBy(orderBy, delim=',', ascToken='', descToken='-') {
  const orderByArr = reduce(orderBy, (accum, [dir, index], column) => {
    accum.push([column, dir, index])
    return accum
  }, [])

  // Sort by index on (third element)
  const sortedArr = orderByArr.sort((o1, o2) => o1[2] > o2[2] ? 1 : -1)

  return sortedArr.reduce((accum, [column, dir]) => {
    if(accum.length > 0) {
      return isAsc(dir) ? `${accum}${delim}${ascToken}${mapCol(column)}` : `${accum}${delim}${descToken}${mapCol(column)}`
    } else {
      return isAsc(dir) ? `${ascToken}${mapCol(column)}` : `${descToken}${mapCol(column)}`
    }
  }, '')
}

/**
 * TODO: comment
 */
export function encodeApiQuery(query, columnMap=id, opMap=id) {
  return reduce(query, (accum, queryObj, column) => {
    const op = getOperator(queryObj)
    const mOp = opMap(op)
    const val = queryObj[op]

    accum[columnMap(column)] = `${mOp}${val}`

    return accum
  }, {})
}
