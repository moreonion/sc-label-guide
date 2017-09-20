import zip from 'lodash.zip'

import {id} from './fp.js'
import {getOperator, getColumn} from './query.js'
import {orderByObjToSortedArray} from './transformOrderBy.js'
import {isListOperator} from './operator.js'

/**
 * ['a', 'b', 'c'] -> a,b,c
 * Supports delimiter customization
 */
export function encodeArray(arr, delim=',') {
  return arr.join(delim)
}

/**
 * {name: ['asc', 1], govTrans: ['desc',0]} ->
 * [['govTrans', 'name'],['desc', 'asc']]
 *
 * Supports delimiter customization
 * Supports column mapping
 */
export function encodeOrderBy(orderBy, columnMap=id, delim=',') {
  const sortedArr = orderByObjToSortedArray(orderBy)
  const mappedArr = sortedArr.map(([column, dir]) => ([columnMap(column), dir]))
  const zipped = zip(...mappedArr)

  return zipped.length > 0 ? [encodeArray(zipped[0], delim), encodeArray(zipped[1], delim)] : [undefined, undefined]
}

/**
 * {$and:[]{name:{$lt:'F'}, {name:{'$gt':'B'}}, {hotspots: {'$in': [1,2]}}}} ->
 * lt=name-F&gt=name-B&in=hotspots-1,hotspots-2
 * Supports delimiter customization
 * Supports column mapping
 * Supports operator mapping
 */
export function encodeQuery(queryObj, columnMap=id, opMap=id, exprDelim=',', splitDelim='-') {
  return queryObj['$and'].reduce((accum, subQuery) => {
    const column = getColumn(subQuery)
    const expr = subQuery[column]
    const op = getOperator(expr)
    const mapOp = opMap(op)
    const val = expr[op]

    const encodeList = (listVal, column) => listVal.reduce((accum, v) => {
      if(accum.length === 0) {
        return `${column}${splitDelim}${v}`
      } else {
        return `${accum},${column}${splitDelim}${v}`
      }
    }, '')

    if(isListOperator(op)) {
      if(accum[mapOp]) {
        accum[mapOp] = `${accum[mapOp]}${exprDelim}${encodeList(val, columnMap(column))}`
      } else {
        accum[mapOp] = `${encodeList(val, columnMap(column))}`
      }
    } else {
      if(accum[mapOp]) {
        accum[mapOp] = `${accum[mapOp]}${exprDelim}${columnMap(column)}${splitDelim}${val}`
      } else {
        accum[mapOp] = `${columnMap(column)}${splitDelim}${val}`
      }
    }

    return accum
  }, {})
}
