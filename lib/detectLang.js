import locale from 'locale'
// use locale2 to detect browser lang / node lang
import locale2 from 'locale2'

import {_DEFAULT_LANGUAGE_, _AVAILABLE_LANGUAGES_} from '../config/language.js'
// import D from '../lib/debug.js'

locale.Locale['default'] = _DEFAULT_LANGUAGE_

export default function() {
  const supportedLanguages = new locale.Locales(_AVAILABLE_LANGUAGES_)

  const clientLocale = new locale.Locales(locale2)
  const clientLang = clientLocale.best(supportedLanguages)

  return clientLang
}
