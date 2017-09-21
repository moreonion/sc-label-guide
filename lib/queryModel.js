import {_COLUMNS_} from '../config/config.js'
import {fetchEndpoint} from './api/fetch.js'
import {getColumn, getOperator} from './query.js'
import {isListOperator} from './operator.js'

const dissectQuery = query => {
  const col = getColumn(query)
  const qSpec = query[col]
  const op = getOperator(qSpec)
  const val = qSpec[op]

  return {col, op, val, qSpec}
}

const syncValueFinderFactory = (model, syncParams) => val => {
  return model.sync(syncParams).find(mVal => val === mVal[model.projectValue])
}

const asyncValueFinderFactory = model => val => {
  return fetchEndpoint(model.async, {[`${model.projectValue}:eq`]: val})
    .then(model.middlewares.postfetch)
}

const wrapQuery = (col, op, model) => ({[col]: {[op]: model}})

const resolveWrapped = (col, op, resVal) => Promise.resolve(wrapQuery(col, op, resVal))

export async function extendModel(query, syncParams) {
  const modelPromises = query['$and'].map(q => {
    const {col, op, val} = dissectQuery(q)

    const meta = _COLUMNS_.columnMeta[col]
    const model = meta.model

    if(model.sync) {
      const syncFinder = syncValueFinderFactory(model, syncParams)
      if(isListOperator(op)) {
        const resVals = val.map(v => syncFinder(v))
        return resolveWrapped(op, col, resVals)
      } else {
        return resolveWrapped(op, col, syncFinder(val))
      }
    } else {
      const asyncFinder = asyncValueFinderFactory(model)
      if(isListOperator(op)) {
        const resValsPromises = val.map(v => asyncFinder(v))
        return Promise.all(resValsPromises).then(resVals => resolveWrapped(col, op, resVals))
      } else {
        return asyncFinder(val).then(resVal => resolveWrapped(col, op, resVal))
      }
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
