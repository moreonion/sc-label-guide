<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearch"
    placeholder="Please input"
    @select="handleSelect"
    :props="{label:'name'}">
  </el-autocomplete>
</template>

<script>
  import axios from 'axios'
  import {_APIURL_} from '../../lib/api/base.js'

  export default {
    props: ['config'],
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
