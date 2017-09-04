import Vuex from 'vuex'

import {_DEFAULT_LANGUAGE_} from '../config/language.js'
import {SET_LANG} from './mutation-types.js'

export default () => {
  return new Vuex.Store({
    state: {
      lang: _DEFAULT_LANGUAGE_
    },
    mutations: {
      [SET_LANG](state, lang) {
        state.lang = lang
      }
    }
  })
}
