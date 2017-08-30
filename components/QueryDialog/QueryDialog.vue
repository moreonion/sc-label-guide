<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">Filters</span>

    <pre>{{queryArr}}</pre>
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
                v-model="query.right"
                :fetch-suggestions="autocompleteHandlerFactory(query.left)"
                :props="{'label': 'label', 'value': 'label'}"
                custom-item="eval-dropdown-item"
                @select="handleSelect">
              </el-autocomplete>
            </template>
            <template v-else>
              <!-- No autocomplete -->
              <el-select class="valInput" v-if="isRating(query.left)" v-model="query.right" placeholder="Value">
                <el-option v-for="(rating, index) in [3,2,1,0]" :key="index" :value="rating">
                  <eval-circle :value="rating"></eval-circle>
                </el-option>
              </el-select>
              <el-input class="valInput" placeholder="Value" v-model="query.right" v-else></el-input>
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
      updateVisible(val) {
        if(val) {
          // Query -> Filters array
          this.queryArr = queryObjToArr(this.queryObj, id, op => _OPERATORS_.opLabelMap[op])
        }

        this.$emit('update:visible', val)
      },
      addQuery: function() {
        const firstColumn = this.selectedColumns[0]
        this.queryArr.push({left: firstColumn[0], op: this.operators[0], right: null})
      },
      transformQuery: function() {
        // Filters array -> Query
        return queryArrToObj(this.queryArr, id, op => _OPERATORS_.opLabelMapRev[op])
      },
      onClose: function() {
        this.dismiss()
        this.$emit('close', this.transformQuery())
      },
      isListOperator: op => {
        const opMeta = _OPERATORS_.opMeta[_OPERATORS_.opLabelMapRev[op]]
        return opMeta && opMeta.isListOperator
      },
      isRating: col => _COLUMNS_.columnMeta[col].type === _COLUMNS_.types.RATING,
      hasAutocomplete: col => _COLUMNS_.columnMeta[col].hasAutocomplete,
      getAutocompleteConfig: col => _COLUMNS_.columnMeta[col].autocomplete,
      columnLabel: column => _COLUMNS_.columnLabelMap[column]
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
