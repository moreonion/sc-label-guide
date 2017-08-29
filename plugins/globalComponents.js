import Vue from 'vue'

import {EvalDropdownItem} from '../components/Eval/EvalDropdownItem.js'

// Needs global registration due to el-autocomplete
Vue.component('eval-dropdown-item', EvalDropdownItem)
