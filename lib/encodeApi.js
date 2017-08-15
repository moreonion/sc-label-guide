import reduce from 'lodash.reduce'

import {_COLUMNS_, _ORDERBY_} from '../config/config.js'
import {getOperator} from './transformQuery.js'
import {id} from './fp.js'

const mapKey = key => _COLUMNS_.columnValueMapRev[key]

const isAsc = dir => dir === _ORDERBY_.token.asc

export function encodeApiOrderBy(orderBy, delim=',', ascToken='', descToken='-') {
  return reduce(orderBy, (accum, [dir], key) => {
    if(accum.length > 0) {
      return isAsc(dir) ? `${accum}${delim}${ascToken}${mapKey(key)}` : `${accum}${delim}${descToken}${mapKey(key)}`
    } else {
      return isAsc(dir) ? `${ascToken}${mapKey(key)}` : `${descToken}${mapKey(key)}`
    }
  }, '')
}

export function encodeApiQuery(query, columnMap=id, opMap=id) {
  return reduce(query, (accum, queryObj, column) => {
    const op = getOperator(queryObj)
    const mOp = opMap(op)
    const val = queryObj[op]

    accum[columnMap(column)] = `${mOp}${val}`

    return accum
  }, {})
}
