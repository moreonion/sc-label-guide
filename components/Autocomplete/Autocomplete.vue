<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    @select="handleSelect"
    :props="selector"
    :custom-item="customItem">
  </el-autocomplete>
</template>

<script>
  import axios from 'axios'
  import {_APIURL_} from '../../lib/api/base.js'

  export default {
    props: {
      'config': {
        type: Object
      },
      'placeholder': {
        type: String,
        default: 'Value'
      },
      'selector': {
        type: Object,
        default: () => ({label: 'name'})
      },
      'customItem': {
        type: String,
        default: ''
      }
    },
    data: () => ({state: null}),
    methods: {
      querySearch(queryString, cb) {
        if(this.config.sync) {
          cb(this.config.sync)
        } else {
          let params = {}
          const mw = this.config.middlewares
          if(mw && mw.prefetch) {
            params = mw.prefetch(queryString)
          }

          axios.get(`${_APIURL_}/${this.config.async}`, {params}).then(res => {
            if(mw && mw.postfetch) {
              cb(mw.postfetch(res))
            } else {
              cb(res.data)
            }
          }).catch(err => {
            if(err) cb([])
            else cb([])
          })
        }
      },
      handleSelect() {

      }
    }
  }
</script>

<style>

</style>
