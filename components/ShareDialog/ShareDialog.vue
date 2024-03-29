<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <span slot="title">{{$t('Texts.EmbedSDK.Embed')}}</span>
    {{$t('Basics.Method')}}:
    <el-select v-model="method">
      <el-option :value="option" :key="index" v-for="(option, index) in options">{{option}}</el-option>
    </el-select>

    <div v-if="method === 'SDK'">
      <i18n path="Texts.EmbedSDK.EmbedDescr" tag="p">
        <el-tag type="gray">body</el-tag>
        <el-tag type="primary">label-guide</el-tag>
      </i18n>
      <i18n path="Texts.EmbedSDK.EmbedDocs" tag="p">
        <a href="https://labels.supplychainge.org/sdk/readme/" target="_blank">SDK Readme</a>
      </i18n>
      <el-input readonly type="textarea" :rows="22" :value="shareSnippet"></el-input>
    </div>
    <div v-else>
      <i18n path="Texts.EmbedIFrame.EmbedDescr" tag="p">
        <el-tag type="gray">iframe</el-tag>
      </i18n>
      <el-input readonly type="textarea" :rows="5" :value="shareIframe"></el-input>
    </div>

    <span slot="footer">
      <el-button @click="dismiss">{{$t('Buttons.Close')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'
import {getSDKSnippet, getIframeSnippet} from '../../lib/sdk.js'
import {stringifyQuery} from '../../lib/transformQuery.js'
import {
  handleEncSelect, handleEncOrderBy, handleEncQuery
} from '../../lib/handleEncode.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible', 'config'],
  data() {
    return {
      options: ['SDK', 'IFrame'],
      method: 'SDK'
    }
  },
  computed: {
    shareSnippet() {
      const {selected, search, query, orderBy, page, limit} = this.config
      return getSDKSnippet({selected, search, query, orderBy, page, limit}).trim()
    },
    shareIframe() {
      const {selected, search, query, orderBy, page, limit} = this.config

      const encSelect = handleEncSelect(selected)

      const [encOrderBy, encOrderDir] = handleEncOrderBy(orderBy)
      const encOrderByObj = {orderBy: encOrderBy, orderDir: encOrderDir}

      const encQueryObj = handleEncQuery(query)

      const qStr = stringifyQuery({
        select: encSelect,
        ...encOrderByObj,
        ...encQueryObj,
        page,
        limit,
        search: search.length > 0 ? search : undefined
      })

      return getIframeSnippet(qStr)
    }
  },
  methods: {
    onClose: function() {
      this.dismiss()
    }
  }
}
</script>

<style>

</style>
