// import 'babel-polyfill'
import fetchLabels from '../../lib/api/fetchLabels.js'
import createApp from './wrapper.js'

function fetchData({selected, query, search, orderBy, limit, page}) {
  return fetchLabels(selected, query, search, orderBy, limit, page)
}

async function mount(selector, params, res) {
  const app = await createApp(res, params)
  app.$mount(selector)
  return app
}

async function fetchAndMount(selector, params, succCB, errCB) {
  try {
    const data = await fetchData(params)
    const vueInst = await mount(selector, params, data)
    succCB(vueInst)
  } catch(err) {
    errCB(err)
  }
}

const api = {'mount': fetchAndMount}

window.moAsyncInit(api)
