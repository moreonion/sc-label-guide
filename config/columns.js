const types = {
  'RATING': 'rating',
  'TEXT': 'text'
}

export const _COLUMNS_ = {
  types,
  // Columns with order
  columns: [['name', 0], ['credibility', 1], ['environment', 2], ['social', 3]],
  columnValueMap: {
    'name': 'name',
    'credibility': 'details.score.credibility',
    'environment': 'details.score.environment',
    'social': 'details.score.social'
  },
  columnValueMapRev: {
    'name': 'name',
    'details.score.credibility': 'credibility',
    'details.score.environment': 'environment',
    'details.score.social': 'social'
  },
  columnValFuncMap: {
    'name': row => row.name,
    'details.score.credibility': row => row.details.score.credibility || 0,
    'details.score.environment': row => row.details.score.environment || 0,
    'details.score.social': row => row.details.score.social || 0
  },
  columnLabelMap: {
    'name': 'Label',
    'details.score.credibility': 'Governance& Transparency',
    'details.score.environment': 'Environmental impact',
    'details.score.social': 'Social impact'
  },
  columnMeta: {
    'name': {type: types.TEXT, hasInfo: true, mandatory: true},
    'details.score.credibility': {type: types.RATING},
    'details.score.environment': {type: types.RATING},
    'details.score.social': {type: types.RATING}
  }
}
