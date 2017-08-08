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
    orderBy: this.serializeArray(orderBy, delim),
    oderDir: this.serializeArray(orderDir, delim)
  }
}

const getOperator = _query => {
  for(const c in _query) {
    return c
  }
}

export function serializeQueryFactory(opMap=id, fieldMap=id) {
  return function serializeQuery(queryObj, exprDelim=',', splitDelim='-') {
    return reduce(queryObj, (accum, expr, field) => {
      const op = getOperator(expr)
      const mapOp = opMap(op)
      const val = expr[op]

      if(accum[mapOp]) {
        accum[mapOp] = `${accum[mapOp]}${exprDelim}${fieldMap(field)}${splitDelim}${val}`
      } else {
        accum[mapOp] = `${fieldMap(field)}${exprDelim}${val}`
      }
      return accum
    }, {})
  }
}
