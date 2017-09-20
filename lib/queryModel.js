import {_COLUMNS_} from '../config/config.js'
import {fetchEndpoint} from './api/fetch.js'
import {getColumn, getOperator} from './query.js'
import {isListOperator} from './operator.js'

const wrapQuery = (col, op, model) => ({[col]: {[op]: model}})

const dissectQuery = query => {
  const col = getColumn(query)
  const qSpec = query[col]
  const op = getOperator(qSpec)
  const val = qSpec[op]

  return {col, op, val, qSpec}
}

export async function extendModel(query, syncParams) {
  const modelPromises = query['$and'].map(q => {
    const {col, op, val} = dissectQuery(q)

    const meta = _COLUMNS_.columnMeta[col]
    const model = meta.model

    if(model.sync) {
      const modVal = model.sync(syncParams).find(mVal => val === mVal[model.projectValue])
      return Promise.resolve(wrapQuery(col, op, modVal))
    } else {
      const mw = model.middlewares
      return Promise.resolve(
        fetchEndpoint(model.async, {[`${model.projectValue}:eq`]: val})
          .then(mw.postfetch)
          .then(modVal => wrapQuery(col, op, modVal)))
    }
  })

  const and = await Promise.all(modelPromises)

  return {'$and': and}
}

export function shrinkModel(query) {
  const and = query['$and'].map(q => {
    const {col, op, val} = dissectQuery(q)

    const meta = _COLUMNS_.columnMeta[col]
    const model = meta.model

    if(val) {
      if(isListOperator(op) && val.length && val.length > 0) {
        return wrapQuery(col, op, val.map(v => v[model.projectValue]))
      } else {
        return wrapQuery(col, op, val[model.projectValue])
      }
    }
  })

  return {'$and': and}
}
