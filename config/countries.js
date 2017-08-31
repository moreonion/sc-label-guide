import reduce from 'lodash.reduce'
import countries from 'i18n-iso-countries'

export const _COUNTRIES_ = reduce(countries.getNames('en'), (accum, label, code) => {
  accum.push({label, code})
  return accum
}, [])
