<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <span slot="title">Filters</span>

    <div>
      <el-button @click="addFilter" type="primary">Add filter</el-button>

      <div v-if="filters.length > 0" class="filter-cont" :key="index" v-for="(filter, index) in filters">
        <el-select class="leftSelect" v-model="filter.left" placeholder="Column">
          <el-option v-for="column in selectedColumns" :key="column[1]"
            :label="colNameMap[column[0]]" :value="column[0]">
          </el-option>
        </el-select>

        <el-select class="opSelect" v-model="filter.op" placeholder="Operator" disabled>
          <el-option v-for="(op, index) in ops" :key="index" :label="op" :value="op"></el-option>
        </el-select>

        <el-input class="rightInput" placeholder="Value" v-model="filter.right"></el-input>

        <el-button @click="filters.splice(index, 1)"><i class="el-icon-close"></i></el-button>
      </div>
      <!-- BUG: v-else not working here -->
      <div v-if="filters.length === 0" class="emptyState">
        Add new filters to get more precise search results.
      </div>

    </div>

    <span slot="footer">
      <el-button @click="dismiss">Close</el-button>
      <el-button @click="onClose" type="primary">Apply</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'query', 'selectedColumns', 'colNameMap'],
  data: () => ({
    ops: ['is'],
    opMap: {'is': '$eq'},
    opMapRev: {'$eq': 'is'},
    filters: []
  }),
  created: function () {
    // Query -> Filters array
    for (let c in this.query) {
      // TODO: allow arb operators
      this.filters.push({left: c, op: this.opMapRev['$eq'], right: this.query[c]['$eq']})
    }
  },
  methods: {
    addFilter: function () {
      this.filters.push({left: this.selectedColumns[0][0], op: 'is', right: ''})
    },
    mapFilters: function () {
      // Filters array -> Query
      return this.filters.reduce((accum, filter) => {
        accum[filter.left] = {[this.opMap[filter.op]]: parseInt(filter.right)}
        return accum
      }, {})
    },
    updateVisible: function (val) {
      this.emitUpdate(val)
    },
    dismiss: function () {
      this.emitUpdate(false)
    },
    emitUpdate: function (val) {
      this.$emit('update:visible', val)
    },
    onClose: function () {
      this.dismiss()
      this.$emit('close', this.mapFilters())
    }
  }
}
</script>

<style>
  .filter-cont {
    border: 1px solid #CFD0D1;
    padding: 10px;
    margin-bottom: 20px;
  }

  .emptyState {
    padding: 20px;
  }

  .leftSelect {
    width: 150px;
    margin-right: 5px;
  }

  .rightInput.el-input {
    width: 150px;
  }

  .opSelect {
    width: 100px;
    margin-right: 5px;
  }
</style>
