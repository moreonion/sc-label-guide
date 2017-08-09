import reduce from 'lodash.reduce'
import {id} from './fp.js'

const getOperator = _query => {
  for(const c in _query) {
    return c
  }
}

export function queryObjToArr(queryObj, fieldMap=id, opMap=id, parseFunc=id) {
  return reduce(queryObj, (accum, expr, field) => {
    const op = getOperator(expr)
    accum.push({left: fieldMap(field), op: opMap(op), right: parseFunc(expr[op])})
    return accum
  }, [])
}

export function queryArrToObj(queryArr, fieldMap=id, opMap=id, parseFunc=id) {
  return queryArr.reduce((accum, filter) => {
    accum[fieldMap(filter.left)] = {[opMap(filter.op)]: parseFunc(filter.right)}
    return accum
  }, {})
}
