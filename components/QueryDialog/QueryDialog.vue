<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="dismiss" size="large">
    <span slot="title">{{$tc('Basics.Filter', 2)}}</span>
    <div>
      <el-button @click="addQuery" type="primary">{{$t('Basics.AddFilters')}}</el-button>

      <div v-if="queryArr.length > 0" class="query-cont">
        <el-row class="query-row" :key="qIndex" v-for="(query, qIndex) in queryArr" :gutter="5">
          <i class="el-icon-close rm-btn" @click="queryArr.splice(qIndex, 1)"></i>

          <el-col :xs="24" :sm="8">
            <el-select v-model="query.left" @input="val => leftChanged(qIndex, val, query.op)" placeholder="$t('Basics.Column')">
              <el-option v-for="column in availableColumns" :key="column[1]"
                :label="columnLabel(column[0], lang)" :value="column[0]">
              </el-option>
            </el-select>
          </el-col>

          <el-col :xs="24" :sm="8">
            <el-select v-model="query.op" @input="val => opChanged(qIndex, val)" :placeholder="$t('Basics.Operator')">
              <el-option v-for="(op, index) in getOperators(query.left)" :key="index" :label="opLabel(op)" :value="op"></el-option>
            </el-select>
          </el-col>

          <el-col :xs="24" :sm="8">
            <template v-if="hasAutocomplete(query.left)">
              <!-- With autocomplete -->
              <el-select v-if="isListOperator(query.op)"
                key="multi"
                v-model="query.right"
                :placeholder="$t('Texts.Forms.Placeholder')"
                :no-data-text="$t('Texts.Forms.NoData')"
                :no-mantch-text="$t('Texts.Forms.NoMatch')"
                multiple
                :value-key="getValueKey(query.left)"
                filterable
                remote
                :remote-method="remoteMethodFactory(query, qIndex)">
                <el-option
                  v-for="item in query.optionsBuffer"
                  :key="getValue(query.left, item)"
                  :label="getLabel(query.left, item)"
                  :value="item">
                  <eval-circle v-if="isRating(query.left)" :value="getValue(query.left, item)"></eval-circle>
                  <div v-else>{{getLabel(query.left, item)}}</div>
                </el-option>
              </el-select>
              <el-select v-else
                key="single"
                v-model="query.right"
                :placeholder="$t('Texts.Forms.Placeholder')"
                :no-data-text="$t('Texts.Forms.NoData')"
                :no-mantch-text="$t('Texts.Forms.NoMatch')"
                :value-key="getValueKey(query.left)"
                filterable
                remote
                :remote-method="remoteMethodFactory(query, qIndex)">
                <el-option
                  v-for="item in query.optionsBuffer"
                  :key="getValue(query.left, item)"
                  :label="getLabel(query.left, item)"
                  :value="item">
                  <eval-circle v-if="isRating(query.left)" :value="getValue(query.left, item)"></eval-circle>
                  <div v-else>{{getLabel(query.left, item)}}</div>
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <!-- No autocomplete -->
              <el-input placeholder="$tc('Basics.Value', 1)" v-model="query.right"></el-input>
            </template>
          </el-col>
        </el-row>
      </div>
      <div v-else class="emptyState">
        {{$t('Texts.AddFilters')}}
      </div>

      <div v-if="countResults !== null" class="emptyState">
        <i18n path="Texts.NumFilterResults" tag="span">
          <el-tag :type="countResults > 0 ? 'success' : 'danger'">{{countResults}}</el-tag>
        </i18n>
      </div>
    </div>

    <!-- <pre>{{queryArr}}</pre> -->

    <span slot="footer">
      <el-button @click="dismiss">{{$t('Buttons.Close')}}</el-button>
      <el-button @click="onClose" type="primary">{{$t('Buttons.Apply')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapState} from 'vuex'
  import debounce from 'lodash.debounce'
  import {_OPERATORS_, _COLUMNS_, _API_} from '../../config/config.js'
  import {id} from '../../lib/fp.js'
  import {queryObjToArr, queryArrToObj} from '../../lib/transformQuery.js'
  import {moDialogVisibility} from '../../lib/mixins/DialogVisibility/DialogVisibility.js'
  import {moAutocomplete} from '../../lib/mixins/Autocomplete.js'
  import {shrinkModel} from '../../lib/queryModel.js'
  import {LabelsRes} from '../../lib/api/LabelsRes.js'
  import {encodeApiQuery} from '../../lib/encodeApi.js'
  import {isListOperator} from '../../lib/operator.js'

  const opLabelMap = o => _OPERATORS_.opLabelMap[o]

  export default {
    mixins: [moDialogVisibility, moAutocomplete],
    props: ['visible', 'queryObj', 'selectedColumns'],
    data: () => ({queryArr: [], countResults: null}),
    computed: {
      ...mapState(['lang']),
      operators: () => _OPERATORS_.ops.map(o => _OPERATORS_.opLabelMap[o]),
      queryObjOut() {
        const res = this.queryArr.filter(({right}) => {
          if(right && right.length !== undefined) {
            return right.length > 0
          } else {
            return right !== null && right !== ''
          }
        })

        // Filters array -> Query
        return queryArrToObj(res, id, op => _OPERATORS_.opLabelMapRev[op])
      },
      shrunkQueryObjOut() {
        return shrinkModel(this.queryObjOut)
      },
      availableColumns() {
        const res = [].concat(this.selectedColumns)

        const additional = this.queryArr.filter(({left}) => {
          return this.selectedColumns.find(([name, _]) => name === left) === undefined
        })

        const addColumns = additional.map(({left}) => {
          const colSpec = _COLUMNS_.columns.find(([name, i]) => _COLUMNS_.columnValueMapRev[left] === name)
          return [left, colSpec[1]]
        })

        return res.concat(addColumns)
      }
    },
    methods: {
      getLabel(column, item) {
        const cModel = this.columnMeta(column).model
        return item[cModel.projectLabel]
      },
      getValueKey(column) {
        const cModel = this.columnMeta(column).model
        return cModel.projectValue
      },
      getValue(column, item) {
        const valueKey = this.getValueKey(column)
        return item[valueKey]
      },
      remoteMethodFactory(query, qIndex) {
        const ac = this.autocompleteHandlerFactory(query.left, this.lang)
        return queryStr => {
          ac(queryStr).then(res => {
            this.$set(this.queryArr[qIndex], 'optionsBuffer', res)
          })
        }
      },
      opChanged(qIndex, op) {
        this.remoteMethodFactory(this.queryArr[qIndex], qIndex)()
        const isListOp = this.isListOperator(op)
        if(isListOp) {
          this.$set(this.queryArr[qIndex], 'right', [])
        } else {
          this.$set(this.queryArr[qIndex], 'right', null)
        }
      },
      leftChanged(qIndex, val, op) {
        this.opChanged(qIndex, op)
        this.remoteMethodFactory(this.queryArr[qIndex], qIndex)()
      },
      handleSelect(query, selection) {
        const cModel = this.columnMeta(query.left).model
        if(cModel) {
          query.model = selection
        }
      },
      async updateVisible(val) {
        if(val) {
          // Query -> Filters array
          const res = queryObjToArr(this.queryObj, id, op => _OPERATORS_.opLabelMap[op])

          for(let i = 0; i < res.length; i++) {
            const query = res[i]
            const ac = this.autocompleteHandlerFactory(query.left, this.lang)
            const options = await ac(this.getLabel(query.left, query.right))
            query.optionsBuffer = options
          }

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
        return isListOperator(_OPERATORS_.opLabelMapRev[op])
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
              op => _OPERATORS_.opEncApiMap[op], _API_.opDelim, _API_.listDelim)

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
  .el-select {
    width: 100%;
  }

  .query-cont {
    position: relative;
    padding: 10px;
    margin-bottom: 20px;
  }

  .query-row {
    padding: 15px;
    border: 4px dashed #e4e4e4;
  }

  .query-row:not(:last-child) {
    margin-bottom: 10px;
  }

  .emptyState {
    padding: 20px;
  }

  .rm-btn {
    cursor: pointer;
    font-size: 8px;
    position: absolute;
    right: 2px;
    top: 2px;
    padding: 5px;
    color: #bfcbd9;
  }

  .rm-btn:hover, .rm-btn:focus {
    color: #20a0ff;
  }
</style>
