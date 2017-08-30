import Vue from 'vue'

import EvalCircle from '../components/Eval/EvalCircle.vue'
import {EvalDropdownItem} from '../components/Eval/EvalDropdownItem.js'

Vue.component('eval-circle', EvalCircle)

// Needs global registration due to el-autocomplete
Vue.component('eval-dropdown-item', EvalDropdownItem)
