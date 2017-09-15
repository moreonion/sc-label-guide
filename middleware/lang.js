import locale from 'locale'
// use locale2 to detect browser lang / node lang
import locale2 from 'locale2'

import {_DEFAULT_LANGUAGE_, _AVAILABLE_LANGUAGES_} from '../config/language.js'
import {SET_LANG, SET_DETECTED_LANG} from '../store/mutation-types.js'
// import D from '../lib/debug.js'

locale.Locale['default'] = _DEFAULT_LANGUAGE_

export default function({app, isClient, isServer, store, query, req}) {
  const supportedLanguages = new locale.Locales(_AVAILABLE_LANGUAGES_)

  let routeLang = null
  if(query && query.lang) {
    const queryLocale = new locale.Locales(query.lang)
    routeLang = queryLocale.best(supportedLanguages)
  }

  let acceptLang = null
  if(isServer && req.headers['accept-language']) {
    const acceptedLocales = new locale.Locales(req.headers['accept-language'])
    acceptLang = acceptedLocales.best(supportedLanguages)
  }

  const clientLocale = new locale.Locales(locale2)
  const clientLang = clientLocale.best(supportedLanguages)

  const detectedLang = acceptLang || clientLang || {language: _DEFAULT_LANGUAGE_}
  const bestLang = routeLang || detectedLang || {language: _DEFAULT_LANGUAGE_}

  store.commit(SET_LANG, bestLang.language)
  store.commit(SET_DETECTED_LANG, detectedLang.language)
}
