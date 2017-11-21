import locale from 'locale'
import detectLang from '../lib/detectLang.js'

import {_DEFAULT_LANGUAGE_, _AVAILABLE_LANGUAGES_} from '../config/language.js'
import {SET_LANG, SET_DETECTED_LANG} from '../store/mutation-types.js'

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

  const clientLang = detectLang()

  const detectedLang = acceptLang || clientLang || {language: _DEFAULT_LANGUAGE_}
  const bestLang = routeLang || detectedLang || {language: _DEFAULT_LANGUAGE_}

  store.commit(SET_LANG, bestLang.language || bestLang)
  store.commit(SET_DETECTED_LANG, detectedLang.language || detectedLang)

  // update the locale
  app.i18n.locale = bestLang.language || bestLang
}
