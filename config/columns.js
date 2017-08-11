const types = {
  'RATING': 'rating',
  'TEXT': 'text'
}

export const _COLUMNS_ = {
  types,
  // Columns with order
  columns: [['label', 0], ['govTrans', 1], ['envImpact', 2], ['socImpact', 3]],
  columnValueMap: {
    'label': 'label.name',
    'govTrans': 'govTrans',
    'envImpact': 'envImpact',
    'socImpact': 'socImpact'
  },
  columnValueMapRev: {
    'label.name': 'label',
    'govTrans': 'govTrans',
    'envImpact': 'envImpact',
    'socImpact': 'socImpact'
  },
  columnValFuncMap: {
    'label.name': row => row.label.name,
    'govTrans': row => row.govTrans,
    'envImpact': row => row.envImpact,
    'socImpact': row => row.socImpact
  },
  columnLabelMap: {
    'label.name': 'Label',
    'govTrans': 'Governance& Transparency',
    'envImpact': 'Environmental impact',
    'socImpact': 'Social impact'
  },
  columnMeta: {
    'label.name': {type: types.TEXT, hasInfo: true, mandatory: true},
    'govTrans': {type: types.RATING},
    'envImpact': {type: types.RATING},
    'socImpact': {type: types.RATING}
  }
}
