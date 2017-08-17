// import {debug as D} from './debug.js'
import {_COLUMNS_, _ROUTE_, _ORDERBY_} from '../config/config.js'
import {decodeArray, decodeQueryFactory} from './decode.js'
import {queryObjToArr} from './transformQuery.js'
import {id} from './fp.js'

// Column helpers
const preDefCols = _COLUMNS_.columns
const columnValueMap = col => _COLUMNS_.columnValueMap[col]

const isSortable = col => _COLUMNS_.columnMeta[columnValueMap(col)].isSortable === true
const isMandatory = col => _COLUMNS_.columnMeta[columnValueMap(col)].isMandatory === true
const isQueryable = col => _COLUMNS_.columnMeta[columnValueMap(col)].isQueryable === true
const isRating = col => _COLUMNS_.columnMeta[columnValueMap(col)].type === _COLUMNS_.types.RATING
const isExistingColumn = col => preDefCols.find(([columnName]) => col === columnName) !== undefined

const mandatory = preDefCols
  .filter(([columnName]) => isMandatory(columnName))
  .map(([columnName]) => columnName)

// Order helpers
const orderTokens = Object.values(_ORDERBY_.token)

// Query
const decodeQuery = decodeQueryFactory(id, id, (_, snd) => snd, _ROUTE_.queryDelim, _ROUTE_.querySubDelim)

const queryHandler = op => (query, val) => {
  const queryArr = queryObjToArr(decodeQuery(val, op))
  return queryValidator(queryArr, op)
}

// Regex tests
const intValidator = val => /^\d+$/.test(val)
const strValidator = val => /^[a-zA-Z]+$/.test(val)
const wordsValidator = val => /^[\w\s]+$/.test(val)

// Helper methods
const arrayValidator = (arr, predFunc) => arr.find(v => !predFunc(v)) === undefined

const queryValidator = (queryArr, _op) => {
  // Column must pass regex test AND
  // Column must exist AND
  // Column must be queryable AND
  // Operator must be _op AND
  // Value must exist
  // Value must pass regex test depending on column type (text/rating)
  return queryArr.find(({left, op, right}) => {
    return !(strValidator(left) &&
      isExistingColumn(left) &&
      isQueryable(left) &&
      op === _op &&
      right !== undefined &&
      (isRating(left) ? intValidator(right) : wordsValidator(right)))
  }) === undefined
}

export const Validation = {
  select: (query, val) => {
    const selected = decodeArray(val, _ROUTE_.queryDelim)

    const passesRegex = () => arrayValidator(selected, strValidator)
    const passesAvailable = () => arrayValidator(selected, isExistingColumn)
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
    const passesAvailable = () => arrayValidator(orderBy, isExistingColumn)
    const passesSortable = () => orderBy.find(col => !isSortable(col)) === undefined

    // OrderBy columns must pass regex test AND
    // OrderBy columns must exist AND
    // OrderBy columns must be sortable
    return passesRegex() && passesAvailable() && passesSortable()
  },
  orderDir: (query, val) => {
    const orderDir = decodeArray(val, _ROUTE_.queryDelim)

    const passesRegex = () => arrayValidator(orderDir, strValidator)
    const passesAvailable = () => arrayValidator(orderDir, dir => orderTokens.find(ot => ot === dir) !== undefined)
    // OrderDir must pass regex AND
    // OrderDir must exist
    return passesRegex() && passesAvailable()
  },
  page: (query, val) => intValidator(val),
  limit: (query, val) => intValidator(val),
  eq: queryHandler('eq'),
  gte: queryHandler('gte'),
  gt: queryHandler('gt'),
  lt: queryHandler('lt'),
  lte: queryHandler('lte'),
  search: (query, val) => wordsValidator(val)
}
