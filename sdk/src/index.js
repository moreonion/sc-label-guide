// import Vue from 'vue'
// import LabelTable from '../../components/LabelTable.vue'

class MO {
  init({select, orderBy, orderDir, query, search}, succCB, errCB) {
    try {
      const res = {'data': [1,2,3]}
      succCB(res)
    } catch(err) {
      errCB(err)
    }
  }

  mount(selector) {
    // const app = new Vue({
    //   el: selector,
    //   components: {
    //     'label-table': LabelTable
    //   },
    //   data: {
    //     message: 'Hello Vue!'
    //   },
    //   render(h) {
    //     return h('div', this.message)
    //   }
    // })
  }

  mountFetched(selector, params, succCB, errCB) {
    this.init(params, () => {
      this.mount(selector, succCB)
      succCB()
    }, errCB)
  }
}

// pass new MO sdk instance
const sdkInst = new MO()

window.moAsyncInit(sdkInst)
