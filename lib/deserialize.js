// Route Query -> Obj
import zip from 'lodash.zip'

const id = x => x

// orderBy=label,govTrans&orderDir=asc,desc
export function deserializeOrderBy(orderBy, orderDir, splitDelim=',') {
  const cols = orderBy.split(splitDelim)
  const dirs = orderDir.split(splitDelim)

  return zip(cols, dirs).reduce((accum, [col, dir], index) => {
    accum[col] = [dir, index]
    return accum
  }, {})
}

export function deserializeFilterFactory(opMap=id, fieldMap=id, parseFunc=id, exprDelim=',', splitDelim='-') {
  return function deserializeFilter(queryObj, op) {
    const exprs = queryObj[op].split(exprDelim)
    return exprs.map(expr => expr.split(splitDelim)).reduce((accum, [field, val]) => {
      const mappedField = fieldMap[field]
      accum[mappedField] = {[opMap[op]]: parseFunc(mappedField, val)}
      return accum
    }, {})
  }
}
