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

        <el-select class="opSelect" v-model="filter.op" placeholder="Operator">
          <el-option v-for="(op, index) in ops" :key="index" :label="op" :value="op"></el-option>
        </el-select>

        <el-select v-if="isRating(filter.left)" v-model="filter.right" placeholder="Value">
          <el-option v-for="(rating, index) in [3,2,1]" :key="index" :value="rating">
            <eval-circle :value="rating"></eval-circle>
          </el-option>
        </el-select>
        <el-input style="width: 100px" placeholder="Value" v-model="filter.right" v-else></el-input>

        <el-button @click="filters.splice(index, 1)"><i class="el-icon-delete"></i></el-button>
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
  import {moDialogVisibility} from '../DialogVisibility/DialogVisibility.js'

  import EvalCircle from '../EvalCircle.vue'

  const getOperator = query => {
    for (const op in query) {
      return op
    }
  }

  export default {
    mixins: [moDialogVisibility],
    components: {
      'eval-circle': EvalCircle
    },
    props: ['visible', 'query', 'selectedColumns', 'colNameMap', 'colSpec'],
    data: () => ({
      ops: ['is', '>', '>=', '<', '<='],
      opMap: {
        'is': '$eq',
        '>': '$gt',
        '>=': '$gte',
        '<': '$lt',
        '<=': '$lte'
      },
      opMapRev: {
        '$eq': 'is',
        '$gt': '>',
        '$gte': '>=',
        '$lt': '<',
        '$lte': '<='
      },
      filters: []
    }),
    created: function () {
      // Query -> Filters array
      for (const field in this.query) {
        const op = getOperator(this.query[field])
        this.filters.push({left: field, op: this.opMapRev[op], right: this.query[field][op]})
      }
    },
    methods: {
      addFilter: function () {
        this.filters.push({left: this.selectedColumns[0][0], op: this.ops[0], right: null})
      },
      mapFilters: function () {
        // Filters array -> Query
        return this.filters.reduce((accum, filter) => {
          accum[filter.left] = {[this.opMap[filter.op]]: parseInt(filter.right)}
          return accum
        }, {})
      },
      onClose: function () {
        this.dismiss()
        this.$emit('close', this.mapFilters())
      },
      isRating: function (col) {
        return this.colSpec[col] === 'rating'
      },
      isText: function (col) {
        return this.colSpec[col] === 'text'
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

  .opSelect {
    width: 70px;
    margin-right: 5px;
  }
</style>
