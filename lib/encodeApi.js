import {_COLUMNS_, _ORDERBY_} from '../config/config.js'
import {getOperator, getColumn} from './transformQuery.js'
import {orderByObjToSortedArray} from './transformOrderBy.js'
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
  return orderByObjToSortedArray(orderBy).reduce((accum, [column, dir]) => {
    if(accum.length > 0) {
      return isAsc(dir) ? `${accum}${delim}${ascToken}${mapCol(column)}` : `${accum}${delim}${descToken}${mapCol(column)}`
    } else {
      return isAsc(dir) ? `${ascToken}${mapCol(column)}` : `${descToken}${mapCol(column)}`
    }
  }, '')
}

/**
 * {$and:[{name:{$gte: 'UTZ'}}]} ->
 * {name: '>=UTZ'}
 */
export function encodeApiQuery(query, columnMap=id, opMap=id) {
  return query['$and'].reduce((accum, subQuery) => {
    const col = getColumn(subQuery)
    const querySpec = subQuery[col]
    const op = getOperator(querySpec)
    const mOp = opMap(op)
    const val = querySpec[op]

    if(accum[columnMap(col)] === undefined) {
      accum[col] = [`${mOp}${val}`]
    } else {
      accum[col].push(`${mOp}${val}`)
    }

    return accum
  }, {})
}
