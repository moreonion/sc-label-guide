export const _OPERATORS_ = {
  // Available operators
  ops: ['$eq', '$gt', '$gte', '$lt', '$lte'],
  // Operators mapped to displayable labels
  opLabelMap: {
    '$eq': 'is',
    '$gt': '>',
    '$gte': '>=',
    '$lt': '<',
    '$lte': '<=',
    '$text': '$text' // not displayed, therefore no mapping
  },
  // Operators mapped to displayable labels (reverse)
  opLabelMapRev: {
    'is': '$eq',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    '$text': '$text'
  },
  // Operators mapped to encodeable route query params
  opEncMap: {
    '$eq': 'eq',
    '$gte': 'gte',
    '$gt': 'gt',
    '$lte': 'lte',
    '$lt': 'lt'
  },
  // Operators mapped to encodeable route query params (reverse)
  opEncMapRev: {
    'eq': '$eq',
    'gt': '$gt',
    'gte': '$gte',
    'lt': '$lt',
    'lte': '$lte'
  },
  opEncApiMap: {
    '$eq': '',
    '$gte': '>=',
    '$gt': '>',
    '$lt': '<',
    '$lte': '<='
  }
}
