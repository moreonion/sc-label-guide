import locale from 'locale'
// use locale2 to detect browser lang / node lang
import locale2 from 'locale2'

import {_DEFAULT_LANGUAGE_, _AVAILABLE_LANGUAGES_} from '../config/language.js'
import {SET_LANG} from '../store/mutation-types.js'
// import D from '../lib/debug.js'

locale.Locale['default'] = _DEFAULT_LANGUAGE_

export default function({isClient, isServer, store, query, req}) {
  const supportedLanguages = new locale.Locales(_AVAILABLE_LANGUAGES_, _DEFAULT_LANGUAGE_)

  let routeLang = null
  if(query && query.lang) {
    const queryLocale = new locale.Locales([query.lang], _DEFAULT_LANGUAGE_)
    routeLang = queryLocale.best(supportedLanguages)
  }

  let acceptLang = null
  if(isServer && req.headers['accept-language']) {
    const acceptedLocales = new locale.Locales(req.headers['accept-language'], _DEFAULT_LANGUAGE_)
    acceptLang = acceptedLocales.best(supportedLanguages)
  }

  const clientLocale = new locale.Locales([locale2], _DEFAULT_LANGUAGE_)
  const clientLang = clientLocale.best(supportedLanguages)

  const bestLang = routeLang || acceptLang || clientLang || _DEFAULT_LANGUAGE_

  store.commit(SET_LANG, bestLang)
}
