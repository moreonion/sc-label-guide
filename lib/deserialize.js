// Route Query -> Obj
import zip from 'lodash.zip'

const id = x => x

// E.g.: a,b,c -> ['a', 'b', 'c']
export function deserializeArray(str, splitDelim=',') {
  return str.split(splitDelim)
}

/**
 * E.g.: orderBy=label,govTrans & orderDir=asc,desc ->
 * {label: [asc, 0], govTrans: [desc, 1]}
 */
export function deserializeOrderBy(orderBy, orderDir, dirToken='asc', splitDelim=',') {
  const cols = this.deserializeArray(orderBy, splitDelim)
  const dirs = this.deserializeArray(orderDir, splitDelim)

  return zip(cols, dirs).reduce((accum, [col, dir], index) => {
    accum[col] = [dir || dirToken, index]
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
export function deserializeFilterFactory(opMap=id, fieldMap=id, parseFunc=id, exprDelim=',', splitDelim='-') {
  return function deserializeFilter(queryObj, op) {
    const exprs = this.deserializeArray(queryObj[op], exprDelim)
    return exprs.map(expr => this.deserializeArray(expr, splitDelim)).reduce((accum, [field, val]) => {
      const mappedField = fieldMap(field)
      accum[mappedField] = {[opMap(op)]: parseFunc(mappedField, val)}
      return accum
    }, {})
  }
}
