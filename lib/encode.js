import reduce from 'lodash.reduce'
import zip from 'lodash.zip'

import {id} from './fp.js'
import {getOperator} from './transformQuery.js'
import {orderByObjToSortedArray} from './transformOrderBy.js'

// ['a', 'b', 'c'] -> a,b,c
export function encodeArray(arr, delim=',') {
  return arr.join(delim)
}

/**
 * {name: ['asc', 1], govTrans: ['desc',0]} ->
 * {
 *  orderBy: ['label', 'govTrans'],
 *  orderDir: ['asc', 'desc']
 * }

 * Supports column mapping
 * Supports delimiter customization
 */
export function encodeOrderBy(orderBy, columnMap=id, delim=',') {
  const sortedArr = orderByObjToSortedArray(orderBy)
  const mappedArr = sortedArr.map(([column, dir]) => ([columnMap(column), dir]))
  const zipped = zip(...mappedArr)

  return zipped.length > 0 ? {orderBy: encodeArray(zipped[0], delim), orderDir: encodeArray(zipped[1], delim)} : {}
}

/**
 * {'label.name': {$eq: 'Fairtrade'}, }
 */
export function encodeQueryFactory(columnMap=id, opMap=id, exprDelim=',', splitDelim='-') {
  return function encodeQuery(queryObj) {
    return reduce(queryObj, (accum, expr, column) => {
      const op = getOperator(expr)
      const mapOp = opMap(op)
      const val = expr[op]

      if(accum[mapOp]) {
        accum[mapOp] = `${accum[mapOp]}${exprDelim}${columnMap(column)}${splitDelim}${val}`
      } else {
        accum[mapOp] = `${columnMap(column)}${splitDelim}${val}`
      }
      return accum
    }, {})
  }
}
