// import {debug as D} from './debug.js'
import {_COLUMNS_, _ROUTE_} from '../config/config.js'
import {decodeArray} from './decode.js'

const intValidator = val => /^\d+$/.test(val)
const strValidator = val => /^[a-zA-Z]+$/.test(val)

const isMandatory = col => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[col]].mandatory === true

export const Validation = {
  select: val => {
    const selected = decodeArray(val, _ROUTE_.queryDelim)
    const mandatory = _COLUMNS_.columns
      .filter(([columnName]) => isMandatory(columnName))
      .map(([columnName]) => _COLUMNS_.columnValueMapRev[columnName])

    // Selected columns must pass regex test AND
    // selected columns must include mandatory columns AND
    // selected columns must be in available columns
    return (selected.filter(s => strValidator(s)).length === selected.length) &&
      (mandatory.find(m => selected.find(s => s === m) !== undefined) !== undefined) &&
      (selected.find(s => _COLUMNS_.columns.find(([columnName]) => columnName === s) === undefined) === undefined)
  },
  orderBy: (orderBy, orderDir) => {
    return true
  },
  orderDir: (orderBy, orderDir) => {
    return true
  },
  page: intValidator,
  limit: intValidator,
  eq: val => {
    return true
  },
  gte: val => {
    return true
  },
  gt: val => {
    return true
  },
  lt: val => {
    return true
  },
  lte: val => {
    return true
  }
}