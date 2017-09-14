import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from '../static/i18n/lang_en.json'
import de from '../static/i18n/lang_de.json'

Vue.use(VueI18n)

const translations = {'en': en, 'de': de}

export function getI18nInst(locale, fallback='en', silentWarnings=false) {
  return new VueI18n({
    locale: locale,
    fallbackLocale: fallback,
    messages: translations,
    silentTranslationWarn: silentWarnings
  })
}

export default ({app, store, isDev}) => {
  app.i18n = getI18nInst(store.state.lang, 'en', !isDev)
}
