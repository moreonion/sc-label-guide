<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <h1 v-if="label.row" slot="title">{{label.row.name}}</h1>
    <div v-if="label.row">
      <section v-if="label.row.description">
        <h2>Description</h2>
        <p>{{label.row.description}}</p>
      </section>

      <section v-if="label.row.meets_criteria">
        <h2>Criteria met</h2>
        <ul>
          <li class="criterion" v-for="c in label.row.meets_criteria">
            {{criterionDescr(c)}}
          </li>
        </ul>
      </section>
    </div>

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
    },
    criterionDescr: c => c.criterion.details.measures[c.score+'']
  }
}
</script>

<style>
  .criterion {
    margin: 20px 0px;
  }
</style>
