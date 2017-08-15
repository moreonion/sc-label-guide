// Route Query -> Obj
import zip from 'lodash.zip'

import {id} from './fp.js'

// E.g.: a,b,c -> ['a', 'b', 'c']
export function decodeArray(str, splitDelim=',') {
  return str.split(splitDelim)
}

/**
 * E.g.: orderBy=label,govTrans & orderDir=asc,desc ->
 * {label: [asc, 0], govTrans: [desc, 1]}
 */
export function decodeOrderBy(serOrderBy, serOrderDir, columnMap=id, dirToken='asc', splitDelim=',') {
  const cols = decodeArray(serOrderBy, splitDelim)
  const dirs = decodeArray(serOrderDir, splitDelim)

  return zip(cols, dirs).reduce((accum, [col, dir], index) => {
    accum[columnMap(col)] = [dir || dirToken, index]
    return accum
  }, {})
}

/**
 * E.g.: eq=label-Fairtrade,govTrans-2 ->
 * {'label.name': {'$eq': 'Fairtrade'}, 'govTrans': {'$eq':2}}
 *
 * opMap: maps encoded operator to actual operator representation: (eq -> $eq)
 * columnMap: maps encoded columns to actual columns (supporting dot notation). (label -> label.name)
 * parseFunc: allows to parse encoded values
 */
export function decodeQueryFactory(opMap=id, columnMap=id, parseFunc=id, exprDelim=',', splitDelim='-') {
  return function decodeQuery(serFilter, op) {
    const exprs = decodeArray(serFilter, exprDelim)
    return exprs.map(expr => decodeArray(expr, splitDelim)).reduce((accum, [column, val]) => {
      const colMapped = columnMap(column)
      accum[colMapped] = {[opMap(op)]: parseFunc(colMapped, val)}
      return accum
    }, {})
  }
}
