import {AutocompleteTypes} from './api.js'

const types = {
  'RATING': 'rating',
  'TEXT': 'text',
  'LIST': 'list'
}

const defaultScoreAutocompleteConfig = {
// vue element autocomplete requires objects as items in dropdown
  sync: [
    {label: '0', value: 0},
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3}
  ],
  dropdown: {
    selector: {'label': 'label', 'value': 'label'}
  },
  middlewares: {
    postfetch(data, query) {
      if(typeof query === 'string' && query.length > 0) {
        return data.filter(d => d.label === query)
      } else {
        return data
      }
    }
  }
}

export const _COLUMNS_ = {
  types,
  // Columns with order
  columns: [['name', 0], ['credibility', 1], ['environment', 2], ['social', 3], ['hotspots', 4], ['resources', 5]],
  columnValueMap: {
    'name': 'name',
    'credibility': 'details.score.credibility',
    'environment': 'details.score.environment',
    'social': 'details.score.social',
    'hotspots': 'hotspots',
    'resources': 'resources'
  },
  columnValueMapRev: {
    'name': 'name',
    'details.score.credibility': 'credibility',
    'details.score.environment': 'environment',
    'details.score.social': 'social',
    'hotspots': 'hotspots',
    'resources': 'resources'
  },
  columnValFuncMap: {
    'name': row => row.name,
    'details.score.credibility': row => row.details.score.credibility || 0,
    'details.score.environment': row => row.details.score.environment || 0,
    'details.score.social': row => row.details.score.social || 0,
    'hotspots': row => row.hotspots || [],
    'resources': row => row.resources || []
  },
  columnLabelMap: {
    'name': 'Label',
    'details.score.credibility': 'Governance& Transparency',
    'details.score.environment': 'Environmental impact',
    'details.score.social': 'Social impact',
    'hotspots': 'Issues label has impact on',
    'resources': 'Raw materials label has impact on'
  },
  columnMeta: {
    'name': {
      type: types.TEXT,
      hasInfo: true,
      isSortable: true,
      isQueryable: true,
      isMandatory: true,
      isDefaultSelected: true,
      hasAutocomplete: true,
      autocomplete: {
        async: 'labels?only=name,id',
        middlewares: {
          postfetch: data => data.items
        },
        dropdown: {
          selector: {'label': 'name', 'value': 'name'}
        },
        endpoint: {
          type: AutocompleteTypes.EMULATED
        }
      }
    },
    'details.score.credibility': {
      type: types.RATING,
      isSortable: true,
      isQueryable: true,
      isDefaultSelected: true,
      hasAutocomplete: true,
      autocomplete: defaultScoreAutocompleteConfig
    },
    'details.score.environment': {
      type: types.RATING,
      isSortable: true,
      isQueryable: true,
      isDefaultSelected: true,
      hasAutocomplete: true,
      autocomplete: defaultScoreAutocompleteConfig
    },
    'details.score.social': {
      type: types.RATING,
      isSortable: true,
      isQueryable: true,
      isDefaultSelected: true,
      hasAutocomplete: true,
      autocomplete: defaultScoreAutocompleteConfig
    },
    'hotspots': {type: types.LIST},
    'resources': {
      type: types.LIST,
      isQueryable: true,
      hasAutocomplete: true,
      autocomplete: {
        async: 'resources?only=name,id',
        middlewares: {
          postfetch: res => res.items
        }
      }
    }
  }
}
