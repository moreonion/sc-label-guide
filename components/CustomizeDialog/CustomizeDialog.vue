<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">Columns to show</span>
    <el-checkbox-group v-model="columns" :min="1">
      <el-checkbox class="checkbox" v-for="column in selectableColumns"
       :key="column[1]" :label="column[0]" :disabled="mandatoryColumns[column[0]]">
       {{colNameMap[column[0]]}}
     </el-checkbox>
    </el-checkbox-group>
    <span slot="footer">
      <el-button @click="dismiss">Close</el-button>
      <el-button @click="onClose" type="primary">Apply</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {moDialogVisibility} from '../DialogVisibility/DialogVisibility.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible', 'selectableColumns', 'selectedColumns', 'colNameMap'],
  data() {
    return {
      columns: [],
      mandatoryColumns: {
        'label': true
      }
    }
  },
  created: function() {
    this.$on('update:visible', val => {
      if(val) {
        this.selectedColumns.forEach(s => {
          this.columns.push(s[0])
        })
      }
    })
  },
  methods: {
    projectColumns: function() {
      return this.selectableColumns.filter(col => this.columns.find(c => c === col[0]) !== undefined)
    },
    onClose: function() {
      this.dismiss()
      this.$emit('close', this.projectColumns())
    }
  }
}
</script>

<style>

</style>
