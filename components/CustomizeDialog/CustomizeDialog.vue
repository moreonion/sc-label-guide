<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">{{$t('Modals.Headers.ColumnsToShow')}}</span>
    <el-checkbox-group v-model="columns" :min="2">
      <el-checkbox class="checkbox" v-for="column in availableColumns" :key="column[1]"
        :label="column[0]" :disabled="isMandadory(column[0])">
       {{columnName(column[0], lang)}}
     </el-checkbox>
    </el-checkbox-group>
    <span slot="footer">
      <el-button @click="dismiss">{{$t('Buttons.Close')}}</el-button>
      <el-button @click="onClose" type="primary">{{$t('Buttons.Apply')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'

import {_COLUMNS_} from '../../config/config.js'
import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible', 'selectedColumns'],
  data: () => ({columns: []}),
  computed: {
    ...mapState(['lang']),
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
    columnName(column, lang) {
      return this.$i18n.t(_COLUMNS_.columnLabelMap[_COLUMNS_.columnValueMap[column]], lang)
    },
    isMandadory: column => _COLUMNS_.columnMeta[_COLUMNS_.columnValueMap[column]].isMandatory,
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
  .checkbox.el-checkbox {
    display: block;
    margin-left: 0px;
    margin-bottom: 10px;
  }
</style>
