import {debug as D} from './debug.js'
import {_COLUMNS_, _ROUTE_} from '../config/config.js'
import {decodeArray, decodeOrderBy} from './decode.js'

const intValidator = val => /^\d+$/.test(val)
const strValidator = val => /^[a-zA-Z]+$/.test(val)

const isMandatory = col => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[col]].mandatory === true
const colValMapRev = col => _COLUMNS_.columnValueMapRev[col]

export const Validation = {
  select: (query, val) => {
    const preDefCols = _COLUMNS_.columns
    const selected = decodeArray(val, _ROUTE_.queryDelim)
    const mandatory = preDefCols
      .filter(([columnName]) => isMandatory(columnName))
      .map(([columnName]) => colValMapRev(columnName))

    // Selected columns must pass regex test AND
    // selected columns must include mandatory columns AND
    // selected columns must be in available columns
    return (selected.filter(s => strValidator(s)).length === selected.length) &&
      (mandatory.find(m => selected.find(s => s === m) !== undefined) !== undefined) &&
      (selected.find(s => preDefCols.find(([columnName]) => columnName === s) === undefined) === undefined)
  },
  orderBy: (query, val) => {
    D('val', val)
    decodeOrderBy(query.orderBy, query.orderDir)
    return true
  },
  orderDir: (query, val) => {
    return true
  },
  page: intValidator,
  limit: intValidator,
  eq: (query, val) => {
    return true
  },
  gte: (query, val) => {
    return true
  },
  gt: (query, val) => {
    return true
  },
  lt: (query, val) => {
    return true
  },
  lte: (query, val) => {
    return true
  }
}
