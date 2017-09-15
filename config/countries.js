import reduce from 'lodash.reduce'
import countries from 'i18n-iso-countries'

export const _GETCOUNTRIES_ = lang => reduce(countries.getNames(lang), (accum, label, code) => {
  accum.push({label, code})
  return accum
}, [])
