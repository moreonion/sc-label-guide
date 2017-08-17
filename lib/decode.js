// Route Query -> Obj
import zip from 'lodash.zip'

import {id} from './fp.js'

/**
 * a,b,c -> ['a', 'b', 'c']
 * Supports delimiter customization
 */
export function decodeArray(str, splitDelim=',') {
  if(str !== undefined && str.length > 0) {
    return str.split(splitDelim)
  } else {
    return []
  }
}

/**
 * orderBy=label,govTrans & orderDir=asc,desc ->
 * {label: [asc, 0], govTrans: [desc, 1]}
 * Supports delimiter customization
 * Supports column mapping
 * Supports direction token customization for default token
 */
export function decodeOrderBy(encOrderBy, encOrderDir, columnMap=id, dirToken='asc', splitDelim=',') {
  const cols = decodeArray(encOrderBy, splitDelim)
  const dirs = decodeArray(encOrderDir, splitDelim)

  if(cols.length >= dirs.length) {
    return zip(cols, dirs).reduce((accum, [col, dir], index) => {
      accum[columnMap(col)] = [dir || dirToken, index]
      return accum
    }, {})
  } else {
    return {}
  }
}

/**
 * eq=label-Fairtrade,govTrans-2 ->
 * {$and:[{'label': {'$eq': 'Fairtrade'}}, {'govTrans': {'$eq':2}}]}
 *
 * Supports delimiter customization
 * Supports column mapping
 * Supports operator mapping
 * Supports custom value parsing
 */
export function decodeQueryFactory(opMap=id, columnMap=id, parseFunc=(_, snd) => snd, exprDelim=',', splitDelim='-') {
  return function decodeQuery(encQuery, op) {
    const exprs = decodeArray(encQuery, exprDelim)
    return exprs.map(expr => decodeArray(expr, splitDelim)).reduce((accum, [column, val]) => {
      const colMapped = columnMap(column)
      accum['$and'].push({[colMapped]: {[opMap(op)]: parseFunc(colMapped, val)}})
      return accum
    }, {$and: []})
  }
}
