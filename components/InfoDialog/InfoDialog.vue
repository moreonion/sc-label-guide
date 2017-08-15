<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <span slot="title">Criteria this label has</span>

    <section v-if="label.row && label.row.description">
      <h2>Description</h2>
      <p>{{label.row.description}}</p>
    </section>

    <span slot="footer">
      <el-button @click="dismiss">Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {moDialogVisibility} from '../DialogVisibility/DialogVisibility.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible', 'label'],
  methods: {
    onClose: function() {
      this.dismiss()
    }
  }
}
</script>

<style>

</style>
