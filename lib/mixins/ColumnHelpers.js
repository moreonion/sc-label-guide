import {mapState} from 'vuex'

import {_COLUMNS_, _OPERATORS_} from '../../config/config.js'
import {isListOperator} from '../operator.js'

export const moColumnHelpers = {
  computed: {
    ...mapState(['lang'])
  },
  methods: {
    columnLabel(column, lang) {
      return this.$i18n.t(_COLUMNS_.columnLabelMap[column], lang)
    },
    opLabel(op, lang) {
      return this.$i18n.t(op, lang)
    },
    isListOperator: op => isListOperator(_OPERATORS_.opLabelMapRev[op]),
    columnIsRating(column) {
      return this.columnMeta(column).type === _COLUMNS_.types.RATING
    },
    projectLabel(column, model) {
      const cModel = this.columnMeta(column).model
      return model[cModel.projectLabel]
    },
    projectValue(column, model) {
      const cModel = this.columnMeta(column).model
      return model[cModel.projectValue]
    },
    projectItemLabel(column, li) {
      const model = this.columnMeta(column)
      return model.projectItemLabel(li)
    },
    columnClass(column) {
      const dir = this.moColumnOrder(column)
      return dir !== null ? [`mo-${dir}`] : ['mo-unordered']
    },
    columnValue: (row, column) => _COLUMNS_.columnValFuncMap[column](row),
    columnMapRev: column => _COLUMNS_.columnValueMapRev[column],
    columnMeta: column => _COLUMNS_.columnMeta[column],

    columnHasInfo(column) {
      return this.columnMeta(column).hasInfo
    },
    columnIsSortable(column) {
      return this.columnMeta(column).isSortable
    },
    columnIsList(column) {
      return this.columnMeta(column).type === _COLUMNS_.types.LIST
    }
  }
}
