<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">Filters</span>

    <pre>{{queryArr}}</pre>

    <div>
      <el-button @click="addQuery" type="primary">Add filter</el-button>

      <div v-if="queryArr.length > 0" class="query-cont" :key="index" v-for="(query, index) in queryArr">
        <el-select class="leftSelect" v-model="query.left" placeholder="Column">
          <el-option v-for="column in selectedColumns" :key="column[1]"
            :label="colNameMap[column[0]]" :value="column[0]">
          </el-option>
        </el-select>

        <el-select class="opSelect" v-model="query.op" placeholder="Operator">
          <el-option v-for="(op, index) in ops" :key="index" :label="op" :value="op"></el-option>
        </el-select>

        <el-select class="valInput" v-if="isRating(query.left)" v-model="query.right" placeholder="Value">
          <el-option v-for="(rating, index) in [3,2,1]" :key="index" :value="rating">
            <eval-circle :value="rating"></eval-circle>
          </el-option>
        </el-select>
        <el-input class="valInput" placeholder="Value" v-model="query.right" v-else></el-input>

        <el-button @click="queryArr.splice(index, 1)"><i class="el-icon-delete"></i></el-button>
      </div>
      <!-- BUG: v-else not working here -->
      <div v-if="queryArr.length === 0" class="emptyState">
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
  import {id} from '../../lib/fp.js'
  import {queryObjToArr, queryArrToObj} from '../../lib/queryTransform.js'
  import {moDialogVisibility} from '../DialogVisibility/DialogVisibility.js'

  import EvalCircle from '../EvalCircle.vue'

  export default {
    mixins: [moDialogVisibility],
    components: {'eval-circle': EvalCircle},
    props: ['visible', 'queryObj', 'selectedColumns', 'colNameMap', 'columnMeta'],
    data() {
      return {
        ops: ['is', '>', '>=', '<', '<='],
        opMap: {
          '$eq': 'is',
          '$gt': '>',
          '$gte': '>=',
          '$lt': '<',
          '$lte': '<='
        },
        opMapRev: {
          'is': '$eq',
          '>': '$gt',
          '>=': '$gte',
          '<': '$lt',
          '<=': '$lte'
        },
        queryArr: []
      }
    },
    methods: {
      updateVisible(val) {
        if(val) {
          // Query -> Filters array
          this.queryArr = queryObjToArr(this.queryObj, column => column, op => this.opMap[op])
        }

        this.$emit('update:visible', val)
      },
      addQuery: function() {
        const firstColumn = this.selectedColumns[0]
        this.queryArr.push({left: firstColumn[0], op: this.ops[0], right: null})
      },
      transformQuery: function() {
        // Filters array -> Query
        return queryArrToObj(this.queryArr, id, op => this.opMapRev[op])
      },
      onClose: function() {
        this.dismiss()
        this.$emit('close', this.transformQuery())
      },
      isRating: function(col) {
        return this.columnMeta[col].type === 'rating'
      }
    }
  }
</script>

<style>
  .query-cont {
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

  .valInput {
    width: 100px;
  }
</style>
