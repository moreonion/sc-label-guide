// Route Query -> Obj
import zip from 'lodash.zip'

import {id} from './fp.js'

// E.g.: a,b,c -> ['a', 'b', 'c']
export function deserializeArray(str, splitDelim=',') {
  return str.split(splitDelim)
}

/**
 * E.g.: orderBy=label,govTrans & orderDir=asc,desc ->
 * {label: [asc, 0], govTrans: [desc, 1]}
 */
export function deserializeOrderBy(serOrderBy, serOrderDir, fieldMap=id, dirToken='asc', splitDelim=',') {
  const cols = deserializeArray(serOrderBy, splitDelim)
  const dirs = deserializeArray(serOrderDir, splitDelim)

  return zip(cols, dirs).reduce((accum, [col, dir], index) => {
    accum[fieldMap(col)] = [dir || dirToken, index]
    return accum
  }, {})
}

/**
 * E.g.: eq=label-Fairtrade,govTrans-2 ->
 * {'label.name': {'$eq': 'Fairtrade'}, 'govTrans': {'$eq':2}}
 *
 * opMap: maps serialized operator to actual operator representation: (eq -> $eq)
 * fieldMap: maps serialized fields to actual fields (supporting dot notation). (label -> label.name)
 * parseFunc: allows to parse serialized values
 */
export function deserializeQueryFactory(opMap=id, fieldMap=id, parseFunc=id, exprDelim=',', splitDelim='-') {
  return function deserializeQuery(serFilter, op) {
    const exprs = deserializeArray(serFilter, exprDelim)
    return exprs.map(expr => deserializeArray(expr, splitDelim)).reduce((accum, [field, val]) => {
      accum[fieldMap(field)] = {[opMap(op)]: parseFunc(field, val)}
      return accum
    }, {})
  }
}
