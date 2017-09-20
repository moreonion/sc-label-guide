import {_OPERATORS_} from '../config/config.js'

export function isListOperator(op) {
  return _OPERATORS_.opMeta[op] && _OPERATORS_.opMeta[op].isListOperator
}
