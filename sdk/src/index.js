// import 'babel-polyfill'
import fetchLabels from '../../lib/api/fetchLabels.js'
import createApp from './wrapper.js'

function fetchData({selected, query, search, orderBy, limit, page}, succCB, errCB) {
  fetchLabels(selected, query, search, orderBy, limit, page).then(succCB).catch(err => errCB(err))
}

function mount(selector, params, res, succCB, errCB) {
  createApp(res, params, app => {
    app.$mount(selector)
    succCB()
  }, errCB)
}

function fetchAndMount(selector, params, succCB, errCB) {
  fetchData(params, data => {
    mount(selector, params, data, succCB, errCB)
  }, errCB)
}

const api = {'mount': fetchAndMount}

window.moAsyncInit(api)
