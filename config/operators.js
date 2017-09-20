export const _OPERATORS_ = {
  // Available operators
  ops: ['$eq', '$gt', '$gte', '$lt', '$lte', '$in'],
  // Operators mapped to displayable labels
  opLabelMap: {
    '$eq': 'Operators.eq',
    '$gt': 'Operators.gt',
    '$gte': 'Operators.gte',
    '$lt': 'Operators.lt',
    '$lte': 'Operators.lte',
    '$in': 'Operators.in',
    '$text': 'Operators.text' // not displayed, therefore no mapping
  },
  // Operators mapped to displayable labels (reverse)
  opLabelMapRev: {
    'Operators.eq': '$eq',
    'Operators.gt': '$gt',
    'Operators.gte': '$gte',
    'Operators.lt': '$lt',
    'Operators.lte': '$lte',
    'Operators.in': '$in',
    'Operators.text': '$text'
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
