import reduce from 'lodash.reduce'

import {id} from './fp.js'
import {getOperator} from './transformQuery.js'

// Obj -> Route Query
// ['a', 'b', 'c'] -> a,b,c
export function encodeArray(arr, delim=',') {
  return arr.join(delim)
}

// [['label', 'govTrans'], ['asc', 'desc']] ->
export function encodeOrderBy([orderBy, orderDir], delim=',') {
  return {
    orderBy: encodeArray(orderBy, delim),
    orderDir: encodeArray(orderDir, delim)
  }
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
