export const _OPERATORS_ = {
  // Available operators
  ops: ['$eq', '$gt', '$gte', '$lt', '$lte'],
  // Operators mapped to displayable labels
  opLabelMap: {
    '$eq': 'is',
    '$gt': 'is better than',
    '$gte': 'is at least',
    '$lt': 'is worse than',
    '$lte': 'is at most',
    '$in': 'in',
    '$text': '$text' // not displayed, therefore no mapping
  },
  // Operators mapped to displayable labels (reverse)
  opLabelMapRev: {
    'is': '$eq',
    'is better than': '$gt',
    'is at least': '$gte',
    'is worse than': '$lt',
    'is at most': '$lte',
    'in': '$in',
    '$text': '$text'
  },
  // Operators mapped to encodeable route query params
  opEncMap: {
    '$eq': 'eq',
    '$gte': 'gte',
    '$gt': 'gt',
    '$lte': 'lte',
    '$lt': 'lt',
    '$in': 'in'
  },
  // Operators mapped to encodeable route query params (reverse)
  opEncMapRev: {
    'eq': '$eq',
    'gt': '$gt',
    'gte': '$gte',
    'lt': '$lt',
    'lte': '$lte',
    'in': '$in'
  },
  opEncApiMap: {
    '$eq': 'eq',
    '$gte': 'ge',
    '$gt': 'gt',
    '$lt': 'lt',
    '$lte': 'le',
    '$in': 'in'
  },
  opMeta: {
    '$in': {isListOperator: true}
  }
}
