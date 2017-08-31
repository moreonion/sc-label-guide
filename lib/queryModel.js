import {_COLUMNS_} from '../config/columns.js'
import {fetchEndpoint} from './api/fetch.js'
import {getColumn, getOperator} from './query.js'

const wrapQuery = (col, op, model) => ({[col]: {[op]: model}})

export async function extendModel(query) {
  const modelPromises = query['$and'].map(q => {
    const col = getColumn(q)
    const meta = _COLUMNS_.columnMeta[col]
    const model = meta.model
    const qSpec = q[col]
    const op = getOperator(qSpec)
    const val = qSpec[op]

    if(model) {
      if(model.sync) {
        const modVal = model.sync.find(mVal => val === mVal[model.projectValue])
        return Promise.resolve(wrapQuery(col, op, modVal))
      } else {
        const mw = model.middlewares
        return Promise.resolve(
          fetchEndpoint(model.async, {[`${model.projectValue}:eq`]: val})
            .then(mw.postfetch)
            .then(modVal => wrapQuery(col, op, modVal)))
      }
    } else {
      return Promise.resolve(wrapQuery(col, op, val))
    }
  })

  const and = await Promise.all(modelPromises)

  return {'$and': and}
}

// export function shrinkModel(query) {
//   const modelPromises = query['$and'].map(q => {

//   })
//   return {'$and': and}
// }
