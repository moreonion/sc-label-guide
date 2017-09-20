<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">{{$tc('Basics.Filter', 2)}}</span>
    <div>
      <el-button @click="addQuery" type="primary">{{$t('Basics.AddFilters')}}</el-button>

      <div v-if="queryArr.length > 0" class="query-cont">
        <div :key="qIndex" v-for="(query, qIndex) in queryArr">
          <el-select class="leftSelect" v-model="query.left" placeholder="$t('Basics.Column')">
            <el-option v-for="column in selectedColumns" :key="column[1]"
              :label="columnLabel(column[0], lang)" :value="column[0]">
            </el-option>
          </el-select>

          <el-select class="opSelect" v-model="query.op" :placeholder="$t('Basics.Operator')">
            <el-option v-for="(op, index) in getOperators(query.left)" :key="index" :label="opLabel(op)" :value="op"></el-option>
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

              <!-- <el-autocomplete v-if="isRating(query.left)"
                class="valInput"
                v-model="query.right"
                :fetch-suggestions="autocompleteHandlerFactory(query.left, lang)"
                :props="getSelector(query.left)"
                custom-item="eval-dropdown-item"
                @select="selection => handleSelect(query, selection)">
              </el-autocomplete> -->
              <el-select v-if="isRating(query.left)"
                class="valInput"
                v-model="query.right"
                placeholder="Placeholder text"
                no-data-text="No data text"
                no-match-text="No match text"
                filterable
                remote
                :remote-method="remoteMethodFactory(query.left)">
                <el-option
                  v-for="item in remoteOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                  <eval-circle :value="item.value"></eval-circle>
                </el-option>
              </el-select>
              <el-autocomplete v-else
                class="valInput"
                v-model="query.right"
                :fetch-suggestions="autocompleteHandlerFactory(query.left, lang)"
                :props="getSelector(query.left)"
                @select="selection => handleSelect(query, selection)">
              </el-autocomplete>
            </template>
            <template v-else>
              <!-- No autocomplete -->
              <el-input class="valInput" placeholder="$tc('Basics.Value', 1)" v-model="query.right"></el-input>
            </template>
          </template>

          <el-button @click="queryArr.splice(qIndex, 1)"><i class="el-icon-delete"></i></el-button>
        </div>
      </div>
      <!-- BUG: v-else not working here -->
      <div v-if="queryArr.length === 0" class="emptyState">
        {{$t('Texts.AddFilters')}}
      </div>
      <div v-if="countResults !== null" class="emptyState">
        <i18n path="Texts.NumFilterResults" tag="span">
          <el-tag :type="countResults > 0 ? 'success' : 'danger'">{{countResults}}</el-tag>
        </i18n>
      </div>
    </div>

    <pre>{{queryArr}}</pre>
    <pre>{{remoteOptions}}</pre>

    <span slot="footer">
      <el-button @click="dismiss">{{$t('Buttons.Close')}}</el-button>
      <el-button @click="onClose" type="primary">{{$t('Buttons.Apply')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapState} from 'vuex'
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

  const opLabelMap = o => _OPERATORS_.opLabelMap[o]

  export default {
    mixins: [moDialogVisibility, moAutocomplete],
    props: ['visible', 'queryObj', 'selectedColumns'],
    data: () => ({queryArr: [], countResults: null, remoteOptions: []}),
    computed: {
      ...mapState(['lang']),
      operators: () => _OPERATORS_.ops.map(o => _OPERATORS_.opLabelMap[o]),
      queryObjOut() {
        const res = this.queryArr
          .filter(({left, right, model}) => right !== null && right !== '')

        // Filters array -> Query
        return queryArrToObj(res, id, op => _OPERATORS_.opLabelMapRev[op])
      },
      shrunkQueryObjOut() {
        return shrinkModel(this.queryObjOut)
      }
    },
    methods: {
      getLabel(column, item) {
        const cModel = this.columnMeta(column).model
        return cModel ? item[cModel.projectLabel] : item
      },
      remoteMethodFactory(column) {
        const ac = this.autocompleteHandlerFactory(column, this.lang)
        return queryStr => {
          ac(queryStr, res => {
            this.remoteOptions = res
          })
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

          res.forEach(query => {
            const ac = this.autocompleteHandlerFactory(query.left, this.lang)
            const cModel = this.columnMeta(query.left).model
            // Remote options must be fetched so that selection is visible
            ac(query.right, resp => {
              this.remoteOptions = resp
            })
          })

          this.queryArr = res
        }

        this.$emit('update:visible', val)
      },
      getOperators(col) {
        const ops = this.columnMeta(col).ops
        if(ops !== undefined) {
          return ops.map(opLabelMap)
        } else {
          return _OPERATORS_.ops.map(opLabelMap)
        }
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
      // getAutocompleteConfig(col) {
      //   return this.columnMeta(col).autocomplete
      // },
      columnLabel(col, lang) {
        return this.$i18n.t(_COLUMNS_.columnLabelMap[col], lang)
      },
      opLabel(op, lang) {
        return this.$i18n.t(op, lang)
      },
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
