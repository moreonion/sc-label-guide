import {_COLUMNS_, _ROUTE_, _OPERATORS_} from '../config/config.js'
import {encodeArray, encodeOrderBy, encodeQuery} from './encode.js'

export function handleEncSelect(selected) {
  const defaultSelection = _COLUMNS_.columns.filter(([c, _]) => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[c]].isDefaultSelected)

  const hasCustomSelection = () => selected.find(([col, _]) => {
    return defaultSelection.find(([defCol, _]) => col === defCol) === undefined
  }) !== undefined

  return (selected.length !== defaultSelection.length || hasCustomSelection())
    ? encodeArray(selected.map(col => col[0]), _ROUTE_.queryDelim) : undefined
}

export function handleEncOrderBy(orderBy) {
  return encodeOrderBy(orderBy,
    col => _COLUMNS_.columnValueMapRev[col],
    _ROUTE_.queryDelim)
}

export function handleEncQuery(query) {
  return encodeQuery(
    query,
    column => _COLUMNS_.columnValueMapRev[column],
    op => _OPERATORS_.opEncMap[op],
    _ROUTE_.queryDelim,
    _ROUTE_.querySubDelim)
}
