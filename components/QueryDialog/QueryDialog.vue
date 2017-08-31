<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">Filters</span>
    <!-- <pre>{{queryArr}}</pre>
    <pre>{{queryObjOut}}</pre>
    <pre>{{shrunkQueryObjOut}}</pre>-->
    <div>
      <el-button @click="addQuery" type="primary">Add filter</el-button>

      <div v-if="queryArr.length > 0" class="query-cont">
        <div :key="qIndex" v-for="(query, qIndex) in queryArr">
          <el-select class="leftSelect" v-model="query.left" placeholder="Column">
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
                class="valInput"
                v-model="query.right"
                :fetch-suggestions="autocompleteHandlerFactory(query.left)"
                :props="getSelector(query.left)"
                custom-item="eval-dropdown-item"
                @select="selection => handleSelect(query, selection)">
              </el-autocomplete>
              <el-autocomplete v-else
                class="valInput"
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
      <div v-if="countResults !== null" class="emptyState">
        This filter yields <el-tag :type="countResults > 0 ? 'success' : 'danger'">{{countResults}}</el-tag> results.
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
  import debounce from 'lodash.debounce'
  import {_OPERATORS_, _COLUMNS_, _API_} from '../../config/config.js'
  import {id} from '../../lib/fp.js'
  import {queryObjToArr, queryArrToObj} from '../../lib/transformQuery.js'
  import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'
  import {moAutocomplete} from '../../lib/mixins/Autocomplete.js'
  import {shrinkModel} from '../../lib/queryModel.js'
  import {LabelsRes} from '../../lib/api/LabelsRes.js'
  import {encodeApiQuery} from '../../lib/encodeApi.js'

  export default {
    mixins: [moDialogVisibility, moAutocomplete],
    props: ['visible', 'queryObj', 'selectedColumns'],
    data: () => ({queryArr: [], countResults: null}),
    computed: {
      operators: () => _OPERATORS_.ops.map(o => _OPERATORS_.opLabelMap[o]),
      queryObjOut() {
        // Hack to solve input model issue
        const res = this.queryArr
          .filter(({left, right, model}) => {
            const cModel = this.columnMeta(left).model
            if(cModel) {
              return model ? right === model[cModel.projectLabel] : false
            } else {
              return right !== null && right !== ''
            }
          })
          .map(({left, op, right, model}) => {
            const cModel = this.columnMeta(left).model

            if(cModel && model && right && right === model[cModel.projectLabel]) {
              return {left, op, right: model}
            } else {
              return {left, right, model}
            }
          })

        // Filters array -> Query
        return queryArrToObj(res, id, op => _OPERATORS_.opLabelMapRev[op])
      },
      shrunkQueryObjOut() {
        return shrinkModel(this.queryObjOut)
      }
    },
    methods: {
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
        return this.queryObjOut
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
        return this.columnMeta(col).autocomplete !== undefined
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
    },
    watch: {
      shrunkQueryObjOut: {
        handler: debounce(async function() {
          if(this.visible && this.shrunkQueryObjOut['$and'].length > 0) {
            const qParams = encodeApiQuery(this.shrunkQueryObjOut, id,
              op => _OPERATORS_.opEncApiMap[op], _API_.opDelim)

            const params = {only: 'id', ...qParams}

            const res = await LabelsRes.fetch(params)
            this.countResults = res.data.items.length
          } else {
            this.countResults = null
          }
        }, 1000),
        immediate: true
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
    width: 150px;
    margin-right: 5px;
  }

  .valInput {
    width: 200px;
    margin-right: 5px;
  }
</style>
