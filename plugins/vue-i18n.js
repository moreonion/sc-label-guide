import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from '../static/i18n/lang_en.json'
import de from '../static/i18n/lang_de.json'

Vue.use(VueI18n)

const translations = {'en': en, 'de': de}

export default ({app}) => {
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: translations
  })
}
