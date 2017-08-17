import {debug as D} from './debug.js'
import {_COLUMNS_, _ROUTE_} from '../config/config.js'
import {decodeArray} from './decode.js'

// Regex tests
const intValidator = val => /^\d+$/.test(val)
const strValidator = val => /^[a-zA-Z]+$/.test(val)

// Helper methods
const arrayValidator = (arr, predFunc) => arr.find(v => !predFunc(v)) === undefined

// Column helpers
const preDefCols = _COLUMNS_.columns
const columnValueMap = col => _COLUMNS_.columnValueMap[col]

const isSortable = col => _COLUMNS_.columnMeta[columnValueMap(col)].isSortable === true
const isMandatory = col => _COLUMNS_.columnMeta[columnValueMap(col)].mandatory === true
const isExisting = col => preDefCols.find(([columnName]) => col === columnName) !== undefined

const mandatory = preDefCols
  .filter(([columnName]) => isMandatory(columnName))
  .map(([columnName]) => columnName)

export const Validation = {
  select: (query, val) => {
    const selected = decodeArray(val, _ROUTE_.queryDelim)

    const passesRegex = () => arrayValidator(selected, strValidator)
    const passesAvailable = () => arrayValidator(selected, isExisting)
    const passesMandatory = () => mandatory.find(m => selected.find(col => col === m) === undefined) === undefined
    const passesMin = () => selected.length >= 2

    // At least 2 columns must be selected AND
    // Selected columns must pass regex test AND
    // selected columns must be in available columns AND
    // selected columns must include mandatory columns
    return passesMin() && passesRegex() && passesAvailable() && passesMandatory()
  },
  orderBy: (query, val) => {
    const orderBy = decodeArray(val, _ROUTE_.queryDelim)

    const passesRegex = () => arrayValidator(orderBy, strValidator)
    const passesAvailable = () => arrayValidator(orderBy, isExisting)
    const passesSortable = () => orderBy.find(col => !isSortable(col)) === undefined

    // OrderBy columns must pass regex test AND
    // OrderBy columns must exist AND
    // OrderBy columns must be sortable
    return passesRegex() && passesAvailable() && passesSortable()
  },
  orderDir: (query, val) => {
    D('orderDir', val)

    const orderDir = decodeArray(val, _ROUTE_.queryDelim)

    D('decOrderDir', orderDir)
    // OrderDir must pass
    // OrderDir must exist
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
