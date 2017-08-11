<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">Columns to show</span>
    <el-checkbox-group v-model="columns" :min="2">
      <el-checkbox class="checkbox" v-for="column in availableColumns" :key="column[1]"
        :label="column[0]" :disabled="isMandadory(column[0])">
       {{columnName(column[0])}}
     </el-checkbox>
    </el-checkbox-group>
    <span slot="footer">
      <el-button @click="dismiss">Close</el-button>
      <el-button @click="onClose" type="primary">Apply</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {_COLUMNS_} from '../../config/config.js'
import {moDialogVisibility} from '../DialogVisibility/DialogVisibility.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible', 'selectedColumns'],
  data: () => ({columns: []}),
  computed: {
    availableColumns: () => _COLUMNS_.columns
  },
  methods: {
    updateVisible(val) {
      if(val) {
        this.columns = []
        this.selectedColumns.forEach(column => {
          this.columns.push(column[0])
        })
      }

      this.$emit('update:visible', val)
    },
    columnName: column => _COLUMNS_.columnLabelMap[_COLUMNS_.columnValueMap[column]],
    isMandadory: column => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[column]].mandatory,
    projectColumns: function() {
      return this.availableColumns.filter(col => this.columns.find(c => c === col[0]) !== undefined)
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
