import reduce from 'lodash.reduce'

import {_COLUMNS_, _ORDERBY_} from '../config/config.js'

const mapKey = key => _COLUMNS_.columnValueMapRev[key]

const isAsc = dir => dir === _ORDERBY_.token.asc

export const serializeApiOrderBy = (orderBy, delim=',', ascToken='', descToken='-') => reduce(orderBy, (accum, [dir], key) => {
  if(accum.length > 0) {
    return isAsc(dir) ? `${accum}${delim}${ascToken}${mapKey(key)}` : `${accum}${delim}${descToken}${mapKey(key)}`
  } else {
    return isAsc(dir) ? `${ascToken}${mapKey(key)}` : `${descToken}${mapKey(key)}`
  }
}, '')
