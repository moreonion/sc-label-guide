import {AutocompleteTypes} from './api.js'
import {_COUNTRIES_} from './countries.js'

const types = {
  'RATING': 0,
  'TEXT': 1,
  'LIST': 2
}

const scoreValues = [
  {label: '0', value: 0},
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3}
]

const defaultModelConfig = {
  sync: scoreValues,
  projectLabel: 'label',
  projectValue: 'value'
}

const defaultAutocompleteConfig = {
  middlewares: {
    postfetch: (res, {query}) => {
      if(typeof query === 'string' && query.length > 0) {
        const qParts = query.split(/[\s,]/)
          .filter(p => p.length > 0)
          .map(p => p.toLocaleLowerCase())

        return res.data.items.filter(item => {
          const _name = item.name.toLocaleLowerCase()
          return qParts.find(qPart => _name.includes(qPart)) !== undefined
        })
      } else {
        return res.data.items
      }
    },
    totalPages: res => res.data.pages.total
  },
  dropdown: {
    selector: {'label': 'name', 'value': 'name'}
  },
  endpoint: {
    type: AutocompleteTypes.EMULATED,
    minResults: 5,
    maxResults: 10,
    limit: 50
  }
}

// vue element autocomplete requires objects as items in dropdown
const defaultScoreAutocompleteConfig = {
  sync: scoreValues,
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
  columns: [['name', 0], ['hotspots', 2], ['resources', 3], ['credibility', 4], ['environment', 5], ['social', 6], ['countries', 7]],
  columnValueMap: {
    'name': 'name',
    'credibility': 'details.score.credibility',
    'environment': 'details.score.environment',
    'social': 'details.score.social',
    'hotspots': 'hotspots',
    'resources': 'resources',
    'countries': 'countries'
  },
  columnValueMapRev: {
    'name': 'name',
    'details.score.credibility': 'credibility',
    'details.score.environment': 'environment',
    'details.score.social': 'social',
    'hotspots': 'hotspots',
    'resources': 'resources',
    'countries': 'countries'
  },
  columnValFuncMap: {
    'name': row => row.name,
    'details.score.credibility': row => row.details.score.credibility || 0,
    'details.score.environment': row => row.details.score.environment || 0,
    'details.score.social': row => row.details.score.social || 0,
    'hotspots': row => row.hotspots || [],
    'resources': row => row.resources || [],
    'countries': row => row.countries || []
  },
  columnLabelMap: {
    'name': 'Label',
    'details.score.credibility': 'Governance& Transparency',
    'details.score.environment': 'Environmental impact',
    'details.score.social': 'Social impact',
    'hotspots': 'Issues label has impact on',
    'resources': 'Raw materials label has impact on',
    'countries': 'Countries'
  },
  columnMeta: {
    'name': {
      type: types.TEXT,
      hasInfo: true,
      isSortable: true,
      isQueryable: true,
      isMandatory: true,
      isDefaultSelected: true,
      autocomplete: {
        ...defaultAutocompleteConfig,
        async: 'labels?only=name,id'
      },
      ops: ['$eq']
    },
    'details.score.credibility': {
      type: types.RATING,
      isSortable: true,
      isQueryable: true,
      isDefaultSelected: true,
      model: defaultModelConfig,
      autocomplete: defaultScoreAutocompleteConfig
    },
    'details.score.environment': {
      type: types.RATING,
      isSortable: true,
      isQueryable: true,
      isDefaultSelected: true,
      model: defaultModelConfig,
      autocomplete: defaultScoreAutocompleteConfig
    },
    'details.score.social': {
      type: types.RATING,
      isSortable: true,
      isQueryable: true,
      isDefaultSelected: true,
      model: defaultModelConfig,
      autocomplete: defaultScoreAutocompleteConfig
    },
    'hotspots': {
      type: types.LIST,
      projectItemLabel: li => li.name,
      isQueryable: true,
      model: {
        async: 'hotspots?only=name,id',
        projectLabel: 'name',
        projectValue: 'id',
        middlewares: {
          postfetch: res => res.data.items[0]
        }
      },
      autocomplete: {
        ...defaultAutocompleteConfig,
        async: 'hotspots?only=name,id'
      },
      ops: ['$eq']
    },
    'resources': {
      type: types.LIST,
      projectItemLabel: li => li.name,
      isQueryable: true,
      model: {
        async: 'resources?only=name,id',
        projectLabel: 'name',
        projectValue: 'id',
        middlewares: {
          postfetch: res => res.data.items[0]
        }
      },
      autocomplete: {
        ...defaultAutocompleteConfig,
        async: 'resources?only=name,id'
      },
      ops: ['$eq']
    },
    'countries': {
      type: types.LIST,
      projectItemLabel: li => li,
      isQueryable: true,
      model: {
        sync: _COUNTRIES_,
        projectLabel: 'label',
        projectValue: 'code'
      },
      autocomplete: {
        sync: _COUNTRIES_,
        dropdown: {
          selector: {'label': 'label', 'value': 'label'}
        },
        middlewares: {
          postfetch(data, query) {
            if(typeof query === 'string' && query.length > 0) {
              const _query = query.toLowerCase()

              return data.filter(({label, code}) => {
                const _label = label.toLocaleLowerCase()
                return _label.includes(_query)
              }).slice(0, 10)
            } else {
              return data.slice(0, 10)
            }
          }
        }
      },
      ops: ['$eq']
    }
  }
}
