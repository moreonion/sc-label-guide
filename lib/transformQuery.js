import {id} from './fp.js'

import {getColumn, getOperator} from './query.js'

export function queryObjToArr(queryObj, columnMap=id, opMap=id, parseFunc=id) {
  return queryObj['$and'].map(subQuery => {
    const column = getColumn(subQuery)
    const expr = subQuery[column]
    const op = getOperator(expr)

    return {left: columnMap(column), op: opMap(op), right: parseFunc(expr[op])}
  })
}

export function queryArrToObj(queryArr, columnMap=id, opMap=id, parseFunc=id) {
  return {
    '$and': queryArr.map(({left, op, right}) => {
      return {[columnMap(left)]: {[opMap(op)]: parseFunc(right)}}
    })
  }
}

// BEGIN COPY vue-router
/**
 * From vue-router
 * https://github.com/vuejs/vue-router/blob/dev/src/util/query.js
 *
 * In the share dialog (embed as iframe) the exact same query stringification
 * of vue router is needed. Since this method is not part of the public API
 * I've copy pasted it in here directly.
 */
const encodeReserveRE = /[!'()*]/g
const encodeReserveReplacer = c => '%' + c.charCodeAt(0).toString(16)
const commaRE = /%2C/g

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = str => encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ',')

export function stringifyQuery(obj) {
  const res = obj ? Object.keys(obj).map(key => {
    const val = obj[key]

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      const result = []
      val.forEach(val2 => {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key))
        } else {
          result.push(encode(key) + '=' + encode(val2))
        }
      })
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(x => x.length > 0).join('&') : null
  return res ? `?${res}` : ''
}
// END COPY vue-router
