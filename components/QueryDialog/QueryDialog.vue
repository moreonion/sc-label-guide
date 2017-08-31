<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">Filters</span>

    <pre>{{queryArr}}</pre>
    <div>
      <el-button @click="addQuery" type="primary">Add filter</el-button>

      <div v-if="queryArr.length > 0" class="query-cont">
        <div :key="qIndex" v-for="(query, qIndex) in queryArr">
          <el-select class="leftSelect" v-model="query.left" @change="_ => cleanupQuery(query)" placeholder="Column">
            <el-option v-for="column in selectedColumns" :key="column[1]"
              :label="columnLabel(column[0])" :value="column[0]">
            </el-option>
          </el-select>

          <el-select class="opSelect" v-model="query.op" placeholder="Operator">
            <el-option v-for="(op, index) in operators" :key="index" :label="op" :value="op"></el-option>
          </el-select>

          <template v-if="isListOperator(query.op)">
            <!-- List operator -->
            <template v-if="hasAutocomplete(query.left)">
              <!-- With autocomplete -->
              <!-- TODO -->
            </template>
            <template v-else>
              <!-- No autocomplete -->
              <!-- TODO -->
            </template>
          </template>
          <template v-else>
            <!-- Single value operator -->
            <template v-if="hasAutocomplete(query.left)">
              <!-- With autocomplete -->
              <!-- <autocomplete v-if="isRating(query.left)"
                v-model="query.right"
                :config="getAutocompleteConfig(query.left)" 
                :selector="{'value':'value'}"
                customItem="eval-dropdown-item">
              </autocomplete>
              <autocomplete v-else 
                :value="query.right"
                :config="getAutocompleteConfig(query.left)"
                @select="item => query.right = item">
              </autocomplete> -->
              <el-autocomplete v-if="isRating(query.left)"
                v-model="query.right"
                :fetch-suggestions="autocompleteHandlerFactory(query.left)"
                :props="getSelector(query.left)"
                custom-item="eval-dropdown-item"
                @select="selection => handleSelect(query, selection)">
              </el-autocomplete>
              <el-autocomplete v-else
                v-model="query.right"
                :fetch-suggestions="autocompleteHandlerFactory(query.left)"
                :props="getSelector(query.left)"
                @select="selection => handleSelect(query, selection)">
              </el-autocomplete>
            </template>
            <template v-else>
              <!-- No autocomplete -->
              <el-input class="valInput" placeholder="Value" v-model="query.right"></el-input>
            </template>
          </template>

          <el-button @click="queryArr.splice(qIndex, 1)"><i class="el-icon-delete"></i></el-button>
        </div>
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
  // import D from '../../lib/debug.js'
  import {_OPERATORS_, _COLUMNS_} from '../../config/config.js'
  import {id} from '../../lib/fp.js'
  import {queryObjToArr, queryArrToObj} from '../../lib/transformQuery.js'
  import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'
  import {moAutocomplete} from '../../lib/mixins/Autocomplete.js'

  export default {
    mixins: [moDialogVisibility, moAutocomplete],
    props: ['visible', 'queryObj', 'selectedColumns'],
    data: () => ({queryArr: []}),
    computed: {
      operators: () => _OPERATORS_.ops.map(o => _OPERATORS_.opLabelMap[o])
    },
    methods: {
      cleanupQuery(query) {
        query.right = null
        if(query.project) {
          delete query.project
        }
        if(query.model) {
          delete query.model
        }
      },
      handleSelect(query, selection) {
        const model = this.columnMeta(query.left).model
        if(model) {
          query.model = selection
        }
      },
      updateVisible(val) {
        if(val) {
          // Query -> Filters array
          const res = queryObjToArr(this.queryObj, id, op => _OPERATORS_.opLabelMap[op])

          /*
           * Transform to intermediate representation
           * where query.right is the label that is
           * shown in form input controls.
           * Additionally, a model object is attached to
           * keep the complete information about the query.
           */
          this.queryArr = res.map(q => {
            const model = this.columnMeta(q.left).model
            if(model) {
              return {...q, right: q.right[model.projectLabel], model: q.right}
            } else {
              return {...q}
            }
          })
        }

        this.$emit('update:visible', val)
      },
      addQuery: function() {
        const firstColumn = this.selectedColumns[0]
        this.queryArr.push({left: firstColumn[0], op: this.operators[0], right: null})
      },
      transformQuery: function() {
        // Hack to solve input model issue
        const res = this.queryArr.map(q => {
          const model = this.columnMeta(q.left).model

          if(model && q.right === q.model[model.projectLabel]) {
            return {left: q.left, op: q.op, right: q.model}
          } else {
            return {...q}
          }
        })

        // Filters array -> Query
        return queryArrToObj(res, id, op => _OPERATORS_.opLabelMapRev[op])
      },
      onClose: function() {
        this.dismiss()
        this.$emit('close', this.transformQuery())
      },
      isListOperator: op => {
        const opMeta = _OPERATORS_.opMeta[_OPERATORS_.opLabelMapRev[op]]
        return opMeta && opMeta.isListOperator
      },
      columnMeta: col => _COLUMNS_.columnMeta[col],
      isRating(col) {
        return this.columnMeta(col).type === _COLUMNS_.types.RATING
      },
      hasAutocomplete(col) {
        return this.columnMeta(col).hasAutocomplete
      },
      getAutocompleteConfig(col) {
        return this.columnMeta(col).autocomplete
      },
      columnLabel: col => _COLUMNS_.columnLabelMap[col],
      getSelector(col) {
        const ac = this.columnMeta(col).autocomplete
        if(ac && ac.dropdown) {
          return ac.dropdown.selector
        } else {
          // Default selector
          return {'label': 'label', 'value': 'value'}
        }
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
