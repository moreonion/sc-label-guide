// Route Query -> Obj
import zip from 'lodash.zip'

import {id} from './fp.js'
import {isListOperator} from './operator.js'
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
export function decodeQueryFactory(opMap=id, columnMap=id, parseFunc=(_, snd) => snd, exprDelim=',', splitDelim='-', listDelim='_') {
  return function decodeQuery(encQuery, op) {
    const exprs = decodeArray(encQuery, exprDelim)
    const leftRightSplits = exprs.map(expr => decodeArray(expr, splitDelim))
    const mapOp = opMap(op)

    if(isListOperator(mapOp)) {
      return leftRightSplits
        .map(([left, encVals]) => [left, decodeArray(encVals, listDelim)])
        .reduce((accum, [column, vals]) => {
          const colMapped = columnMap(column)
          accum['$and'].push({[colMapped]: {[mapOp]: vals.map(v => parseFunc(colMapped, v))}})
          return accum
        }, {$and: []})
    } else {
      return leftRightSplits.reduce((accum, [column, val]) => {
        const colMapped = columnMap(column)
        accum['$and'].push({[colMapped]: {[mapOp]: parseFunc(colMapped, val)}})
        return accum
      }, {$and: []})
    }
  }
}
