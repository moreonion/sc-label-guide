<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <span slot="title">{{$t('Texts.Embed')}}</span>
    <p>{{$t('Texts.EmbedDescr')}}</p>
    <el-input readonly type="textarea" :rows="22" :value="shareSnippet"></el-input>
    <span slot="footer">
      <el-button @click="dismiss">{{$t('Buttons.Close')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'
import getSDKSnippet from '../../config/sdk.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible', 'config'],
  computed: {
    shareSnippet: function() {
      const {selected, search, query, orderBy, page, limit} = this.config
      return getSDKSnippet({selected, search, query, orderBy, page, limit}).trim()
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
