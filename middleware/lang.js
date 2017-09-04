import locale from 'locale'
import {_DEFAULT_LANGUAGE_, _AVAILABLE_LANGUAGES_} from '../config/language.js'
import {SET_LANG} from '../store/mutation-types.js'
// import D from '../lib/debug.js'

locale.Locale['default'] = _DEFAULT_LANGUAGE_

export default function({isServer, store, query, req}) {
  const supportedLanguages = new locale.Locales(_AVAILABLE_LANGUAGES_, _DEFAULT_LANGUAGE_)

  let acceptLang = null
  if(isServer && req.headers['accept-language']) {
    const locales = new locale.Locales(req.headers['accept-language'])
    acceptLang = locales.best(supportedLanguages)
  }

  let routeLang = null
  if(query && query.lang) {
    routeLang = supportedLanguages.best(new locale.Locales([query.lang]))
  }

  const bestLang = routeLang || acceptLang || _DEFAULT_LANGUAGE_

  store.commit(SET_LANG, bestLang)
}
