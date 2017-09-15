import Vuex from 'vuex'
import createStore from '../../store'

export default function(Vue) {
  Vue.use(Vuex)
  return createStore()
}
