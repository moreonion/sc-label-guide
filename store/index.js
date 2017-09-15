import Vuex from 'vuex'

import {_DEFAULT_LANGUAGE_} from '../config/language.js'
import {SET_LANG, SET_DETECTED_LANG} from './mutation-types.js'

export default () => {
  return new Vuex.Store({
    state: {
      lang: _DEFAULT_LANGUAGE_,
      detectedLang: _DEFAULT_LANGUAGE_
    },
    mutations: {
      [SET_LANG](state, lang) {
        state.lang = lang
      },
      [SET_DETECTED_LANG](state, lang) {
        state.detectedLang = lang
      }
    }
  })
}
