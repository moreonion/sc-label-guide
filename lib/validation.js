import {debug as D} from './debug.js'
import {_COLUMNS_, _ROUTE_} from '../config/config.js'
import {decodeArray, decodeOrderBy} from './decode.js'

// Regex tests
const intValidator = val => /^\d+$/.test(val)
const strValidator = val => /^[a-zA-Z]+$/.test(val)

// Column helper methods
const isMandatory = col => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[col]].mandatory === true
const isSortable = col => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[col]].isSortable === true
const colValMapRev = col => _COLUMNS_.columnValueMapRev[col]

// Column helper variables
const preDefCols = _COLUMNS_.columns
const mandatory = preDefCols
  .filter(([columnName]) => isMandatory(columnName))
  .map(([columnName]) => colValMapRev(columnName))

export const Validation = {
  select: (query, val) => {
    const selected = decodeArray(val, _ROUTE_.queryDelim)

    const passesRegex = () => selected.filter(s => strValidator(s)).length === selected.length
    const passesMandatory = () => mandatory.find(m => selected.find(s => s === m) !== undefined) !== undefined
    const passesAvailable = () => selected.find(s => preDefCols.find(([columnName]) => columnName === s) === undefined) === undefined

    // Selected columns must pass regex test AND
    // selected columns must include mandatory columns AND
    // selected columns must be in available columns
    return passesRegex() && passesMandatory() && passesAvailable()
  },
  orderBy: (query, val) => {
    const orderBy = decodeOrderBy(query.orderBy, query.orderDir)

    const orderByValidator = validFunc => {
      return () => {
        for(const column in orderBy) {
          const valid = validFunc(column)
          if(!valid) {
            return false
          }
        }
        return true
      }
    }

    const passesRegex = orderByValidator(strValidator)
    const passesAvailable = orderByValidator(col => preDefCols.find(([columnName]) => columnName === col) !== undefined)
    const passesSortable = orderByValidator(isSortable)

    // OrderBy columns must pass regex test AND
    // OrderBy columns must exist AND
    // OrderBy columns must be sortable
    return passesRegex() && passesAvailable() && passesSortable()
  },
  orderDir: (query, val) => {
    D('orderDir', val)
    return true
  },
  page: (query, val) => intValidator(val),
  limit: (query, val) => intValidator(val),
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
