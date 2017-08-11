import reduce from 'lodash.reduce'
import {id} from './fp.js'

// Obj -> Route Query
// ['a', 'b', 'c'] -> a,b,c
export function serializeArray(arr, delim=',') {
  return arr.join(delim)
}

// [['label', 'govTrans'], ['asc', 'desc']] ->
export function serializeOrderBy([orderBy, orderDir], delim=',') {
  return {
    orderBy: serializeArray(orderBy, delim),
    orderDir: serializeArray(orderDir, delim)
  }
}

const getOperator = _query => {
  for(const c in _query) {
    return c
  }
}

/**
 * {'label.name': {$eq: 'Fairtrade'}, }
 */
export function serializeQueryFactory(columnMap=id, opMap=id) {
  return function serializeQuery(queryObj, exprDelim=',', splitDelim='-') {
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
