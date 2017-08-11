import reduce from 'lodash.reduce'
import {id} from './fp.js'

const getOperator = _query => {
  for(const c in _query) {
    return c
  }
}

export function queryObjToArr(queryObj, columnMap=id, opMap=id, parseFunc=id) {
  return reduce(queryObj, (accum, expr, column) => {
    const op = getOperator(expr)
    accum.push({left: columnMap(column), op: opMap(op), right: parseFunc(expr[op])})
    return accum
  }, [])
}

export function queryArrToObj(queryArr, columnMap=id, opMap=id, parseFunc=id) {
  return queryArr.reduce((accum, filter) => {
    accum[columnMap(filter.left)] = {[opMap(filter.op)]: parseFunc(filter.right)}
    return accum
  }, {})
}
