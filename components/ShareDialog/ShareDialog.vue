<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <span slot="title">Embed this label guide on your website</span>
    <el-input readonly type="textarea" :rows="15" v-model="shareSnippet"></el-input>
    <span slot="footer">
      <el-button @click="dismiss">Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible'],
  data: () => ({
    shareSnippet: '<<< TODO: Coming Soon! >>>'
  }),
  methods: {
    onClose: function() {
      this.dismiss()
    }
  }
}
</script>

<style>

</style>
