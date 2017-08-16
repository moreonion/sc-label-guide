import {id} from './fp.js'

export const getColumn = _query => {
  for(const c in _query) {
    return c
  }
}

export const getOperator = _query => {
  for(const c in _query) {
    return c
  }
}

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
