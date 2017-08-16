import {getOperator, getColumn} from './transformQuery.js'
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
 * {name: ['>E', '<G']}
 *
 * Supports column mapping
 * Supports operator mapping
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
