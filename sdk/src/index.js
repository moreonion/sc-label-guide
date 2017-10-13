// import 'babel-polyfill'
import fetchLabels from '../../lib/api/fetchLabels.js'
import detectLang from '../../lib/detectLang.js'
import createApp from './wrapper.js'
import piwik from '../../plugins/piwik.js'

function getLang() {
  const lang = detectLang()
  return lang.language || lang
}

function fetchData({selected, query, search, orderBy, limit, page, lang}) {
  return fetchLabels(selected, query, search, orderBy, limit, page, lang)
}

async function mount(selector, params, res) {
  const app = await createApp(res, params)
  app.$mount(selector)
  return app
}

async function fetchAndMount(selector, params) {
  const _params = {...params, lang: getLang()}
  const data = await fetchData(_params)
  const vueInst = await mount(selector, _params, data)
  piwik(vueInst)
  return {vueInst}
}

const api = {'mount': fetchAndMount}

window.moAsyncInit(api)
